export class ZammadAnswerModel {
    constructor(
        public id: number, 
        public translation_id: number,
        public categoryID: number, 
        public name: string,         
        public body: string, 
        public locale: string,
        public tags?: string[]) {
            if (!this.tags) {
                this.tags = []
            }
        
    }
}