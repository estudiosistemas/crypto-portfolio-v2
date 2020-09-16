import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { FirebaseContext } from "../../firebase";
import axios from "axios";
import { formatDate, getNowDateTimeStr } from "../../functions/funciones";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import { makeStyles, Paper } from "@material-ui/core";

import Error404 from "../../components/layout/404";

// validaciones
import useValidacion from "../../hooks/useValidacion";
import validarComprarMoneda from "../../validacion/validarComprarMoneda";

//hooks
import useParBilletera from "../../hooks/useParBilletera";

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
  moneda_sigla: "",
  moneda_cantidad: 0,
  moneda_valorcompra: 0,
  fecha: getNowDateTimeStr(), //formatDate(Date.now()),
  monedapar: "",
  disponible: 0,
  cantidad: 0,
  precio: 0,
  total: 0,
  totalUSD: 0,
  monedapar_cotizaUSD: 0,
};

const ComprarMoneda = () => {
  const [moneda, setMoneda] = useState({});
  const [errorBuscar, setErrorBuscar] = useState(false);
  const [error, setError] = useState(false);

  const [par, SelectPar] = useParBilletera({});

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
  } = useValidacion(STATE_INICIAL, validarComprarMoneda, comprarMoneda);

  const {
    id_API,
    nombre,
    moneda_sigla,
    moneda_cantidad,
    moneda_valorcompra,
    monedapar,
    disponible,
    fecha,
    cantidad,
    precio,
    total,
    totalUSD,
    monedapar_cotizaUSD,
  } = valores;

  //context con operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);
  const classes = useStyles();

  async function comprarMoneda() {
    // Controlo que haya usuario logueado
    if (!usuario) {
      return router.push("/login");
    }

    try {
      // creo el obj moneda
      const compra = {
        orden: "Compra",
        usuario: usuario.uid,
        moneda_id: id,
        moneda_sigla,
        par_id: par.value,
        par_sigla: par.label,
        fecha,
        cantidad,
        precio,
        total,
        totalUSD,
        vendido: 0,
        id_venta: [],
      };

      // inserto en DB
      firebase.db.collection("ordenes").add(compra);

      // sumo cantidad y valorUSD en moneda comprada
      const monedaUpdated = {
        cantidad: (
          parseFloat(moneda_cantidad) + parseFloat(valores.cantidad)
        ).toFixed(8),
        valorcompra: (
          parseFloat(moneda_valorcompra) + parseFloat(valores.totalUSD)
        ).toFixed(8),
      };

      firebase.db.collection("billetera").doc(id).update(monedaUpdated);

      // resto cantidad y valorUSD en moneda par
      const parUpdated = {
        cantidad: (
          parseFloat(par.cantidad) - parseFloat(valores.total)
        ).toFixed(8),
        valorcompra: (
          parseFloat(par.valorcompra) - parseFloat(valores.totalUSD)
        ).toFixed(8),
      };

      firebase.db.collection("billetera").doc(compra.par_id).update(parUpdated);

      // vuelvo a la billetera
      router.push("/billetera");
    } catch (error) {
      console.log("Error al grabar datos de compra");
    }
  }

  useEffect(() => {
    if (id) {
      const obtenerMoneda = async () => {
        const monedaQuery = await firebase.db.collection("billetera").doc(id);
        const moneda = await monedaQuery.get();
        if (moneda.exists) {
          setMoneda(moneda.data());
          setValores({
            ...valores,
            id_API: moneda.data().id_API,
            nombre: moneda.data().nombre,
            moneda_sigla: moneda.data().sigla,
            moneda_cantidad: moneda.data().cantidad,
            moneda_valorcompra: moneda.data().valorcompra,
          });
        } else {
          setErrorBuscar(true);
        }
      };
      obtenerMoneda();
    }
  }, [id]);

  useEffect(() => {
    const buscoValor = () => {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${par.id_API}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

      axios
        .get(url)
        .then((res) => {
          if (res.data[0]) {
            setValores({
              ...valores,
              monedapar_cotizaUSD: res.data[0].current_price,
              monedapar: par.value,
              disponible: parseFloat(par.cantidad),
            });
          }
        })
        .catch((err) => console.log(err));
    };
    if (par) {
      buscoValor();
    }
  }, [par]);

  return (
    <>
      {errorBuscar && <Error404 />}
      <Paper className={classes.paper}>
        <h2>Comprar {moneda_sigla}</h2>
        <form noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Sigla"
                id="moneda_sigla"
                name="moneda_sigla"
                value={moneda_sigla}
                variant="outlined"
                size="small"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Nombre"
                id="nombre"
                name="nombre"
                value={nombre}
                variant="outlined"
                size="small"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SelectPar />
              <input
                type="text"
                id="monedapar"
                placeholder="Par Sigla criptomoneda"
                name="monedapar"
                value={monedapar}
                onChange={handleChange}
                onBlur={handleBlur}
                hidden
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Disponible"
                id="disponible"
                name="disponible"
                value={disponible}
                variant="outlined"
                size="small"
                fullWidth
                disabled
              />
            </Grid>
            <input
              type="number"
              id="monedapar_cotizaUSD"
              name="monedapar_cotizaUSD"
              value={monedapar_cotizaUSD}
              hidden
            />
            <Grid item xs={12}>
              {errores.monedapar && (
                <Alert variant="filled" severity="error">
                  {errores.monedapar}
                </Alert>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Fecha"
                type="datetime-local"
                error={errores.fecha && true}
                id="fecha"
                name="fecha"
                defaultValue={fecha}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errores.fecha}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Precio"
                error={errores.precio && true}
                id="precio"
                name="precio"
                value={precio}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errores.precio}
                variant="outlined"
                size="small"
                fullWidth
                type="number"
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
                label="Total"
                error={errores.total && true}
                id="total"
                name="total"
                value={total}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errores.total}
                variant="outlined"
                size="small"
                type="number"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Total USD"
                error={errores.totalUSD && true}
                id="totalUSD"
                name="totalUSD"
                value={totalUSD}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errores.totalUSD}
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
    </>
  );
};

export default ComprarMoneda;
