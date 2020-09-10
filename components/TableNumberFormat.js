import React from "react";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import useStyles from "../src/styles";

export default function TableNumberFormat(props) {
  const { estilo, valor, decimales, prefijo, sufijo } = props;
  const classes = useStyles();
  return (
    <NumberFormat
      value={valor}
      displayType={"text"}
      thousandSeparator={true}
      decimalScale={decimales}
      fixedDecimalScale={true}
      prefix={prefijo}
      suffix={sufijo}
      renderText={(value) =>
        estilo ? (
          valor > 0 ? (
            <div className={classes.positivo}>{value}</div>
          ) : (
            <div className={classes.negativo}>{value}</div>
          )
        ) : (
          <div className={classes.numero}>{value}</div>
        )
      }
    />
  );
}
