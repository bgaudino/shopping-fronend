import { useState } from "react";
import { stores } from "./stores";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function Item({ item, handlePurchase, handleDelete }) {
  const [store, setStore] = useState(item.store || "Any");
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
        store: e.target.value,
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
        {editItem && (
          <form onSubmit={handleItemUpdate} onBlur={handleItemUpdate}>
            <input
              className="input is-fullwidth"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </form>
        )}
        {!editItem && !editStore && (
          <span onClick={() => setEditItem(true)} style={{ cursor: "pointer" }}>
            {name}
          </span>
        )}
        {editStore && (
          <div className="select is-fullwidth">
            <select
              value={store}
              onChange={(e) => {
                setStore(e.target.value);
                handleStoreUpdate(e);
              }}
              onBlur={() => setEditStore(false)}
              autoFocus
            >
              {stores.map((storeOption) => (
                <option key={storeOption[1]} value={storeOption[1]}>
                  {storeOption[0]}
                </option>
              ))}
            </select>
          </div>
          // <form onSubmit={handleStoreUpdate} onBlur={handleStoreUpdate}>
          //   <input
          //     value={store}
          //     list={`stores-${item.id}`}
          //     onChange={(e) => setStore(e.target.value)}
          //     autoFocus
          //   />
          //   <StoreDatalist listId={`stores-${item.id}`} />
          // </form>
        )}
        {!editItem && !editStore && (
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
