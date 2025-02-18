import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "jotai";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import App from "./App";
import "./index.css";
import { validateEnv } from './utils/env-validation';

// Validate environment variables before app starts
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error.message);
  throw error;
}

// Get root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Create root
const root = ReactDOM.createRoot(rootElement);

// Render app
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
