import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1 className="display-3">404</h1>
      <p className="lead">Oops! The page you're looking for doesn't exist.</p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
