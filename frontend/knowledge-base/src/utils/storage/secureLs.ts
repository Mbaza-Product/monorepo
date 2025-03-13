import SecureLS from 'secure-ls';

import Keys from '../appConstants/keys';

const set = (key: string, value: any) => {
  const ls = new SecureLS({ encodingType: 'aes' });
  ls.set(key, value);
};

const get = (key: string) => {
  const ls = new SecureLS({ encodingType: 'aes' });
  return ls.get(key);
};

const remove = (key: string) => {
  const ls = new SecureLS({ encodingType: 'aes' });
  return ls.remove(key);
};

const removeToken = () => {
  const ls = new SecureLS({ encodingType: 'aes' });
  return ls.remove(Keys.REACT_APP_ACCESS_TOKEN);
};

const setToken = (value: any) => {
  const ls = new SecureLS({ encodingType: 'aes' });
  ls.set(Keys.REACT_APP_ACCESS_TOKEN, value);
};

const getToken = () => {
  const ls = new SecureLS({ encodingType: 'aes' });
  try {
    return ls.get(Keys.REACT_APP_ACCESS_TOKEN);
  } catch (error) {
    return null;
  }
};

const Secure = {
  set,
  setToken,
  get,
  getToken,
  remove,
  removeToken,
};

export default Secure;
