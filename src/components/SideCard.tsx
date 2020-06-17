import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from "@material-ui/core";
import RootStore from "../store/RootStore";
import {observer} from "mobx-react";

const useStyles = makeStyles({
    card: {
        height: '548px',
        overflow: 'hidden'
    }
});

export function SideCard() {
    const rootStore = useContext(RootStore);

    const {info} = rootStore.statStore;

    const classes = useStyles();
    return (
        <Grid item xs={12} lg={3}>
            <Card className={classes.card} elevation={4}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Puzzle
                    </Typography>
                    <Typography variant={"body1"}>
                        Possible move : ? {/*info.possibleMove*/}
                    </Typography>
                    <Typography variant={"body1"}>
                        Blue count : {info.blueCount}
                    </Typography>
                    <Typography variant={"body1"}>
                        Red count : {info.redCount}
                    </Typography>
                    <Typography variant={"body1"}>
                        Green count : {info.greenCount}
                    </Typography>
                    <Typography variant={"body1"}>
                        Purple count : {info.purpleCount}
                    </Typography>
                    <Typography variant={"body1"}>
                        Amber count : {info.amberCount}
                    </Typography>
                    <Typography variant={"body1"}>
                        Grey count : {info.greyCount}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        Mathes
                    </Typography>
                    <Typography variant={"body1"}>
                        Nb match-3 : {info.match3}
                    </Typography>
                    <Typography variant={"body1"}>
                        Nb match-4 : {info.match4}
                    </Typography>
                    <Typography variant={"body1"}>
                        Nb match-5 : {info.match5}
                    </Typography>
                    <Typography variant={"body1"}>
                        Blue : {info.blue}
                    </Typography>
                    <Typography variant={"body1"}>
                        Red : {info.red}
                    </Typography>
                    <Typography variant={"body1"}>
                        Green : {info.green}
                    </Typography>
                    <Typography variant={"body1"}>
                        Purple : {info.purple}
                    </Typography>
                    <Typography variant={"body1"}>
                        Amber : {info.amber}
                    </Typography>
                    <Typography variant={"body1"}>
                        Grey : {info.grey}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default observer(SideCard);