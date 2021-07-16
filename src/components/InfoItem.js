import React from "react";

export default function InfoItem({ icon, label, value, color }) {
  return (
    <article className="item">
      <span className={color}>{icon}</span>
      <div>
          <h3>{value}</h3>
          <p>{label}</p>
      </div>
    </article>
  );
}
