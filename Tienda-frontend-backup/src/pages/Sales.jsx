import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ohanaImg from "../assets/ohana.jpg"; // ✅ Imagen de fondo

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState("");
  const [change, setChange] = useState(0);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Cargar productos
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ Calcular total
  useEffect(() => {
    const t = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    setTotal(t);
  }, [cart]);

  // ✅ Agregar producto al carrito
  const addToCart = (p) => {
    if (p.stock <= 0) return alert(`❌ "${p.name}" sin stock`);
    const existing = cart.find((i) => i.id === p.id);
    if (existing) {
      if (existing.qty + 1 > p.stock)
        return alert(`⚠️ No hay suficiente stock de "${p.name}"`);
      setCart(cart.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i)));
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
  };

  const decreaseQty = (id) => {
    const item = cart.find((i) => i.id === id);
    if (item.qty === 1) {
      removeFromCart(id);
    } else {
      setCart(cart.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i)));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    if (window.confirm("¿Vaciar carrito?")) setCart([]);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.code.toLowerCase().includes(query.toLowerCase())
  );

  const addFromQuery = () => {
    const p = products.find(
      (x) =>
        x.code.toLowerCase() === query.toLowerCase() ||
        x.name.toLowerCase() === query.toLowerCase()
    );
    if (p) {
      addToCart(p);
      setQuery("");
    } else alert("❌ Producto no encontrado");
  };

  // ✅ Registrar venta
  const handleSale = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/sales",
        {
          items: cart.map((i) => ({
            productId: i.id,
            name: i.name,
            price: i.price,
            qty: i.qty,
          })),
          total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ Venta registrada. Cambio: $${change.toFixed(2)}`);
      setCart([]);
      setShowPaymentModal(false);
      setAmountReceived("");
      setChange(0);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Error al registrar venta");
    }
  };

  const handlePayment = () => {
    if (cart.length === 0) return alert("Carrito vacío");
    if (total === 0) return;
    setShowPaymentModal(true);
  };

  useEffect(() => {
    const received = parseFloat(amountReceived);
    if (!isNaN(received)) setChange(received - total);
  }, [amountReceived, total]);

  return (
    <motion.div
      style={{
        ...styles.page,
        backgroundImage: `url(${ohanaImg})`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div style={styles.overlay}></div>

      <motion.div style={styles.content}>
        <motion.img
          src={ohanaImg}
          alt="Ohana Logo"
          style={styles.logo}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        />
        <motion.h1
          style={styles.header}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          💫 OHANA - SIGNIFICA FAMILIA
        </motion.h1>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button onClick={() => navigate("/panel")} style={styles.backButton}>
            ⬅️ Volver
          </button>
        </div>

        {/* 🔍 Barra de búsqueda con botones */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Buscar o escanear código..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addFromQuery()}
            style={styles.input}
          />
          <button onClick={addFromQuery} style={styles.btnPink}>
            Agregar
          </button>
          <button onClick={() => navigate("/sales-history")} style={styles.btnBlue}>
            Historial
          </button>
          <button onClick={() => navigate("/debtors")} style={styles.btnOrange}>
            💰 Deudores
          </button>
          <button onClick={() => navigate("/sales-report")} style={styles.btnGreen}>
            Reporte
          </button>
        </div>

        {/* 🧺 Productos y Carrito */}
        <div style={styles.container}>
          <motion.div style={styles.card}>
            <h3 style={styles.title}>🧺 Productos</h3>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredProducts.map((p) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <td>{p.name}</td>
                      <td>${p.price}</td>
                      <td>{p.stock}</td>
                      <td>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addToCart(p)}
                          style={styles.addBtn}
                        >
                          ➕
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>

          {/* 🛒 Carrito */}
          <motion.div style={styles.card}>
            <h3 style={styles.title}>🛒 Carrito</h3>
            {cart.length === 0 ? (
              <p>No hay productos</p>
            ) : (
              <>
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <motion.tr key={item.id}>
                        <td>{item.name}</td>
                        <td>
                          <button onClick={() => decreaseQty(item.id)} style={styles.qtyBtn}>
                            ➖
                          </button>{" "}
                          {item.qty}{" "}
                          <button onClick={() => addToCart(item)} style={styles.qtyBtn}>
                            ➕
                          </button>
                        </td>
                        <td>${item.price * item.qty}</td>
                        <td>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={styles.btnDelete}
                          >
                            ❌
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                <h3 style={styles.totalText}>
                  Total: <span style={{ color: "#ff4b2b" }}>${total.toFixed(2)}</span>
                </h3>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button onClick={handlePayment} style={styles.btnPink}>
                    💳 Pagar
                  </button>
                  <button onClick={clearCart} style={styles.btnDanger}>
                    🗑️ Vaciar
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* 💰 Modal de pago */}
        <AnimatePresence>
          {showPaymentModal && (
            <motion.div style={styles.modalOverlay}>
              <motion.div style={styles.modal}>
                <h2>💰 Pago</h2>
                <p>
                  Total a pagar: <b>${total.toFixed(2)}</b>
                </p>
                <input
                  type="number"
                  placeholder="Monto recibido"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  style={styles.input}
                />
                <p>
                  Cambio:{" "}
                  <b style={{ color: change < 0 ? "red" : "green" }}>
                    ${isNaN(change) ? "0.00" : change.toFixed(2)}
                  </b>
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    disabled={change < 0}
                    onClick={handleSale}
                    style={{
                      ...styles.btnGreen,
                      opacity: change < 0 ? 0.6 : 1,
                    }}
                  >
                    Confirmar venta
                  </button>
                  <button onClick={() => setShowPaymentModal(false)} style={styles.btnDanger}>
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "'Poppins', sans-serif",
    padding: "30px",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(6px)",
  },
  content: { position: "relative", zIndex: 2 },
  logo: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "50%",
    display: "block",
    margin: "0 auto 15px",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
  },
  header: {
    fontSize: "48px",
    textAlign: "center",
    background: "linear-gradient(90deg, #ff416c, #ff4b2b, #36d1dc, #5b86e5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "900",
    marginBottom: "25px",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    background: "rgba(255,255,255,0.9)",
    borderRadius: "25px",
    padding: "40px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
    minWidth: "600px",
    backdropFilter: "blur(12px)",
    fontSize: "20px",
  },
  title: { fontSize: "22px", marginBottom: "10px" },
  input: {
    padding: "12px",
    borderRadius: "12px",
    border: "2px solid #ff4b2b",
    minWidth: "240px",
    outline: "none",
    fontSize: "16px",
  },
  btnPink: {
    background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "10px 16px",
  },
  btnBlue: {
    background: "linear-gradient(90deg, #36d1dc, #5b86e5)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "10px 16px",
  },
  btnGreen: {
    background: "linear-gradient(90deg, #11998e, #38ef7d)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "10px 16px",
  },
  btnOrange: {
    background: "linear-gradient(90deg, #f6d365, #fda085)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "10px 16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  btnDanger: {
    background: "linear-gradient(90deg, #ff5e62, #f00000)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "10px 16px",
  },
  backButton: {
    background: "linear-gradient(90deg, #868f96, #596164)",
    borderRadius: "12px",
    color: "white",
    border: "none",
    padding: "10px 16px",
  },
  qtyBtn: {
    background: "linear-gradient(90deg, #36d1dc, #5b86e5)",
    border: "none",
    borderRadius: "6px",
    color: "white",
    padding: "3px 8px",
    cursor: "pointer",
  },
  addBtn: {
    background: "linear-gradient(90deg, #36d1dc, #5b86e5)",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
  },
  btnDelete: {
    background: "linear-gradient(90deg, #ff9966, #ff5e62)",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
  },
  totalText: { marginTop: "15px", fontSize: "20px" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: {
    background: "linear-gradient(90deg, #6a11cb, #2575fc)",
    color: "white",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    textAlign: "center",
    width: "350px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
};
