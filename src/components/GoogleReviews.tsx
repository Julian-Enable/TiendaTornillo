import React from "react";
import "./GoogleReviews.css";

const reviews = [
  {
    name: "Camila Torres",
    time: "Hace 2 meses",
    rating: 5,
    comment: "Excelente servicio, encontré todo lo que necesitaba y la atención fue muy amable.",
  },
  {
    name: "Andrés Ramírez",
    time: "Hace 3 semanas",
    rating: 5,
    comment: "Muy buenos precios y variedad de productos. ¡Recomendado!",
  },
  {
    name: "Valentina López",
    time: "Hace 1 mes",
    rating: 4,
    comment: "Buen lugar, aunque podría mejorar el tiempo de atención en horas pico.",
  },
  {
    name: "Juan Pablo Medina",
    time: "Hace 5 días",
    rating: 5,
    comment: "Me asesoraron muy bien y resolvieron todas mis dudas. Volveré pronto.",
  },
  {
    name: "Sofía Herrera",
    time: "Hace 2 días",
    rating: 5,
    comment: "Gran variedad y excelente calidad. El personal es muy atento.",
  },
];

const GoogleReviews: React.FC = () => {
  return (
    <div className="google-reviews-container">
      <div className="google-reviews-header">
        <h2>UNIVERSAL TORNILLOS Y FERRETERÍA SAS</h2>
        <div className="google-reviews-rating-row">
          <span className="google-reviews-rating">4.7</span>
          <span className="google-reviews-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < 4 ? "star filled" : "star half"}>★</span>
            ))}
          </span>
          <span className="google-reviews-count">(24)</span>
        </div>
        <div className="google-reviews-subtitle">Tienda de herramientas</div>
      </div>
      <div className="google-reviews-list">
        {reviews.map((review, idx) => (
          <div className="google-review" key={idx}>
            <div className="google-review-header">
              <span className="google-review-avatar">{review.name[0]}</span>
              <div>
                <div className="google-review-name-row">
                  <span className="google-review-name">{review.name}</span>
                  <span className="google-review-stars-inline">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? "star filled" : "star"}>★</span>
                    ))}
                  </span>
                </div>
                <div className="google-review-time">{review.time}</div>
              </div>
            </div>
            <div className="google-review-comment">{review.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleReviews; 