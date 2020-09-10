import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { Paper, Button, Tooltip } from "@material-ui/core";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import useInterval from "../hooks/useInterval";
import { FirebaseContext } from "../firebase";
import { useRouter } from "next/router";
import CustomToolbarSelect from "../components/CustomToolbarSelect";
import CustomFooter from "../components/CustomFooter";
import MUIDataTable from "mui-datatables";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import useStyles from "../src/styles";
import TableNumberFormat from "../components/TableNumberFormat";
import textLabelsSpanish from "../components/tableLabelsLocation";
import Events from "../components/layout/Events";
import Fade from "@material-ui/core/Fade";

export default function Billetera() {
  const [mensaje, setMensaje] = useState("Cargando...");
  const [mostrarConCantidad, setMostrarConCantidad] = useState(true);
  const [filaSelected, setFilaSelected] = useState([]);
  const [filaExpanded, setFilaExpanded] = useState([]);
  const [billetera, setBilletera] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [valores, setValores] = useState({});
  const [siglas, setSiglas] = useState("");
  const [totales, setTotales] = useState({
    compra: 0,
    actual: 0,
    posicion: 0,
  });

  const { usuario, firebase } = useContext(FirebaseContext);
  const router = useRouter();

  useEffect(() => {
    if (usuario) {
      const { uid } = usuario;
      const obtenerBilletera = () => {
        firebase.db
          .collection("billetera")
          .orderBy("creado", "asc")
          .where("usuario", "==", uid)
          .onSnapshot(manejarSnapshot);
      };

      obtenerBilletera();
    }
  }, [usuario]);

  function manejarSnapshot(snapshot) {
    let sumacompra = 0;
    let miSiglas = "";
    const result = snapshot.docs.map((doc) => {
      sumacompra = sumacompra + parseFloat(doc.data().valorcompra);
      miSiglas = miSiglas + doc.data().id_API + ",";
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    miSiglas = miSiglas.slice(0, -1);
    setTotales({ ...totales, compra: sumacompra });
    setSiglas(miSiglas);
    setMonedas(result);
    if (result.length == 0)
      setMensaje("No hay monedas Cargadas. Por favor diríjase a Cargar Moneda");
  }

  useEffect(() => {
    if (siglas) buscoValor();
  }, [siglas]);

  useInterval(() => {
    if (siglas) buscoValor();
  }, 2000);

  useEffect(() => {
    const actualizoTotales = () => {
      const sumoactual = billetera.reduce(function (acc, el) {
        return acc + el.totalUSDT;
      }, 0);

      //Actualizo totales
      setTotales({
        ...totales,
        actual: sumoactual,
        posicion: (sumoactual / totales.compra - 1) * 100,
      });
    };
    if (billetera) actualizoTotales();
  }, [billetera]);

  useEffect(() => {
    if (Object.keys(valores).length != 0) {
      setBilletera(concatenarBilletera());
    }
  }, [valores, mostrarConCantidad]);

  const concatenarBilletera = () => {
    const concatena = monedas.map((moneda) => {
      if (
        !mostrarConCantidad ||
        (mostrarConCantidad && parseFloat(moneda.cantidad) > 0)
      ) {
        let cotUSDT = moneda.cotizacion;
        let cotBTC = 0;
        const moneda_actual = valores.filter((el) => el.id == moneda.id_API);
        if (moneda_actual.length > 0 && moneda.cotizacion == 0) {
          cotUSDT = moneda_actual[0].current_price;
          //cotBTC = valores[moneda.sigla].BTC;
        }
        const totalUSDT = moneda.cantidad * cotUSDT;
        const totalBTC = moneda.cantidad * cotBTC;
        let posicionUSDT = 0;
        if (totalUSDT > 0 && moneda.valorcompra > 0) {
          posicionUSDT = (totalUSDT / moneda.valorcompra - 1) * 100;
        }
        const elBilletera = {
          id: moneda.id,
          id_API: moneda.id_API,
          sigla: moneda.sigla,
          nombre: moneda.nombre,
          cantidad: moneda.cantidad,
          valorcompra: moneda.valorcompra,
          cotizacion: moneda.cotizacion,
          cotizacionUSDT: cotUSDT,
          cotizacionBTC: cotBTC,
          totalUSDT,
          totalBTC,
          posicionUSDT,
          posicionBTC: 0,
          exchange: moneda.exchange,
        };
        return elBilletera;
      }
    });
    return concatena.filter(function (dato) {
      return dato != undefined;
    });
  };

  const buscoValor = () => {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${siglas}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

    axios
      .get(url)
      .then((res) => {
        setValores(res.data);
      })
      .catch((err) => console.log(err));
  };

  const toggleMostrarConCantidad = () => {
    setMostrarConCantidad(!mostrarConCantidad);
  };

  const borrarMoneda = async (index) => {
    const id = billetera[index].id;
    if (!usuario) {
      return router.push("/login");
    }
    try {
      await firebase.db.collection("billetera").doc(id).delete();
    } catch (error) {
      console.log(error);
    }
  };

  const editarMoneda = (index) => {
    const id = billetera[index].id;
    router.push("/editar-monedas[id]", `/editar-monedas/${id}`);
  };

  const ordenesMoneda = (index) => {
    const id = billetera[index].id;
    router.push("/libro-ordenes[id]", `/libro-ordenes/${id}`);
  };

  const comprarMoneda = (index) => {
    const id = billetera[index].id;
    router.push("/comprar-moneda[id]", `/comprar-moneda/${id}`);
  };

  const venderMoneda = (index) => {
    const id = billetera[index].id;
    router.push("/vender-moneda[id]", `/vender-moneda/${id}`);
  };

  const classes = useStyles();

  const columns = [
    {
      name: "id_API",
      options: {
        display: "false",
      },
    },
    {
      label: "Sigla",
      name: "sigla",
      options: {
        filter: true,
      },
    },
    {
      label: "Nombre",
      name: "nombre",
      options: {
        filter: true,
      },
    },
    {
      label: "Cantidad",
      name: "cantidad",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          let val = billetera[dataIndex].cantidad;
          return <TableNumberFormat valor={val} decimales={8} estilo={false} />;
        },
      },
    },
    {
      label: "Cotización USDT",
      name: "cotizacionUSDT",
      options: {
        filter: false,
        print: false,
        customBodyRenderLite: (dataIndex) => {
          let val = billetera[dataIndex].cotizacionUSDT;
          return <TableNumberFormat valor={val} decimales={8} estilo={false} />;
        },
      },
    },
    {
      label: "Valor Compra USDT",
      name: "valorcompra",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          let val = billetera[dataIndex].valorcompra;
          return <TableNumberFormat valor={val} decimales={2} estilo={false} />;
        },
      },
    },
    {
      label: "Valor Actual USDT",
      name: "totalUSDT",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          let val = billetera[dataIndex].totalUSDT;
          return <TableNumberFormat valor={val} decimales={2} estilo={false} />;
        },
      },
    },
    {
      label: "Posición",
      name: "posicionUSDT",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          let val = billetera[dataIndex].posicionUSDT;
          return (
            <TableNumberFormat
              valor={val}
              decimales={2}
              estilo={true}
              sufijo={" %"}
            />
          );
        },
      },
    },
    {
      label: "Exchange/Wallet",
      name: "exchange",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "vertical",
    selectableRowsHeader: false,
    selectableRows: "single",
    //selectableRowsOnClick: true,
    rowsSelected: filaSelected,
    rowsPerPage: 25,
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <CustomToolbarSelect
        selectedRows={selectedRows}
        displayData={displayData}
        setSelectedRows={setSelectedRows}
        borrarMoneda={borrarMoneda}
        editarMoneda={editarMoneda}
        ordenesMoneda={ordenesMoneda}
        comprarMoneda={comprarMoneda}
        venderMoneda={venderMoneda}
      />
    ),
    onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
      setFilaSelected(rowsSelected);
    },
    expandableRows: true,
    expandableRowsHeader: false,
    expandableRowsOnClick: true,
    rowsExpanded: filaExpanded,
    isRowExpandable: (dataIndex, expandedRows) => {
      //if (dataIndex === 3 || dataIndex === 4) return false;

      // Prevent expand/collapse of any row if there are 4 rows expanded already (but allow those already expanded to be collapsed)
      if (
        expandedRows.data.length > 4 &&
        expandedRows.data.filter((d) => d.dataIndex === dataIndex).length === 0
      )
        return false;
      return true;
    },
    renderExpandableRow: (rowData, rowMeta) => {
      const colSpan = rowData.length + 1;
      return (
        <TableRow>
          <TableCell colSpan={colSpan}>
            {/* Custom expandable row option. Data: {JSON.stringify(rowData)} */}
            <Events coin={rowData[0]} />
          </TableCell>
        </TableRow>
      );
    },
    onRowExpansionChange: (curExpanded, allExpanded, rowsExpanded) => {
      const filas = allExpanded.map((fila) => fila.dataIndex);
      setFilaExpanded(filas);
    },
    setTableProps: () => {
      return {
        padding: "default",
        size: "small",
      };
    },
    textLabels: textLabelsSpanish,
    customToolbar: () => {
      return (
        <Button
          variant="outlined"
          size="small"
          color="inherit"
          onClick={() => router.push("/nueva-moneda")}
        >
          Agregar Moneda
        </Button>
      );
    },
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
    customTableBodyFooterRender: function (opts) {
      return (
        <TableFooter className={classes.footerCell}>
          <TableRow>
            {opts.selectableRows !== "none" ? (
              <TableCell className={classes.footerCell} />
            ) : null}
            {opts.columns.map((col, index) => {
              if (col.display === "true") {
                if (col.name === "cantidad") {
                  return (
                    <TableCell key={index} className={classes.footerCell}>
                      Totales
                    </TableCell>
                  );
                } else if (col.name === "valorcompra") {
                  return (
                    <TableCell key={index} className={classes.footerCell}>
                      <TableNumberFormat valor={totales.compra} decimales={8} />
                    </TableCell>
                  );
                } else if (col.name === "totalUSDT") {
                  return (
                    <TableCell key={index} className={classes.footerCell}>
                      <TableNumberFormat valor={totales.actual} decimales={8} />
                    </TableCell>
                  );
                } else if (col.name === "posicionUSDT") {
                  return (
                    <TableCell key={index} className={classes.footerCell}>
                      <TableNumberFormat
                        valor={totales.posicion}
                        decimales={2}
                        estilo={true}
                        sufijo={" %"}
                      />
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell key={index} className={classes.footerCell} />
                  );
                }
              }
              return null;
            })}
          </TableRow>
        </TableFooter>
      );
    },
  };

  return (
    <>
      <Paper className={classes.root}>
        <h2>Billetera</h2>
        <FormGroup
          aria-label="position"
          row
          style={{ marginRight: "1rem", marginTop: "2rem" }}
        >
          <FormControlLabel
            value="start"
            labelPlacement="start"
            label="Ocultar monedas sin balance"
            //            style={{ marginRight: "1rem", marginBottom: "1rem" }}
            control={
              <Switch
                size="small"
                checked={mostrarConCantidad}
                onChange={toggleMostrarConCantidad}
              />
            }
          />
        </FormGroup>
        <MUIDataTable
          data={billetera}
          columns={columns}
          options={options}
          // components={{
          //   Tooltip: CustomTooltip,
          // }}
        />
      </Paper>
    </>
  );
}
