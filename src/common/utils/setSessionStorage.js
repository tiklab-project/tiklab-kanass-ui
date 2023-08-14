
const setSessionStorage = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
}

const getSessionStorage = (key) => {
    const data =  sessionStorage.getItem(key);
    return JSON.parse(data);
}

const removeSessionStorage = (key) => {
    sessionStorage.removeItem(key);
}

export {setSessionStorage, getSessionStorage, removeSessionStorage}