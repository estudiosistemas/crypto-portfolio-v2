import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SubjectIcon from "@material-ui/icons/Subject";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { makeStyles } from "@material-ui/core/styles";
import ConfirmationDialogRaw from "./ConfirmationDialogRaw";
import { useSnackbar } from "notistack";
import Fade from "@material-ui/core/Fade";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  iconButton: {},
  iconContainer: {
    marginRight: "24px",
  },
  inverseIcon: {
    transform: "rotate(90deg)",
  },
}));

const CustomActionsSelect = (props) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      props.borrarMoneda(props.dataIndex);
      enqueueSnackbar("Moneda borrada!", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Acción Cancelada!", {
        variant: "warning",
      });
    }
  };

  const handleClickBtn = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleBorrarMoneda = () => {
    handleCloseMenu();
    setOpen(true);
  };

  const handleEditarMoneda = () => {
    handleCloseMenu();
    props.editarMoneda(props.dataIndex);
  };

  const handleOrdenesMoneda = () => {
    props.ordenesMoneda(props.dataIndex);
  };

  const handleComprarMoneda = () => {
    props.comprarMoneda(props.dataIndex);
  };

  const handleVenderMoneda = () => {
    props.venderMoneda(props.dataIndex);
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

      <Button
        color="secondary"
        size="small"
        variant="outlined"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClickBtn}
      >
        Acciones
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEditarMoneda}>
          Modificar {props.sigla}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleOrdenesMoneda}>Libro de Ordenes</MenuItem>
        <MenuItem onClick={handleComprarMoneda}>Registrar Compra</MenuItem>
        <MenuItem onClick={handleVenderMoneda}>Registrar Venta</MenuItem>
        <Divider />
        <MenuItem onClick={handleBorrarMoneda}>Borrar {props.sigla}</MenuItem>
      </Menu>
    </>
  );
};

export default CustomActionsSelect;
