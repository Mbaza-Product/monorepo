export class ZammadQueryBuilder {

    static getCategoriesQuery(categoryID: number): string {
        
        return `
                    SELECT distinct categories.id as id, trans.title as name, locales.locale as locale 
                    FROM knowledge_base_categories categories 
                    LEFT JOIN knowledge_base_category_translations trans on trans.category_id = categories.id 
                    LEFT JOIN knowledge_base_locales kblocales on trans.kb_locale_id = kblocales.id 
                    LEFT JOIN locales locales on kblocales.system_locale_id = locales.id 
                    WHERE parent_id ${categoryID ? ' = ' +categoryID : 'is null'}
                `;
    }

    static getAnswersQuery(categoryID: number, locale: string): string {
        return `
                    SELECT answers.id as id, translations.id as translation_id, translations.title as name, contents.body as body, locales.locale as locale, locales.alias as localealias
                    FROM knowledge_base_answers answers
                    LEFT JOIN knowledge_base_answer_translations translations on translations.answer_id = answers.id
                    LEFT JOIN knowledge_base_answer_translation_contents contents on contents.id = translations.content_id
                    LEFT JOIN knowledge_base_locales kblocales on translations.kb_locale_id = kblocales.id
                    LEFT JOIN locales locales on kblocales.system_locale_id = locales.id
                    WHERE answers.category_id=${categoryID} and locales.locale = '${locale}'
                `;
    }

    static getTagsQuery(answerID: number): string {
        return `
                    SELECT items.name_downcase as name
                    FROM tags
                    LEFT JOIN tag_objects objects on tags.tag_object_id = objects.id
                    LEFT JOIN tag_items items on items.id = tags.tag_item_id
                    WHERE tags.o_id= ${answerID}
                `;
    }
}