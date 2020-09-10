import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: "auto",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
  },

  border: {
    width: "100px",
    height: "3px",
    background: "#60b4df",
  },

  socialmedia: {
    margin: "20px",
  },

  socialIcons: {
    color:
      theme.palette.type === "light"
        ? theme.palette.grey[800]
        : theme.palette.grey[200],
    marginRight: "25px",
    fontSize: "22px",
    textDecoration: "none",
    transition: "0.3s linear",

    "&:hover": {
      color: "#60b4df",
    },
  },
}));

export default function StickyFooter() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} style={{ padding: "2rem 4rem" }}>
          <div className={classes.socialmedia}>
            <a
              className={classes.socialIcons}
              href="mailto:estudiosistemas@gmail.com"
              target="_blank"
            >
              <i className="fas fa-at" />
            </a>
            <a
              className={classes.socialIcons}
              href="https://www.facebook.com/mcosta.estudiosistemas/"
              target="_blank"
            >
              <i className="fab fa-facebook-f" />
            </a>
            <a
              className={classes.socialIcons}
              href="https://twitter.com/mc_costa"
              target="_blank"
            >
              <i className="fab fa-twitter" />
            </a>
            <a
              className={classes.socialIcons}
              href="https://www.instagram.com/estudiosistemas/"
              target="_blank"
            >
              <i className="fab fa-instagram" />
            </a>
            <a
              className={classes.socialIcons}
              href="https://www.youtube.com/user/estudiosistemas"
              target="_blank"
            >
              <i className="fab fa-youtube" />
            </a>
            <a
              className={classes.socialIcons}
              href="https://www.linkedin.com/in/mauricio-costa-07044b38/"
              target="_blank"
            >
              <i className="fab fa-linkedin-in" />
            </a>
          </div>
          <p className="rights-text">
            © {new Date().getFullYear()} Mauricio Costa. All Rights Reserved.
          </p>
        </Grid>
        <Grid item xs={12} sm={6} style={{ paddingLeft: "4rem" }}>
          <h3>Contribuciones</h3>
          <div className={classes.border} />

          <p>
            <strong>ETH: </strong>0x1B21EF011CcEfB7e55C8bA9F8513B3f88CD22Fd6
          </p>
          <p>
            <strong>BAT: </strong>0x89dCE8bA0e031CD97DC9BFb36581D24519dE02C5
          </p>
        </Grid>
      </Grid>
    </footer>
  );
}
