import React, { Fragment, useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";

const useParCriptomoneda = (stateInicial) => {
  // State de nuestro custom hook
  const [state, actualizarState] = useState(stateInicial);
  const [opciones, setOpciones] = useState([
    { value: "usd", label: "USD" },
    { value: "btc", label: "BTC" },
    { value: "eth", label: "ETH" },
    { value: "bnb", label: "BNB" },
  ]);

  const SelectPar = () => (
    <Autocomplete
      id="combo-box-par"
      options={opciones}
      getOptionLabel={(option) => option.label}
      getOptionSelected={(option, value) => option.label === value.label}
      value={state}
      size="small"
      onChange={(event, newValue) => {
        actualizarState(newValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Par" variant="outlined" />
      )}
    />
  );

  // Retornar state, interfaz y fn que modifica el state
  return [state, SelectPar, actualizarState];
};

export default useParCriptomoneda;
