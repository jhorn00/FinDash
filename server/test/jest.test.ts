// This file serves to test that I have jest implemented in my Actions properly

import {describe, expect, test} from '@jest/globals';
import { sum } from "./sample/sum";

describe('sum correctness', () => {
  test('adds 2 + 2 to equal 4', () => {
    expect(sum(2, 2)).toBe(4);
  });
});

describe('sum incorrectness', () => {
  test('adds 2 + 2 not equal 5', () => {
    expect(sum(2, 2)).not.toBe(5);
  });
});
