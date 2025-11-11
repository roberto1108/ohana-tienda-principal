import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import { FaArrowLeft, FaMoneyBillWave, FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import logo from "../assets/ohana.jpg";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function DailyCut() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailySales();
  }, []);

  const fetchDailySales = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/sales/daily`);
      console.log("📦 Respuesta del backend:", res.data);

      const salesData = Array.isArray(res.data)
        ? res.data
        : res.data?.sales || [];

      const totalSales = Array.isArray(salesData)
        ? salesData.reduce((sum, s) => sum + (s.total || 0), 0)
        : 0;

      setSales(salesData);
      setTotal(totalSales);
    } catch (error) {
      console.error("❌ Error al obtener el corte del día:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📊 Prepara datos para la gráfica
  const chartData = Array.isArray(sales)
    ? sales.reduce((acc, sale) => {
        if (!sale.date || typeof sale.total !== "number") return acc;
        const hour = new Date(sale.date).getHours();
        const existing = acc.find((x) => x.hour === hour);
        if (existing) existing.total += sale.total;
        else acc.push({ hour, total: sale.total });
        return acc.sort((a, b) => a.hour - b.hour);
      }, [])
    : [];

  // 📄 Generar PDF del corte del día
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte del Día - OHANA", 14, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total Vendido: $${total.toFixed(2)}`, 14, 38);

    const tableColumn = ["Fecha", "Cliente", "Productos", "Total"];
    const tableRows = sales.map((s) => [
      new Date(s.date).toLocaleString(),
      s.clientName || "Cliente general",
      s.items?.length || 0,
      `$${(s.total || 0).toFixed(2)}`,
    ]);

    doc.autoTable({
      startY: 50,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`Corte_Ohana_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div style={container}>
      {/* 🔙 Botón regresar */}
      <button
        style={backButton}
        onClick={() => navigate(-1)}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateX(-5px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateX(0)")
        }
      >
        <FaArrowLeft /> Volver
      </button>

      {/* 🖼️ Encabezado */}
      <div style={header}>
        <img src={logo} alt="Ohana Logo" style={logoStyle} />
        <div>
          <h1 style={title}>💰 Corte del Día - OHANA</h1>
          <p style={subtitle}>Resumen de todas las ventas realizadas hoy</p>
        </div>
      </div>

      {loading ? (
        <p style={loadingText}>Cargando datos...</p>
      ) : (
        <>
          {/* 💵 Tarjeta de resumen */}
          <div style={summaryCard}>
            <FaMoneyBillWave size={45} color="#27ae60" />
            <div>
              <h2 style={{ margin: 0, color: "#2d3436" }}>Total vendido hoy</h2>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#27ae60",
                }}
              >
                ${total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* 📊 Gráfica */}
          {chartData.length > 0 && (
            <div style={chartContainer}>
              <h3
                style={{
                  textAlign: "center",
                  marginBottom: "15px",
                  color: "#2d3436",
                }}
              >
                Gráfica de ventas por hora
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    label={{
                      value: "Hora",
                      position: "insideBottom",
                      dy: 10,
                    }}
                  />
                  <YAxis
                    label={{ value: "Monto", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip />
                  <Bar dataKey="total" fill="#74b9ff" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* 📋 Tabla */}
          <div style={tableContainer}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>🕒 Fecha</th>
                  <th style={th}>👤 Cliente</th>
                  <th style={th}>📦 Productos</th>
                  <th style={th}>💵 Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={noSales}>
                      No hay ventas registradas hoy 😅
                    </td>
                  </tr>
                ) : (
                  sales.map((s, i) => (
                    <tr key={i} style={row}>
                      <td style={td}>{new Date(s.date).toLocaleString()}</td>
                      <td style={td}>{s.clientName || "Cliente general"}</td>
                      <td style={td}>{s.items?.length || 0}</td>
                      <td style={td}>${(s.total || 0).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 📄 PDF */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              style={pdfButton}
              onClick={generatePDF}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <FaFilePdf /> Generar Reporte PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}

//
// 🎨 ESTILOS
//
const container = {
  padding: "30px",
  fontFamily: "'Poppins', sans-serif",
  background: "linear-gradient(135deg, #f9f9ff 0%, #e8ecff 100%)",
  minHeight: "100vh",
};

const backButton = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  background: "linear-gradient(90deg, #6c5ce7, #a29bfe)",
  color: "white",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginBottom: "25px",
  fontWeight: "bold",
  boxShadow: "0 5px 10px rgba(0,0,0,0.15)",
};

const header = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  background: "white",
  padding: "20px 30px",
  borderRadius: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  marginBottom: "35px",
};

const logoStyle = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  objectFit: "cover",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
};

const title = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#2d3436",
  marginBottom: "5px",
};

const subtitle = {
  color: "#636e72",
  marginBottom: "0",
  fontSize: "18px",
};

const loadingText = {
  textAlign: "center",
  fontSize: "18px",
  color: "#555",
  marginTop: "50px",
};

const summaryCard = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  background: "linear-gradient(90deg, #81ecec, #74b9ff)",
  padding: "25px 35px",
  borderRadius: "20px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  marginBottom: "35px",
  color: "#fff",
  animation: "fadeIn 1s ease",
};

const chartContainer = {
  background: "white",
  borderRadius: "20px",
  padding: "20px",
  marginBottom: "35px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
};

const tableContainer = {
  background: "white",
  borderRadius: "20px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  overflow: "hidden",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "15px",
  background: "linear-gradient(90deg, #6c5ce7, #a29bfe)",
  color: "white",
  fontWeight: "bold",
  fontSize: "16px",
};

const td = {
  textAlign: "left",
  padding: "15px",
  borderBottom: "1px solid #f0f0f0",
  fontSize: "15px",
  color: "#2d3436",
};

const row = {
  transition: "all 0.2s ease",
};

const noSales = {
  textAlign: "center",
  padding: "20px",
  color: "#999",
  fontStyle: "italic",
};

const pdfButton = {
  background: "linear-gradient(90deg, #e74c3c, #ff7675)",
  color: "white",
  padding: "12px 25px",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s",
  fontSize: "16px",
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
};
