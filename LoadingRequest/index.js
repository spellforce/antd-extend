import { Spin } from "antd";
import ReactDOM from 'react-dom';
import React, { useContext, useEffect, useState } from "react";

export default (func, doms = []) => {

  let spins = [];
  console.log(doms)
  let temp = document.getElementById(doms[0])
  console.log(temp);
  // document.body.appendChild(<Spin spinning>111</Spin>)

  // func().finnally().then(() => ())


};