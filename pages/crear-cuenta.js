import React, { useState } from "react";
import Router from "next/router";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import firebase from "../firebase";

// validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearCuenta from "../validacion/validarCrearCuenta";

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "4rem",
    marginBottom: "4rem",
    padding: "1rem",
    minHeight: 400,
    maxWidth: 600,
    alignItems: "center",
    align: "auto",
    display: "flex",
    flexDirection: "column",
  },
}));

const STATE_INICIAL = {
  nombre: "",
  email: "",
  password: "",
};

export default function CrearCuenta() {
  const [error, setError] = useState(false);

  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const { nombre, email, password } = valores;
  const classes = useStyles();

  async function crearCuenta() {
    try {
      await firebase.registrar(nombre, email, password);
      Router.push("/billetera");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <Paper className={classes.root}>
      <h2>Crear Cuenta</h2>
      <form noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              error={errores.nombre && true}
              label="Nombre de usuario"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errores.nombre}
              size="small"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={errores.email && true}
              label="Email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errores.email}
              size="small"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={errores.password && true}
              type="password"
              label="Password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errores.password}
              autoComplete="current-password"
              variant="outlined"
              size="small"
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

          <Grid item xs={12}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              style={{ width: "100%" }}
            >
              Iniciar Sesion
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
