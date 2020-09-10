import React from "react";
import Link from "@material-ui/core/Link";
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
import { makeStyles, Paper, Button, Chip } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Switch from "@material-ui/core/Switch";
import Moment from "react-moment";

const ListadoEventos = ({ evento }) => {
  const { date_event, title, proof, source } = evento;

  const router = useRouter();

  return (
    <>
      <ListItem role={undefined} dense>
        <ListItemText
          primary={
            <Chip
              size="small"
              label={
                <Typography color="inherit" variant="caption">
                  <Moment format="DD-MM-YYYY">{date_event}</Moment>
                </Typography>
              }
              color="secondary"
            />
          }
        />
        <ListItemText
          primary={
            <Typography color="inherit" variant="caption">
              {title.en}
            </Typography>
          }
          secondary={
            <Typography color="inherit" variant="caption"></Typography>
          }
        />
        <ListItemSecondaryAction>
          <Link
            href={proof}
            target="_blank"
            rel="noopener noreferrer"
            color="secondary"
            style={{ marginRight: "1rem" }}
          >
            <Typography color="inherit" variant="caption">
              Prueba
            </Typography>
          </Link>

          <Link
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            color="secondary"
          >
            <Typography color="inherit" variant="caption">
              Fuente
            </Typography>
          </Link>
        </ListItemSecondaryAction>
      </ListItem>

      <Divider />
    </>
  );
};

export default ListadoEventos;
