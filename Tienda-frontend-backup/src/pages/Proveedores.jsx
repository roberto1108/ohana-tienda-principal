import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ohanaImg from "../assets/ohana.jpg";

export default function Proveedores() {
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [code, setCode] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProveedor, setFilterProveedor] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const proveedores = [
    "Cocacola", "Bimbo", "Barcel", "Gamesa", "Marinela", "Ricolino", "MYMS",
    "Pepsi", "Peñafiel", "Boing", "Cerveza", "Jabones", "Papel", "Costeña",
    "Herdez", "Dulces", "Maruchan", "Nestle Productos", "Nestle Helados",
    "Articulo de limpieza", "Sopas", "Cigarros"
  ];

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductos(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    let filtered = productos.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterProveedor) {
      filtered = filtered.filter(
        (p) => p.proveedor?.toLowerCase() === filterProveedor.toLowerCase()
      );
    }
    setFilteredProducts(filtered);
  }, [searchTerm, filterProveedor, productos]);

  const handleSave = async () => {
    if (!name || !price || !stock || !code || !selectedProveedor)
      return alert("Por favor, completa todos los campos.");

    const data = { name, price: Number(price), stock: Number(stock), code, proveedor: selectedProveedor };

    try {
      if (editingId) {
        await axios.put(`http://localhost:4000/api/products/${editingId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Producto actualizado correctamente");
      } else {
        await axios.post("http://localhost:4000/api/products", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Producto agregado correctamente");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar el producto");
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setPrice(p.price);
    setStock(p.stock);
    setCode(p.code);
    setSelectedProveedor(p.proveedor || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
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

  return (
    <div style={styles.container}>
      {/* 🔹 Header */}
      <header style={styles.header}>
        <div style={styles.logoTitle}>
          <img src={ohanaImg} alt="Ohana" style={styles.logo} />
          <h1 style={styles.title}>Gestión de Productos OHANA</h1>
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={filterProveedor}
            onChange={(e) => setFilterProveedor(e.target.value)}
            style={styles.searchSelect}
          >
            <option value="">Todos los proveedores</option>
            {proveedores.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
          <button onClick={() => navigate("/panel")} style={styles.backBtn}>
            ⬅️ Atrás
          </button>
        </div>
      </header>

      {/* 🔹 Formulario */}
      <div style={styles.mainContent}>
        <div style={styles.formCard}>
          <h2 style={styles.sectionTitle}>
            {editingId ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
          </h2>
          <div style={styles.formGrid}>
            <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
            <input placeholder="Precio" type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={styles.input} />
            <input placeholder="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} style={styles.input} />
            <input placeholder="Código" value={code} onChange={(e) => setCode(e.target.value)} style={styles.input} />
            <select value={selectedProveedor} onChange={(e) => setSelectedProveedor(e.target.value)} style={styles.input}>
              <option value="">Selecciona proveedor</option>
              {proveedores.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <button onClick={handleSave} style={editingId ? styles.saveBtnEdit : styles.saveBtn}>
            {editingId ? "💾 Guardar Cambios" : "➕ Agregar Producto"}
          </button>
        </div>
      </div>

      {/* 🔹 Tabla */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th>Proveedor</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Código</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.noData}>🚫 No hay productos registrados</td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} style={styles.tableRow}>
                  <td>{p.proveedor}</td>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td>{p.code}</td>
                  <td>
                    <button onClick={() => handleEdit(p)} style={styles.editBtn}>✏️</button>
                    <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>🗑️</button>
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

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #d1f2eb, #b2ebf2)",
    minHeight: "100vh",
    padding: "30px",
    fontSize: "18px",
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
  },
  logoTitle: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },
  logo: {
    width: "240px",
    borderRadius: "20px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#00695c",
  },
  searchContainer: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  searchInput: {
    padding: "14px 18px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "18px",
  },
  searchSelect: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    fontSize: "18px",
  },
  backBtn: {
    background: "#00796b",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "14px 22px",
    cursor: "pointer",
    fontSize: "18px",
  },
  mainContent: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  formCard: {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    width: "700px",
    boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
  },
  sectionTitle: {
    color: "#00796b",
    fontWeight: "700",
    fontSize: "26px",
    marginBottom: "15px",
  },
  formGrid: {
    display: "grid",
    gap: "15px",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "18px",
  },
  saveBtn: {
    marginTop: "20px",
    width: "100%",
    background: "linear-gradient(90deg, #00c853, #00e676)",
    color: "white",
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "20px",
  },
  saveBtnEdit: {
    marginTop: "20px",
    width: "100%",
    background: "linear-gradient(90deg, #ffb300, #ffca28)",
    color: "white",
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "20px",
  },
  tableCard: {
    background: "white",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "18px",
  },
  tableHeader: {
    background: "#004d40",
    color: "white",
    fontSize: "20px",
  },
  tableRow: {
    transition: "0.2s",
  },
  noData: {
    textAlign: "center",
    padding: "25px",
    color: "#888",
    fontSize: "18px",
  },
  editBtn: {
    background: "#ffb142",
    border: "none",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "white",
    cursor: "pointer",
    marginRight: "8px",
    fontSize: "18px",
  },
  deleteBtn: {
    background: "#e53935",
    border: "none",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "white",
    cursor: "pointer",
    fontSize: "18px",
  },
};
