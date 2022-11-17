import React from "react";
import { Card, Statistic } from "antd";
import Icon from "@mdi/react";

const TileIcon = ({
  clrH,
  clrB,
  clrF,
  title,
  texto,
  subtexto,
  icono,
  pie,
  funcion = null,
  opcion = 0,
}) => {
  return (
    <Card
      style={{
        backgroundColor: "#fff",
      }}
      bordered={false}
      onClick={funcion ? () => funcion(opcion) : console.log("No funcion")}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: clrH,
          padding: 6,
          paddingLeft: 12,
          paddingRight: 12,
          cursor: "pointer"
        }}
      >
        <Statistic
          value={title}
          valueStyle={{ color: "white", fontSize: 17 }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: clrB,
          paddingTop: 6,
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        <Statistic
          value={texto}
          valueStyle={{ color: "white", fontSize: 16 }}
        />
        <Icon path={icono} size={"30px"} color="white" className="icon-tile" />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: clrB,
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        <Statistic
          value={subtexto}
          valueStyle={{ color: "white", fontSize: 16 }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: clrF,
          padding: 6,
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        <Statistic value={pie} valueStyle={{ color: "white", fontSize: 16 }} />
      </div>
    </Card>
  );
};

export default TileIcon;
