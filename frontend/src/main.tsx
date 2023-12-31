import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./auth/AuthProvider";
import { AxiosInterceptor } from "./auth/AxiosProvider";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Missing root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <AxiosInterceptor>
        <App />
      </AxiosInterceptor>
    </AuthProvider>
  </React.StrictMode>
);
