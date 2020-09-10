import React, { useContext, useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
//import Titulo from "../ui/Titulo";
import Alarmas from "./Alarmas";

import { useRouter } from "next/router";

import { FirebaseContext } from "../../firebase";

const drawerWidth = 500;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  grow: {
    flexGrow: 1,
    height: "80px",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    marginTop: "80px",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Header({ darkMode, changeTheme }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const { usuario, firebase } = useContext(FirebaseContext);
  const [openAlarm, setOpeAlarm] = useState(false);
  const router = useRouter();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    handleMenuClose();
    firebase.cerrarSesion();
  };

  const handleChangeTheme = () => {
    handleMenuClose();
    changeTheme();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
      <MenuItem onClick={handleMenuClose}>Configuración</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={changeTheme}>
        <IconButton aria-label="changeTheme" color="inherit">
          <Brightness4Icon />
        </IconButton>
        <p>{darkMode ? "Claro" : "Oscuro"}</p>
      </MenuItem>
      <MenuItem onClick={() => setOpeAlarm(!openAlarm)}>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <NotificationsIcon />
        </IconButton>
        <p>Alarmas</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Perfil</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            CryptoPortfolio
          </Typography>
          <div className={classes.grow} />
          <Button
            className={classes.menuButton}
            size="small"
            color="inherit"
            onClick={() => router.push("/")}
          >
            Inicio
          </Button>
          {usuario && (
            <Button
              className={classes.menuButton}
              size="small"
              color="inherit"
              onClick={() => router.push("/billetera")}
            >
              Billetera
            </Button>
          )}
          <Button
            className={classes.menuButton}
            size="small"
            color="inherit"
            onClick={() => router.push("/nosotros")}
          >
            Nosotros
          </Button>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Tooltip title="Cambiar tema claro/oscuro" arrow>
              <IconButton
                aria-label="changeTheme"
                color="inherit"
                onClick={handleChangeTheme}
              >
                <Brightness4Icon />
              </IconButton>
            </Tooltip>
            {usuario ? (
              <>
                <Tooltip title="Alarmas" arrow>
                  <IconButton
                    aria-label="show 17 new notifications"
                    color="inherit"
                    onClick={() => setOpeAlarm(!openAlarm)}
                  >
                    <NotificationsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cuenta" arrow>
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Button
                  className={classes.menuButton}
                  size="small"
                  color="inherit"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>

                <Button
                  size="small"
                  color="inherit"
                  onClick={() => router.push("/crear-cuenta")}
                >
                  Crear Cuenta
                </Button>
              </>
            )}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={openAlarm}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => setOpeAlarm(!openAlarm)}>
            <ChevronRightIcon />
          </IconButton>
          <h2>Alarmas</h2>
        </div>
        <Divider />
        <div className={classes.drawerContainer}>
          <br />
          <Alarmas />
        </div>
      </Drawer>
    </div>
  );
}
