import React, { useEffect, useContext, useState } from "react";

import NumberFormat from "react-number-format";
import { FirebaseContext } from "../../firebase";
import { useRouter } from "next/router";
import Moment from "react-moment";
import { Paper } from "@material-ui/core";
import CustomFooter from "../../components/CustomFooter";
import MUIDataTable from "mui-datatables";
import useStyles from "../../src/styles";
import TableNumberFormat from "../../components/TableNumberFormat";
import textLabelsSpanish from "../../components/tableLabelsLocation";

export default function LibroOrdenes() {
  const [mensaje, setMensaje] = useState("Cargando...");
  const [libroOrdenes, setLibroOrdenes] = useState([]);
  const [moneda, setMoneda] = useState({});
  const [par, setPar] = useState({});
  const [ordenSelect, setOrdenSelect] = useState({});
  const [filaSelected, setFilaSelected] = useState([]);

  const { usuario, firebase } = useContext(FirebaseContext);

  const router = useRouter();
  const classes = useStyles();
  const {
    query: { id },
  } = router;

  useEffect(() => {
    if (id) {
      const obtenerOrdenes = () => {
        firebase.db
          .collection("ordenes")
          .orderBy("fecha", "desc")
          .where("moneda_id", "==", id)
          .onSnapshot(manejarSnapshot);
      };

      obtenerOrdenes();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const obtenerMoneda = async () => {
        const monedaQuery = await firebase.db.collection("billetera").doc(id);
        const moneda = await monedaQuery.get();
        if (moneda.exists) {
          setMoneda(moneda.data());
        } else {
          setErrorBuscar(true);
        }
      };

      obtenerMoneda();
    }
  }, [id]);

  function manejarSnapshot(snapshot) {
    const result = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setLibroOrdenes(result);
    if (result.length == 0) setMensaje("No hay órdenes Cargadas.");
  }

  const obtenerPar = async (idPar) => {
    const parQuery = await firebase.db.collection("billetera").doc(idPar);
    const par = await parQuery.get();
    if (par.exists) {
      setPar(par.data());
    } else {
      setErrorBuscar(true);
    }
  };

  const borrarOrden = async (indice) => {
    if (!usuario) {
      return router.push("/login");
    }
    try {
      const miOrden = libroOrdenes[indice];
      setOrdenSelect(miOrden);
      await obtenerPar(miOrden.par_id);
      await firebase.db.collection("ordenes").doc(miOrden.id).delete();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (Object.keys(par).length > 0 && Object.keys(ordenSelect).length > 0) {
      if (ordenSelect.orden == "Compra") {
        recuperoCompra(ordenSelect);
      } else {
        recuperoVenta(ordenSelect);
      }
      setPar({});
      setOrdenSelect({});
    }
  }, [par]);

  const recuperoCompra = async () => {
    // resto cantidad y valorUSD en moneda vendida
    let calculoCantidad =
      parseFloat(moneda.cantidad) - parseFloat(ordenSelect.cantidad);
    let calculoValorcompra = 0;
    if (calculoCantidad > 0) {
      calculoValorcompra =
        parseFloat(moneda.valorcompra) - parseFloat(ordenSelect.totalUSD);
    }

    const monedaUpdated = {
      cantidad: calculoCantidad.toFixed(8),
      valorcompra: calculoValorcompra.toFixed(8),
    };
    //console.log(moneda, id, monedaUpdated);
    await firebase.db.collection("billetera").doc(id).update(monedaUpdated);

    // sumo cantidad y valorUSD en moneda par
    const parUpdated = {
      cantidad: (
        parseFloat(par.cantidad) + parseFloat(ordenSelect.total)
      ).toFixed(8),
      valorcompra: (
        parseFloat(par.valorcompra) + parseFloat(ordenSelect.totalUSD)
      ).toFixed(8),
    };

    await firebase.db
      .collection("billetera")
      .doc(ordenSelect.par_id)
      .update(parUpdated);
    //console.log(par, ordenSelect.par_id, parUpdated);
  };

  const recuperoVenta = async (ordenSelect) => {
    // sumo cantidad y valorUSD en moneda vendida
    let calculoCantidad =
      parseFloat(moneda.cantidad) + parseFloat(ordenSelect.cantidad);
    let calculoValorcompra = 0;
    if (calculoCantidad > 0) {
      calculoValorcompra =
        parseFloat(moneda.valorcompra) + parseFloat(ordenSelect.totalUSD);
    }

    const monedaUpdated = {
      cantidad: calculoCantidad.toFixed(8),
      valorcompra: calculoValorcompra.toFixed(8),
    };
    console.log(moneda, id, monedaUpdated);
    await firebase.db.collection("billetera").doc(id).update(monedaUpdated);

    // resto cantidad y valorUSD en moneda par
    const parUpdated = {
      cantidad: (
        parseFloat(par.cantidad) - parseFloat(ordenSelect.total)
      ).toFixed(8),
      valorcompra: (
        parseFloat(par.valorcompra) - parseFloat(ordenSelect.totalUSD)
      ).toFixed(8),
    };

    await firebase.db
      .collection("billetera")
      .doc(ordenSelect.par_id)
      .update(parUpdated);
    console.log(par, ordenSelect.par_id, parUpdated);
  };

  const columns = [
    {
      label: "Fecha",
      name: "fecha",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          let val = libroOrdenes[dataIndex].fecha;
          return <Moment format="DD-MM-YYYY HH:MM">{val}</Moment>;
        },
      },
    },
    {
      label: "Par",
      name: "moneda_sigla",
      options: {
        customBodyRenderLite: (dataIndex) => {
          let val = `${libroOrdenes[dataIndex].moneda_sigla}/${libroOrdenes[dataIndex].par_sigla}`;
          return <div>{val}</div>;
        },
      },
    },
    {
      label: "Orden",
      name: "orden",
    },
    {
      label: "Cantidad",
      name: "cantidad",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          let val = libroOrdenes[dataIndex].cantidad;
          return <TableNumberFormat valor={val} decimales={8} />;
        },
      },
    },
    {
      label: "Precio",
      name: "precio",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          let val = libroOrdenes[dataIndex].precio;
          return <TableNumberFormat valor={val} decimales={8} />;
        },
      },
    },
    {
      label: "Total Orden",
      name: "total",
      options: {
        filter: false,
        print: false,
        customBodyRenderLite: (dataIndex) => {
          let val = libroOrdenes[dataIndex].total;
          return <TableNumberFormat valor={val} decimales={8} />;
        },
      },
    },
    {
      label: "Total Orden USD",
      name: "totalUSD",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          let val = libroOrdenes[dataIndex].totalUSD;
          return <TableNumberFormat valor={val} decimales={4} />;
        },
      },
    },
  ];

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "vertical",
    selectableRowsHeader: false,
    selectableRows: "single",
    rowsPerPage: 25,
    download: true,
    print: true,
    viewColumns: true,
    setTableProps: () => {
      return {
        padding: "default",
        size: "medium",
      };
    },
    rowsSelected: filaSelected,
    onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
      setFilaSelected(rowsSelected);
    },
    onRowsDelete: (rowsDeleted, newData) => {
      setFilaSelected([]);
      borrarOrden(rowsDeleted.data[0].dataIndex);
    },
    textLabels: textLabelsSpanish,
    customFooter: (
      count,
      page,
      rowsPerPage,
      changeRowsPerPage,
      changePage,
      textLabels
    ) => {
      return (
        <CustomFooter
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          changeRowsPerPage={changeRowsPerPage}
          changePage={changePage}
          textLabels={textLabels}
        />
      );
    },
  };

  return (
    <Paper className={classes.root}>
      <h2>
        Libro de Ordenes{" "}
        {libroOrdenes.length > 0 && libroOrdenes[0].moneda_sigla}
      </h2>

      <MUIDataTable data={libroOrdenes} columns={columns} options={options} />
      {/* <table>
        <thead>
          <th>Fecha</th>
          <th>Par</th>
          <th>Orden</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Total Orden</th>
          <th>Total Orden USD</th>
          <th>Acciones</th>
        </thead>
        <tbody>
          {libroOrdenes.length > 0 ? (
            libroOrdenes.map((orden, index) => (
              <tr key={index}>
                <td>
                  <Moment format="DD-MM-YYYY HH:MM">{orden.fecha}</Moment>
                </td>
                <td>
                  {orden.moneda_sigla}/{orden.par_sigla}
                </td>
                <td>
                  {orden.orden == "Compra" ? (
                    <div verde>{orden.orden}</div>
                  ) : (
                    <div>{orden.orden}</div>
                  )}
                </td>
                <td>
                  <NumberFormat
                    value={orden.cantidad}
                    displayType={"text"}
                    thousandSeparator={true}
                    decimalScale={8}
                    fixedDecimalScale={true}
                    renderText={(value) => <div>{value}</div>}
                  />
                </td>
                <td>
                  <NumberFormat
                    value={orden.precio}
                    displayType={"text"}
                    thousandSeparator={true}
                    decimalScale={8}
                    fixedDecimalScale={true}
                    renderText={(value) => <div>{value}</div>}
                  />
                </td>
                <td>
                  <NumberFormat
                    value={orden.total}
                    displayType={"text"}
                    thousandSeparator={true}
                    decimalScale={8}
                    fixedDecimalScale={true}
                    renderText={(value) => <div>{value}</div>}
                  />
                </td>
                <td>
                  {" "}
                  <NumberFormat
                    value={orden.totalUSD}
                    displayType={"text"}
                    thousandSeparator={true}
                    decimalScale={4}
                    fixedDecimalScale={true}
                    renderText={(value) => <div>{value}</div>}
                  />
                </td>
                <td>
                  <button onClick={() => borrarOrden(orden)}>Borrar</button>
                </td>
              </tr>
              //<ListadoOrdenes key={index} moneda={moneda} />
            ))
          ) : (
            <tr>
              <td colSpan="8">{mensaje}</td>
            </tr>
          )}
        </tbody>
      </table> */}
    </Paper>
  );
}
