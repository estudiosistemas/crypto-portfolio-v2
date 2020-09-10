import React, { useContext, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { FirebaseContext } from "../firebase";

const useParBilletera = (stateInicial) => {
  // State de nuestro custom hook
  const [state, actualizarState] = useState(stateInicial);
  const [opciones, setOpciones] = useState([]);

  const { usuario, firebase } = useContext(FirebaseContext);

  useEffect(() => {
    if (usuario) {
      const { uid } = usuario;
      const obtenerBilletera = () => {
        firebase.db
          .collection("billetera")
          .orderBy("creado", "asc")
          .where("usuario", "==", uid)
          .onSnapshot(manejarSnapshot);
      };

      obtenerBilletera();
    }
  }, [usuario]);

  function manejarSnapshot(snapshot) {
    const result = snapshot.docs.map((doc) => {
      return {
        value: doc.id,
        label: doc.data().sigla,
        id_API: doc.data().id_API,
        valorcompra: doc.data().valorcompra,
        cantidad: doc.data().cantidad,
      };
    });
    setOpciones(result);
    // if (result.length == 0)
    // setMensaje(
    //   "No hay monedas en la Billetera. Por favor diríjase a Cargar Moneda"
    // );
  }

  const SelectPar = () => (
    <Autocomplete
      id="combo-box-demo"
      options={opciones}
      getOptionLabel={(option) => option.label}
      value={state}
      size="small"
      onChange={(event, newValue) => {
        actualizarState(newValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Par Criptomoneda" variant="outlined" />
      )}
    />
  );

  // Retornar state, interfaz y fn que modifica el state
  return [state, SelectPar, actualizarState];
};

export default useParBilletera;
