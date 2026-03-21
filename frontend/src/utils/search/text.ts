import { isValidElement } from "react";

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (Object.prototype.toString.call(value) !== "[object Object]") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const collectSearchStrings = (value: unknown, buffer: string[]) => {
  if (value == null) return;

  if (typeof value === "string" || typeof value === "number") {
    buffer.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectSearchStrings(item, buffer));
    return;
  }

  if (isValidElement(value)) {
    return;
  }

  if (isPlainObject(value)) {
    Object.values(value).forEach((item) => collectSearchStrings(item, buffer));
  }
};

export const normalizeSearchText = (value: string) =>
  value.toLowerCase().replace(/\s+/g, " ").trim();

export const buildSearchText = (value: unknown) => {
  const buffer: string[] = [];
  collectSearchStrings(value, buffer);
  return normalizeSearchText(buffer.join(" "));
};
