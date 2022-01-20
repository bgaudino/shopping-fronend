const stores = [
  "Whole Foods",
  "Trader Joes",
  "Costco",
  "Jewel-Osco",
  "Online",
  "Any",
];

export default function StoreDatalist({ listId }) {
  return (
    <datalist id={listId}>
      {stores.map((store) => (
        <option key={store} value={store} />
      ))}
    </datalist>
  );
}
