import { runInAction, observable, makeObservable } from "mobx";
import Cell from "./Cell";
import Match from "./Match";

export interface ColorStat {
    blue: number;
    red: number;
    green: number;
    purple: number;
    amber: number;
    grey: number;
}

export interface ForInitGrid {
    x: ColorStat[];
    y: ColorStat[];
}

export interface MatchResult {
    cellsToRemove: SimpleCell[]
    matches: Match[]
}

export interface SimpleCell {
    x: number;
    y: number;
}

export default class Grid {

    private squareSize: number;
    canMove: boolean = true;
    cells: Cell[] = [];
    selectedCell: Cell | null = null;
    forInitGridStat: ForInitGrid = {x: [], y: []};

    constructor(squareSize: number) {
        makeObservable(this, {
            canMove: observable,
            cells: observable,
            selectedCell: observable,
            forInitGridStat: observable
        });

        this.squareSize = squareSize;
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
            for (let y: number = 0; y < squareSize; y++) {
                const cell = this.getNextColor(x, y, true);
                this.cells.push(cell);
            }
        }
    }

    private getNextColor(x: number, y: number, forInit: boolean, count: number = 0): Cell {
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
            return new Cell(x, y, this.squareSize, color);
        } else {
            return this.getNextColor(x, y, forInit, count + 1);
        }
    }

    get(x: number, y: number, createIfUndefined: boolean = false, usedGrid: Cell[] | null = null): Cell | null {
        let grid: Cell[];
        if (usedGrid !== null) {
            grid = usedGrid;
        } else {
            grid = this.cells;
        }

        let cell = grid.find(cell => cell.x === x && cell.y === y);
        if (cell === undefined) {
            if (createIfUndefined) {
                cell = this.getNextColor(x, y, false);
                grid.push(cell);
            } else {
                return null;
            }
        }
        return cell;
    }

    private setNearCanBeSelected(x: number, y: number, canBeselected: boolean): void {
        let leftCell = this.get(x - 1, y);
        if (leftCell !== null) {
            leftCell.canBeSelected = canBeselected;
        }
        let rightCell = this.get(x + 1, y);
        if (rightCell !== null) {
            rightCell.canBeSelected = canBeselected;
        }
        let topCell = this.get(x, y + 1);
        if (topCell !== null) {
            topCell.canBeSelected = canBeselected;
        }
        let bottomCell = this.get(x, y - 1);
        if (bottomCell !== null) {
            bottomCell.canBeSelected = canBeselected;
        }
    }

    /**
     * @param x
     * @param y
     * return need to execute next step
     */
    select(x: number, y: number): boolean {
        if (this.canMove) {
            let cell = this.get(x, y);
            if (cell === null) {
                return false;
            }
            let alreadySelected: boolean = cell.selected;
            if (this.selectedCell === null || alreadySelected) {
                cell.selected = !alreadySelected;
                if (alreadySelected) {
                    this.selectedCell = null;
                } else {
                    this.selectedCell = new Cell(0, 0, this.squareSize, 'white');
                    this.selectedCell.copy(cell);
                }
                this.setNearCanBeSelected(x, y, !alreadySelected);
            } else if (cell.canBeSelected) {
                this.canMove = false;
                let selected = this.get(this.selectedCell.x, this.selectedCell.y);
                if (selected === null) {
                    return false;
                }
                selected.selected = false;
                this.setNearCanBeSelected(this.selectedCell.x, this.selectedCell.y, false);
                this.selectedCell = null;
                return true;
            }
        }
        return false;
    }

    getGridMatch(isCombo: boolean): MatchResult {
        let cellsToRemove: SimpleCell[] = [];
        let matches: Match[] = [];
        let currentColor: string = '';
        let currentSuite: number = 0;
        let elemInList: any;
        for (let x: number = 0; x < this.squareSize; x++) {
            for (let y: number = 0; y < this.squareSize; y++) {
                let cell = this.get(x, y, false, this.cells);
                if (cell === null) {
                    continue;
                }
                if (y === 0) {
                    currentColor = cell.name;
                    currentSuite = 0;
                } else {
                    if (cell.name === currentColor) {
                        currentSuite++;
                    } else {
                        if (currentSuite >= 2) {
                            matches.push(new Match(currentColor, currentSuite, isCombo));
                        }
                        currentColor = cell.name;
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
                if (y >= this.squareSize - 1 && currentSuite >= 2) {
                    matches.push(new Match(currentColor, currentSuite, isCombo));
                }
            }
        }
        currentColor = '';
        currentSuite = 0;
        for (let y: number = 0; y < this.squareSize; y++) {
            for (let x: number = 0; x < this.squareSize; x++) {
                let cell = this.get(x, y, false, this.cells);
                if (cell === null) {
                    continue;
                }
                if (x === 0) {
                    currentColor = cell.name;
                    currentSuite = 0;
                } else {
                    if (cell.name === currentColor) {
                        currentSuite++;
                    }
                    if (cell.name !== currentColor) {
                        if (currentSuite >= 2) {
                            matches.push(new Match(currentColor, currentSuite, isCombo));
                        }
                        currentColor = cell.name;
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
                if (x >= this.squareSize - 1 && currentSuite >= 2) {
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
            matches
        };
    }

    moveNewCells() {
        for (let x: number = 0; x < this.squareSize; x++) {
            for (let y: number = 0; y < this.squareSize; y++) {
                runInAction(() => {
                    let cell = this.get(x, y);
                    if (cell !== null && cell.top < 0) {
                            cell.top = ((this.squareSize - 1) - y) * 12.5;
                    }
                });
            }
        }
    }

    removeMatches(matches: SimpleCell[]): Cell[] {
        matches.forEach(simpleCell => {
            this.remove(simpleCell.x, simpleCell.y);
        });
        const result = this.fillGrid(matches);
        return result;
    }

    fillGrid(matches: SimpleCell[]): Cell[] {
        let newCells: Cell[] = [];
        for (let x: number = 0; x < this.squareSize; x++) {
            let newY: number = (this.squareSize - 1);
            const yMatches = matches.filter(m => m.x === x);
            yMatches.forEach(m => {
                let newCell = this.getNextColor(x, newY, false);
                newCell.top = ((((this.squareSize - 1) - newY) * 12.5) - 100);
                this.cells.push(newCell);
                newCells.push(newCell);
                newY--;
            })
        }
        return newCells;
    }

    remove(x: number, y: number) {
        let cell = this.get(x, y);
        if (cell !== null) {
            const indexToRemove = this.cells.indexOf(cell);
            this.cells.splice(indexToRemove, 1);
            for (let i: number = y; i < (this.squareSize - 1); i++) {
                let editedCell = this.get(x, i + 1);
                if (editedCell !== null) {
                    editedCell.y = i;
                    editedCell.top = ((this.squareSize - 1) - i) * 12.5;
                    editedCell.zIndex = (this.squareSize - 1) - i;
                }
            }
        }
    }

    invertCellsPosition(fx: number, fy: number, sx: number, sy: number) {
        let cellF = this.get(fx, fy);
        let cellS = this.get(sx, sy);
        if (cellF !== null) {
            cellF.setPosition(sx, sy, this.squareSize);
        }
        if (cellS !== null) {
            cellS.setPosition(fx, fy, this.squareSize);
        }
        return true;
    }
}