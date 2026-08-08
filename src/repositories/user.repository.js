import User from '../models/user.model.js';

export class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findById(id) {
    return User.findById(id).select('-password');
  }

  async findByIdRaw(id) {
    return User.findById(id);
  }

  async create(userData, session = null) {
    if (session) {
      const res = await User.create([userData], { session });
      return res[0];
    }
    return User.create(userData);
  }

  async update(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async findAll() {
    return User.find().select('-password');
  }
}

export default new UserRepository();
