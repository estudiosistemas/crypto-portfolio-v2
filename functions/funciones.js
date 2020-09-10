import React from "react";

export function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export function getNowDateTimeStr() {
  var now = new Date();
  var hour = now.getHours(); // - (now.getHours() >= 12 ? 12 : 0);
  return [
    [
      now.getFullYear(),
      AddZero(now.getMonth() + 1),
      AddZero(now.getDate()),
    ].join("-"),
    [AddZero(hour), AddZero(now.getMinutes())].join(":"),
    //now.getHours() >= 12 ? "PM" : "AM",
  ].join("T");
}

//Pad given value to the left with "0"
function AddZero(num) {
  return num >= 0 && num < 10 ? "0" + num : num + "";
}
