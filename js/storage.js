// js/storage.js

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function deleteFromStorage(key) {
  localStorage.removeItem(key);
}
