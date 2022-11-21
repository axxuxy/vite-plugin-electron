import { builtinModules } from "module";
import type { PluginOption } from "vite";
import { buildElectronModule } from "../../build_modules/electron";
import { buildNodeJSModule } from "../../build_modules/node";

/** This's a plugin of electron renderer in serve. */
export function serve(): PluginOption {
  const moduleCodeMap: Map<string, string> = new Map();
  return {
    name: "vite-plugin-electron-renderer:serve",
    apply: "serve",
    resolveId(source) {
      /// Retrun electron and node module id.
      if (builtinModules.includes(source) || /^electron(\/)?/.test(source))
        return source;
    },
    load(id) {
      /// Load electron and node modules.
      if (!moduleCodeMap.has(id)) {
        if (builtinModules.includes(id))
          moduleCodeMap.set(id, buildNodeJSModule(id));
        else if (/^electron(\/)?/.test(id))
          moduleCodeMap.set(id, buildElectronModule(id));
      }
      if (moduleCodeMap.has(id)) return moduleCodeMap.get(id);
    },
  };
}
