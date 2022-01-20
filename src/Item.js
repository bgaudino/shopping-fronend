import { useState } from "react";
import StoreDatalist from "./StoreDatalist";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function Item({ item, handlePurchase, handleDelete }) {
  const [store, setStore] = useState(item.store);
  const [name, setName] = useState(item.name);
  const [editStore, setEditStore] = useState(false);
  const [editItem, setEditItem] = useState(false);

  function handleStoreUpdate(e) {
    e.preventDefault();
    fetch(`${baseUrl}/item/${item.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...item,
        store,
      }),
    });
    setEditStore(false);
  }

  function handleItemUpdate(e) {
    e.preventDefault();
    if (!name) handleDelete(item);
    fetch(`${baseUrl}/item/${item.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...item,
        name,
      }),
    });
    setEditItem(false);
  }

  return (
    <div key={item.id} className="row">
      <span className="item">
        {editItem ? (
          <form
            style={{ width: "fit-content" }}
            onSubmit={handleItemUpdate}
            onBlur={handleItemUpdate}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "fit-content" }}
              autoFocus
            />
          </form>
        ) : (
          <span onClick={() => setEditItem(true)} style={{ cursor: "pointer" }}>
            {name}
          </span>
        )}
        {editStore ? (
          <form
            style={{ width: "fit-content" }}
            onSubmit={handleStoreUpdate}
            onBlur={handleStoreUpdate}
          >
            <input
              value={store}
              list={`stores-${item.id}`}
              onChange={(e) => setStore(e.target.value)}
              style={{ width: "fit-content" }}
              autoFocus
            />
            <StoreDatalist listId={`stores-${item.id}`} />
          </form>
        ) : (
          <span className="store" onClick={() => setEditStore(true)}>
            {store ? store : "Any"}
          </span>
        )}
      </span>
      <div className="buttonGroup">
        <button onClick={() => handlePurchase(item.id)}>
          {" "}
          <i className="fas fa-check"></i>
        </button>
        <button className="deleteButton" onClick={() => handleDelete(item)}>
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
}
