import { test as testFn } from './index.js';

describe('util', () => {
  test('test function', () => {
    expect(testFn()).toBe('just test');
  });
});
