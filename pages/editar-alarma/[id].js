import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { makeStyles, Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

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

import { FirebaseContext } from "../../firebase";

//hook cripto
import useParCriptomoneda from "../../hooks/useParCriptomoneda";

// validaciones
import useValidacion from "../../hooks/useValidacion";
import validarCrearAlarma from "../../validacion/validarCrearAlarma";

const STATE_INICIAL = {
  nombre: "",
  sigla: "",
  monedapar: "",
  precioalarma: 0,
  preciostop: 0,
};

const editarAlarma = () => {
  const [error, setError] = useState(false);
  const [alarma, setAlarma] = useState({});
  const [errorBuscar, setErrorBuscar] = useState(false);

  // utilizar useCriptomoneda
  const [par, SelectPar, setPar] = useParCriptomoneda(null);

  const classes = useStyles();
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
    setValores,
  } = useValidacion(STATE_INICIAL, validarCrearAlarma, modifyAlarma);

  const {
    id_API,
    nombre,
    sigla,
    monedapar,
    precioalarma,
    preciostop,
  } = valores;

  //context con operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function modifyAlarma() {
    // Controlo que haya usuario logueado
    if (!usuario) {
      return router.push("/login");
    }

    // creo el obj alarma
    const alarmaUpdated = {
      id_API,
      sigla,
      nombre,
      par: monedapar,
      precioalarma,
      preciostop,
    };

    // inserto en DB
    firebase.db.collection("alarmas").doc(id).update(alarmaUpdated);
    router.push("/billetera");
  }

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

  //localizo la alarma
  useEffect(() => {
    if (id) {
      const obtenerAlarma = async () => {
        const alarmaQuery = await firebase.db.collection("alarmas").doc(id);
        const alarma = await alarmaQuery.get();
        if (alarma.exists) {
          setAlarma(alarma.data());
          setPar({
            value: alarma.data().par,
            label: alarma.data().par.toUpperCase(),
          });
          setValores({
            id_API: alarma.data().id_API,
            nombre: alarma.data().nombre,
            sigla: alarma.data().sigla,
            monedapar: alarma.data().par,
            precioalarma: alarma.data().precioalarma,
            preciostop: alarma.data().preciostop,
          });
        } else {
          setErrorBuscar(true);
        }
      };
      obtenerAlarma();
    }
  }, [id]);

  return (
    <Paper className={classes.paper}>
      <h2>Modificar Alarma</h2>
      <form noValidate autoComplete="off">
        <Grid container spacing={3}>
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

export default editarAlarma;
