import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from "@material-ui/core";
import RootStore from "../store/RootStore";
import {observer} from "mobx-react";
import {GameGrid} from "./GameGrid";

const useStyles = makeStyles({
    card: {
        height: '548px',
        overflow: 'hidden'
    },
    logs: {
        overflowY: 'scroll',
        height: 'auto',
        maxHeight: '495px'
    }
});

export const LogSideCard = () => {
    const rootStore = useContext(RootStore);
    const {info} = rootStore.messageStore;
    const classes = useStyles();
    return (
        <Grid item xs={12} lg={3}>
            <Card className={classes.card} elevation={4}>
                <CardContent>
                    <Typography variant={"h5"} component={"h2"}>
                        Log
                    </Typography>
                    <div className={classes.logs}>
                    {info.messages.map((m) =>
                        <Typography variant={"body1"} key={m + Math.random()}>
                            {m}
                        </Typography>
                    )}
                    </div>
                </CardContent>
            </Card>
        </Grid>
    );
}
export default observer(LogSideCard);
