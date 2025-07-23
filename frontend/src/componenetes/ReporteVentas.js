import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/reporteventas.css'; // estilos opcionales

function ReporteVentas() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    cargarReporte();
  }, []);

  const cargarReporte = async () => {
    try {
      const res = await axios.get('http://localhost:5000/reporteventas');
      setVentas(res.data);
    } catch (error) {
      console.error('Error al cargar reporte:', error);
    }
  };

  return (
    <div className="reporte-container">
      <h2>📦 Reporte de Ventas</h2>
      <table className="tabla-reporte">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.order_id + v.product_name}>
              <td>{v.order_id}</td>
              <td>{v.cliente}</td>
              <td>{v.order_date}</td>
              <td>{v.product_name}</td>
              <td>{v.unit_price}</td>
              <td>{v.quantity}</td>
              <td>{v.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReporteVentas;