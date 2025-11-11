import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ohanaImg from "../assets/ohana.jpg";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      const res = await axios.get("http://localhost:4000/api/sales", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(res.data);
    };
    fetchSales();
  }, [token]);

  const formatDate = (sale) => {
    const date =
      sale.date || sale.createdAt || sale.created_at || sale.fecha || sale.timestamp;
    return date ? new Date(date).toLocaleString() : "Sin fecha";
  };

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
      {/* Capa translúcida clara */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          zIndex: 0,
        }}
      ></div>

      <motion.div
        style={{ position: "relative", zIndex: 2 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* LOGO EN LA PARTE SUPERIOR DERECHA */}
        <div style={styles.logoContainer}>
          <img src={ohanaImg} alt="Ohana Logo" style={styles.logoImage} />
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 style={styles.title}>🌟 HISTORIAL DE OHANA  🌟</h1>
          <div style={styles.titleUnderline}></div>
        </div>

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

        {/* TABLA DE VENTAS */}
        <motion.div
          style={styles.tableWrapper}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    No hay ventas registradas
                  </td>
                </tr>
              ) : (
                sales.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    style={styles.tr}
                  >
                    <td style={styles.td}>{i + 1}</td>
                    <td style={styles.td}>{formatDate(s)}</td>
                    <td style={styles.td}>${s.total}</td>
                    <td style={styles.td}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSale(s)}
                        style={styles.detailButton}
                      >
                        🔍 Ver Detalles
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        {/* DETALLES DE LA VENTA */}
        <AnimatePresence>
          {selectedSale && (
            <motion.div
              style={styles.detailOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                style={styles.detailCard}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120 }}
              >
                <h2 style={styles.detailTitle}>
                  🧾 Detalles de la Venta #{selectedSale.id}
                </h2>
                <div style={styles.detailBody}>
                  <p><b>📅 Fecha:</b> {formatDate(selectedSale)}</p>
                  <p><b>💰 Total:</b> ${selectedSale.total}</p>
                  <p><b>🧮 Productos vendidos:</b> {JSON.parse(selectedSale.items).reduce((sum, i) => sum + i.qty, 0)}</p>
                  <p><b>💵 Pago recibido:</b> ${selectedSale.pago || 0}</p>
                  <p><b>💸 Cambio entregado:</b> ${selectedSale.cambio || 0}</p>

                  <h4 style={styles.productTitle}>🛍️ Detalle de Productos:</h4>
                  <ul style={styles.productList}>
                    {JSON.parse(selectedSale.items).map((item, i) => (
                      <li key={i}>
                        {item.qty} × {item.name} — ${item.price * item.qty}
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedSale(null)}
                  style={styles.closeButton}
                >
                  ❌ Cerrar
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

const styles = {
  logoContainer: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "rgba(255,255,255,0.85)",
    borderRadius: "50%",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    padding: "8px",
  },
  logoImage: {
    width: "150px",
    height: "150px",
    borderRadius: "100%",
    objectFit: "cover",
  },
  title: {
    textAlign: "center",
    fontSize: "50px",
    fontWeight: "900",
    background: "linear-gradient(270deg, #1A73E8, #FFD54F, #4DD0E1)",
    backgroundSize: "600% 600%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "gradientFlow 8s ease infinite",
    marginBottom: "15px",
    letterSpacing: "2px",
  },
  titleUnderline: {
    width: "200px",
    height: "4px",
    margin: "0 auto 35px",
    background: "linear-gradient(90deg, #1A73E8, #FFD54F, #4DD0E1)",
    borderRadius: "2px",
    animation: "gradientFlow 8s ease infinite",
  },
  tableWrapper: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    background: "linear-gradient(90deg, #FFF6BF, #AEE6F1)",
    color: "#333",
    textAlign: "left",
    padding: "14px 16px",
    fontWeight: "600",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #f0f0f0",
  },
  backButton: {
    background: "linear-gradient(90deg, #AEE6CF, #FFF6BF)",
    color: "#333",
    border: "none",
    padding: "12px 22px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "all 0.3s",
  },
  detailButton: {
    background: "linear-gradient(90deg, #AEE6F1, #FFF6BF)",
    color: "#333",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  closeButton: {
    background: "linear-gradient(90deg, #FFD3B6, #FFAAA5)",
    color: "#333",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    marginTop: "20px",
    cursor: "pointer",
    fontWeight: "700",
  },
  detailOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  detailCard: {
    background: "rgba(255,255,255,0.98)",
    borderRadius: "20px",
    padding: "35px",
    width: "520px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
  },
  detailTitle: {
    fontSize: "26px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#56B4D3",
  },
  detailBody: {
    color: "#333",
    fontSize: "15px",
  },
  productTitle: {
    marginTop: "15px",
    color: "#4E6E58",
    fontWeight: "700",
  },
  productList: {
    marginTop: "8px",
    paddingLeft: "25px",
  },
};

// Animación de degradado dinámico
const styleSheet = document.styleSheets[0];
const keyframes =
`@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
