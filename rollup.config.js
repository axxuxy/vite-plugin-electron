import ts from "@rollup/plugin-typescript";
import { dirname, resolve, relative } from "path";
import { defineConfig } from "rollup";
import { fileURLToPath } from "url";
import nodeResolve from "@rollup/plugin-node-resolve";

const __dirname = dirname(fileURLToPath(import.meta.url));
const output = resolve(__dirname, "dist");

export default defineConfig({
  input: [
    resolve(__dirname, "src/index.ts"),
    resolve(__dirname, "src/main_electron/build.ts"),
  ],
  external: ["vite", "electron", "tslib"],
  output: [
    {
      format: "esm",
      dir: output,
      preserveModules: true,
      entryFileNames(info) {
        return relative(resolve(__dirname, "src"), info.facadeModuleId).replace(
          /ts$/,
          "mjs"
        );
      },
    },
    {
      format: "commonjs",
      dir: output,
      preserveModules: true,
      entryFileNames(info) {
        return relative(resolve(__dirname, "src"), info.facadeModuleId).replace(
          /ts$/,
          "js"
        );
      },
    },
  ],
  plugins: [
    nodeResolve(),
    ts({
      declaration: true,
      declarationDir: "dist/types",
    }),
  ],
});
