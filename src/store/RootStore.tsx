import React, {createContext} from 'react';
import GridStore from "./GridStore";
import MessageStore from "./MessageStore";

export class RootStore {
    gridStore: GridStore;
    messageStore: MessageStore;
    constructor() {
        this.messageStore = new MessageStore();
        this.gridStore = new GridStore(this.messageStore);
    }
}

export default createContext(new RootStore());