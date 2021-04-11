import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { FirebaseContext } from "../firebase";

//hook cripto
import useCriptomonedaBSC from "../hooks/useCriptomonedaMUbsc";

// validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearMoneda from "../validacion/validarCrearMoneda";
import { makeStyles, Paper } from "@material-ui/core";

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
  id_API: "",
  nombre: "",
  sigla: "",
  cantidad: 0,
  valorcompra: 0,
  cotiza: 0,
  exchange: "",
  decimals: 0,
};

const NuevaMonedaBSC = () => {
  const [error, setError] = useState(false);

  // utilizar useCriptomoneda
  const [criptomoneda, SelectCripto] = useCriptomonedaBSC(null);

  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
    setValores,
  } = useValidacion(STATE_INICIAL, validarCrearMoneda, crearMoneda);

  const {
    id_API,
    nombre,
    sigla,
    cantidad,
    valorcompra,
    cotiza,
    exchange,
    decimals,
  } = valores;

  const router = useRouter();

  //context con operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function crearMoneda() {
    // Controlo que haya usuario logueado
    if (!usuario) {
      return router.push("/login");
    }

    // creo el obj moneda
    const moneda = {
      usuario: usuario.uid,
      id_API,
      sigla,
      nombre,
      cantidad,
      valorcompra,
      cotizacion: cotiza,
      exchange,
      creado: Date.now(),
      ordenes: [],
      decimals,
    };

    // inserto en DB
    firebase.db.collection("billetera").add(moneda);
    router.push("/billetera");
  }

  useEffect(() => {
    let miValor = {
      id_API: "",
      sigla: "",
      nombre: "",
      cantidad,
      valorcompra,
      cotiza,
      exchange,
      decimals: 0,
    };
    if (criptomoneda) {
      miValor = {
        id_API: criptomoneda.value,
        sigla: criptomoneda.symbol,
        nombre: criptomoneda.name,
        cantidad,
        valorcompra,
        cotiza,
        exchange,
        decimals: criptomoneda.decimals,
      };
    }
    setValores(miValor);
  }, [criptomoneda]);

  const consultoDataToken = async (contract) => {
    const busd = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
    const url = `https://api.1inch.exchange/v3.0/56/quote?fromTokenAddress=${contract}&toTokenAddress=${busd}&amount=10000000000`;

    axios
      .get(url)
      .then((res) => {
        const { name, symbol, decimals } = res.data.fromToken;
        setValores({
          ...valores,
          id_API: contract,
          sigla: symbol,
          nombre: name,
          decimals,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeContract = (e) => {
    if (e.target.value.length == 42) {
      consultoDataToken(e.target.value);
    }
    setValores({
      ...valores,
      id_API: e.target.value,
    });
  };

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <h2>Cargar Moneda BSC</h2>
      <form noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SelectCripto />
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              label="Contrato"
              error={errores.id_API && true}
              id="id_API"
              name="id_API"
              value={id_API}
              onChange={handleChangeContract}
              onBlur={handleBlur}
              helperText={errores.id_API}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Dec"
              error={errores.decimals && true}
              id="decimals"
              name="decimals"
              value={decimals}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errores.decimals}
              variant="outlined"
              size="small"
              type="number"
              fullWidth
            />
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cantidad"
              error={errores.cantidad && true}
              id="cantidad"
              name="cantidad"
              value={cantidad}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errores.cantidad}
              variant="outlined"
              size="small"
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Valor Compra"
              error={errores.valorcompra && true}
              id="valorcompra"
              name="valorcompra"
              value={valorcompra}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                errores.valorcompra
                  ? errores.valorcompra
                  : "Importe total pagado en USDT"
              }
              variant="outlined"
              size="small"
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Cotización"
              error={errores.cotiza && true}
              id="cotiza"
              name="cotiza"
              value={cotiza}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                errores.cotiza
                  ? errores.cotiza
                  : "0 = cotización automática. 1 = stable coins (Ej. USDT)"
              }
              variant="outlined"
              size="small"
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Exchange/Wallet"
              error={errores.exchange && true}
              id="exchange"
              name="exchange"
              value={exchange}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                errores.exchange ? errores.exchange : "Exchange o Wallet"
              }
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

export default NuevaMonedaBSC;
