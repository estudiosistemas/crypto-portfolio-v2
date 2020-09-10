import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { Paper, Button } from "@material-ui/core";
import useStyles from "../src/styles";
import useCriptomonedaCMC from "../hooks/useCriptomonedaCMC";
import qs from "qs";

const coinmarketcalConfig = {
  API_KEY: "78NGOoMkrM4JNyBkiGE203ufkUE2Nz2T7J1ccm6v",
  HOST_URL: "'https://developers.coinmarketcal.com/v1/events",
};

const privateRequest = async (data, endPoint, type) => {
  const dataQueryString = qs.stringify(data);
  const requestConfig = {
    method: type,
    url: coinmarketcalConfig.HOST_URL + endPoint + "?" + dataQueryString,
    headers: {
      Accept: "*/*",
      Connection: "keep-alive",
      Accept: "application/json",
      "Accept-Encoding": "deflate, gzip",
      "x-api-key": coinmarketcalConfig.API_KEY,
    },
  };

  try {
    console.log("URL: ", requestConfig);
    const response = await axios(requestConfig);
    //console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const Events = () => {
  const classes = useStyles();
  const [criptomoneda, SelectCripto] = useCriptomonedaCMC(null);

  useEffect(() => {
    const data = qs.stringify({
      translate: "es",
      max: 10,
      coins: "akropolis",
    });
    const config = {
      method: "get",
      url:
        "https://cors-anywhere.herokuapp.com/https://developers.coinmarketcal.com/v1/events" +
        "?" +
        data,
      headers: {
        "x-api-key": "78NGOoMkrM4JNyBkiGE203ufkUE2Nz2T7J1ccm6v",
        Accept: "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Paper className={classes.root}>
        <h2>Calendario de Eventos</h2>
        <SelectCripto />
      </Paper>
    </>
  );
};

export default Events;
