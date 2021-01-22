import {action, computed, makeObservable, observable} from "mobx";
import Message from "../domain/Message";
import { RootStore } from "./RootStore";
import Match from "../domain/Match";

export default class MessageStore {

    messages: Message[] = [];
    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        makeObservable(this, {
            messages: observable,
            allMessages: computed,
            add: action,
            addMatch: action,
        })
        this.rootStore = rootStore;
    }

    get allMessages() {
        return this.messages.slice().reverse();
    }

    add = (message: string) => {
        console.log(message);
        this.messages.push(new Message(message));
    }

    addMatch = (match: Match) => {
        const message = 'Match-' + (match.suite + 1) + " " + match.color + (match.isCombo ? ' COMBO' : '');
        this.messages.push(new Message(message));
    }
}
