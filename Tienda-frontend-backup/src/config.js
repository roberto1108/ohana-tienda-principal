// src/config.js
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:4000" // cuando trabajas en tu PC
    : "http://192.168.1.152:4000"; // IP local de tu PC (para usar desde el celular)

export default API_BASE;
