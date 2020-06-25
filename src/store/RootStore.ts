import {createContext} from 'react';
import NewGridStore from "./NewGridStore";
import MessageStore from "./MessageStore";
import StatStore from "./StatStore";

export class RootStore {
    gridStore: NewGridStore;
    messageStore: MessageStore;
    statStore: StatStore;
    constructor() {
        this.messageStore = new MessageStore(this);
        this.statStore = new StatStore(this);
        this.gridStore = new NewGridStore(this);
    }
}

export default createContext(new RootStore());