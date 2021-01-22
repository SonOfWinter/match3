import {useContext} from 'react';
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core";
import ReplayIcon from '@material-ui/icons/Replay';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import RootStore from "../store/RootStore";

const useStyles = makeStyles({
    card: {
        height: "auto",
        maxHeight: "548px",
        overflow: "hidden",
    },
    button: {
        margin: "0 10px"
    }
});

export default function ActionMenu() {

    const rootStore = useContext(RootStore);
    const classes = useStyles();
    const { reset } = rootStore.gridStore;

    return (
        <Grid item xs={12} sm={6} md={12}>
            <Card className={classes.card} elevation={4}>
                <CardContent>
                    <Typography variant={"h5"} component={"h2"}>
                        Actions
                    </Typography>
                    <div>
                        <Fab onClick={reset} color="primary" aria-label="new" className={classes.button}>
                            <ReplayIcon />
                        </Fab>
                        <Fab color="primary" aria-label="hint" className={classes.button} disabled={true}>
                            <EmojiObjectsIcon />
                        </Fab>
                    </div>
                </CardContent>
            </Card>
        </Grid>

    );
}
