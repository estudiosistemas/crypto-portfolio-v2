import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SingleCard from "./SingleCard";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    minWidth: 275,
    justify: "center",
  },
});

const TopCards = ({ monedas }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {monedas.map((moneda) => (
          <SingleCard key={moneda.id} moneda={moneda} />
        ))}
      </Grid>
    </div>
  );
};

export default TopCards;
