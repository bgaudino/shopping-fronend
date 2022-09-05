import React, {useRef, useState} from 'react';
import {stores} from './stores';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function Item({item, handlePurchase, handleDelete}) {
  const [store, setStore] = useState(item.store || 'Any');
  const [name, setName] = useState(item.name);
  const [editStore, setEditStore] = useState(false);
  const [editItem, setEditItem] = useState(false);
  const photoRef = useRef(null);
  const [photo, setPhoto] = useState(item.url);
  const [showPhoto, setShowPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleStoreUpdate(e) {
    e.preventDefault();
    fetch(`${baseUrl}/item/${item.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...item,
        name,
      }),
    });
    setEditItem(false);
  }

  return (
    <React.Fragment key={item.id}>
      <div className="row">
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
            <span onClick={() => setEditItem(true)} style={{cursor: 'pointer'}}>
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
          )}
          {!editItem && !editStore && (
            <span className="store" onClick={() => setEditStore(true)}>
              {store ? store : 'Any'}
            </span>
          )}
        </span>
        <div className="buttonGroup">
          <button onClick={() => handlePurchase(item.id)}>
            <i className="fas fa-check"></i>
          </button>
          <div className={`dropdown is-right${dropdownOpen && ' is-active'}`}>
            <div className="dropdown-trigger">
              <button
                className="has-background-info"
                aria-haspopup="true"
                aria-controls="dropdown-menu"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="icon is-small">
                  <i
                    className={`fas fa-angle-${dropdownOpen ? 'up' : 'down'}`}
                    aria-hidden="true"
                  ></i>
                </span>
              </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content">
                <a
                  href="/"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(item);
                    setDropdownOpen(false);
                  }}
                >
                  Delete
                </a>
                {photo && (
                  <>
                    <a
                      href="/"
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPhoto(() => !showPhoto);
                        setDropdownOpen(false);
                      }}
                    >
                      {showPhoto ? 'Hide' : 'Show'} Photo
                    </a>
                    <a
                      href="/"
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault();
                        fetch(`${baseUrl}/item/${item.item}/photo/`, {
                          method: 'DELETE',
                        })
                          .then((res) => {
                            setShowPhoto(false);
                            setPhoto('');
                          })
                          .finally(() => setDropdownOpen(false));
                      }}
                    >
                      Delete Photo
                    </a>
                  </>
                )}
                <a
                  href="/"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    photoRef.current?.click();
                    setDropdownOpen(false);
                  }}
                >
                  {photo ? 'Replace' : 'Upload'} Photo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <input
          hidden
          ref={photoRef}
          name="photo"
          type="file"
          onChange={(e) => {
            setIsLoading(true);
            const data = new FormData();
            data.set('photo', e.target.files[0]);

            fetch(`${baseUrl}/item/${item.item}/photo/`, {
              method: 'PUT',
              body: data,
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.photo) {
                  setPhoto(data.photo);
                  setShowPhoto(true);
                }
              })
              .finally(() => setIsLoading(false));
          }}
        />
      </div>
      {showPhoto && photo && (
        <figure className="image">
          <img src={photo} alt="Item" style={{margin: 'auto'}} />
        </figure>
      )}
      {isLoading && (
        <div
          className="row"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <progress
            className="progress is-success"
            style={{
              width: '100%',
            }}
          >
            Uploading Image
          </progress>
        </div>
      )}
    </React.Fragment>
  );
}
