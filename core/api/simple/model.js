import simpleSchema from "./schema";

class simpleModel {
    constructor({name, number}) {
        if(name === undefined) {
            throw SyntaxError('Must include name.')
        }
        if(number === undefined) {
            throw SyntaxError('Must include number.')
        }
        if(typeof(name) !== this.simpleSchema.name) {
            throw TypeError(`Name must be ${this.simpleSchema.name}`)
        }
        if(typeof(number) !== this.simpleSchema.number) {
            throw TypeError(`Number must be ${this.simpleSchema.number}`)
        }

        this.name = name
        this.number = number
    }

    static modelName = "simple"
    static schema = simpleSchema;
}

export default simpleModel;