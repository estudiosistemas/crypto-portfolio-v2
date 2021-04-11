import React, { Fragment, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

const useCriptomonedaBSC = (stateInicial) => {
  // State de nuestro custom hook
  const [state, actualizarState] = useState(stateInicial);
  //const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  //const loading = open && options.length === 0;

  // Ejecutar llamado a la API
  useEffect(() => {
    const consultarAPI = async () => {
      const url = "https://api.1inch.exchange/v3.0/56/tokens";

      axios
        .get(url)
        .then((res) => {
          const lista = Object.values(res.data.tokens).map((moneda) => ({
            value: moneda.address,
            symbol: moneda.symbol.toUpperCase(),
            name: moneda.name,
            decimals: moneda.decimals,
            label: `(${moneda.symbol.toUpperCase()}) ${moneda.name}`,
          }));
          setOptions(lista);
        })
        .catch((err) => console.log(err));
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

export default useCriptomonedaBSC;
