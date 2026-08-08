import { jest } from '@jest/globals';
import categoryRepository from '#repositories/category.repository.js';
import Category from '#models/category.model.js';

describe('CategoryRepository Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create should create category document', async () => {
    const mockCat = { _id: 'c1', name: 'Streaming', slug: 'streaming' };
    jest.spyOn(Category, 'create').mockResolvedValue(mockCat);

    const res = await categoryRepository.create(mockCat);
    expect(res._id).toBe('c1');
  });

  test('findAllForUser should query system and user categories', async () => {
    jest.spyOn(Category, 'find').mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ _id: 'c1', name: 'Streaming' }])
    });

    const res = await categoryRepository.findAllForUser('u1');
    expect(res).toHaveLength(1);
  });
});
