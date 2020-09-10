import React, { useEffect, useContext, useState } from "react";
import TopCards from "../components/layout/TopCards";
import axios from "axios";
import useInterval from "../hooks/useInterval";
import { Paper } from "@material-ui/core";
import CustomFooter from "../components/CustomFooter";
import MUIDataTable from "mui-datatables";
import useStyles from "../src/styles";
import TableNumberFormat from "../components/TableNumberFormat";
import textLabelsSpanish from "../components/tableLabelsLocation";

export default function Home() {
  //const { id, sigla, nombre, cantidad } = moneda;
  const [listado, setListado] = useState([]);
  const classes = useStyles();

  const buscoValor = () => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false";

    axios
      .get(url)
      .then((res) => {
        const lista = res.data.map((moneda) => ({
          id: moneda.id,
          logo: moneda.image,
          sigla: moneda.symbol.toUpperCase(),
          nombre: moneda.name,
          valor: moneda.current_price,
          valoralto24hs: moneda.high_24h,
          valorbajo24hs: moneda.low_24h,
          cambio24hs: moneda.price_change_24h,
          cambioporc24hs: moneda.price_change_percentage_24h,
        }));
        setListado(lista);
      })
      .catch((err) => console.log(err));
  };

  useInterval(() => {
    buscoValor();
  }, 2000);

  useEffect(() => {
    buscoValor();
  }, []);

  const columns = [
    {
      label: "Moneda",
      name: "logo",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          let val = `${listado[dataIndex].sigla} ${listado[dataIndex].nombre}`;
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                className={classes.logo}
                src={listado[dataIndex].logo}
                alt="Img"
              />
              {val}
            </div>
          );
        },
      },
    },
    {
      name: "sigla",
      options: { display: "exclude" },
    },
    {
      name: "nombre",
      options: { display: "exclude" },
    },
    {
      label: "Ultimo Precio",
      name: "valor",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          let val = listado[dataIndex].valor;
          return <TableNumberFormat valor={val} decimales={4} />;
        },
      },
    },
    {
      label: "Cambio 24 hs.",
      name: "cambioporc24hs",
      options: {
        filter: false,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          let val = listado[dataIndex].cambioporc24hs;
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
      label: "Máximo 24 hs.",
      name: "valoralto24hs",
      options: {
        filter: false,
        print: false,
        customBodyRenderLite: (dataIndex) => {
          let val = listado[dataIndex].valoralto24hs;
          return <TableNumberFormat valor={val} decimales={4} />;
        },
      },
    },
    {
      label: "Mínimo 24 hs.",
      name: "valorbajo24hs",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          let val = listado[dataIndex].valorbajo24hs;
          return <TableNumberFormat valor={val} decimales={4} />;
        },
      },
    },
  ];

  const options = {
    filter: false,
    filterType: "dropdown",
    responsive: "vertical",
    selectableRowsHeader: false,
    selectableRows: "none",
    rowsPerPage: 10,
    download: false,
    print: false,
    searchPlaceholder: "Buscar...",
    searchOpen: true,
    viewColumns: false,
    setTableProps: () => {
      return {
        padding: "default",
        size: "medium",
      };
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
    <div>
      <TopCards monedas={listado.slice(0, 5)} />
      <Paper className={classes.root}>
        <MUIDataTable data={listado} columns={columns} options={options} />
      </Paper>
    </div>
  );
}
