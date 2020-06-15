import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    card: {
        height: '100%'
    }
});

export default function SideCard() {

    const classes = useStyles();
    return (
        <Grid item xs={12} lg={3}>
            <Card className={classes.card} elevation={4}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Puzzle
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}
