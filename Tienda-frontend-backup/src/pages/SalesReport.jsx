import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ohanaImg from "../assets/ohana.jpg";
import { motion } from "framer-motion";

export default function SalesReport() {
  const [sales, setSales] = useState([]);
  const [dailySummary, setDailySummary] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchSales = useCallback(async () => {
    const res = await axios.get("http://localhost:4000/api/sales", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSales(res.data);
  }, [token]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  useEffect(() => {
    if (sales.length === 0) return;

    const daily = {};
    const monthly = {};

    sales.forEach((s) => {
      const saleDate =
        s.date || s.createdAt || s.created_at || s.timestamp || s.fecha;
      const dateObj = new Date(saleDate);

      const dateStr = isNaN(dateObj)
        ? "Sin fecha"
        : dateObj.toLocaleDateString("es-MX");
      const monthStr = !isNaN(dateObj)
        ? dateObj.toLocaleString("es-MX", { month: "long", year: "numeric" })
        : "Sin fecha";

      daily[dateStr] = (daily[dateStr] || 0) + s.total;
      monthly[monthStr] = (monthly[monthStr] || 0) + s.total;
    });

    setDailySummary(Object.entries(daily).map(([date, total]) => ({ date, total })));
    setMonthlySummary(Object.entries(monthly).map(([month, total]) => ({ month, total })));
  }, [sales]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "'Poppins', sans-serif",
        backgroundImage: `url(${ohanaImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Capa translúcida cálida */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(255, 247, 235, 0.9)",
          backdropFilter: "blur(10px)",
          zIndex: 0,
        }}
      ></div>

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Imagen superior derecha */}
        <div style={styles.logoContainer}>
          <img src={ohanaImg} alt="Ohana" style={styles.logoImage} />
        </div>

        <h1 style={styles.title}>
          📊 Reporte de Ventas — <span style={{ color: "#FF8B6A" }}>Ohana Store</span>
        </h1>

        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <motion.button
            onClick={() => navigate("/sales")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.backButton}
          >
            ⬅️ Regresar al Punto de Venta
          </motion.button>
        </div>

        {/* 📅 Ventas Diarias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={styles.card}
        >
          <h2 style={styles.sectionTitle}>📅 Ventas por Día</h2>
          {dailySummary.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailySummary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFE0B2" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#FF8B6A"
                  strokeWidth={4}
                  dot={{ r: 6, fill: "#FFA987" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={styles.noData}>Sin ventas registradas</p>
          )}
        </motion.div>

        {/* 🗓️ Ventas Mensuales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ ...styles.card, marginTop: "40px" }}
        >
          <h2 style={styles.sectionTitle}>🗓️ Ventas por Mes</h2>
          {monthlySummary.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySummary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAD7FF" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#A78BFA"
                  strokeWidth={4}
                  dot={{ r: 6, fill: "#C4B5FD" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={styles.noData}>Sin datos aún</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

const styles = {
  logoContainer: {
    position: "absolute",
    top: "25px",
    right: "40px",
    background: "rgba(255,255,255,0.9)",
    borderRadius: "50%",
    padding: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  logoImage: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  title: {
    textAlign: "center",
    fontSize: "44px",
    fontWeight: "900",
    color: "#4E4E4E",
    marginBottom: "40px",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  backButton: {
    background: "linear-gradient(90deg, #FFD3B6, #FFAAA5)",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    color: "#333",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  card: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    color: "#FF8B6A",
    fontSize: "24px",
    marginBottom: "15px",
  },
  noData: {
    textAlign: "center",
    color: "#777",
  },
};

