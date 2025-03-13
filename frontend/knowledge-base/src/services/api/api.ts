import axios from 'axios';

import Keys from '@/utils/appConstants/keys';
import Secure from '@/utils/storage/secureLs';

const API = axios.create({
  baseURL: Keys.APP_API_URL,
  headers: {
    Authorization: `Bearer ${Secure.getToken()}`,
  },
});

export default API;
