import { builtinModules } from "module";

import { build as _build, type UserConfig } from "vite";
import { passViteResolvePlugin } from "../pass_vite_resolve";
import watchBuild from "./build_watch";

/**
 * Build vite config.
 * If this process exit in app, It's exit code equal to 101.
 */
function buildConfig({
  watch,
  main,
  preload,
  output,
}: ElectronMainBuildOption): UserConfig {
  const entry: { [entryAlias: string]: string } = { main: main.input };
  if (preload) entry["preload"] = preload.input;

  const plugins = [passViteResolvePlugin()];
  if (watch) plugins.push(watchBuild());

  return {
    plugins,
    /// This is build options.
    build: {
      outDir: output,
      lib: { entry, formats: ["cjs"] },
      emptyOutDir: false,
      copyPublicDir: false,
      rollupOptions: {
        external: [/^electron(\/)?/, ...builtinModules],
        output: {
          entryFileNames(chunkInfo) {
            if (chunkInfo.isEntry) {
              if (chunkInfo.name === "main") return main.output;
              if (chunkInfo.name === "preload") return preload!.output;
            }
            return chunkInfo.name;
          },
        },
      },
      ...(watch ? { watch: {} } : {}),
    },
  };
}

/** Build main electron */
export function build(
  option: ElectronMainBuildOption
): ReturnType<typeof _build> {
  /// If not set configFile, renderer build will to be trigger closeBundle.
  return _build({
    configFile: __filename,
    ...buildConfig(option),
  });
}

// export default buildConfig;
export default {};
