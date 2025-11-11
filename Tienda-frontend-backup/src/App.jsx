import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import SalesHistory from "./pages/SalesHistory";
import SalesReport from "./pages/SalesReport";
import Proveedores from "./pages/Proveedores";  // ✅ NUEVO
import ProveedorDetalle from "./pages/ProveedorDetalle";
import Debtors from "./pages/Debtors";
import DailyCut from "./pages/DailyCut";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/panel" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/sales-history" element={<SalesHistory />} />
        <Route path="/sales-report" element={<SalesReport />} />
        <Route path="/proveedores" element={<Proveedores />} /> {/* ✅ NUEVA RUTA */}
        <Route path="/proveedores/:id" element={<ProveedorDetalle />} /> {/* ✅ DETALLE */}
        <Route path="/debtors" element={<Debtors />} />
      <Route path="/daily-cut" element={<DailyCut />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
