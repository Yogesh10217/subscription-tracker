import providerRepository from '../repositories/provider.repository.js';
import ApiError from '../utils/api-error.js';
import { generateSlug } from '../utils/slug.utils.js';

export const providerService = {
  async getProviders(userId) {
    return providerRepository.findAllForUser(userId);
  },

  async createProvider(data, userId) {
    const slug = generateSlug(data.name);
    return providerRepository.create({ ...data, slug, user: userId, isSystem: false });
  },

  async updateProvider(id, userId, data) {
    const provider = await providerRepository.update(id, userId, data);
    if (!provider) {
      throw ApiError.notFound('Provider not found or cannot edit system provider');
    }
    return provider;
  },

  async deleteProvider(id, userId) {
    const provider = await providerRepository.delete(id, userId);
    if (!provider) {
      throw ApiError.notFound('Provider not found or cannot delete system provider');
    }
    return provider;
  }
};

export default providerService;
