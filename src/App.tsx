import React from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Nav from "./components/Nav";
import GameGrid from "./components/GameGrid";
import SideCard from "./components/SideCard";
import LogSideCard from "./components/LogSideCard";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  main: {
    marginTop: "10px",
  },
});

function App() {
  const classes = useStyles();
  return (
    <div className="App">
      <CssBaseline />
      <header>
        <Nav />
      </header>
      <main className={classes.main}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <GameGrid />
            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <SideCard />
                <LogSideCard />
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

export default App;
