export const saveToStore = (key, value) => localStorage.setItem(key, value);
export const getFromStore = key => localStorage.getItem(key);
export const removeFromStore = key => localStorage.removeItem(key);
