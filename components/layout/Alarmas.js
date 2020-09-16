import React, { useState, useEffect, useContext } from "react";
import ListadoAlarmas from "./ListadoAlarmas";
import { FirebaseContext } from "../../firebase";
import { useRouter } from "next/router";
import useInterval from "../../hooks/useInterval";
import axios from "axios";
import useSound from "use-sound";

import {
  FormGroup,
  Button,
  FormControlLabel,
  Switch,
  Tooltip,
} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles, Paper } from "@material-ui/core";
// import Divider from "@material-ui/core/Divider";
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";

// import NuevaAlarma from "../NuevaAlarma";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 355,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Alarmas = () => {
  const classes = useStyles();
  const [alarmasAPI, setAlarmasAPI] = useState([]);
  const [alarmas, setAlarmas] = useState([]);
  const [mensajeAlarma, setMensajeAlarma] = useState("Cargando...");
  const [valores, setValores] = useState({});
  const [siglas, setSiglas] = useState("");
  const [par_siglas, setPar_Siglas] = useState("");

  const { usuario, firebase } = useContext(FirebaseContext);
  const router = useRouter();

  const [play, { stop }] = useSound("/static/mp3/SoundHelix-Song-1.mp3");
  const [playing, setPlaying] = useState(true);
  const [startalarm, setStartAlarm] = useState(false);

  const [agregarAlarma, setAgregarAlarma] = useState(false);

  const toggle = () => setPlaying(!playing);
  const toggleStart = () => setStartAlarm(!startalarm);
  const toggleAgregar = () => setAgregarAlarma(!agregarAlarma);

  useEffect(() => {
    playing && startalarm ? play() : stop();
  }, [playing, startalarm]);

  useEffect(() => {
    if (usuario) {
      const { uid } = usuario;
      const obtenerAlarmas = () => {
        firebase.db
          .collection("alarmas")
          .orderBy("creado", "asc")
          .where("usuario", "==", uid)
          .onSnapshot(manejarSnapshotAlarmas);
      };

      obtenerAlarmas();
    }
  }, [usuario]);

  function manejarSnapshotAlarmas(snapshot) {
    let miSiglas = "bitcoin,ethereum,binancecoin,";
    //let miParSiglas = "";
    const result = snapshot.docs.map((doc) => {
      miSiglas = miSiglas + doc.data().id_API + ",";
      //miParSiglas = miParSiglas + doc.data().par + ",";
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    miSiglas = miSiglas.slice(0, -1);
    //miParSiglas = miParSiglas.slice(0, -1);
    setSiglas(miSiglas);
    //setPar_Siglas(miParSiglas);
    setAlarmasAPI(result);
    if (result.length == 0) setMensajeAlarma("No hay Alarmas configuradas.");
  }

  useEffect(() => {
    if (siglas) buscoValor();
  }, [siglas]);

  useInterval(() => {
    if (siglas) buscoValor();
  }, 2000);

  useEffect(() => {
    if (Object.keys(valores).length != 0) {
      setAlarmas(concatenarAlarmas());
    }
  }, [valores]);

  const concatenarAlarmas = () => {
    //obtener cotizacion de los pares en usd
    let cotBTC = 0;
    let cotETH = 0;
    let cotBNB = 0;
    valores.map((elem) => {
      switch (elem.symbol) {
        case "btc":
          cotBTC = elem.current_price;
          break;
        case "eth":
          cotETH = elem.current_price;
          break;
        case "bnb":
          cotBNB = elem.current_price;
          break;
        default:
          break;
      }
    });
    const concatenaAl = alarmasAPI.map((al) => {
      let cotUSDT = 0;
      let cotPar = 0;
      const alarma_actual = valores.filter((el) => el.id == al.id_API);
      if (alarma_actual.length > 0) {
        cotUSDT = alarma_actual[0].current_price;
        switch (al.par) {
          case "btc":
            cotPar = (cotUSDT / cotBTC).toFixed(2);
            break;
          case "eth":
            cotPar = (cotUSDT / cotETH).toFixed(2);
            break;
          case "bnb":
            cotPar = (cotUSDT / cotBNB).toFixed(2);
            break;
          default:
            cotPar = cotUSDT.toFixed(2);
            break;
        }
      }
      const elAlarma = {
        id: al.id,
        id_API: al.id_API,
        sigla: al.sigla,
        nombre: al.nombre,
        par: al.par,
        //compara: al.compara,
        precioalarma: parseFloat(al.precioalarma).toFixed(2),
        preciostop: parseFloat(al.preciostop).toFixed(2),
        precioaUSD: cotUSDT,
        preciopar: cotPar,
      };
      return elAlarma;
    });
    return concatenaAl;
  };

  const buscoValor = () => {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${siglas}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

    axios
      .get(url)
      .then((res) => {
        setValores(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {/* <Dialog
        className={classes.backdrop}
        open={agregarAlarma}
        onClick={toggleAgregar}
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <NuevaAlarma />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAgregarAlarma(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => setAgregarAlarma(false)} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog> */}

      <FormGroup aria-label="position" row>
        <Tooltip title="Agregar Alarma" arrow>
          <IconButton
            edge="end"
            aria-label="add"
            onClick={() => router.push("/nueva-alarma")}
            //
            //toggleAgregar()}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        <FormControlLabel
          value="start"
          labelPlacement="start"
          label="Todas las alarmas activas"
          control={<Switch size="small" checked={playing} onChange={toggle} />}
        />
      </FormGroup>
      <div className={classes.demo}>
        <List dense={true}>
          {alarmas.length > 0 ? (
            alarmas.map((alarm, index) => (
              <ListadoAlarmas
                key={index}
                alarma={alarm}
                startalarm={startalarm}
                toggleStart={toggleStart}
                setStartAlarm={setStartAlarm}
                setAlarmas={setAlarmas}
              />
            ))
          ) : (
            <ListItemText primary={mensajeAlarma} />
          )}
        </List>
      </div>
    </div>
  );
};

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

export default Alarmas;
