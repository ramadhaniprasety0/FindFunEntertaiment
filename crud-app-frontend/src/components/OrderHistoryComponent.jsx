import React, { useState } from "react";
import {
  Card,
  Tab,
  Tabs,
  Row,
  Col,
  Badge,
  Button,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import QRCode from "react-qr-code";

const OrderHistoryComponent = ({ concertOrders = [], filmOrders = [] }) => {
  const [key, setKey] = useState("concerts");
  const navigate = useNavigate();

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketType, setTicketType] = useState("");

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy, HH:mm", {
        locale: id,
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatShowtimes = (show_times) => {
    if (!show_times) return [];
    return show_times.split(",").map((showtime, index) => (
      <div key={index} className="btn btn-sm btn-outline-secondary">
        {showtime.slice(0, 5)}
      </div>
    ));
  };

  const truncateText = (text, maxLength = 15) => {
    if (!text) return "";

    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toUpperCase()) {
      case "ACCEPT":
        return "success";
      case "WAITING":
        return "warning";
      case "FAILED":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleShowConcertTicket = (order) => {
    setSelectedTicket(order);
    setTicketType("concert");
    setShowTicketModal(true);
  };

  const handleShowFilmTicket = (order) => {
    setSelectedTicket(order);
    setTicketType("film");
    setShowTicketModal(true);
  };

  const handleCloseTicketModal = () => {
    setShowTicketModal(false);
    setSelectedTicket(null);
  };

  const handlePrintTicket = () => {
    const printContent = document.getElementById("ticket-to-print");
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;

    window.location.reload();
  };

  return (
    <>
      <Card className="p-4 shadow-sm">
        <Tabs
          id="order-history-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-4"
        >
          <Tab
            eventKey="concerts"
            title="Tiket Konser"
            style={{ color: "#333" }}
          >
            {concertOrders && concertOrders.length > 0 ? (
              concertOrders.map((order) => (
                <Card key={order.id} className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <h5>{order.nama_konser || "Konser"}</h5>
                        <p className="mb-1">
                          <strong>Nama Pembeli:</strong> {order.nama}
                        </p>
                        <p className="mb-1">
                          <strong>Email:</strong> {order.email}
                        </p>
                        <p className="mb-1">
                          <strong>Tanggal:</strong>{" "}
                          {formatDate(order.created_at)}
                        </p>
                        <p className="mb-1">
                          <strong>Lokasi:</strong> {order.lokasi}
                        </p>
                        <p className="mb-1">
                          <strong>Total Harga:</strong> Rp{" "}
                          {order.total_harga?.toLocaleString("id-ID")}
                        </p>
                        <p className="mb-1">
                          <strong>Status:</strong>{" "}
                          <Badge bg={getStatusBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </p>
                      </Col>
                      <Col
                        md={4}
                        className="d-flex align-items-center justify-content-end"
                      >
                        <Button
                          variant="outline-primary"
                          onClick={() => handleShowConcertTicket(order)}
                          disabled={order.status?.toUpperCase() !== "ACCEPT"}
                        >
                          Cetak Tiket
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p className="text-center">Belum ada pesanan tiket konser.</p>
            )}
          </Tab>
          <Tab eventKey="films" title="Tiket Film" style={{ color: "#333" }}>
            {filmOrders && filmOrders.length > 0 ? (
              filmOrders.map((order) => (
                <Card key={order.id} className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <h5>{order.film_title || "Film"}</h5>
                        <p className="mb-1">
                          <strong>Nama Pembeli:</strong> {order.nama}
                        </p>
                        <p className="mb-1">
                          <strong>Email:</strong> {order.email}
                        </p>
                        <p className="mb-1">
                          <strong>Bioskop:</strong> {order.cinema}
                        </p>
                        <p className="mb-1">
                          <strong>Jam Tayang:</strong> {order.show_time}
                        </p>
                        <p className="mb-1">
                          <strong>Kursi:</strong> {order.seats}
                        </p>
                        <p className="mb-1">
                          <strong>Total Harga:</strong> Rp{" "}
                          {order.total_price?.toLocaleString("id-ID")}
                        </p>
                        <p className="mb-1">
                          <strong>Status:</strong>{" "}
                          <Badge bg={getStatusBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </p>
                      </Col>
                      <Col
                        md={4}
                        className="d-flex align-items-center justify-content-end"
                      >
                        <Button
                          variant="primary"
                          onClick={() => handleShowFilmTicket(order)}
                          disabled={order.status?.toUpperCase() !== "ACCEPT"}
                        >
                          Cetak Tiket
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p className="text-center">Belum ada pesanan tiket film.</p>
            )}
          </Tab>
        </Tabs>
      </Card>

      {/* Modal Cetak Tiket */}
      <Modal
        show={showTicketModal}
        onHide={handleCloseTicketModal}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Tiket {ticketType === "concert" ? "Konser" : "Film"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="ticket-to-print">
            <div
              className="ticket-container"
              style={{
                backgroundColor: "#a5b4fc",
                borderRadius: "10px",
                padding: "20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                className="ticket-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>
                    {ticketType === "concert"
                      ? selectedTicket?.nama_konser || "Konser"
                      : selectedTicket?.film_title || "Film"}
                  </h3>
                  <p style={{ margin: "5px 0 0 0" }}>
                    Order Code:{" "}
                    {selectedTicket?.payment_id ||
                      selectedTicket?.id ||
                      "TRK" + Math.floor(Math.random() * 10000000)}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <h2 style={{ margin: 0, fontSize: "28px" }}>FindFun</h2>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                    padding: "15px",
                    marginRight: "10px",
                  }}
                >
                  <h4 style={{ margin: 0 }}>
                    {ticketType === "concert"
                      ? `${selectedTicket?.jumlah + " Tiket"}`
                      : `${
                          selectedTicket?.seats?.split(",").length || 1
                        } Tiket`}
                  </h4>
                  <p style={{ margin: "5px 0 0 0" }}>
                    {ticketType === "concert"
                      ? selectedTicket?.jenis_tiket
                      : `${truncateText(selectedTicket?.seats, 20)}`}
                  </p>
                  <p style={{ margin: "5px 0 0 0" }}>
                    Rp{" "}
                    {(ticketType === "concert"
                      ? selectedTicket?.total_harga
                      : selectedTicket?.total_price
                    )?.toLocaleString("id-ID")}
                  </p>
                </div>

                <div
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                    padding: "15px",
                    marginRight: "10px",
                  }}
                >
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    {ticketType === "concert"
                      ? format(
                          new Date(selectedTicket?.tanggal || new Date()),
                          "EEEE",
                          { locale: id }
                        )
                      : "-"}
                  </p>
                  <p style={{ margin: "5px 0 0 0" }}>
                    {ticketType === "concert"
                      ? format(
                          new Date(selectedTicket?.tanggal || new Date()),
                          "d MMM yyyy",
                          { locale: id }
                        )
                      : formatShowtimes(selectedTicket?.show_time)}
                  </p>
                  <p style={{ margin: "5px 0 0 0" }}>
                    {ticketType === "concert"
                      ? selectedTicket?.jam || "19:00 - 22:00 WIB"
                      : format(
                          new Date(selectedTicket?.updated_at || new Date()),
                          "HH:mm",
                          { locale: id }
                        ) + " WIB"}
                  </p>
                </div>

                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <QRCode
                      value={String(
                        selectedTicket?.payment_id ||
                          selectedTicket?.id ||
                          "TRK" + Math.floor(Math.random() * 10000000)
                      )}
                      size={120}
                      level="H"
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "15px",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  borderRadius: "8px",
                  padding: "15px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: "10px" }}>📍</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      {ticketType === "concert"
                        ? "CGV"
                        : selectedTicket?.cinema}
                    </p>
                    <p style={{ margin: "5px 0 0 0" }}>
                      {ticketType === "concert"
                        ? selectedTicket?.lokasi || "Mall AEON Jakarta"
                        : "Mall AEON Jakarta"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTicketModal}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handlePrintTicket}>
            Unduh Tiket
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderHistoryComponent;
