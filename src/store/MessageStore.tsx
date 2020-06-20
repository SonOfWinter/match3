import {action, computed, observable, reaction} from "mobx";
import Message from "../domain/Message";
import {RootStore} from "./RootStore";

export default class MessageStore {

    @observable messages: Message[] = [];
    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @computed
    get allMessages() {
        return this.messages.slice().reverse();
    }

    @action
    add = (message: string) => {
        this.messages.push(new Message(message));
    }

    reactionToNewMessage = reaction(
        () => this.messages.length,
        length => console.log("New message :", this.messages[length-1].message)
    )
}
