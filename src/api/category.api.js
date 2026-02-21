import { instance } from './api.config';

export const CategoryApi = {
  // GET /category/get
  getAll() {
    return instance.get('api/v1/category/get');
  },

  // GET /category/get/{id}
  getById(id) {
    return instance.get(`api/v1/category/get/${id}`);
  },

  // POST /category/create
  create(data) {
    return instance.post('api/v1/category/create', data);
  },

  // PUT /category/update/{id}
  update(id, data) {
    return instance.put(`api/v1/category/update/${id}`, data);
  },

  // DELETE /category/delete/{id}
  delete(id) {
    return instance.delete(`api/v1/category/delete/${id}`);
  }
};