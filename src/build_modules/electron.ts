import { readFileSync } from "fs";
import { dirname, resolve } from "path";

/**
 * Build the module for electron
 * @param {string} module The module to be loaded
 * @returns {string}
 */
export function buildElectronModule(module: string): string {
  /// Get electron types file.
  const { types } = require("electron/package.json");
  const typesFile = readFileSync(
    resolve(dirname(require.resolve("electron/package.json")), types),
    "utf-8"
  );

  /// Get module namespace.
  const nameReg = new RegExp(
    `(?<=declare[ \n]+module +('${module}'|"${module}")[ \n]*{[^.]+\\.)[_A-z][_A-z0-9]*`,
    "gm"
  );
  const namespace = typesFile.match(nameReg)?.toString();
  if (!namespace)
    throw new Error(
      `Not find the namespace: ${namespace};\nThe module is: ${module};`
    );

  /// Get module all key.
  const namespaceReg = new RegExp(`namespace +${namespace} *{`);
  let start = false;
  const keys = new Set();
  const lines = typesFile.split("\n");
  for (const code of lines) {
    if (!start && namespaceReg.test(code)) start = true;
    if (!start) continue;
    (
      code.match(/(?<=(; *|^ *)(const|class) +)[_A-z][_A-z0-9]*/g) || []
    ).forEach((key) => keys.add(key));
    if (code.trim() === "}") break;
  }

  /// Created code for module code.
  return [
    `const module = require("${module}");`,
    "",
    "",
    Array.from(keys)
      .map((key) => `export const ${key} = module.${key};`)
      .join("\n"),
    "",
    `export default module;`,
  ].join("\n");
}
