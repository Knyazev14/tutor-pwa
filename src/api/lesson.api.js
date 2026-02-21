import { instance } from './api.config';

export const LessonApi = {
  // GET /lesson/get
  getAll() {
    return instance.get('api/v1/lesson/get');
  },

  // GET /lesson/get/{id}
  getById(id) {
    return instance.get(`api/v1/lesson/get/${id}`);
  },

  // POST /lesson/create
  create(data) {
    return instance.post('api/v1/lesson/create', data);
  },

  // PUT /lesson/update/{id}
  update(id, data) {
    return instance.put(`api/v1/lesson/update/${id}`, data);
  },

  // DELETE /lesson/delete/{id}
  delete(id) {
    return instance.delete(`api/v1/lesson/delete/${id}`);
  }
};