import  axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,

})

httpClient.interceptors.request.use(function (config) {
  // Do something before request is sent
  const accessToken = localStorage.getItem('accessToken');
  config.headers['Authorization'] = `Bearer ${accessToken}`;
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
})

httpClient.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
})

export default httpClient;
