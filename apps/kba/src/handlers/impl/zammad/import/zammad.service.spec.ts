import { QueryRunner } from "typeorm";
import { ZammadService } from "./zammad.service";

describe('Zammad Service', () => {

  let zammadService: ZammadService;
  let queryRunner: QueryRunner;
  
  beforeEach(() => {
    queryRunner = <QueryRunner>{
        query(query: string, params?: any): Promise<any> {
            return Promise.resolve([]);
        }
    };
    zammadService = new ZammadService(queryRunner);
  });

  it('should build the hierarchy based on the records', async () => {
    
    const responses = [
        // Root categories
        [ 
            {id: 2, name: "CHILD 1", locale:"en"},
            {id: 3, name: "CHILD 2", locale:"en"},
        ],
        // Locale based child anwers for first category
        [],
        [],
        [],
        [],
        // First child of first category
        [
          {id: 4, name: "CHILD 1.1", locale:"en"}
        ],              
        // en-gb Answer for Child 1.1
        [], 
        // en Answer for Child 1.1
        [{id: 999, name: "Answer 1", body: "Answer Content", locale: 'en', localealias: ''}], 
        // Tags for provided anwser
        [
            {name: 'entity:entity_name:entity_value'},
            {name: 'intent:intent_name'},
            {name: 'option:ignore_remaining_entities:true'}
        ],
        
    ]
    responses.forEach(it => jest.spyOn(queryRunner, "query").mockImplementationOnce(() => Promise.resolve(it)));
    
    const categories = await zammadService.getHierarchy(null, true);        
    console.log(categories);
    expect(categories).toHaveLength(2);
    expect(categories[0].subcategories).toHaveLength(1);
    expect(categories[0].answers).toHaveLength(0);
    expect(categories[0].subcategories[0].answers).toHaveLength(1);
    expect(categories[0].subcategories[0].answers[0].tags).toHaveLength(3);
  });

});