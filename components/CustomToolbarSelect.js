import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SubjectIcon from "@material-ui/icons/Subject";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { makeStyles } from "@material-ui/core/styles";
import ConfirmationDialogRaw from "./ConfirmationDialogRaw";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  iconButton: {},
  iconContainer: {
    marginRight: "24px",
  },
  inverseIcon: {
    transform: "rotate(90deg)",
  },
}));

const CustomToolbarSelect = (props) => {
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      props.borrarMoneda(props.selectedRows.data[0].dataIndex);
      enqueueSnackbar("Acción Correcta!", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Acción Cancelada!", {
        variant: "warning",
      });
    }
  };

  const handleBorrarMoneda = () => {
    setOpen(true);
  };

  const handleEditarMoneda = () => {
    props.editarMoneda(props.selectedRows.data[0].dataIndex);
  };

  const handleOrdenesMoneda = () => {
    props.ordenesMoneda(props.selectedRows.data[0].dataIndex);
  };

  const handleComprarMoneda = () => {
    props.comprarMoneda(props.selectedRows.data[0].dataIndex);
  };

  const handleVenderMoneda = () => {
    props.venderMoneda(props.selectedRows.data[0].dataIndex);
  };

  return (
    <>
      <ConfirmationDialogRaw
        classes={{
          paper: classes.paper,
        }}
        id="confirmo-borrar"
        keepMounted
        open={open}
        onClose={handleClose}
      />
      <div className={classes.iconContainer}>
        <Tooltip title={"Editar"}>
          <IconButton
            className={classes.iconButton}
            onClick={handleEditarMoneda}
          >
            <EditIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Libro de Ordenes"}>
          <IconButton
            className={classes.iconButton}
            onClick={handleOrdenesMoneda}
          >
            <SubjectIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Registrar Compra"}>
          <IconButton
            className={classes.iconButton}
            onClick={handleComprarMoneda}
          >
            <ShoppingCartIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Registrar Venta"}>
          <IconButton
            className={classes.iconButton}
            onClick={handleVenderMoneda}
          >
            <RemoveShoppingCartIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Eliminar"}>
          <IconButton
            className={classes.iconButton}
            onClick={handleBorrarMoneda}
          >
            <DeleteIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
};

export default CustomToolbarSelect;
