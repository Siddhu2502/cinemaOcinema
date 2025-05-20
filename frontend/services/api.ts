import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Assuming backend runs on port 8080

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getBooks = async () => {
  try {
    const response = await apiClient.get('/books');
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getMovies = async () => {
  try {
    const response = await apiClient.get('/movies');
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getImages = async () => {
  try {
    const response = await apiClient.get('/images');
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const searchContent = async (query) => {
  try {
    const response = await apiClient.get('/search', { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Error searching content:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getContentUrl = (type, filename) => {
  // Ensure filename is properly encoded if it can contain special characters
  return `${API_BASE_URL}/content/${type}/${encodeURIComponent(filename)}`;
};

// Later, if we have a token, we might add an interceptor to include it in headers:
// apiClient.interceptors.request.use(config => {
//   const token = /* get token from storage */ null;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });
