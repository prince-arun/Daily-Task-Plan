import React from "react";
import Home from "./Home";
import { Navigate } from "react-router-dom";

const Protected = () => {
  const token = localStorage.getItem("token");
  return token ? <Home /> : <Navigate to="/" />;
};

export default Protected;
