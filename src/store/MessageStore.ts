import { action, computed, observable } from "mobx";
import Message from "../domain/Message";
import { RootStore } from "./RootStore";
import Match from "../domain/Match";

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

    @action
    addMatch = (match: Match) => {
        const message = 'Match-' + (match.suite + 1) + " " + match.color + (match.isCombo ? ' COMBO' : '');
        this.messages.push(new Message(message));
    }
}
