import fs from "fs/promises";
import { app } from "electron";
import { join, dirname } from "path";

export const rootPath = process.env.NODE_ENV === "development" ? app.getAppPath() : dirname(app.getAppPath());
export const dbPath = join(app.getPath("userData"), "agf.db");
export const unpackedPath = join(rootPath, "/app.asar.unpacked/resources/");
export const migrationsDir =
  process.env.NODE_ENV === "development" ? join(rootPath, "resources/migrations") : join(unpackedPath, "migrations");

/**
 * Freeze an object along with all of it's properties and subproperties making it completely immutable.
 * This is useful because Object.freeze() only freezes the top level properties.
 * @param object The object to freeze
 * @returns The frozen object
 */
export function deepFreeze(object: any) {
  let props = Object.getOwnPropertyNames(object);

  // Iterate through all top level properties
  props.forEach((prop) => {
    let subProp = object[prop];

    // Recursively traverse sub-properties
    if (subProp && typeof subProp === "object") {
      deepFreeze(subProp);
    }
  });

  // Freeze self
  return Object.freeze(object);
}

export async function fileExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    // File doesn't exist or not accessible (e.g. no permissions)
    return false;
  }
}

/**
 * Remove all top level properties matching the blacklist from an object
 * @param obj The object to clone and remove properties from
 * @param blacklist A string array of properties to remove
 * @returns A new object with the properties removed
 */
export function omit(obj: any, blacklist: string[]): any {
  const deepClone = JSON.parse(JSON.stringify(obj));

  // Delete all the top level properties that are in the blacklist
  Object.getOwnPropertyNames(deepClone).forEach((prop) => {
    if (blacklist.includes(prop)) {
      delete deepClone[prop];
    }
  });

  return deepClone;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Check if the given value is of type Error, if not rethrow it.
 * https://stackoverflow.com/a/70993058
 * @param error A value that should be of type Error
 */
export function isError(error: any): asserts error is Error {
  if (!(error instanceof Error)) {
    throw error;
  }
}

export type Result<T, E> = { kind: "ok"; value: T } | { kind: "err"; error: E };
export type Option<T> = { kind: "some"; value: T } | { kind: "none" };