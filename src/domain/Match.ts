export default class Match {
    color: string;
    suite: number;
    isCombo: boolean;

    constructor(color: string, suite: number, isCombo: boolean) {
        this.color = color;
        this.suite = suite;
        this.isCombo = isCombo;
    }

}
