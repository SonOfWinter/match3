import React, { Component } from "react";
import { motion } from "framer-motion";
import withStyles from "@material-ui/core/styles/withStyles";

const size = "12.5%";
const margin = "2px";
const transition = "top 0.3s ease, left 0.3s ease";

const styles = {
  cell: {
    position: "absolute",
    cursor: "pointer",
    borderRadius: "65px",
    margin: margin,
    height: `calc(${size} - 4px)`,
    width: `calc(${size} - 4px)`,
    "-webkit-transition": transition,
    "-moz-transition": transition,
    "-ms-transition": transition,
    "-o-transition": transition,
    transition,
    color: "black",
  },
};

type RoundCellProps = {
  backgroundColor: string;
  color: string;
  selected: boolean;
  x: number;
  y: number;
  top: number;
  left: number;
  zIndex: number;
  icon: any;
  select: (x: number, y: number) => void;
  classes: object;
};

export class RoundCell extends Component<RoundCellProps> {
  shouldComponentUpdate(nextProps: RoundCellProps, nextState: RoundCellProps) {
    return (
      nextProps.top !== this.props.top ||
      nextProps.left !== this.props.left ||
      nextProps.x !== this.props.x ||
      nextProps.y !== this.props.y ||
      nextProps.selected !== this.props.selected
    );
  }

  render() {
    const {
      classes,
      backgroundColor,
      color,
      selected,
      x,
      y,
      top,
      left,
      zIndex,
      icon,
      select,
    } = this.props;
    const iconComponent = React.createElement(icon, {
      style: {
        color,
        width: "50%",
        height: "50%",
        margin: "25%",
      },
    });
    return (
      <motion.div
        whileHover={{ scale: 1.1, opacity: 0.8 }}
        whileTap={{ scale: 0.8 }}
        animate={{ scale: selected ? 1.1 : 1, opacity: selected ? 0.8 : 1 }}
        // @ts-ignore
        className={classes.cell}
        style={{
          backgroundColor: backgroundColor,
          top: top + "%",
          left: left + "%",
          zIndex: zIndex,
        }}
        onClick={() => {
          select(x, y);
        }}
      >
        {iconComponent}
      </motion.div>
    );
  }
}

// @ts-ignore
export default withStyles(styles)(RoundCell);
