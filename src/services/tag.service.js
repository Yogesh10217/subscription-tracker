import tagRepository from '../repositories/tag.repository.js';
import ApiError from '../utils/api-error.js';

export const tagService = {
  async getTags(userId) {
    try {
      await tagRepository.seedSystemTags();
    } catch (_e) {
      // Non-blocking seed error
    }
    return tagRepository.findAllForUser(userId);
  },

  async createTag(data, userId) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return tagRepository.create({ ...data, slug, user: userId, isSystem: false });
  },

  async updateTag(id, userId, data) {
    const tag = await tagRepository.update(id, userId, data);
    if (!tag) {
      throw ApiError.notFound('Tag not found or cannot edit system tag');
    }
    return tag;
  },

  async deleteTag(id, userId) {
    const tag = await tagRepository.delete(id, userId);
    if (!tag) {
      throw ApiError.notFound('Tag not found or cannot delete system tag');
    }
    return tag;
  }
};

export default tagService;
