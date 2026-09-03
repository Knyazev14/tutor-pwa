import { instance } from './api.config';

export const BookApi = {
  // GET /book/get
  getAll() {
    return instance.get('api/v1/book/get');
  },

  // GET /book/get/{id}
  getById(id) {
    return instance.get(`api/v1/book/get/${id}`);
  },

  // POST /book/create
  create(data) {
    return instance.post('api/v1/book/create', data);
  },

  // PUT /book/update/{id}
  update(id, data) {
    return instance.put(`api/v1/book/update/${id}`, data);
  },

  // DELETE /book/delete/{id}
  delete(id) {
    return instance.delete(`api/v1/book/delete/${id}`);
  }
};