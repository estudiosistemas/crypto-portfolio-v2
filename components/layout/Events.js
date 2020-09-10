import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { Paper, makeStyles } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import qs from "qs";
import ListadoEventos from "./ListadoEventos";

const coinmarketcalConfig = {
  API_KEY: "78NGOoMkrM4JNyBkiGE203ufkUE2Nz2T7J1ccm6v",
  HOST_URL: "'https://developers.coinmarketcal.com/v1/events",
};

const useStyles = makeStyles((theme) => ({
  root: {
    //flexGrow: 1,
    //maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
    padding: "0 2rem",
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Events = ({ coin }) => {
  const classes = useStyles();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorloading, setErrorLoading] = useState(false);

  useEffect(() => {
    const data = qs.stringify({
      translate: "es",
      max: 10,
      coins: coin,
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
        console.log(response.data.body);
        setEventos(response.data.body);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        setErrorLoading(true);
      });
  }, []);

  return (
    <div className={classes.demo}>
      <List dense={true}>
        {errorloading && (
          <ListItemText secondary={"Error al leer eventos..."} />
        )}
        {loading ? (
          <ListItemText secondary={"Cargando eventos..."} />
        ) : !loading && eventos ? (
          eventos.length > 0 &&
          eventos.map((evento, index) => (
            <ListadoEventos key={index} evento={evento} />
          ))
        ) : (
          <ListItemText
            secondary={"No se hallaron eventos para los próximos 7 días."}
          />
        )}
      </List>
    </div>
  );
};

export default Events;
