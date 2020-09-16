import React, { useState, useEffect, useContext } from "react";
import NumberFormat from "react-number-format";
import Link from "../../src/Link";
import { FirebaseContext } from "../../firebase";
import { useRouter } from "next/router";
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
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles, Paper, Button } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Switch from "@material-ui/core/Switch";

const ListadoAlarmas = ({
  alarma,
  startalarm,
  toggleStart,
  setStartAlarm,
  setAlarmas,
}) => {
  const {
    id,
    sigla,
    nombre,
    par,
    precioaUSD,
    preciopar,
    //compara,
    precioalarma,
    preciostop,
  } = alarma;

  const [activada, setActivada] = useState(false);
  const [activadaLimit, setActivadaLimit] = useState(false);
  const [activadaStop, setActivadaStop] = useState(false);
  const [checked, setChecked] = useState(true);

  const { usuario, firebase } = useContext(FirebaseContext);

  const router = useRouter();

  const borrarAlarma = async () => {
    if (!usuario) {
      return router.push("/login");
    }
    try {
      await firebase.db.collection("alarmas").doc(id).delete();
    } catch (error) {
      console.log(error);
    }
  };

  const checkAlarma = () => {
    if (checked) {
      if (precioalarma > 0 && preciopar >= precioalarma) {
        setStartAlarm(true);
        setActivada(true);
        setActivadaLimit(true);
        setActivadaStop(false);
      } else if (preciostop > 0 && preciopar <= preciostop) {
        setStartAlarm(true);
        setActivada(true);
        setActivadaStop(true);
        setActivadaLimit(false);
      } else {
        setStartAlarm(false);
      }
    }
  };

  useEffect(() => {
    checkAlarma();
  }, [preciopar]);

  const veoPar = `${sigla}/${par.toUpperCase()}`;

  const handleToggle = () => () => {
    if (checked) {
      setChecked(false);
      setStartAlarm(false);
      setActivadaStop(false);
      setActivadaLimit(false);
    } else {
      setChecked(true);
      checkAlarma();
    }
  };

  const handleModificar = () => {
    router.push("/editar-alarma[id]", `/editar-alarma/${id}`);
  };

  return (
    <>
      <ListItem role={undefined} dense button onClick={handleToggle()}>
        <ListItemIcon>
          <Switch
            edge="start"
            size="small"
            //onChange={toogleActivada}
            checked={checked}
            inputProps={{ "aria-labelledby": "switch-list-label-bluetooth" }}
          />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              color={activada ? "error" : "inherit"}
              variant="subtitle2"
            >
              {veoPar}
            </Typography>
          }
          secondary={<Typography variant="caption">{preciopar}</Typography>}
        />
        <ListItemText
          primary={
            <Typography
              color={activadaLimit ? "error" : "inherit"}
              variant="subtitle2"
            >
              Limit
            </Typography>
          }
          secondary={
            <Typography
              color={activadaLimit ? "error" : "inherit"}
              variant="caption"
            >
              {precioalarma}
            </Typography>
          }
        />
        <ListItemText
          primary={
            <Typography
              color={activadaStop ? "error" : "inherit"}
              variant="subtitle2"
            >
              Stop
            </Typography>
          }
          secondary={
            <Typography
              color={activadaStop ? "error" : "inherit"}
              variant="caption"
            >
              {preciostop}
            </Typography>
          }
        />

        <ListItemSecondaryAction>
          <IconButton
            component={Link}
            naked
            href="/editar-alarma[id]"
            as={`/editar-alarma/${id}`}
            size="small"
            edge="end"
            aria-label="edit"
            //onClick={handleModificar}
          >
            <EditIcon style={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            size="small"
            edge="end"
            aria-label="delete"
            onClick={borrarAlarma}
          >
            <DeleteIcon style={{ fontSize: 20 }} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      <Divider />
    </>
  );
};

export default ListadoAlarmas;
