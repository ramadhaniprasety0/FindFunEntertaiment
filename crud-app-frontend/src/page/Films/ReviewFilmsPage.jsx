// import { Container, Spinner } from "react-bootstrap";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import { ReviewFilms } from "../data"; // Importing the data
import ReviewFilmsComponent from "../../components/FilmsComponentsHome/ReviewFilmsComponent";

const ReviewFilmsPage = () => {
  
  return (
    <div className="w-100 min-vh-100 homepage-films">
      <ReviewFilmsComponent />
    </div>
  );
};

export default ReviewFilmsPage;
