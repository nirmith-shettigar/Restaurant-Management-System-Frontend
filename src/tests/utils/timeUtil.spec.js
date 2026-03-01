import { describe, it, expect } from "vitest";
import { formatTime, formatDate } from "../../utils/timeUtil";

describe("timeUtil", () => {
  describe("formatTime", () => {
    it("formats a valid ISO datetime string into 12-hour time", () => {
      const result = formatTime("2024-06-15T14:30:00.000Z");
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(/AM|PM/i.test(result)).toBe(true);
    });
  });

  describe("formatDate", () => {
    it("includes year in the formatted date", () => {
      const result = formatDate("2024-06-15T14:30:00.000Z");
      expect(result).toContain("2024");
    });

    it("returns a non-empty string for any valid date", () => {
      const result = formatDate("2023-12-25T00:00:00.000Z");
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
