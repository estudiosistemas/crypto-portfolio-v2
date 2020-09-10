import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SingleCard from "./SingleCard";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    minWidth: 275,
    justify: "center",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const TopCards = ({ monedas }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      {monedas.map((moneda) => (
        <SingleCard key={moneda.id} moneda={moneda} />
      ))}
    </Grid>
  );
};

export default TopCards;
