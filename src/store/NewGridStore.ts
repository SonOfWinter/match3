import {action, computed, observable, reaction} from "mobx"
import Cell from '../domain/Cell';
import {RootStore} from "./RootStore";
import Match from "../domain/Match";
import Grid, {MatchResult} from "../domain/Grid";

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

interface ForInitGrid {
    x: ColorStat[];
    y: ColorStat[];
}

export default class NewGridStore {
    private rootStore: RootStore;

    @observable matches: Match[] = [];
    @observable oldMatches: Match[] = [];
    @observable grid: Grid;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.init();
    }


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


    init() {
        this.grid = new Grid(squareSize);
        this.grid.grid.forEach(cell => {
                this.rootStore.statStore.addColorCount(cell.color, 1);
            }
        );
    }

    @computed
    get info() {
        return {
            grid: this.grid,
            selectedCell: this.grid.selectedCell,
            canMove: this.grid.canMove
        };
    }

    @computed
    get flatGrid(): Cell[] {
        return this.grid.grid.flat();
    }

    @action
    select = (x: number, y: number) => {
        console.log('store select');
        if (this.grid.select(x, y)) {
            const selectedCell = this.grid.selectedCell;
            if (selectedCell !== null) {
                setTimeout(() => {
                        this.grid.invertCellsPosition(selectedCell.x, selectedCell.y, x, y)
                    }, 50
                );
                setTimeout(() => {
                    this.invertCellData(selectedCell.x, selectedCell.y, x, y);
                }, 500)
            }
        }
    }

    @action.bound
    countMatch(match: Match) {
        this.matches.push(match);
    }

    @action.bound
    getMatch(isCombo: boolean = false): MatchResult {
        return this.grid.getGridMatch(this.grid.grid, isCombo);
    }


    @action.bound
    moveNewCells() {
        this.grid.moveNewCells();
    }

    @action.bound
    removeMatches(matches: SimpleCell[]) {
        this.grid.removeMatches(matches);
        matches.forEach(match => {
            const cell = this.grid.get(match.x, match.y);
            if (cell !== null) {
                this.rootStore.statStore.addColorCount(cell.name, -1);
            }
        })
        setTimeout(() => {
            this.grid.moveNewCells();
        }, 100);
        const newMatches: MatchResult = this.grid.getGridMatch(this.grid.grid, false);
        if (newMatches.cellsToRemove.length > 0) {
            setTimeout(() => {
                this.matches = this.matches.concat(newMatches.matches);
            }, 500)
            setTimeout(() => {
                this.removeMatches(newMatches.cellsToRemove);
            }, 600);
        } else {
            this.grid.canMove = true;
        }
    }

    @action.bound
    invertCellData(fx: number, fy: number, sx: number, sy: number, isRevert: boolean = false) {
        this.grid.invertCellData(fx, fy, sx, sy);
        if (!isRevert) {
            let matches: MatchResult = this.getMatch();
            if (matches.cellsToRemove.length === 0) {
                setTimeout(() => {
                    this.grid.invertCellsPosition(fx, fy, sx, sy);
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
                this.grid.canMove = true;
            }
        } else {
            this.grid.canMove = true;
        }
    }
}
