import userRepository from '../repositories/user.repository.js';
import ApiError from '../utils/api-error.js';

export class UserService {
  async getUsers() {
    return userRepository.findAll();
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound('User Not Found');
    }
    return user;
  }
}

export default new UserService();
