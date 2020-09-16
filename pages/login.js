import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import Router from "next/router";

import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";

import firebase from "../firebase";

// validaciones
import useValidacion from "../hooks/useValidacion";
import validarIniciarSesion from "../validacion/validarIniciarSesion";

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
  email: "",
  password: "",
};

const Login = () => {
  const [error, setError] = useState(false);

  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email, password } = valores;
  const classes = useStyles();

  async function iniciarSesion() {
    try {
      await firebase.login(email, password);
      Router.push("/billetera");
    } catch (error) {
      console.error("Hubo un error al autenticar el usuario ", error.message);
      setError(error.message);
    }
  }

  return (
    <Paper className={classes.root}>
      <h2>Iniciar Sesión</h2>
      <form noValidate>
        <Grid container spacing={3}>
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
};

export default Login;
