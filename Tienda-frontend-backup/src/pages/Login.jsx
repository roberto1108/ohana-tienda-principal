import React, { useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import logo from "../assets/ohana.jpg";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/login`, {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/panel";
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div style={background}>
      <div style={overlay}></div>
      <div style={card}>
        <img src={logo} alt="OHANA Logo" style={logoStyle} />
        <h1 style={title}>🌸 Bienvenidos a <span style={{ color: "#ff8c42" }}>OHANA</span></h1>
        <p style={subtitle}>Tu tienda, tu familia 💛</p>

        <form onSubmit={handleLogin} style={form}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={input}
          />

          <div style={passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...input, marginBottom: 0 }}
            />
            <span
              style={eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {error && <p style={errorMsg}>{error}</p>}

          <button type="submit" style={button}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

// 🎨 Estilos — cálidos y familiares
const background = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #ffe5b4, #fff3e2, #b5eaea, #fcd5ce)",
  backgroundSize: "400% 400%",
  animation: "softGradient 10s ease infinite",
  fontFamily: "'Poppins', sans-serif",
  position: "relative",
};

const overlay = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(255,255,255,0.3)",
  zIndex: 1,
};

const card = {
  position: "relative",
  zIndex: 2,
  background: "rgba(255, 255, 255, 0.9)",
  borderRadius: "25px",
  padding: "50px 40px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
  width: "90%",
  maxWidth: "400px",
  textAlign: "center",
};

const logoStyle = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: "20px",
  border: "3px solid #ffaf87",
  boxShadow: "0 5px 15px rgba(255,175,135,0.5)",
};

const title = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#333",
  marginBottom: "10px",
};

const subtitle = {
  fontSize: "16px",
  color: "#666",
  marginBottom: "30px",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const input = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "10px",
  border: "2px solid #ffd6a5",
  outline: "none",
  background: "#fff9f3",
  color: "#333",
  fontSize: "16px",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
  transition: "0.3s",
};

const passwordWrapper = {
  position: "relative",
};

const eyeIcon = {
  position: "absolute",
  right: "15px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#777",
  cursor: "pointer",
};

const button = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(90deg, #f9a826, #fcd5ce, #f08080)",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(240,128,128,0.4)",
};

const errorMsg = {
  color: "#d62828",
  background: "rgba(255, 240, 240, 0.9)",
  padding: "8px",
  borderRadius: "8px",
  fontSize: "14px",
};

// ✨ Animación del fondo
const style = document.createElement("style");
style.innerHTML = `
@keyframes softGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;
document.head.appendChild(style);
