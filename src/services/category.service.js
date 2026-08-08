import categoryRepository from '../repositories/category.repository.js';
import ApiError from '../utils/api-error.js';

export const categoryService = {
  async getCategories(userId) {
    try {
      await categoryRepository.seedSystemCategories();
    } catch (_e) {
      // Non-blocking seed error
    }
    return categoryRepository.findAllForUser(userId);
  },

  async createCategory(data, userId) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
