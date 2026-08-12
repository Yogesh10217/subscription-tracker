import { isAppShuttingDown } from '../../../src/config/shutdown.js';

describe('Shutdown Manager Unit Tests', () => {
  it('isAppShuttingDown should return initial false state', () => {
    expect(isAppShuttingDown()).toBe(false);
  });
});
