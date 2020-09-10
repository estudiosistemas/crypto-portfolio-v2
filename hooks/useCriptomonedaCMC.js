import React, { Fragment, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

const useCriptomonedaCMC = (stateInicial) => {
  // State de nuestro custom hook
  const [state, actualizarState] = useState(stateInicial);
  //const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  //const loading = open && options.length === 0;

  // Ejecutar llamado a la API
  useEffect(() => {
    const consultarAPI = async () => {
      const config = {
        method: "get",
        url:
          "https://cors-anywhere.herokuapp.com/https://developers.coinmarketcal.com/v1/coins",
        headers: {
          "x-api-key": "78NGOoMkrM4JNyBkiGE203ufkUE2Nz2T7J1ccm6v",
          Accept: "application/json",
        },
      };

      axios(config)
        .then(function (res) {
          console.log(res.data);
          const lista = res.data.body.map((moneda) => ({
            value: moneda.id,
            symbol: moneda.symbol,
            name: moneda.name,
            label: moneda.fullname,
          }));
          setOptions(lista);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    consultarAPI();
  }, []);

  const SelectCripto = () => (
    <Autocomplete
      id="combo-box-demo"
      options={options}
      getOptionLabel={(option) => option.label}
      value={state}
      size="small"
      onChange={(event, newValue) => {
        actualizarState(newValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Criptomoneda" variant="outlined" />
      )}
    />
  );

  // Retornar state, interfaz y fn que modifica el state
  return [state, SelectCripto, actualizarState];
};

export default useCriptomonedaCMC;
