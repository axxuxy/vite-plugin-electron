import { builtinModules } from "module";
import { PluginOption } from "vite";

export function passEsbuildNode(): PluginOption {
  return {
    name: "vite-plugin-pass-esbuild-node",
    apply: "serve",
    enforce: "pre",
    config(config) {
      if (!config.optimizeDeps) config.optimizeDeps = {};
      if (!config.optimizeDeps.esbuildOptions)
        config.optimizeDeps.esbuildOptions = {};
      config.optimizeDeps.esbuildOptions.platform = "node";
      if (!config.optimizeDeps.esbuildOptions.plugins)
        config.optimizeDeps.esbuildOptions.plugins = [];
      config.optimizeDeps.esbuildOptions.plugins.push({
        name: "vite-plugin-pass-node",
        setup(plugin) {
          plugin.onResolve(
            { filter: new RegExp(`^(${builtinModules.join("|")})$`) },
            () => ({ external: false })
          );
        },
      });
    },
  };
}
