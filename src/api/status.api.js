import { instance } from './api.config';

export const StatusApi = {
  // GET /status/get
  getAll() {
    return instance.get('api/v1/status/get');
  },

  // GET /status/get/{id}
  getById(id) {
    return instance.get(`api/v1/status/get/${id}`);
  },

  // POST /status/create
  create(data) {
    return instance.post('api/v1/status/create', data);
  },

  // PUT /status/update/{id}
  update(id, data) {
    return instance.put(`api/v1/status/update/${id}`, data);
  },

  // DELETE /status/delete/{id}
  delete(id) {
    return instance.delete(`api/v1/status/delete/${id}`);
  }
};