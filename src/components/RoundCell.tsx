import React, {useContext} from 'react';
import {makeStyles} from "@material-ui/core";
import GridStore from "../store/GridStore";

const size = '62px';
const margin = '2px';
const transition = 'top 0.3s ease, left 0.3s ease';

const useStyles = makeStyles({
    cell: {
        position: "absolute",
        cursor: 'pointer',
        borderRadius: '32px',
        margin: margin,
        height: size,
        width: size,
        '-webkit-transition': transition,
        '-moz-transition': transition,
        '-ms-transition': transition,
        '-o-transition': transition,
        transition,
        color: 'black'
    },
    cellSelected: {
        color: 'white'
    },
    cellCanBeSelected: {
        color: 'grey'
    }
});

type RoundCellProps = {
    backgroundColor: string,
    color: string,
    selected: boolean,
    canBeSelected: boolean,
    x: number,
    y: number,
    top: number,
    left: number,
    zIndex: number,
    icon: string
}

export default function RoundCell(props: RoundCellProps) {
    const {backgroundColor, color, selected, x, y, top, left, zIndex, canBeSelected, icon } = props;
    const classes = useStyles();
    const gridStore = useContext(GridStore);
    const {select, selectedCell, info} = gridStore
    const otherClass = canBeSelected ? classes.cellCanBeSelected : selected ? classes.cellSelected : '';
    const iconComponent = React.createElement(icon, {style: {color: color, width: '50%', height: '50%', margin: '25%'}});
    return (
        <div
            className={`${classes.cell} ${otherClass}`}
            style={{'backgroundColor': backgroundColor, top: top + 'px', left: left + 'px', zIndex: zIndex}}
            onClick={() => {
                if (info.canMove && (selectedCell === null || selected || canBeSelected)) {
                    select(x, y);
                }
            }}
        >
            {iconComponent}
        </div>
    );
}
