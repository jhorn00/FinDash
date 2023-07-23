// This file serves to test that I have jest implemented in my Actions properly

import {describe, expect, test} from '@jest/globals';
import { sum } from "./sample/sum";

describe("Verify jest testing", () => {
  it("validates equality", () => {
    expect(sum(2, 2)).toBe(4);
  });
});
