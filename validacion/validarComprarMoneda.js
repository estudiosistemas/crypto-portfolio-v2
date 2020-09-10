export default function validarComprarMoneda(valores) {
  let errores = {};

  if (!valores.moneda_sigla) {
    errores.moneda_sigla = "La sigla es obligatorio";
  }

  if (!valores.nombre) {
    errores.nombre = "El Nombre es obligatorio";
  }

  if (valores.cantidad < 0 || valores.cantidad == 0) {
    errores.cantidad =
      "La cantidad de compra no puede ser 0 o un número negativo";
  }

  if (valores.total > valores.disponible) {
    errores.total = "El total de compra no puede ser mayor al disponible";
  } else {
    if (valores.totalUSD == 0) {
      valores.totalUSD = valores.total * valores.monedapar_cotizaUSD;
    }
  }

  if (valores.precio < 0 || valores.precio == 0) {
    errores.precio = "El precio de compra no puede ser 0 o un número negativo";
  }

  return errores;
}
