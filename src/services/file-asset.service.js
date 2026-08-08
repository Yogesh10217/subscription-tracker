import fileAssetRepository from '../repositories/file-asset.repository.js';
import subscriptionRepository from '../repositories/subscription.repository.js';
import ApiError from '../utils/api-error.js';

export const fileAssetService = {
  async addFileAsset(subscriptionId, userId, assetData) {
    const sub = await subscriptionRepository.findById(subscriptionId);
    if (!sub || sub.user.toString() !== userId) {
      throw ApiError.notFound('Subscription not found');
    }
    return fileAssetRepository.create({ ...assetData, subscription: subscriptionId, user: userId });
  },

  async getFileAssets(subscriptionId, userId) {
    return fileAssetRepository.findBySubscription(subscriptionId, userId);
  },

  async deleteFileAsset(assetId, userId) {
    const deleted = await fileAssetRepository.delete(assetId, userId);
    if (!deleted) {
      throw ApiError.notFound('File asset not found');
    }
    return deleted;
  }
};

export default fileAssetService;
