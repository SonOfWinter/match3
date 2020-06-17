import React, {createContext} from 'react';
import GridStore from "./GridStore";
import MessageStore from "./MessageStore";
import StatStore from "./StatStore";

export class RootStore {
    gridStore: GridStore;
    messageStore: MessageStore;
    statStore: StatStore;
    constructor() {
        this.messageStore = new MessageStore();
        this.statStore = new StatStore();
        this.gridStore = new GridStore(this.messageStore, this.statStore);
    }
}

export default createContext(new RootStore());