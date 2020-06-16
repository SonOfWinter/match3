import React, {useContext} from 'react';
import {makeStyles} from "@material-ui/core";
import RootStore from "../store/RootStore";
import { motion } from "framer-motion";

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
    const rootStore = useContext(RootStore);
    const {select, selectedCell, info} = rootStore.gridStore
    const otherClass = canBeSelected ? classes.cellCanBeSelected : selected ? classes.cellSelected : '';
    const iconComponent = React.createElement(icon, {style: {color, width: '50%', height: '50%', margin: '25%'}});
    const canBeClick:boolean = info.canMove && (selectedCell === null || selected || canBeSelected);

    return (
        <motion.div
            animate={{ scale: (selected ? 1.1 : 1) , opacity: (selected ? 0.8 : 1)}}
            whileHover={{ scale: (canBeClick ? 1.1 : 1), opacity: (canBeClick ? 0.8 : 1) }}
            whileTap={{ scale: 0.8 }}
            className={`${classes.cell} ${otherClass}`}
            style={{'backgroundColor': backgroundColor, top: top + 'px', left: left + 'px', zIndex: zIndex}}
            onClick={() => {
                if (canBeClick) {
                    select(x, y);
                }
            }}
        >
            {iconComponent}
        </motion.div>
    );
}
