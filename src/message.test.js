import { describe, expect, test } from "vitest";
import { getButtonMessage } from "./message.js";

describe("getButtonMessage", () => {
    test("возвращает сообщение о работе JavaScript", () => {
        expect(getButtonMessage()).toBe("JavaScript работает!");
    });
});