import {action, computed, observable, reaction} from "mobx"
import Cell, {CellInfo} from '../domain/Cell';
import {RootStore} from "./RootStore";
import Match from "../domain/Match";

const squareSize = 8;

interface ColorStat {
    blue: number;
    red: number;
    green: number;
    purple: number;
    amber: number;
    grey: number;
}

interface SimpleCell {
    x: number;
    y: number;
}


interface MatchResult {
    cellsToRemove: SimpleCell[]
    matches: Match[],
    newGrid: any[]
}

interface ForInitGrid {
    x: ColorStat[];
    y: ColorStat[];
}

export default class GridStore {
    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.init();
    }

    @observable grid: any[] = [];
    @observable selectedCell: CellInfo | null = null;
    @observable canMove: boolean = true;
    @observable matches: Match[] = [];
    @observable oldMatches: Match[] = [];

    forInitGridStat: ForInitGrid = {x: [], y: []};

    reactionToNewMatch = reaction(
        () => this.matches,
        (newMatches: Match[]) => {
            const matches = newMatches.filter(x => !this.oldMatches.includes(x));
            matches.forEach(match => {
                this.rootStore.messageStore.addMatch(match);
                if (match.suite === 2) {
                    this.rootStore.statStore.addMatch3();
                }
                if (match.suite === 3) {
                    this.rootStore.statStore.addMatch4();
                }
                if (match.suite === 4) {
                    this.rootStore.statStore.addMatch5();
                }
                this.rootStore.statStore.addColor(match.color, match.suite+1);
            });
            this.oldMatches = [...newMatches];
        }
    );

    getNextColor(x: number, y: number, forInit: boolean, count: number = 0): Cell {
        const number = Math.random() * 100;
        let color = null;
        if (number <= 16 && (!forInit || (this.forInitGridStat.x[x].blue < 2 && this.forInitGridStat.y[y].blue < 2))) {
            this.forInitGridStat.x[x].blue++;
            this.forInitGridStat.y[y].blue++;
            color = 'blue';
        } else if (number <= 32 && (!forInit || (this.forInitGridStat.x[x].red < 2 && this.forInitGridStat.y[y].red < 2))) {
            this.forInitGridStat.x[x].red++;
            this.forInitGridStat.y[y].red++;
            color = 'red';
        } else if (number <= 48 && (!forInit || (this.forInitGridStat.x[x].green < 2 && this.forInitGridStat.y[y].green < 2))) {
            this.forInitGridStat.x[x].green++;
            this.forInitGridStat.y[y].green++;
            color = 'green';
        } else if (number <= 64 && (!forInit || (this.forInitGridStat.x[x].purple < 2 && this.forInitGridStat.y[y].purple < 2))) {
            this.forInitGridStat.x[x].purple++;
            this.forInitGridStat.y[y].purple++;
            color = 'purple';
        } else if (number <= 80 && (!forInit || (this.forInitGridStat.x[x].amber < 2 && this.forInitGridStat.y[y].amber < 2))) {
            this.forInitGridStat.x[x].amber++;
            this.forInitGridStat.y[y].amber++;
            color = 'amber'
        } else if (!forInit || (this.forInitGridStat.x[x].grey < 2 && this.forInitGridStat.y[y].grey < 2) || count > 8) {
            this.forInitGridStat.x[x].grey++;
            this.forInitGridStat.y[y].grey++;
            color = 'grey';
        }
        if (color !== null) {
            this.rootStore.statStore.addColorCount(color, 1);
            return new Cell(x, y, squareSize, color);
        } else {
            return this.getNextColor(x, y, forInit, count + 1);
        }
    }

    init() {
        for (let i: number = 0; i < squareSize; i++) {
            this.forInitGridStat.x[i] = {
                blue: 0,
                red: 0,
                green: 0,
                purple: 0,
                amber: 0,
                grey: 0,
            }
            this.forInitGridStat.y[i] = {
                blue: 0,
                red: 0,
                green: 0,
                purple: 0,
                amber: 0,
                grey: 0,
            }
        }
        for (let x: number = 0; x < squareSize; x++) {
            this.grid[x] = [];
            for (let y: number = 0; y < squareSize; y++) {
                let cell = this.getNextColor(x, y, true);
                this.grid[x].push(cell)
            }
        }
    }

    @computed
    get info() {
        return {
            grid: this.grid,
            flatGrid: this.grid.flat(),
            selectedCell: this.selectedCell,
            canMove: this.canMove
        };
    }

    @computed
    get flatGrid(): Cell[] {
        return this.grid.flat();
    }

    @action
    select = (x: number, y: number) => {
        let isSelected: boolean = this.grid[x][y].selected;
        if (this.selectedCell === null || isSelected) {
            this.grid[x][y].selected = !isSelected;
            if (!isSelected) {
                this.selectedCell = {...this.grid[x][y]};
            } else {
                this.selectedCell = null;
            }
            if (x - 1 >= 0) {
                this.grid[x - 1][y].canBeSelected = !isSelected;
            }
            if (x + 1 <= 7) {
                this.grid[x + 1][y].canBeSelected = !isSelected;
            }
            if (y - 1 >= 0) {
                this.grid[x][y - 1].canBeSelected = !isSelected;
            }
            if (y + 1 <= 7) {
                this.grid[x][y + 1].canBeSelected = !isSelected;
            }
        } else {
            let isCanBeSelected: boolean = this.grid[x][y].canBeSelected;
            if (isCanBeSelected) {
                this.canMove = false;
                let first = {...this.selectedCell, selected: false};
                let second = {...this.grid[x][y]};
                if (first.x - 1 >= 0) {
                    this.grid[first.x - 1][first.y].canBeSelected = false;
                }
                if (first.x + 1 <= 7) {
                    this.grid[first.x + 1][first.y].canBeSelected = false;
                }
                if (first.y - 1 >= 0) {
                    this.grid[first.x][first.y - 1].canBeSelected = false;
                }
                if (first.y + 1 <= 7) {
                    this.grid[first.x][first.y + 1].canBeSelected = false;
                }

                this.selectedCell = null;
                setTimeout(() => {
                        this.invertCellPosition(first.x, first.y, second.x, second.y)
                    }, 50
                );
                setTimeout(() => {
                    this.invertCellData(first.x, first.y, second.x, second.y);
                }, 500)
            }

        }
    }

    @action.bound
    countMatch(match: Match) {
        this.matches.push(match);
    }

    getGridMatch(grid: any[], isCombo: boolean): MatchResult {
        let newGrid = {...grid};
        let cellsToRemove: SimpleCell[] = [];
        let matches: Match[] = [];
        let currentColor: string = '';
        let currentSuite: number = 0;
        let elemInList: any;
        for (let x: number = 0; x < squareSize; x++) {
            for (let y: number = 0; y < squareSize; y++) {
                if (y === 0) {
                    currentColor = newGrid[x][y].name;
                    currentSuite = 0;
                } else {
                    if (newGrid[x][y].name === currentColor) {
                        currentSuite++;
                    } else {
                        if (currentSuite >= 2) {
                            matches.push(new Match(currentColor, currentSuite, isCombo));
                        }
                        currentColor = newGrid[x][y].name;
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
                if (y >= squareSize - 1 && currentSuite >= 2) {
                    matches.push(new Match(currentColor, currentSuite, isCombo));
                }
            }
        }
        currentColor = '';
        currentSuite = 0;
        for (let y: number = 0; y < squareSize; y++) {
            for (let x: number = 0; x < squareSize; x++) {
                if (x === 0) {
                    currentColor = newGrid[x][y].name;
                    currentSuite = 0;
                } else {
                    if (newGrid[x][y].name === currentColor) {
                        currentSuite++;
                    }
                    if (newGrid[x][y].name !== currentColor) {
                        if (currentSuite >= 2) {
                            matches.push(new Match(currentColor, currentSuite, isCombo));
                        }
                        currentColor = newGrid[x][y].name;
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
                if (x >= squareSize - 1 && currentSuite >= 2) {
                    matches.push(new Match(currentColor, currentSuite, isCombo));
                }
            }
        }
        const returnedCellsToRemove: SimpleCell[] = cellsToRemove.sort((a, b) => {
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
            matches,
            newGrid
        };
    }


    @action.bound
    getMatch(isCombo: boolean = false): MatchResult {
        return this.getGridMatch({...this.grid}, isCombo);
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
        const newMatches: MatchResult = this.getMatch(true);
        if (newMatches.cellsToRemove.length > 0) {
            setTimeout(() => {
                this.matches = this.matches.concat(newMatches.matches);
            }, 500)
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
                    ...this.getNextColor(x, newY, false),
                    top: (((7 - newY) * 66) - 528)
                }
                this.grid[x][newY] = newCell;
                newY--;
            })
        }
    }

    @action.bound
    invertCellData(fx: number, fy: number, sx: number, sy: number, isRevert: boolean = false) {
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
            let matches: MatchResult = this.getMatch();
            if (matches.cellsToRemove.length === 0) {
                setTimeout(() => {
                    this.invertCellPosition(fx, fy, sx, sy);
                }, 50)
                setTimeout(() => {
                    this.invertCellData(fx, fy, sx, sy, true);
                }, 500)
            } else if (matches.cellsToRemove.length > 0) {
                setTimeout(() => {
                    this.matches = this.matches.concat(matches.matches);
                }, 50)

                this.removeMatches(matches.cellsToRemove);
            } else {
                this.canMove = true;
            }
        } else {
            this.canMove = true;
        }
    }

    @action.bound
    invertCellPosition(fx: number, fy: number, sx: number, sy: number) {
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
        this.rootStore.statStore.addColorCount(this.grid[x][y].name, -1);
        this.grid[x][y] = null;
        for (let i: number = y; i < 7; i++) {
            this.grid[x][i] = {...this.grid[x][i + 1], y: i, top: (7 - i) * 66, zIndex: 7 - i};
        }
    }
}
