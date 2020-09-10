export default function validarCrearMoneda(valores) {
  let errores = {};

  if (!valores.sigla) {
    errores.sigla = "La sigla es obligatorio";
  }

  if (!valores.nombre) {
    errores.nombre = "El Nombre es obligatorio";
  }

  if (!valores.exchange) {
    errores.exchange = "El Exchage/Wallet es obligatorio";
  }

  if (valores.valorcompra < 0) {
    errores.valorcompra = "El valor de compra no puede un número negativo";
  }

  return errores;
}
