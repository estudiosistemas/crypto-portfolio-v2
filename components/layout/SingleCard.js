import React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import NumberFormat from "react-number-format";
import { useStylesCard } from "../../src/styles";

const SingleCard = ({ moneda }) => {
  const classes = useStylesCard();

  const {
    id,
    logo,
    sigla,
    nombre,
    valor,
    valoralto24hs,
    valorbajo24hs,
    cambio24hs,
    cambioporc24hs,
  } = moneda;

  return (
    <Grid item xs>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {`${sigla}/USD`}
          </Typography>

          <NumberFormat
            value={valor}
            displayType={"text"}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true}
            renderText={(value) => (
              <Typography variant="h5" component="h2">
                $ {value}
              </Typography>
            )}
          />

          <NumberFormat
            value={cambioporc24hs}
            displayType={"text"}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true}
            suffix={" %"}
            renderText={(value) =>
              cambioporc24hs > 0 || cambioporc24hs == 0 ? (
                <div className={classes.positivo}>
                  <Typography variant="body2" component="p">
                    {`${value} % (${cambio24hs})`}
                  </Typography>
                </div>
              ) : (
                <div className={classes.negativo}>
                  <Typography variant="body2" component="p">
                    {`${value} % (${cambio24hs})`}
                  </Typography>
                </div>
              )
            }
          />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default SingleCard;
