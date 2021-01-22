import {makeObservable, action, computed, observable} from "mobx";
import {RootStore} from "./RootStore";

export default class StatStore {

    blue: number = 0;
    red: number = 0;
    green: number = 0;
    purple: number = 0;
    amber: number = 0;
    grey: number = 0;
    blueCount: number = 0;
    redCount: number = 0;
    greenCount: number = 0;
    purpleCount: number = 0;
    amberCount: number = 0;
    greyCount: number = 0;
    match3: number = 0;
    match4: number = 0;
    match5: number = 0;
    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        makeObservable(this, {
            blue: observable,
            red: observable,
            green: observable,
            purple: observable,
            amber: observable,
            grey: observable,
            blueCount: observable,
            redCount: observable,
            greenCount: observable,
            purpleCount: observable,
            amberCount: observable,
            greyCount: observable,
            match3: observable,
            match4: observable,
            match5: observable,
            info: computed,
            reset: action,
            addMatch3: action,
            addMatch4: action,
            addMatch5: action,
            addColor: action,
            addColorCount: action
        })
        this.rootStore = rootStore;
    }

    get info() {
        return {
            blue: this.blue,
            red: this.red,
            green: this.green,
            purple: this.purple,
            amber: this.amber,
            grey: this.grey,
            match3: this.match3,
            match4: this.match4,
            match5: this.match5,
            blueCount: this.blueCount,
            redCount: this.redCount,
            greenCount: this.greenCount,
            purpleCount: this.purpleCount,
            amberCount: this.amberCount,
            greyCount: this.greyCount,
        };
    }

    reset = () => {
        this.match5 = 0;
        this.blueCount = 0;
        this.redCount = 0;
        this.greenCount = 0;
        this.purpleCount = 0;
        this.amberCount = 0;
        this.greyCount = 0;
    }

    addMatch3 = () => {
        ++this.match3;
    }

    addMatch4 = () => {
        ++this.match4;
    }

    addMatch5 = () => {
        ++this.match5;
    }

    addColor = (color: string, number: number) => {
        switch (color) {
            case 'blue':
                this.blue = this.blue + number;
                break;
            case 'red':
                this.red = this.red + number;
                break;
            case 'green':
                this.green = this.green + number;
                break;
            case 'purple':
                this.purple = this.purple + number;
                break;
            case 'amber':
                this.amber = this.amber + number;
                break;
            case 'grey':
                this.grey = this.grey + number;
                break;
        }
    }

    addColorCount = (color: string, count: number) => {
        switch (color) {
            case 'blue':
                this.blueCount = this.blueCount + count;
                break;
            case 'red':
                this.redCount = this.redCount + count;
                break;
            case 'green':
                this.greenCount = this.greenCount + count;
                break;
            case 'purple':
                this.purpleCount = this.purpleCount + count;
                break;
            case 'amber':
                this.amberCount = this.amberCount + count;
                break;
            case 'grey':
                this.greyCount = this.greyCount + count;
                break;
        }
    }
}
