import { IntentLanguages } from '../../../../intent/intent.languages';
import { IntentEntities } from '../../../../models/intents.entity';
import { ZammadAnswerModel } from './zammad.answer-model';
import { ZammadCategoryModel } from './zammad.category-model';

/**
 * Provides general utility functions to process the Zammad database content
 */
export class ZammadUtils {
  
  private constructor() {}

  /**
   * Flattens a hierarhical list of categories and removed the eventual default answers (containing the inheritable tags)
   * @param {ZammadCategoryModel[]} categories - The list of hierarhical content fetched from Zammad
   * @returns {ZammadCategoryModel[]} - The flattened list of categories
   */
  static flattenHierarchy(categories: ZammadCategoryModel[]): ZammadAnswerModel[] {
    const result = new Map<string, ZammadAnswerModel>();

    for (const category of categories) {
      category.answers
              .filter( (answer) => answer.name?.toLowerCase() !== "default")
              .forEach( (answer) => { if (!result.has(answer.id + "_" + answer.locale)) { result.set(answer.id + "_" + answer.locale, answer); }});
      
      if (category.subcategories.length > 0) {
        this.flattenHierarchy(category.subcategories)
            .forEach( (answer) => { if (!result.has(answer.id + "_" + answer.locale)) { result.set(answer.id + "_" + answer.locale, answer); }});                          
      }
    }

    return Array.from(result.values());
  }

  /**
   * Expands the default tags (from pages with "default" title) by propagating the tags to all child categories and answers
   * @param {ZammadCategoryModel[]} categories - The list of hierarhical content fetched from Zammad
   * @param {string[]} tags - The list of tags accummulated so far in the hierarchy (will be appeneded with any tags from the "default" answer in any child category)
   */
  static expandDefaultTags(categories: ZammadCategoryModel[], tags: string[] = []) {
    
    for (const category of categories) {
      const defaultAnswer = category.answers?.find(
        (answer) => answer.name?.toLowerCase() === 'default',
      );

      const allTags = [...tags];
      if (defaultAnswer) {
        allTags.push(...defaultAnswer.tags);
      }

      ZammadUtils.expandDefaultTags(category.subcategories, allTags);

      if (!category.answers || category.answers.length <= 0) {
        continue;
      }

      category.answers
        .filter((answer) => answer.name?.toLowerCase() !== 'default')
        .forEach((answer) => {
          for (const tag of allTags) {
            if (answer.tags.indexOf(tag) < 0) {
              answer.tags.push(tag);
            }
          }
        });
    }
  }

  /**
   * Extract the list of valid intents based on the list of tags associated with an answer
   * @param {string[]} tags - The list of tags to be evaluated
   * @returns {string[]} - The list of identified intents
   */
  static getIntents(tags: string[]): string[] {
    return tags.filter(ZammadUtils.isIntentTag).map(ZammadUtils.getTagName);
  }

  /**
   * Extract the list of valid entities based on the list of tags associated with an answer
   * @param {string[]} tags - The list of tags to be evaluated
   * @returns {IntentEntities} - The identified entities
   */
  static getEntities(tags: string[], locale?: string): IntentEntities {
    return tags
      .filter((tag) => {
        const localizedTagLocale = ZammadUtils.getLocalizedEntityTagLocale(tag);
        const validTag = ZammadUtils.isEntityTag(tag) && (localizedTagLocale === locale || !localizedTagLocale );
        return validTag;
      })
      .map(ZammadUtils.getTagKeyValue)
      .reduce((entities: IntentEntities, obj: string[]) => {
        entities[obj[0]?.toLowerCase()] = obj[1]?.toLowerCase();
        return entities;
      }, new IntentEntities());
  }

  
  /**
   * Extract the list of valid options based on the list of tags associated with an answer
   * @param {string[]} tags - The list of tags to be evaluated
   * @returns {{[key: string]: string | boolean}} - The identified options
   */
   public static getOptions(tags: string[]): {[key: string]: string | boolean} {
    return tags
      .filter(ZammadUtils.isOptionTag)
      .map(ZammadUtils.getTagKeyWithOptionalValue)
      .reduce((entities: {[key: string]: string | boolean}, obj: [string, string] | [string, boolean]) => {            
        entities[obj[0]] = obj[1];
        return entities;
      }, new IntentEntities());
  }

  private static isEntityTag(tag: string): boolean {
    const parts = tag.split(':');
    return parts.length == 3 && (ZammadUtils.isSimpleEntityPrefix(parts[0]) || ZammadUtils.isLocalizedEntityPrefix(parts[0]))  && parts[1] !== ""  && parts[2] !== "";
  }

  private static isSimpleEntityPrefix(tag: string): boolean {
    return ['entity', 'ent'].indexOf(tag) >= 0;
  }

  private static isLocalizedEntityPrefix(tag: string): boolean {
    const parts = tag.split('_');    
    return parts.length > 1 && (<any>Object).values(IntentLanguages).includes(parts[0]);
  }

  private static getLocalizedEntityTagLocale(tag: string): string {
    let parts = tag.split(':');
    if (parts.length <= 1) {
      return undefined;
    }
    parts = parts[0].split('_');
    if (parts.length > 1 && (<any>Object).values(IntentLanguages).includes(parts[0])) {
      return parts[0];
    } 

    return undefined;
  }

  private static isIntentTag(tag: string) {
    const parts = tag.split(':');
    return parts.length == 2 && (parts[0] === 'intent' || parts[0] === 'int') && parts[1] !== "";
  }
  
  private static isOptionTag(tag: string) {
    const parts = tag.split(':');
    return (parts.length >=2 && (parts[0] === 'option' || parts[0] === 'opt')) &&
           ( 
             (parts.length == 2 && parts[1] !== "" ) ||
             (parts.length == 3 && parts[1] !== "" && parts[2] !== "")
           );
  }

  private static getTagName(tag: string): string {
    const parts = tag.split(':');

    if (parts.length >= 2) {
      return parts[1]?.toLowerCase();
    } else {
      return null;
    }
  }

  private static getTagKeyValue(tag: string): [string, string] | null {
    const parts = tag.split(':');

    if (parts.length >= 3) {
      return [parts[1]?.toLowerCase(), parts[2]?.toLowerCase()];
    } else {
      return null;
    }
  }
  
  private static getTagKeyWithOptionalValue(tag: string): [string, string] | [string, boolean] | null {
    const parts = tag.split(':');

    if (parts.length >= 3) {
      return [parts[1]?.toLowerCase(), parts[2]?.toLowerCase()];
    } else if (parts.length === 2) {
      return [parts[1]?.toLowerCase(), true];
    } else {
      return null;
    }
  }
}