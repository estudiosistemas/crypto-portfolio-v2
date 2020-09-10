export default function validarCrearMoneda(valores) {
  let errores = {};

  if (!valores.sigla) {
    errores.sigla = "La sigla es obligatorio";
  }

  if (!valores.nombre) {
    errores.nombre = "El Nombre es obligatorio";
  }

  if (!valores.monedapar) {
    errores.monedapar = "Seleccione el par";
  }

  if (valores.precioalarma < 0) {
    errores.precioalarma = "El Precio Limit no puede ser un número negativo";
  }

  if (valores.preciostop < 0) {
    errores.preciostop = "El Stop Loss no puede ser un número negativo";
  }

  if (valores.precioalarma > 0 && valores.preciostop > valores.precioalarma) {
    errores.preciostop = "El Stop Loss no puede ser mayor que el Limit";
  }

  if (valores.preciostop == 0 && valores.precioalarma == 0) {
    errores.precioalarma = "Limit y Stop no pueden ser 0";
  }

  return errores;
}
