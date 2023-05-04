import simpleSchema from "./schema";

class simpleModel {
    constructor({name, number}) {
        number = Number(number)
        if(name === undefined) {
            throw SyntaxError('Must include name.')
        }
        if(number === undefined) {
            throw SyntaxError('Must include number.')
        }
        if(typeof(name) !== simpleModel.schema.name) {
            throw TypeError(`Name must be ${simpleModel.schema.name}`)
        }
        if(typeof(number) !== simpleModel.schema.number) {
            throw TypeError(`Number must be ${simpleModel.schema.number}`)
        }

        this.name = name
        this.number = number
    }

    static modelName = "simple";
    static schema = simpleSchema;
}

export default simpleModel;