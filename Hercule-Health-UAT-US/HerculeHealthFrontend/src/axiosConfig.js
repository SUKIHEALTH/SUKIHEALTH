import axios from 'axios';
import baseUrl from './config/config';
 
// Configure Axios defaults
axios.defaults.baseURL = baseUrl; // Replace with your backend's base URL
axios.defaults.withCredentials = true;
 
export default axios;
 
 
 