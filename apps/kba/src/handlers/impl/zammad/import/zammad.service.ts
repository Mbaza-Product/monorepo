import { Inject, Injectable, Logger } from "@nestjs/common";
import { QueryRunner } from "typeorm";
import { ZammadAnswerModel } from "./zammad.answer-model";
import { ZammadCategoryModel } from "./zammad.category-model";
import { ZammadUtils } from "./zammad.utils";
import { ZammadQueryBuilder } from "./zammad.query-builder";
import { IntentLanguages } from "../../../../intent/intent.languages";

/**
 * Provides access to the Zammad content through its database.
 * Handles categories, answers and tags. Uses Zammad native localisation support to extract content locale.
 */
@Injectable()
export class ZammadService {

    private logger: Logger = new Logger(ZammadService.name);

    private categoriesCache = new Map<Number, ZammadCategoryModel[]>();
    private answersCache = new Map<string, ZammadAnswerModel[]>();
    private tagsCache = new Map<Number, string[]>();

    /**
     * Creates a new instance of the Zammad Service
     * @param {PGConnection} conn The instance of the Database connection to be used for fetching the Zammad content hierarchy
     */    
    constructor(@Inject("ZAMMAD_QUERY_RUNNER") private connRunner: QueryRunner) {
        this.logger.log(`Using connection: ${JSON.stringify(this.connRunner?.connection?.name, null, 2)}`);
    }

    /**
     * Clears the cache between synchronizations
     */
    async emptyCache() {
        this.categoriesCache.clear();
        this.answersCache.clear();
        this.tagsCache.clear();
    }

    /**
     * Fetches the content hierarchy from the Zammad database. Starting with the provided parentID will fetch all child categories and answers.
     * This is applied recursively untill there are no more subcategories to be handled.     
     * 
     * @param parentID The ID of the category to extract the answers and subcategories for
     * @param expandTags Specifies if the tags associated with the "Default" answer should be propagated to all child categories and answers
     * @returns The hierarchy of child categories
     */
    async getHierarchy(parentID: number, expandTags = true): Promise<ZammadCategoryModel[]> {
        
        if (this.categoriesCache.has(parentID)) {
            return this.categoriesCache.get(parentID);
        }

        try {
            this.logger.log(`Fetching hierarchy for category ${parentID}`);
            const categories: ZammadCategoryModel[] = [];
            const query = ZammadQueryBuilder.getCategoriesQuery(parentID);            
            const results: ZammadCategoryModel[] = await this.connRunner.query(query);
            this.logger.log(`Found ${results?.length} categories`);    
            

            for (const result of results) {
                this.logger.log(`Processing category ${result.id} ${result.name} ${result.locale}`);    
                const answers = [
                  ...(await this.getAnswers(
                    result.id,
                    IntentLanguages.ENGLISH_US,
                  )),
                  ...(await this.getAnswers(
                    result.id,
                    IntentLanguages.ENGLISH,
                  )),
                  ...(await this.getAnswers(result.id, IntentLanguages.FRENCH)),
                  ...(await this.getAnswers(
                    result.id,
                    IntentLanguages.KINYARWANDA,
                  )),
                ];

                categories.push(
                    new ZammadCategoryModel(
                        result.id, 
                        parentID, 
                        result.name, 
                        this.translateLocale(result.locale),
                        await this.getHierarchy(result.id, false),
                        answers,                        
                    ),
                );
            }

            if (expandTags) {
                 // The tags associated with the "default" answer from each category (if present) 
                // will be expanded to all child categories and answers
                ZammadUtils.expandDefaultTags(categories);
            }

            this.categoriesCache.set(parentID, categories);            
            return categories;
        } catch (ex) {
             this.logger.error(ex);
             return [];
        }
    }

    private async getAnswers(categoryID: number, locale: string): Promise<ZammadAnswerModel[]> {    
        if (this.answersCache.has(categoryID + "_" + locale)) {
            return this.answersCache.get(categoryID + "_" + locale);
        }    
        try {
            this.logger.log(`Fetching answers for category ${categoryID} and locale ${locale}`);
            const answers: ZammadAnswerModel[] = [];            
            const query = ZammadQueryBuilder.getAnswersQuery(categoryID, locale);
            const results: ZammadAnswerModel[] = await this.connRunner.query(query);
            this.logger.log(`Found ${results?.length} anwers`);
            for (const result of results) {
                const tags = await this.getTags(result.id);
                if (tags.length > 0) {
                    answers.push(
                        new ZammadAnswerModel(
                            result.translation_id, 
                            result.id,
                            categoryID, 
                            result.name, 
                            result.body, 
                            this.translateLocale(result['localealias'] || result.locale),
                            tags
                        )
                    );                                
                }
                
            }
            this.answersCache.set(categoryID + "_" + locale, answers);            
            return answers;
        } catch (ex) {
            this.logger.error(ex);
            return [];
        }
    }
    translateLocale(locale: any): string {
        if ("en-gb".localeCompare(locale) == 0) {
            return "en";
        }

        return locale;
    }

    private async getTags(answerID: number): Promise<string[]> {        
        if (this.tagsCache.has(answerID)) {
            return this.tagsCache.get(answerID);
        }  
        const tags: string[] = [];
        this.logger.log(`Fetching tags for answer ${answerID}`);
        try {
            const query = ZammadQueryBuilder.getTagsQuery(answerID);            
            const results = await this.connRunner.query(query);        
            if (results?.length > 0) {
                this.logger.log(`Found ${results?.length} tags for answer ${answerID}`);
            }

            for (const result of results) {
                tags.push(result['name']);
            }                        
            this.tagsCache.set(answerID, tags); 
            return tags;
        } catch (ex) {
            this.logger.error(ex);            
        }
        return tags;
    }
}