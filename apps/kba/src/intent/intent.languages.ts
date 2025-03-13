export enum IntentLanguages {
  ENGLISH_US = 'en-us',
  ENGLISH = 'en',
  FRENCH = 'fr',
  KINYARWANDA = 'rw',
};

export type IntentTranslationMapping = {
  [key in IntentLanguages as string]: string;
}

export const ALLOWED_LANGUAGES = Object.keys(IntentLanguages).map((key) => IntentLanguages[key]);

export const DEFAULT_LOCALE = IntentLanguages.ENGLISH;
export const DEFAULT_RESPONSE: IntentTranslationMapping = {
  "en": "I'm sorry, I can't help you with that!",
  "fr": "Je suis désolé, je ne peux pas t'aider avec ça !",
  "rw": "Mumbabarire, sinshobora kugufasha kubyo!",
};  


export const UNSUPPORTED_LANGUAGE_MESSAGE = "Unsupported language!";