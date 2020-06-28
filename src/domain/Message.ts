import { makeId } from "../utils/IdUtils";

export default class Message {
    id: string;
    date: Date;
    message: string;

    constructor(message: string) {
        this.id = makeId(10);
        this.date = new Date();
        this.message = message;
    }

    toString(): string {
        return this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds() + ' : ' + this.message;
    }
}
