import { resolve } from "path";
import { normalizePath, type PluginOption } from "vite";

export default function setOutput(output: string): PluginOption {
  return {
    name: "vite-plugin-renderer-electron",
    configResolved(config) {
      /// Set output renderer dir.
      config.build.outDir = normalizePath(
        resolve("./", config.build.outDir, output)
      );
    },
  };
}
