import { jest } from '@jest/globals';
import sessionRepository from '#repositories/session.repository.js';
import Session from '#models/session.model.js';

describe('SessionRepository Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create should create session document', async () => {
    const mockSession = { _id: 's1', familyId: 'fam1', refreshTokenHash: 'h1' };
    jest.spyOn(Session, 'create').mockResolvedValue(mockSession);

    const res = await sessionRepository.create(mockSession);
    expect(res._id).toBe('s1');
  });

  test('findByRefreshToken should query unrevoked session by hash', async () => {
    jest.spyOn(Session, 'findOne').mockResolvedValue({ _id: 's1', isRevoked: false });
    const res = await sessionRepository.findByRefreshToken('h1');
    expect(res._id).toBe('s1');
  });

  test('revokeFamily should revoke all sessions in family', async () => {
    jest.spyOn(Session, 'updateMany').mockResolvedValue({ modifiedCount: 2 });
    const res = await sessionRepository.revokeFamily('fam1');
    expect(res.modifiedCount).toBe(2);
  });
});
