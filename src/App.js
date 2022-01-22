import { useEffect, useState } from "react";
import Item from "./Item";
import Purchased from "./Purchased";
import { stores } from "./stores";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [items, setItems] = useState([]);
  const [store, setStore] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [input, setInput] = useState("");
  const [datalist, setDatalist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/items/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.items);
        setItems(data.items);
        setPurchases(data.purchases);
        setDatalist(data.datalist);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  function refresh() {
    fetch(`${baseUrl}/items/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.items);
        setItems(data.items);
        setPurchases(data.purchases);
        setDatalist(data.datalist);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    fetch(`${baseUrl}/items/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: input,
        store: store,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setItems((prevState) => [...prevState, data]);
        setInput("");
        setStore("");
        if (!datalist.map((item) => item.name).includes(input)) {
          setDatalist((prevState) => [...prevState, { name: input }]);
        }
      })
      .catch((err) => console.log(err));
  }

  function handleDelete(itemToDelete) {
    fetch(`${baseUrl}/item/${itemToDelete.id}/`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 204 && !itemToDelete.is_purchased) {
          setItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemToDelete.id)
          );
        } else if (res.status === 204 && itemToDelete.is_purchased) {
          setPurchases((prevPurchases) =>
            prevPurchases.filter((purchase) => purchase.id !== itemToDelete.id)
          );
        }
      })
      .catch((err) => console.log(err));
  }

  function handlePurchase(itemId) {
    fetch(`${baseUrl}/item/${itemId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_purchased: true,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        setPurchases((prevPurchases) => [...prevPurchases, data]);
      })
      .catch((err) => console.log(err));
  }

  function handleRestore(itemId) {
    fetch(`${baseUrl}/item/${itemId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_purchased: false,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPurchases((prevPurchases) =>
          prevPurchases.filter((item) => item.id !== itemId)
        );
        setItems((prevItems) => [...prevItems, data]);
      })
      .catch((err) => console.log(err));
  }

  const dates = Array.from(
    new Set(
      purchases.map((purchase) =>
        new Date(purchase.purchased_at).toLocaleDateString()
      )
    )
  ).sort((a, b) => new Date(b) - new Date(a));

  const itemChoices = datalist.map((item) => item.name.toLowerCase()).sort();

  if (loading) return null;

  return (
    <main>
      <h1>
        <span style={{ cursor: "pointer" }} onClick={refresh}>
          🥑
        </span>{" "}
        Avocado
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          list="items"
          placeholder="Add an item"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <datalist id="items">
          {itemChoices.map((item, index) => (
            <option key={index} value={item} />
          ))}
        </datalist>
        <select value={store} onChange={(e) => setStore(e.target.value)}>
          <option value="" disabled>
            Choose a Store
          </option>
          {stores.map((storeOption) => (
            <option key={storeOption[1]} value={storeOption[1]}>
              {storeOption[0]}
            </option>
          ))}
        </select>
        <button disabled={!input}>
          <i className="fas fa-plus"></i>
        </button>
      </form>

      <section>
        <h2>To Purchase</h2>
        {!items.length && <p>All done!</p>}
        {items
          .sort((a, b) => a.id - b.id)
          .map((item) => (
            <Item
              key={item.id}
              item={item}
              handleDelete={handleDelete}
              handlePurchase={handlePurchase}
            />
          ))}
      </section>

      {purchases.length > 0 && <h2>Recent Purchases</h2>}
      {dates.map((date) => (
        <Purchased
          key={date}
          date={date}
          handleRestore={handleRestore}
          handleDelete={handleDelete}
          items={purchases
            .filter(
              (item) =>
                new Date(item.purchased_at).toLocaleDateString() === date
            )
            .sort(
              (a, b) => new Date(a.purchased_at) - new Date(b.purchased_at)
            )}
        />
      ))}
    </main>
  );
}

export default App;
