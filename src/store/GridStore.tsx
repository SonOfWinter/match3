import {action, computed, observable} from "mobx"
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import yellow from '@material-ui/core/colors/yellow';
import blueGrey from '@material-ui/core/colors/blueGrey';
import lime from '@material-ui/core/colors/lime';
import brown from '@material-ui/core/colors/brown';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import EcoIcon from '@material-ui/icons/Eco';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import BugReportIcon from '@material-ui/icons/BugReport';
import ExtensionIcon from '@material-ui/icons/Extension';
import MessageStore from "./MessageStore";

export const blueCell = {
    name: 'blue',
    backgroundColor: blue[500],
    color: blue[800],
    icon: InvertColorsIcon
}

export const redCell = {
    name: 'red',
    backgroundColor: red[500],
    color: yellow[500],
    icon: WhatshotIcon
}

export const greenCell = {
    name: 'green',
    backgroundColor: green[500],
    color: brown[500],
    icon: EcoIcon
}

export const purpleCell = {
    name: 'purple',
    backgroundColor: purple[500],
    color: lime[500],
    icon: BubbleChartIcon
}

export const amberCell = {
    name: 'amber',
    backgroundColor: amber[500],
    color: green[500],
    icon: BugReportIcon
}

export const deathCell = {
    name: 'death',
    backgroundColor: blueGrey[500],
    color: amber[700],
    icon: ExtensionIcon
}

const squareSize = 8;

interface ColorStat {
    blue: number;
    red: number;
    green: number;
    purple: number;
    amber: number;
    death: number;
}

interface SimpleCell {
    x: number;
    y: number;
}

export interface Match {
    color: string;
    suite: number;
    isCombo: boolean;
}

interface MatchResult {
    cellsToRemove: SimpleCell[]
    matches: Match[]
}

interface ForInitGrid {
    x: ColorStat[];
    y: ColorStat[];
}

export interface CellPart {
    name: string;
    backgroundColor: string;
    color: string;
    icon: object;
}


export interface Cell extends CellPart {
    id: string;
    x: number;
    y: number;
    zIndex: number;
    selected: boolean;
    canBeSelected: boolean;
    top: number;
    left: number;
}

export default class GridStore {
    private messageStore: MessageStore;

    constructor(messageStore: MessageStore) {
        this.messageStore = messageStore;
        this.init();
    }

    @observable grid: any[] = [];
    @observable selectedCell: Cell | null = null;
    @observable canMove: boolean = true;

    blueStat = 0;
    redStat = 0;
    greenStat = 0;
    purpleStat = 0;
    amberStat = 0;
    deathStat = 0;

    forInitGridStat: ForInitGrid = {x: [], y: []};

    getNextColor(x: number, y: number, forInit: boolean, count: number = 0): CellPart {
        const number = Math.random() * 100;
        if (number <= 16 && (!forInit || (this.forInitGridStat.x[x].blue < 2 && this.forInitGridStat.y[y].blue < 2))) {
            this.forInitGridStat.x[x].blue++;
            this.forInitGridStat.y[y].blue++;
            this.blueStat++;
            return {...blueCell};
        } else if (number <= 32 && (!forInit || (this.forInitGridStat.x[x].red < 2 && this.forInitGridStat.y[y].red < 2))) {
            this.forInitGridStat.x[x].red++;
            this.forInitGridStat.y[y].red++;
            this.redStat++;
            return {...redCell};
        } else if (number <= 48 && (!forInit || (this.forInitGridStat.x[x].green < 2 && this.forInitGridStat.y[y].green < 2))) {
            this.forInitGridStat.x[x].green++;
            this.forInitGridStat.y[y].green++;
            this.greenStat++;
            return {...greenCell};
        } else if (number <= 64 && (!forInit || (this.forInitGridStat.x[x].purple < 2 && this.forInitGridStat.y[y].purple < 2))) {
            this.forInitGridStat.x[x].purple++;
            this.forInitGridStat.y[y].purple++;
            this.purpleStat++;
            return {...purpleCell};
        } else if (number <= 80 && (!forInit || (this.forInitGridStat.x[x].amber < 2 && this.forInitGridStat.y[y].amber < 2))) {
            this.forInitGridStat.x[x].amber++;
            this.forInitGridStat.y[y].amber++;
            this.amberStat++;
            return {...amberCell};
        } else {
            if (!forInit || (this.forInitGridStat.x[x].death < 2 && this.forInitGridStat.y[y].death < 2) || count > 8) {
                this.forInitGridStat.x[x].death++;
                this.forInitGridStat.y[y].death++;
                this.deathStat++;
                return {...deathCell};
            } else {
                return this.getNextColor(x, y, forInit, count + 1);
            }
        }
    }

    getCell(x: number, y: number, forInit: boolean) {
        return {
            ...this.getNextColor(x, y, forInit),
            id: this.makeid(10),
            y,
            x,
            selected: false,
            canBeSelected: false,
            top: (7 - y) * 66,
            left: x * 66,
            zIndex: 7 - y
        }
    }

    makeid(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    init() {
        for (let i: number = 0; i < squareSize; i++) {
            this.forInitGridStat.x[i] = {
                blue: 0,
                red: 0,
                green: 0,
                purple: 0,
                amber: 0,
                death: 0,
            }
            this.forInitGridStat.y[i] = {
                blue: 0,
                red: 0,
                green: 0,
                purple: 0,
                amber: 0,
                death: 0,
            }
        }
        for (let x: number = 0; x < squareSize; x++) {
            this.grid[x] = [];
            for (let y: number = 0; y < squareSize; y++) {
                let cell = this.getCell(x, y, true);
                this.grid[x].push(cell)
            }
        }
        this.messageStore.add('init grid');
    }

    @computed
    get info() {
        return {
            grid: this.grid,
            selectedCell: this.selectedCell,
            canMove: this.canMove
        };
    }

    @action
    select = (x: number, y: number) => {
        let isSelected: boolean = this.grid[x][y].selected;
        if (this.selectedCell === null || isSelected) {
            const selectedCell = {...this.grid[x][y], selected: !isSelected};
            this.grid[x][y] = selectedCell;
            if (!isSelected) {
                this.selectedCell = selectedCell;
            } else {
                this.selectedCell = null;
            }
            if (x - 1 >= 0) {
                this.grid[x - 1][y] = {...this.grid[x - 1][y], canBeSelected: !isSelected};
            }
            if (x + 1 <= 7) {
                this.grid[x + 1][y] = {...this.grid[x + 1][y], canBeSelected: !isSelected};
            }
            if (y - 1 >= 0) {
                this.grid[x][y - 1] = {...this.grid[x][y - 1], canBeSelected: !isSelected};
            }
            if (y + 1 <= 7) {
                this.grid[x][y + 1] = {...this.grid[x][y + 1], canBeSelected: !isSelected};
            }
        } else {
            let isCanBeSelected: boolean = this.grid[x][y].canBeSelected;
            if (isCanBeSelected) {
                this.messageStore.add('Move');
                this.canMove = false;
                let first = {...this.selectedCell, selected: false};
                let second = {...this.grid[x][y]};
                if (first.x - 1 >= 0) {
                    this.grid[first.x - 1][first.y] = {
                        ...this.grid[first.x - 1][first.y],
                        canBeSelected: false
                    };
                }
                if (first.x + 1 <= 7) {
                    this.grid[first.x + 1][first.y] = {
                        ...this.grid[first.x + 1][first.y],
                        canBeSelected: false
                    };
                }
                if (first.y - 1 >= 0) {
                    this.grid[first.x][first.y - 1] = {
                        ...this.grid[first.x][first.y - 1],
                        canBeSelected: false
                    };
                }
                if (first.y + 1 <= 7) {
                    this.grid[first.x][first.y + 1] = {
                        ...this.grid[first.x][first.y + 1],
                        canBeSelected: false
                    };
                }

                this.selectedCell = null;
                setTimeout(() => {
                        this.invertCellData(first.x, first.y, second.x, second.y)
                    }, 50
                );
                setTimeout(() => {
                    this.switchCellData(first.x, first.y, second.x, second.y);
                }, 500)
            }

        }
    }

    @action.bound
    countMatch(suite: number, color: string, isCombo: boolean) {
        const message = 'Match-' + (suite+1) + " " + color + (isCombo ? ' COMBO' : '');
        setTimeout(() => {
            this.messageStore.add(message);
        }, 300);
    }

    @action.bound
    getMatch(isCombo: boolean = false): MatchResult {
        let cellsToRemove: SimpleCell[] = [];
        let matches: Match[] = [];
        let currentColor: string = '';
        let currentSuite: number = 0;
        let elemInList: any;
        for (let x: number = 0; x < squareSize; x++) {
            for (let y: number = 0; y < squareSize; y++) {
                if (y === 0) {
                    currentColor = this.grid[x][y].name;
                    currentSuite = 0;
                } else {
                    if (this.grid[x][y].name === currentColor) {
                        currentSuite++;
                    } else {
                        if (currentSuite >= 2) {
                            matches.push({suite: currentSuite, color: currentColor, isCombo});
                        }
                        currentColor = this.grid[x][y].name;
                        currentSuite = 0;
                    }
                }
                if (currentSuite === 2) {
                    elemInList = cellsToRemove.find(elem => elem.x === x && elem.y === y - 2);
                    if (elemInList === undefined) {
                        cellsToRemove.push({x, y: y - 2});
                    }
                    elemInList = cellsToRemove.find(elem => elem.x === x && elem.y === y - 1);
                    if (elemInList === undefined) {
                        cellsToRemove.push({x, y: y - 1});
                    }
                    elemInList = cellsToRemove.find(elem => elem.x === x && elem.y === y);
                    if (elemInList === undefined) {
                        cellsToRemove.push({x, y});
                    }
                } else if (currentSuite > 2) {
                    elemInList = cellsToRemove.find(elem => elem.x === x && elem.y === y);
                    if (elemInList === undefined) {
                        cellsToRemove.push({x, y});
                    }
                }

            }
        }
        currentColor = '';
        currentSuite = 0;
        for (let y: number = 0; y < squareSize; y++) {
            for (let x: number = 0; x < squareSize; x++) {
                if (x === 0) {
                    currentColor = this.grid[x][y].name;
                    currentSuite = 0;
                } else {
                    if (this.grid[x][y].name === currentColor) {
                        currentSuite++;
                    } else {
                        if (currentSuite >= 2) {
                            matches.push({suite: currentSuite, color: currentColor, isCombo});
                        }
                        currentColor = this.grid[x][y].name;
                        currentSuite = 0;
                    }
                }
                if (currentSuite === 2) {
                    elemInList = cellsToRemove.find(elem => elem.x === x - 2 && elem.y === y);
                    if (elemInList === undefined) {
                        cellsToRemove.push({x: x - 2, y});
                    }
                    elemInList = cellsToRemove.find(elem => elem.x === x - 1 && elem.y === y);
                    if (elemInList === undefined) {
                        cellsToRemove.push({x: x - 1, y});
                    }
                    elemInList = cellsToRemove.find(elem => elem.x === x && elem.y === y);
                    if (elemInList === undefined) {
                        cellsToRemove.push({x, y});
                    }
                } else if (currentSuite > 2) {
                    elemInList = cellsToRemove.find(elem => elem.x === x && elem.y === y);
                    if (elemInList === undefined) {
                        cellsToRemove.push({x, y});
                    }
                }
            }
        }
        const returnedCellsToRemove:SimpleCell[] =  cellsToRemove.sort((a, b) => {
            if (a.y > b.y) {
                return -1;
            } else if (a.y < b.y) {
                return 1;
            } else if (a.x < b.x) {
                return -1;
            }
            return 0;
        });
        return {
            cellsToRemove: returnedCellsToRemove,
            matches
        };
    }


    @action.bound
    moveNewCells() {
        for (let x: number = 0; x < squareSize; x++) {
            for (let y: number = 0; y < squareSize; y++) {
                if (this.grid[x][y].top < 0) {
                    this.grid[x][y].top = (7 - y) * 66;
                }
            }
        }
    }

    @action.bound
    removeMatches(matches: SimpleCell[]) {
        matches.forEach(simpleCell => {
            this.remove(simpleCell.x, simpleCell.y);
        });
        this.fillGrid(matches);
        setTimeout(() => {
            this.moveNewCells();
        }, 100);
        const newMatches:MatchResult = this.getMatch(true);
        if (newMatches.cellsToRemove.length > 0) {
            newMatches.matches.forEach(m => {
                setTimeout(() => {
                    this.countMatch(m.suite, m.color, m.isCombo);
                }, 50)
            });
            setTimeout(() => {
                this.removeMatches(newMatches.cellsToRemove);
            }, 600);
        } else {
            this.canMove = true;
        }
    }

    @action.bound
    fillGrid(matches: SimpleCell[]) {
        for (let x: number = 0; x < squareSize; x++) {
            let newY: number = 7;
            const yMatches = matches.filter(m => m.x === x);
            yMatches.forEach(m => {
                const newCell = {
                    ...this.getCell(x, newY, false),
                    top: (((7 - newY) * 66) - 528)
                }
                this.grid[x][newY] = newCell;
                newY--;
            })
        }
    }

    @action.bound
    switchCellData(fx: number, fy: number, sx: number, sy: number, isRevert: boolean = false) {
        let first = {...this.grid[fx][fy]};
        let second = {...this.grid[sx][sy]};
        this.grid[fx][fy] = {
            ...second,
            x: fx,
            y: fy,
            top: (7 - fy) * 66,
            left: fx * 66,
            zIndex: 7 - fy
        };
        this.grid[sx][sy] = {
            ...first,
            x: sx,
            y: sy,
            top: (7 - sy) * 66,
            left: sx * 66,
            zIndex: 7 - sy
        };
        if (!isRevert) {
            let matches:MatchResult = this.getMatch();
            if (matches.cellsToRemove.length === 0) {
                setTimeout(() => {
                    this.invertCellData(fx, fy, sx, sy);
                }, 50)
                setTimeout(() => {
                    this.switchCellData(fx, fy, sx, sy, true);
                }, 500)
            } else if (matches.cellsToRemove.length > 0) {
                matches.matches.forEach(m => {
                    setTimeout(() => {
                        this.countMatch(m.suite, m.color, m.isCombo);
                    }, 50)
                })
                this.removeMatches(matches.cellsToRemove);
            } else {
                this.canMove = true;
            }
        } else {
            this.canMove = true;
        }
    }

    @action.bound
    invertCellData(fx: number, fy: number, sx: number, sy: number) {
        let first = {...this.grid[fx][fy]};
        let second = {...this.grid[sx][sy]};
        this.grid[fx][fy] = {
            ...first,
            selected: false,
            canBeSelected: false,
            x: sx,
            y: sy,
            top: (7 - sy) * 66,
            left: sx * 66,
            zIndex: 7 - sy
        };
        this.grid[sx][sy] = {
            ...second,
            selected: false,
            canBeSelected: false,
            x: fx,
            y: fy,
            top: (7 - fy) * 66,
            left: fx * 66,
            zIndex: 7 - fy
        };
    }

    @action.bound
    remove(x: number, y: number) {
        this.grid[x][y] = null;
        for (let i: number = y; i < 7; i++) {
            this.grid[x][i] = {...this.grid[x][i + 1], y: i, top: (7 - i) * 66, zIndex: 7 - i};
        }
    }
}
