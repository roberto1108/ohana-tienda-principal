import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBoxOpen, FaUsers, FaClock, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import API_BASE from "../config";
import logo from "../assets/ohana.jpg";

export default function Dashboard() {
  const [stats, setStats] = useState({
    ventas: 0,
    productos: 0,
    clientes: 0,
    pendientes: 0,
  });

  // 🔁 Actualiza los datos cada 5 segundos
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔍 Función para traer estadísticas del backend
  const fetchStats = async () => {
    try {
      const [salesRes, productsRes, clientsRes, pendingRes] = await Promise.all([
        axios.get(`${API_BASE}/api/sales/total`),
        axios.get(`${API_BASE}/api/products/count`),
        axios.get(`${API_BASE}/api/clients/count`),
        axios.get(`${API_BASE}/api/sales/pending`),
      ]);

      setStats({
        ventas: salesRes.data.total || 0,
        productos: productsRes.data.count || 0,
        clientes: clientsRes.data.count || 0,
        pendientes: pendingRes.data.count || 0,
      });
    } catch (err) {
      console.error("Error al obtener estadísticas:", err);
    }
  };

  return (
    <div style={container}>
      {/* --- MENÚ LATERAL --- */}
      <aside style={sidebar}>
        <div style={logoContainer}>
          <img src={logo} alt="Logo OHANA" style={logoStyle} />
          <h1 style={brandName}>OHANA</h1>
          <p style={brandSubtitle}>Punto de Venta</p>
        </div>

        <nav style={navLinks}>
          <SidebarLink to="/panel" label="Inicio" emoji="🏠" />
          <SidebarLink to="/proveedores" label="Productos" emoji="📦" />
          <SidebarLink to="/sales" label="Ventas" emoji="🧾" />
          <SidebarLink to="/daily-cut" label="Corte del día" emoji="💰" /> {/* 👈 NUEVO */}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          style={logoutButton}
        >
          <FaSignOutAlt style={{ marginRight: "8px" }} />
          Cerrar sesión
        </button>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main style={mainContent}>
        <div style={header}>
          <h1 style={headerTitle}>Bienvenido a OHANA POS</h1>
          <p style={headerSubtitle}>Tu sistema de ventas rápido, visual y confiable 💫</p>
        </div>

        <div style={heroCard}>
          <img src={logo} alt="Ohana" style={heroImage} />
          <div>
            <h2 style={heroTitle}>Gestión Inteligente y Amigable</h2>
            <p style={heroText}>
              Controla tus productos, ventas y clientes en un entorno moderno, intuitivo y elegante.
            </p>
          </div>
        </div>

        {/* --- TARJETAS CON DATOS REALES --- */}
        <div style={statsGrid}>
          <Card icon={<FaShoppingCart size={30} />} title="Ventas Totales" value={`$${stats.ventas}`} color="#00cec9" />
          <Card icon={<FaBoxOpen size={30} />} title="Productos" value={stats.productos} color="#6c5ce7" />
          <Card icon={<FaUsers size={30} />} title="Clientes" value={stats.clientes} color="#fdcb6e" />
          <Card icon={<FaClock size={30} />} title="Pendientes" value={stats.pendientes} color="#e17055" />
        </div>
      </main>
    </div>
  );
}

// --- COMPONENTE CARD ---
const Card = ({ icon, title, value, color }) => (
  <div
    style={{
      ...card,
      borderTop: `5px solid ${color}`,
      background: `linear-gradient(145deg, #ffffff, #f3f4f6)`,
    }}
  >
    <div style={{ color }}>{icon}</div>
    <h3 style={cardTitle}>{title}</h3>
    <p style={cardValue}>{value}</p>
  </div>
);

// --- COMPONENTE LINK ---
const SidebarLink = ({ to, label, emoji }) => (
  <Link
    to={to}
    style={sidebarLink}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.3)";
      e.currentTarget.style.transform = "translateX(5px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.15)";
      e.currentTarget.style.transform = "translateX(0)";
    }}
  >
    {emoji} {label}
  </Link>
);

//
// 🎨 ESTILOS
//
const container = {
  display: "flex",
  height: "100vh",
  background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
  fontFamily: "'Poppins', sans-serif",
};

const sidebar = {
  width: "260px",
  background: "rgba(90, 93, 255, 0.9)",
  backdropFilter: "blur(10px)",
  color: "white",
  display: "flex",
  flexDirection: "column",
  padding: "25px 20px",
  boxShadow: "5px 0 20px rgba(0,0,0,0.2)",
  borderTopRightRadius: "20px",
  borderBottomRightRadius: "20px",
};

const logoContainer = { textAlign: "center", marginBottom: "40px" };
const logoStyle = {
  width: "110px",
  height: "110px",
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: "10px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
};
const brandName = { fontSize: "26px", fontWeight: "700", letterSpacing: "2px" };
const brandSubtitle = { fontSize: "14px", opacity: 0.8, marginTop: "-5px" };

const navLinks = { display: "flex", flexDirection: "column", gap: "15px", marginBottom: "auto" };
const sidebarLink = {
  color: "white",
  textDecoration: "none",
  padding: "12px 15px",
  borderRadius: "12px",
  background: "rgba(255, 255, 255, 0.15)",
  transition: "all 0.3s ease",
  fontWeight: "500",
  fontSize: "16px",
  textAlign: "center",
  display: "block",
};
const logoutButton = {
  background: "linear-gradient(90deg, #ff7675 0%, #d63031 100%)",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
};

const mainContent = { flex: 1, padding: "50px", overflowY: "auto" };
const header = { textAlign: "center", marginBottom: "40px" };
const headerTitle = { fontSize: "42px", fontWeight: "700", color: "#2d3436", marginBottom: "10px" };
const headerSubtitle = { color: "#636e72", fontSize: "18px" };

const heroCard = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(145deg, #ffffff, #f0f4ff)",
  padding: "25px 35px",
  borderRadius: "25px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  marginBottom: "40px",
  gap: "25px",
};

const heroImage = {
  width: "130px",
  height: "130px",
  borderRadius: "20px",
  objectFit: "cover",
  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
};
const heroTitle = { fontSize: "24px", fontWeight: "600", color: "#2d3436", marginBottom: "8px" };
const heroText = { color: "#636e72", fontSize: "16px", maxWidth: "420px" };

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "25px",
};
const card = {
  background: "white",
  padding: "25px 20px",
  borderRadius: "18px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
};
const cardTitle = { fontSize: "18px", color: "#333", fontWeight: "500" };
const cardValue = { fontSize: "22px", fontWeight: "bold", color: "#555" };
