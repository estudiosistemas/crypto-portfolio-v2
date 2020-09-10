import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import { makeStyles, Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import { FirebaseContext } from "../firebase";

//hook cripto
import useCriptomonedaMU from "../hooks/useCriptomonedaMU";
import useParCriptomoneda from "../hooks/useParCriptomoneda";

// validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearAlarma from "../validacion/validarCrearAlarma";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    padding: theme.spacing(3),
    maxWidth: 600,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    align: "auto",
  },
}));

const STATE_INICIAL = {
  nombre: "",
  sigla: "",
  monedapar: "",
  //compara: [comparaOptions[0].value],
  precioalarma: 0,
  preciostop: 0,
};

const nuevaAlarma = () => {
  const [error, setError] = useState(false);
  const classes = useStyles();

  // utilizar useCriptomoneda
  const [criptomoneda, SelectCripto] = useCriptomonedaMU(null);
  const [par, SelectPar] = useParCriptomoneda(null);

  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
    setValores,
  } = useValidacion(STATE_INICIAL, validarCrearAlarma, crearAlarma);

  const {
    id_API,
    nombre,
    sigla,
    monedapar,
    //compara,
    precioalarma,
    preciostop,
  } = valores;

  const router = useRouter();

  //context con operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function crearAlarma() {
    // Controlo que haya usuario logueado
    if (!usuario) {
      return router.push("/login");
    }

    // creo el obj alarma
    const alarma = {
      usuario: usuario.uid,
      id_API,
      sigla,
      nombre,
      par: monedapar,
      precioalarma,
      preciostop,
      //compara,
      creado: Date.now(),
    };

    // inserto en DB
    firebase.db.collection("alarmas").add(alarma);
    router.push("/billetera");
  }

  useEffect(() => {
    if (criptomoneda) {
      const miValor = {
        id_API: criptomoneda.value,
        sigla: criptomoneda.symbol,
        nombre: criptomoneda.name,
        //compara,
        precioalarma,
        preciostop,
      };
      setValores(miValor);
    }
  }, [criptomoneda]);

  useEffect(() => {
    if (par) {
      const miValor = {
        id_API,
        sigla,
        nombre,
        monedapar: par.value,
        precioalarma,
        preciostop,
      };
      setValores(miValor);
    }
  }, [par]);

  return (
    <Paper className={classes.paper}>
      <h2>Crear Alarma</h2>
      <form noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SelectCripto />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Sigla"
              error={errores.sigla && true}
              id="sigla"
              name="sigla"
              value={sigla}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errores.sigla}
              variant="outlined"
              size="small"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              label="Nombre"
              error={errores.nombre && true}
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errores.nombre}
              variant="outlined"
              size="small"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <SelectPar />
            <input
              type="text"
              id="monedapar"
              name="monedapar"
              value={monedapar}
              onChange={handleChange}
              onBlur={handleBlur}
              hidden
            />
          </Grid>
          <Grid item xs={12}>
            {errores.monedapar && (
              <Alert variant="filled" severity="error">
                {errores.monedapar}
              </Alert>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Precio Limit"
              error={errores.precioalarma && true}
              id="precioalarma"
              name="precioalarma"
              value={precioalarma}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                errores.precioalarma
                  ? errores.precioalarma
                  : "Precio límite superior"
              }
              variant="outlined"
              size="small"
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Precio Stop"
              error={errores.preciostop && true}
              id="preciostop"
              name="preciostop"
              value={preciostop}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                errores.preciostop
                  ? errores.preciostop
                  : "Precio límite inferior"
              }
              variant="outlined"
              size="small"
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            {error && (
              <Alert variant="filled" severity="error">
                {error}
              </Alert>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              style={{ width: "100%" }}
            >
              Guardar
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={() => router.push("/billetera")}
              variant="contained"
              color="secondary"
              style={{ width: "100%" }}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default nuevaAlarma;
