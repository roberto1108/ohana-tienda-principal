import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [code, setCode] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const proveedores = [
    "Cocacola","Bimbo","Barcel","Gamesa","Marinela","Ricolino","MYMS",
    "Pepsi","Peñafiel","Boing","Cerveza","Jabones","Papel","Costeña",
    "Herdez","Dulces","Maruchan","Nestle Productos","Nestle Helados",
    "Articulo de limpieza","Sopas","Cigarros"
  ];

  // --- Cargar productos sin warning ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [token]); // Solo depende de token

  // --- Filtrar productos automáticamente ---
  useEffect(() => {
    if (selectedProveedor) {
      setFilteredProducts(
        products.filter(
          p => p.proveedor?.trim().toLowerCase() === selectedProveedor.trim().toLowerCase()
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [selectedProveedor, products]);

  // --- Guardar o actualizar producto ---
  const handleSave = async () => {
    if (!name || !price || !stock || !code || !selectedProveedor) {
      return alert("Por favor, completa todos los campos incluyendo proveedor");
    }

    const data = {
      name,
      price: Number(price),
      stock: Number(stock),
      code,
      proveedor: selectedProveedor.trim(),
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:4000/api/products/${editingId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Producto actualizado con éxito");
      } else {
        await axios.post("http://localhost:4000/api/products", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Producto agregado con éxito");
      }
      resetForm();
      // Recargar productos
      const res = await axios.get("http://localhost:4000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al guardar el producto");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setCode(product.code);
    setSelectedProveedor(product.proveedor || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Recargar productos
      const res = await axios.get("http://localhost:4000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setCode("");
    setSelectedProveedor("");
    setEditingId(null);
  };

  const handleProveedorChange = (prov) => {
    setSelectedProveedor(prov);
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>🛍️ Gestión de Productos OHANA</h1>
        <p style={{ color: "#444", fontSize: "18px" }}>Agrega, edita o elimina productos fácilmente</p>
        <button onClick={() => navigate("/panel")} style={backButtonStyle}>⬅️ Volver al panel</button>
      </header>

      {/* FORMULARIO */}
      <div style={formContainerStyle}>
        <h2 style={{ color: "#6a11cb", marginBottom: "20px" }}>
          {editingId ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "15px" }}>
          <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Precio" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} style={inputStyle} />
          <input type="text" placeholder="Código" value={code} onChange={e => setCode(e.target.value)} style={inputStyle} />
          <select value={selectedProveedor} onChange={e => handleProveedorChange(e.target.value)} style={inputStyle}>
            <option value="">Selecciona proveedor</option>
            {proveedores.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
          <button onClick={handleSave} style={{ ...actionButton, background: editingId ? "linear-gradient(90deg, #feca57, #ff9f43)" : "linear-gradient(90deg, #1dd1a1, #10ac84)" }}>
            {editingId ? "💾 Guardar cambios" : "➕ Agregar producto"}
          </button>
        </div>
      </div>

      {/* BOTONES DE PROVEEDORES */}
      <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <button onClick={() => handleProveedorChange("")} style={{ ...providerBtnStyle, background: selectedProveedor === "" ? "#8395a7" : "#576574" }}>Todos</button>
        {proveedores.map((prov, i) => (
          <button key={i} onClick={() => handleProveedorChange(prov)} style={selectedProveedor === prov ? { ...providerBtnStyle, background: "#1dd1a1" } : providerBtnStyle}>
            {prov}
          </button>
        ))}
      </div>

      {/* TABLA */}
      <div style={tableContainerStyle}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={thStyle}>Proveedor</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Precio</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Código</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" align="center" style={{ padding: "20px", color: "#666" }}>💤 No hay productos registrados</td>
              </tr>
            ) : (
              filteredProducts.map(p => (
                <tr key={p.id} style={tableRowStyle} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8f9fa"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}>
                  <td style={tdStyle}>{p.proveedor}</td>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>${p.price}</td>
                  <td style={tdStyle}>{p.stock}</td>
                  <td style={tdStyle}>{p.code}</td>
                  <td style={tdStyle}>
                    <button onClick={() => handleEdit(p)} style={editBtnStyle}>✏️ Editar</button>
                    <button onClick={() => handleDelete(p.id)} style={deleteBtnStyle}>🗑️ Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🎨 Estilos */
const containerStyle = { padding: "40px", fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", color: "#333" };
const headerStyle = { textAlign: "center", marginBottom: "40px" };
const titleStyle = { fontSize: "50px", fontWeight: "800", background: "linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "4px", marginBottom: "10px" };
const formContainerStyle = { background: "white", borderRadius: "20px", padding: "25px", boxShadow: "0 15px 35px rgba(0,0,0,0.1)", marginBottom: "40px" };
const inputStyle = { padding: "10px 12px", borderRadius: "10px", border: "1px solid #ccc", flex: "1", minWidth: "120px", outline: "none", fontSize: "15px", transition: "0.3s" };
const actionButton = { color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "16px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", transition: "0.3s" };
const backButtonStyle = { background: "linear-gradient(90deg, #576574, #8395a7)", color: "white", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" };
const providerBtnStyle = { padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "500", color: "white", background: "#576574", transition: "0.3s" };
const tableContainerStyle = { overflowX: "auto", background: "white", borderRadius: "15px", padding: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" };
const tableHeaderStyle = { background: "linear-gradient(90deg, #6a11cb, #2575fc, #00c6ff)", color: "white" };
const tableRowStyle = { backgroundColor: "#fff", transition: "0.3s", borderBottom: "1px solid #eee" };
const thStyle = { padding: "12px 15px", fontWeight: "600" };
const tdStyle = { padding: "12px 15px", color: "#333" };
const editBtnStyle = { background: "linear-gradient(90deg, #ffb142, #ff793f)", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", marginRight: "5px", cursor: "pointer", fontWeight: "500", transition: "0.3s" };
const deleteBtnStyle = { background: "linear-gradient(90deg, #ff6b6b, #ee5253)", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "500", transition: "0.3s" };
