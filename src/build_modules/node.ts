/**
 * Build the NodeJS module
 * @param {string} module The module to be loaded
 * @returns {string}
 */
export function buildNodeJSModule(module: string): string {
  /// Create the module code and retrun.
  const keys = Object.keys(require(module));

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
