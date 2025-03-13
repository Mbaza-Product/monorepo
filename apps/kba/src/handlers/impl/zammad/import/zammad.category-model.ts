import { ZammadAnswerModel } from "./zammad.answer-model";

export class ZammadCategoryModel {
    constructor(
        public id: number, 
        public parentID: number, 
        public name: string, 
        public locale: string,
        public subcategories: ZammadCategoryModel[],
        public answers: ZammadAnswerModel[]) {  
            if (!subcategories) {
                this.subcategories = [];
            }

            if (!answers) {
                this.answers = [];
            }
    }
}