import React, { Fragment, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Select from "react-select";
import axios from "axios";

const useExchange = (stateInicial) => {
  // console.log(opciones);

  // State de nuestro custom hook
  const [state, actualizarState] = useState(stateInicial);
  const [opciones, setOpciones] = useState([]);
  const [pholder, setPholder] = useState("Cargando...");

  // Ejecutar llamado a la API
  useEffect(() => {
    const consultarAPI = async () => {
      const url = "https://api.coingecko.com/api/v3/exchanges";

      axios
        .get(url)
        .then((res) => {
          const lista = res.data.map((exchange) => ({
            value: exchange.id,
            label: exchange.name,
          }));

          setOpciones(lista);
          setPholder("Seleccione un Exchange...");
        })
        .catch((err) => console.log(err));
    };
    consultarAPI();
  }, []);

  const SelectExchange = () => (
    <div
      css={css`
        flex: 1;
      `}
    >
      <Select
        noOptionsMessage={() => "Cargando..."}
        options={opciones}
        onChange={(e) => actualizarState(e)}
        value={state}
        placeholder="Seleccione un Exchange..."
      />
    </div>
  );

  // Retornar state, interfaz y fn que modifica el state
  return [state, SelectExchange, actualizarState];
};

export default useExchange;
