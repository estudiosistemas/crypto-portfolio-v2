import { makeStyles } from "@material-ui/core/styles";

export const useStylesCard = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginTop: "2rem",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 70,
    height: 70,
  },
  positivo: {
    textAlign: "right",
    color: "green",
  },
  negativo: {
    textAlign: "right",
    color: "red",
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "2rem",
    marginBottom: "2rem",
    padding: "0.5rem",
    minHeight: 355,
  },
  numero: {
    textAlign: "right",
  },
  positivo: {
    textAlign: "right",
    color: theme.palette.type === "light" ? "#66bb6a" : "#00e676",
  },
  negativo: {
    textAlign: "right",
    color: "#ff5252",
  },
  footerCell: {
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
    fontSize: "0.9rem",
    paddingTop: "0.8rem",
    paddingBottom: "0.8rem",
    color: theme.palette.type === "light" ? theme.palette.grey[900] : "#fafafa",
  },
  stickyFooterCell: {
    position: "sticky",
    bottom: 0,
    zIndex: 100,
  },
  logo: {
    width: "25px",
    height: "25px",
    marginRight: "1rem",
  },
}));

export default useStyles;
