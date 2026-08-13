import categoryRepository from '../repositories/category.repository.js';
import ApiError from '../utils/api-error.js';
import { generateSlug } from '../utils/slug.utils.js';

export const categoryService = {
  async getCategories(userId) {
    return categoryRepository.findAllForUser(userId);
  },

  async createCategory(data, userId) {
    const slug = generateSlug(data.name);
    return categoryRepository.create({ ...data, slug, user: userId, isSystem: false });
  },

  async updateCategory(id, userId, data) {
    const category = await categoryRepository.update(id, userId, data);
    if (!category) {
      throw ApiError.notFound('Category not found or cannot edit system category');
    }
    return category;
  },

  async deleteCategory(id, userId) {
    const category = await categoryRepository.delete(id, userId);
    if (!category) {
      throw ApiError.notFound('Category not found or cannot delete system category');
    }
    return category;
  }
};

export default categoryService;
