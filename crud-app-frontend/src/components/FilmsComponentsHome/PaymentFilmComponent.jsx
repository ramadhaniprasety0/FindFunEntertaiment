import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const PaymentFilmComponent = () => {

  const { id, tiketId } = useParams();
  
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const getDetailFilm = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:3000/api/film-payment/${id}/schedule/${tiketId}`);
      setData(data.data);
      setTitle(data.data.film_title);
      setLoading(false);
      console.log(data);
      console.log(title);
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat mengambil data film.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailFilm();
  }, []);
  

  // const fileInputRef = useRef(null);
  // const [fileName, setFileName] = useState("");
  // const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  // if (!data) {
  //   return <p className="text-center my-5">Data pembayaran tidak tersedia.</p>;
  // }

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(data.paymentCode)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Berhasil Disalin!",
          text: "Kode Pembayaran berhasil disalin ke clipboard.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      })
      .catch((err) => {
        console.error("Gagal menyalin kode: ", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Menyalin",
          text: "Terjadi kesalahan saat menyalin kode pembayaran.",
        });
      });
  };

  const handleChooseFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      console.log("File dipilih:", file.name);
    } else {
      setFileName("");
      setSelectedFile(null);
    }
  };

  const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace("Rp", currency);
  };

  const handleCheckPayment = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "warning",
        title: "Upload Bukti Pembayaran",
      });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    Swal.fire({
      icon: "success",
      title: "Pembayaran Berhasil !",
      showConfirmButton: false,
      timer: 2500,
    }).then(() => {
      navigate("/page-tiket");
    });
  };

  return (
    <div className="payment-confirmation-page">
      <Container className="payment-content-container">
        <Row className="justify-content-center text-center">
          <Col md={5} lg={11}>
            <p className="payment-label mb-1">Nama Film</p>
            <h1 className="payment-music-title">{title}</h1>

            <p className="payment-label mt-4 mb-1">Total Pembayaran</p>
            <h2 className="payment-amount">
              {/* {formatCurrency(data.totalAmount, data.currency)} */}
            </h2>

            <p className="payment-label mt-4 mb-1">Kode Pembayaran</p>
            <div className="payment-code-wrapper">
              {/* <h3 className="payment-code-value">{data.paymentCode}</h3> */}
              <Button
                variant="link"
                onClick={handleCopyCode}
                className="copy-code-btn"
              >
                <i className="bi bi-clipboard"></i>
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*,.pdf,.doc,.docx" // Sesuaikan tipe file yang diterima
            />
            <button
              type="button"
              className="btn-pilih-file mt-3"
              onClick={handleChooseFileClick}
            >
              <i className="bi bi-upload me-2"></i>Pilih File
            </button>

            {/* {fileName && (
              <p className="mt-2 selected-file-name">
                File terpilih: {fileName}
              </p>
            )} */}
          </Col>
        </Row>

        {/* Bagian Cara Pembayaran */}
        <Row className="justify-content-center mt-5">
          <Col md={10} lg={12}>
            <div className="instructions-box">
              {/* <h5 className="instructions-title">
                {data.paymentInstructionsTitle}
              </h5>
              <ol className="instructions-list">
                {data.paymentInstructions.map(
                  (
                    item,
                    index // Tambahkan index sebagai key
                  ) => (
                    <li key={index}>
                      {item.text}
                      {item.boldText && <strong>{item.boldText}</strong>}
                    </li>
                  )
                )}
              </ol> */}
            </div>
          </Col>
        </Row>

        {/* Tombol Cek Pembayaran */}
        <Row className="justify-content-center mt-4 mb-5">
          <Col md={6} lg={4} className="text-center">
            {/* Memanggil handleCheckPayment saat tombol diklik */}
            <button
              type="button"
              className="btn-cek-pembayaran w-100"
              onClick={handleCheckPayment}
            >
              Cek Pembayaran
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PaymentFilmComponent;
