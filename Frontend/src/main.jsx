import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import GlobalContextProvider from './Context/GlobalContextProvider';
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalContextProvider>
        <App />
        <Toaster />
      </GlobalContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
