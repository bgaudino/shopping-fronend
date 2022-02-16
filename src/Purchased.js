import React from "react";

export default function Purchased({
  items,
  date,
  handleRestore,
  handleDelete,
}) {
  return (
    <section className="purchased">
      <h2 className="is-size-5">{date}</h2>
      {items.map((item, index) => (
        <div key={item.id} className="row">
          <span className="item">{item.name}</span>
          <div className="buttonGroup">
            <button
              className="restoreButton"
              onClick={() => handleRestore(item.id)}
            >
              <i className="fas fa-undo"></i>
            </button>
            <button className="deleteButton" onClick={() => handleDelete(item)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
