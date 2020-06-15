import {createContext} from "react";
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

export interface Cell extends CellPart{
    id: string;
    x: number;
    y: number;
    zIndex: number;
    selected: boolean;
    canBeSelected: boolean;
    top: number;
    left: number;
}

export class GridStore {

    constructor() {
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
    }

    @action.bound
    getMatch(): SimpleCell[] {
        let cellsToRemove:SimpleCell[] = [];
        let currentColor: string = '';
        let currentSuite: number = 0;
        let elemInList:any;
        for (let x: number = 0; x < squareSize; x++) {
            for (let y: number = 0; y < squareSize; y++) {
                if (y === 0) {
                    currentColor = this.grid[x][y].name;
                    currentSuite = 0;
                } else {
                    if (this.grid[x][y].name === currentColor) {
                        currentSuite++;
                    } else {
                        currentColor = this.grid[x][y].name;
                        currentSuite = 0;
                    }
                }
                if (currentSuite === 2) {
                    elemInList = cellsToRemove.find(elem => elem.x === x && elem.y === y-2);
                    if (elemInList === undefined) {
                        cellsToRemove.push({x, y: y-2});
                    }
                    elemInList = cellsToRemove.find(elem => elem.x === x && elem.y === y-1);
                    if (elemInList === undefined) {
                        cellsToRemove.push({x, y: y-1});
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
        for (let y: number = 0; y < squareSize; y++) {
            for (let x: number = 0; x < squareSize; x++) {
                if (x === 0) {
                    currentColor = this.grid[x][y].name;
                    currentSuite = 0;
                } else {
                    if (this.grid[x][y].name === currentColor) {
                        currentSuite++;
                    } else {
                        currentColor = this.grid[x][y].name;
                        currentSuite = 0;
                    }
                }
                if (currentSuite === 2) {
                    elemInList = cellsToRemove.find(elem => elem.x === x-2 && elem.y === y);
                    if (elemInList === undefined) {
                        cellsToRemove.push({x: x-2, y});
                    }
                    elemInList = cellsToRemove.find(elem => elem.x === x-1 && elem.y === y);
                    if (elemInList === undefined) {
                        cellsToRemove.push({x: x-1, y});
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
        //console.log(cellsToRemove);
        return cellsToRemove.sort((a, b) => {
            if (a.y > b.y) {
                return -1;
            } else if (a.y < b.y) {
                return 1;
            } else if (a.x < b.x) {
                return -1;
            }
            // a doit être égal à b
            return 0;
        });
    }


    @action.bound
    moveNewCells() {
        for (let x: number = 0; x < squareSize; x++) {
            for (let y: number = 0; y < squareSize; y++) {
                if (this.grid[x][y].top < 0) {
                    //console.log('move ' + x+ ':'+y+ ' from ' + this.grid[x][y].top +  ' to ' + ((7 - y) * 66));
                    this.grid[x][y].top = (7 - y) * 66;
                }
            }
        }
    }

    @action.bound
    removeMatches(matches: SimpleCell[]) {
        //console.log('removeMatches');
        //console.log(matches);
        matches.forEach(simpleCell => {
            this.remove(simpleCell.x, simpleCell.y);
        });
        this.fillGrid(matches);
        setTimeout(() => {
            this.moveNewCells();
        }, 100);
        const newMatches = this.getMatch();
        if (newMatches.length > 0) {
            setTimeout(() => {
                this.removeMatches(newMatches);
            }, 600);
        } else {
            this.canMove = true;
        }
    }

    @action.bound
    fillGrid(matches: SimpleCell[])
    {
        //console.log('fillGrid');
        for(let x:number = 0; x < squareSize; x++) {
            let newY: number = 7;
            const yMatches = matches.filter(m => m.x === x);
            yMatches.forEach(m => {
                const newCell = {
                    ...this.getCell(x, newY, false),
                    top: (((7 - newY) * 66) - 528)
                }
                //console.log(newCell);
                this.grid[x][newY] = newCell;
                newY--;
            })
        }
    }

    @action.bound
    switchCellData(fx: number, fy: number, sx: number, sy: number, isRevert: boolean = false) {
        //console.log('switchCellData ' + fx + ':' + fy + ' ' + sx + ':' + sy);
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
        let matches = this.getMatch();
        if (matches.length === 0 && !isRevert) {
            this.revert(fx, fy, sx, sy);
        } else if (!isRevert && matches.length > 0) {
            this.removeMatches(matches);
        } else {
            this.canMove = true;
        }
    }

    @action.bound
    revert(fx: number, fy: number, sx: number, sy: number) {
        //console.log('revert');
        let first = {...this.grid[fx][fy]};
        // revert
        //console.log({...this.grid[fx][fy]});
        let second = {...this.grid[sx][sy]};
        this.grid[fx][fy] = {
            ...first,
            x: sx,
            y: sy,
            top: (7 - sy) * 66,
            left: sx  * 66,
            zIndex: 7 - sy
        };
        //console.log({...this.grid[fx][fy]});
        //console.log({...this.grid[sx][sy]});
        this.grid[sx][sy] = {
            ...second,
            x: fx,
            y: fy,
            top: (7 - fy) * 66,
            left: fx  * 66,
            zIndex: 7 - fy
        };
        //console.log({...this.grid[sx][sy]});
        setTimeout(() => {
            this.switchCellData( second.x, second.y, first.x, first.y,true);
        }, 500)
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

                this.grid[first.x][first.y] = {
                    ...first,
                    selected: false,
                    canBeSelected: false,
                    x: second.x,
                    y: second.y,
                    top: second.top,
                    left: second.left,
                    zIndex: 7 - second.y
                };
                this.grid[second.x][second.y] = {
                    ...second,
                    selected: false,
                    canBeSelected: false,
                    x: first.x,
                    y: first.y,
                    top: first.top,
                    left: first.left,
                    zIndex: 7 - first.y
                };
                setTimeout(() => {
                    this.switchCellData(first.x, first.y, second.x, second.y);
                }, 500)
            }

        }
    }

    @action.bound
    remove(x: number, y: number) {
        //console.log('remove ' + x + ':' + y);
        this.grid[x][y] = null;
        for (let i: number = y; i < 7; i++) {
            this.grid[x][i] = {...this.grid[x][i + 1], y: i, top: (7 - i) * 66, zIndex: 7 - i};
        }
    }
}

export default createContext(new GridStore());