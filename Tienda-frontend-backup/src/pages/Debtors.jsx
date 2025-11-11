import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Debtors() {
  const [debtors, setDebtors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    description: "",
    items: [{ product: "", price: "", qty: 1 }],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // 🟢 mensaje de notificación
  const token = localStorage.getItem("token");

  // 🔄 Obtener lista de deudores
  const fetchDebtors = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/debtors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDebtors(res.data);
    } catch (err) {
      console.error("Error al cargar deudores:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchDebtors();
  }, [fetchDebtors]);

  const calcTotal = () =>
    form.items.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.qty) || 0),
      0
    );

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { product: "", price: "", qty: 1 }] });
  };

  const removeItem = (index) => {
    const updated = [...form.items];
    updated.splice(index, 1);
    setForm({ ...form, items: updated });
  };

  const addDebtor = async (e) => {
    e.preventDefault();
    if (!form.name) return alert("Debe ingresar un nombre");
    setLoading(true);
    const total = calcTotal();
    try {
      await axios.post(
        "http://localhost:4000/api/debtors",
        { ...form, total },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({
        name: "",
        phone: "",
        description: "",
        items: [{ product: "", price: "", qty: 1 }],
      });
      fetchDebtors();
    } catch (err) {
      console.error("Error al agregar deudor:", err);
      alert("Error al guardar deudor");
    }
    setLoading(false);
  };

  const markAsPaid = async (debtor) => {
    if (!window.confirm(`¿Marcar a ${debtor.name} como pagado?`)) return;
    await axios.put(
      `http://localhost:4000/api/debtors/${debtor.id}`,
      { ...debtor, paid: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessage(`✅ ${debtor.name} ya pagó su deuda`);
    setTimeout(() => setMessage(""), 3000); // mensaje por 3 segundos
    fetchDebtors();
  };

  const deleteDebtor = async (id) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    await axios.delete(`http://localhost:4000/api/debtors/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDebtors();
  };

  // 📊 Datos para el resumen
  const totalDebt = debtors.reduce((sum, d) => sum + (d.paid ? 0 : d.total || 0), 0);
  const totalPaid = debtors.filter((d) => d.paid).length;
  const totalPending = debtors.filter((d) => !d.paid).length;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💸 Registro de Adeudos</h1>
        {/* 🔙 Botón para regresar */}
<button
  onClick={() => window.history.back()}
  style={styles.backButton}
  onMouseEnter={(e) => (e.target.style.transform = "translateX(-5px)")}
  onMouseLeave={(e) => (e.target.style.transform = "translateX(0)")}
>
  ← Volver
</button>

      {/* 🟢 Mensaje de confirmación */}
      {message && <div style={styles.message}>{message}</div>}

      {/* 📊 Resumen tipo dashboard */}
      <div style={styles.summaryContainer}>
        <div style={{ ...styles.summaryCard, background: "#ffe0b2" }}>
          <h3 style={styles.summaryTitle}>💰 Total Adeudado</h3>
          <p style={styles.summaryValue}>${totalDebt.toFixed(2)}</p>
        </div>
        <div style={{ ...styles.summaryCard, background: "#d1c4e9" }}>
          <h3 style={styles.summaryTitle}>👥 Total Deudores</h3>
          <p style={styles.summaryValue}>{debtors.length}</p>
        </div>
        <div style={{ ...styles.summaryCard, background: "#c8e6c9" }}>
          <h3 style={styles.summaryTitle}>✅ Pagados</h3>
          <p style={styles.summaryValue}>{totalPaid}</p>
        </div>
        <div style={{ ...styles.summaryCard, background: "#ffccbc" }}>
          <h3 style={styles.summaryTitle}>⏳ Pendientes</h3>
          <p style={styles.summaryValue}>{totalPending}</p>
        </div>
      </div>

      {/* 📝 Formulario */}
      <form onSubmit={addDebtor} style={styles.form}>
        <h2 style={styles.formTitle}>➕ Nuevo Deudor</h2>
        <input
          type="text"
          placeholder="Nombre del deudor"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          style={styles.input}
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={styles.textarea}
        />

        <h4 style={styles.sectionTitle}>🛒 Productos a deber</h4>

        {form.items.map((item, i) => (
          <div key={i} style={styles.itemRow}>
            <input
              type="text"
              placeholder="Producto"
              value={item.product}
              onChange={(e) => {
                const updated = [...form.items];
                updated[i].product = e.target.value;
                setForm({ ...form, items: updated });
              }}
              style={styles.itemInput}
            />
            <input
              type="number"
              placeholder="Cant."
              value={item.qty}
              onChange={(e) => {
                const updated = [...form.items];
                updated[i].qty = e.target.value;
                setForm({ ...form, items: updated });
              }}
              style={styles.itemInputSmall}
            />
            <input
              type="number"
              placeholder="Precio"
              value={item.price}
              onChange={(e) => {
                const updated = [...form.items];
                updated[i].price = e.target.value;
                setForm({ ...form, items: updated });
              }}
              style={styles.itemInputSmall}
            />
            <button type="button" onClick={() => removeItem(i)} style={styles.removeBtn}>
              ✖
            </button>
          </div>
        ))}

        <button type="button" onClick={addItem} style={styles.addProductBtn}>
          ➕ Agregar otro producto
        </button>

        <p style={styles.totalText}>Total: ${calcTotal().toFixed(2)}</p>

        <button type="submit" disabled={loading} style={styles.saveBtn}>
          {loading ? "Guardando..." : "💾 Guardar"}
        </button>
      </form>

      {/* 📋 Lista de deudores */}
      <h2 style={styles.listTitle}>📋 Lista de Deudores</h2>
      <div style={styles.debtorGrid}>
        {debtors.length === 0 ? (
          <p style={styles.noData}>No hay deudores registrados</p>
        ) : (
          debtors.map((d) => {
            const items = typeof d.items === "string" ? JSON.parse(d.items) : d.items || [];
            return (
              <div key={d.id} style={d.paid ? styles.debtorCardPaid : styles.debtorCard}>
                <h3 style={styles.debtorName}>{d.name}</h3>
                <p style={styles.debtorPhone}>📞 {d.phone || "Sin teléfono"}</p>
                <ul style={styles.productList}>
                  {items.map((it, idx) => (
                    <li key={idx}>
                      {it.qty}× {it.product} — ${it.price}
                    </li>
                  ))}
                </ul>
                <p style={styles.debtorTotal}>💰 Total: ${d.total?.toFixed(2)}</p>
                <div style={styles.cardActions}>
                  {!d.paid && (
                    <button onClick={() => markAsPaid(d)} style={styles.payBtn}>
                      ✅ Pagado
                    </button>
                  )}
                  <button onClick={() => deleteDebtor(d.id)} style={styles.deleteBtn}>
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// 🎨 Estilos
const styles = {
  container: {
    background: "linear-gradient(135deg, #fff8e1, #ffe0e0)",
    minHeight: "100vh",
    padding: "30px",
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "42px",
    color: "#ff7043",
    fontWeight: "700",
    marginBottom: "20px",
  },
  message: {
    background: "#c8e6c9",
    color: "#2e7d32",
    textAlign: "center",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontWeight: "600",
  },
  summaryContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  summaryCard: {
    borderRadius: "20px",
    padding: "20px",
    textAlign: "center",
    color: "#333",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  summaryTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  summaryValue: {
    fontSize: "26px",
    fontWeight: "700",
  },
  form: {
    background: "#fff",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    marginBottom: "40px",
    maxWidth: "600px",
    margin: "auto",
  },
  formTitle: {
    textAlign: "center",
    color: "#ff6f61",
    fontSize: "24px",
    marginBottom: "15px",
  },
  input: {
    padding: "10px 15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    width: "100%",
  },
  textarea: {
    padding: "10px 15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    width: "100%",
    height: "70px",
    marginBottom: "10px",
  },
  sectionTitle: {
    color: "#ff9068",
    fontSize: "18px",
    marginBottom: "10px",
  },
  itemRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "10px",
  },
  itemInput: {
    flex: 2,
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  itemInputSmall: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  removeBtn: {
    background: "#ffb3b3",
    border: "none",
    borderRadius: "8px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  addProductBtn: {
    background: "#ffd6a5",
    border: "none",
    borderRadius: "10px",
    padding: "10px",
    width: "100%",
    cursor: "pointer",
    marginTop: "5px",
  },
  totalText: {
    textAlign: "center",
    color: "#ff7043",
    fontWeight: "600",
    marginTop: "10px",
  },
  saveBtn: {
    background: "#ff7043",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "10px",
    width: "100%",
  },
  listTitle: {
    textAlign: "center",
    color: "#ff6f61",
    marginBottom: "20px",
    fontSize: "28px",
  },
  debtorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  },
  debtorCard: {
    background: "#fffefc",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
  },
  debtorCardPaid: {
    background: "#e8f5e9",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
    opacity: 0.8,
  },
  debtorName: {
    fontSize: "20px",
    color: "#ff7043",
    fontWeight: "600",
    marginBottom: "5px",
  },
  debtorPhone: {
    color: "#777",
    fontSize: "14px",
    marginBottom: "8px",
  },
  productList: {
    listStyle: "disc",
    marginLeft: "20px",
    color: "#444",
    fontSize: "14px",
  },
  debtorTotal: {
    marginTop: "10px",
    fontWeight: "600",
    color: "#ff6f61",
  },
  cardActions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
  },
  payBtn: {
    background: "#81c784",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#ef5350",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  noData: {
    textAlign: "center",
    color: "#888",
  },
  backButton: {
  background: "#ffb74d",
  color: "white",
  border: "none",
  borderRadius: "25px",
  padding: "10px 20px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  marginBottom: "20px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
},

};