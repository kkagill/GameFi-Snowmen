import axios from 'axios';
import { toast } from 'react-toastify';

export const clientBackend = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

export const createMsg = (nonce: number) => `
  Welcome to Snowmen!
  
  Approve this message to securely log in.
  
  Nonce:
  ${JSON.stringify(nonce)}`;

// export const formatToken = (weiValue: string) => {
//     return parseInt(weiValue) / 10 ** 18;
// }

export const showToast = (type: string, msg: string, delay: number) => {
  if (type === 'warn') {
    toast.warn(msg, {
      position: 'top-center',
      autoClose: delay * 1000
    });
  } else if (type === 'error') {
    toast.error(msg, {
      position: 'top-center',
      autoClose: delay * 1000
    });
  } else if (type === 'info') {
    toast.info(msg, {
      position: 'top-center',
      autoClose: delay * 1000
    });
  } else if (type === 'success') {
    toast.success(msg, {
      position: 'top-center',
      autoClose: delay * 1000
    });
  }
};