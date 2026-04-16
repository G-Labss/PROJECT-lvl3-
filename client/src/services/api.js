import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// handle 401
api.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config;

  if (error.response && error.response.status === 401 && !originalRequest._retry) {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return api(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.get(`/api/auth/refresh-token/${refreshToken}`);
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      api.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
      originalRequest.headers['Authorization'] = 'Bearer ' + data.token;
      processQueue(null, data.token);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
});

export const lessonAPI = {
  getAll: () => api.get('/lessons').then(r => r.data),
  getById: (id) => api.get(`/lessons/${id}`).then(r => r.data),
  create: (data) => api.post('/lessons', data).then(r => r.data),
  update: (id, data) => api.put(`/lessons/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/lessons/${id}`).then(r => r.data),
};

export const userAPI = {
  getAll: () => api.get('/users').then(r => r.data),
  getById: (id) => api.get(`/users/${id}`).then(r => r.data),
  updateServiceArea: (id, serviceArea) => api.patch(`/users/${id}/service-area`, { serviceArea }).then(r => r.data),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials).then(r => r.data),
  register: (data) => api.post('/auth/register', data).then(r => r.data),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data).then(r => r.data),
};

export const discountAPI = {
  validate: (code) => api.post('/discounts/validate', { code }).then(r => r.data),
};

export const paymentAPI = {
  createZelleBooking: (data) => api.post('/payments/zelle', data).then(r => r.data),
};

export const bookingAPI = {
  getAll: () => api.get('/bookings').then(r => r.data),
  getById: (id) => api.get(`/bookings/${id}`).then(r => r.data),
  markPaid: (id) => api.patch(`/bookings/${id}/pay`).then(r => r.data),
  getRankings: () => api.get('/bookings/rankings').then(r => r.data),
  updateStudentNtrp: (studentEmail, ntrpRating) => api.patch('/bookings/student-ntrp', { studentEmail, ntrpRating }).then(r => r.data),
  getUpcoming: (email) => api.get(`/bookings/upcoming/${encodeURIComponent(email)}`).then(r => r.data),
};

export const testimonialAPI = {
  getAll: () => api.get('/testimonials').then(r => r.data),
  create: (data) => api.post('/testimonials', data).then(r => r.data),
  delete: (id) => api.delete(`/testimonials/${id}`).then(r => r.data),
};

export const progressAPI = {
  get: (email) => api.get(`/progress/${encodeURIComponent(email)}`).then(r => r.data),
  upsert: (email, data) => api.put(`/progress/${encodeURIComponent(email)}`, data).then(r => r.data),
  addNote: (email, text) => api.post(`/progress/${encodeURIComponent(email)}/notes`, { text }).then(r => r.data),
  deleteNote: (email, noteId) => api.delete(`/progress/${encodeURIComponent(email)}/notes/${noteId}`).then(r => r.data),
  addNtrp: (email, rating, note) => api.post(`/progress/${encodeURIComponent(email)}/ntrp`, { rating, note }).then(r => r.data),
};

export const availabilityAPI = {
  getSlots: () => api.get('/availability').then(r => r.data.data),
  upsert: (slots) => api.post('/availability', { slots }).then(r => r.data),
  toggleSlot: (slotId) => api.patch(`/availability/${slotId}`).then(r => r.data),

  // Lightweight summary used by the live availability badge on the lessons page.
  // Returns { spotsThisWeek: number, nextOpening: { dayLabel, timeLabel } | null }
  getSummary: () => api.get('/availability/summary').then(r => r.data.data),
};

export default api;
