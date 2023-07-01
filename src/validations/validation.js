import { FieldIsRequiredError } from "../errors/field-required.error.js";

export class Validation {

    static async validate(fields, value){
        
      for await (const field of fields) {
        if(!value[field]) {
            throw new FieldIsRequiredError(field)
        }
      }
    }
}