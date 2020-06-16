import {action, computed, observable} from "mobx";

export default class MessageStore {

    constructor() {
    }

    @observable messages: string[] = [];

    @computed
    get info() {
        return {
            messages: this.messages
        };
    }

    @action
    add = (message: string) => {
        this.messages.push(message);
    }
}
