export default function validarVenderMoneda(valores) {
  let errores = {};

  if (!valores.moneda_sigla) {
    errores.moneda_sigla = "La sigla es obligatorio";
  }

  if (!valores.nombre) {
    errores.nombre = "El Nombre es obligatorio";
  }

  if (valores.cantidad > valores.disponible) {
    errores.cantidad = "La cantidad de venta no puede ser mayor al disponible";
  }

  if (valores.cantidad < 0 || valores.cantidad == 0) {
    errores.cantidad =
      "La cantidad de venta no puede ser 0 o un número negativo";
  }

  if (valores.total < 0 || valores.total == 0) {
    errores.total = "El Total de venta no puede ser 0 o un número negativo";
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
