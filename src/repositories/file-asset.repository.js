/**
 * @file file-asset.repository.js
 * @module repositories/file-asset.repository
 * @description Data access operations for subscription file assets/attachments.
 */

import FileAsset from '../models/file-asset.model.js';

export const fileAssetRepository = {
  async create(assetData) {
    return FileAsset.create(assetData);
  },

  async findBySubscription(subscriptionId, userId) {
    return FileAsset.find({ subscription: subscriptionId, user: userId }).sort({ uploadDate: -1 });
  },

  async findById(id) {
    return FileAsset.findById(id);
  },

  async delete(id, userId) {
    return FileAsset.findOneAndDelete({ _id: id, user: userId });
  }
};

export default fileAssetRepository;
