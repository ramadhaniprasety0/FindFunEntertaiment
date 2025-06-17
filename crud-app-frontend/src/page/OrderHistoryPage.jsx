import React, { useState, useEffect } from "react";
import api from "../api/axios";
import OrderHistoryComponent from "../components/OrderHistoryComponent";
import { Container, Row, Spinner, Alert } from "react-bootstrap";

const OrderHistoryPage = () => {
  // State untuk menyimpan data pesanan
  const [concertOrders, setConcertOrders] = useState([]);
  const [filmOrders, setFilmOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const getOrderHistory = async () => {
    try {
      setLoading(true);
      
      
      if (userId) {
        try {
          const concertResponse = await api.get(`/tikets/konser/user/${userId}`);
          setConcertOrders(concertResponse.data.data || []);
        } catch (error) {
          console.error("Error fetching concert orders:", error);
          setConcertOrders([]);
        }
        
        try {
          // Mengambil data pesanan film
          const filmResponse = await api.get(`/films/tickets/user/${userId}`);
          setFilmOrders(filmResponse.data.data || []);
        } catch (error) {
          console.error("Error fetching film orders:", error);
          setFilmOrders([]);
        }
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token && userId) {
      getOrderHistory();
    } else {
      setLoading(false);
    }
  }, [token, userId]);

  if (loading) {
    return <Container className="text-center my-5"><Spinner /></Container>;
  }

  if (!token || !userId) {
    return <Container className="text-center my-5"><Alert variant="warning">Anda harus login untuk melihat halaman ini.</Alert></Container>;
  }

  return (
    <div className="order-history-wrapper w-100 min-vh-100">
      <Container className='p-4 mt-5'>
        <h1 className="mb-4 mt-5">
          <b>Riwayat Pesanan</b>
        </h1>
        <Row>
          <OrderHistoryComponent 
            concertOrders={concertOrders} 
            filmOrders={filmOrders} 
          />
        </Row>
      </Container>
    </div>
  );
};

export default OrderHistoryPage;