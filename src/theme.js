import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import orange from "@material-ui/core/colors/orange";
import grey from "@material-ui/core/colors/grey";

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: grey[900],
    },
    secondary: {
      main: "#60b4df",
    },
    background: { paper: grey[900] },
  },

  overrides: {
    MUIDataTable: {
      paper: {
        boxShadow: "none",
      },
    },
    MuiTableCell: {
      head: {
        fontFamily: "Poppins, sans-serif",
        fontSize: "0.75rem",
      },
    },
    MUIDataTableBodyCell: {
      root: {
        fontFamily: "Poppins, sans-serif",
        fontSize: "0.75rem",
      },
    },
  },
});

export const lightTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#60b4df",
      contrastText: "#fff",
    },
    secondary: {
      main: orange[800],
    },
  },
  socialmedia: {
    margin: "20px 0",
  },

  socialIcons: {
    color: "#fff",
    marginRight: "25px",
    fontSize: "22px",
    textDecoration: "none",
    transition: "0.3s linear",

    "&:hover": {
      color: "#60b4df",
    },
  },
  overrides: {
    MUIDataTable: {
      paper: {
        boxShadow: "none",
      },
    },
    MuiTableCell: {
      head: {
        fontFamily: "Poppins, sans-serif",
        fontSize: "0.8rem",
      },
    },
    MUIDataTableBodyCell: {
      root: {
        fontFamily: "Poppins, sans-serif",
        fontSize: "0.8rem",
      },
    },
  },
});

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },

  socialmedia: {
    margin: "20px 0",
  },
});

export default theme;
