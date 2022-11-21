import { builtinModules } from "module";
import type { PluginOption } from "vite";

export function passViteResolvePlugin(): PluginOption {
  return {
    name: "vite-plugin-electron-pass",
    enforce: "pre",
    configResolved(config) {
      /// Plugin vite:resolve will the shield electron and node module. need pass these modules.
      passViteResolve(config.plugins as PluginOption);
    },
  };
}

function passViteResolve(plugin: PluginOption) {
  if (!plugin) return;
  if (plugin instanceof Promise) plugin.then(passViteResolve);
  else if (Array.isArray(plugin)) plugin.forEach(passViteResolve);
  else if (plugin.name === "vite:resolve") {
    const resolveId = plugin.resolveId as Function;
    plugin.resolveId = function (...args) {
      if (builtinModules.includes(args[0]) || /^electron(\/)?/.test(args[0]))
        return;
      return resolveId.call(this, ...args);
    };
  }
}
