import { instance } from './api.config';

export const StudentApi = {
  // GET /student/get
  getAll() {
    return instance.get('api/v1/student/get');
  },

  // GET /student/get/{id}
  getById(id) {
    return instance.get(`api/v1/student/get/${id}`);
  },

  // POST /student/create
  create(data) {
    return instance.post('api/v1/student/create', data);
  },

  // PUT /student/update/{id}
  update(id, data) {
    return instance.put(`api/v1/student/update/${id}`, data);
  },

  // DELETE /student/delete/{id}
  delete(id) {
    return instance.delete(`api/v1/student/delete/${id}`);
  }
};