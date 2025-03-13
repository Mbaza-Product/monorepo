import { EntitiesSanitizer } from "./entities-sanitizer.interface";
import { WipeSanitier as WipeSanitizer } from "./wipe.sanitizer";

export class EntitiesSanitizerFactory {

  private sanitizers =  new Map<string, EntitiesSanitizer>()
  
  constructor() {
    this.sanitizers.set('wipe', new WipeSanitizer()); 
  }

  getSanitizer(sanitizing_strategy: string): EntitiesSanitizer {
    return this.sanitizers.get(sanitizing_strategy);
  }


}