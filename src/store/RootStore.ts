import { createContext } from 'react';
import GridStore from "./GridStore";
import MessageStore from "./MessageStore";
import StatStore from "./StatStore";

export class RootStore {
    gridStore: GridStore;
    messageStore: MessageStore;
    statStore: StatStore;
    constructor() {
        this.messageStore = new MessageStore(this);
        this.statStore = new StatStore(this);
        this.gridStore = new GridStore(this);
    }
}

export default createContext(new RootStore());