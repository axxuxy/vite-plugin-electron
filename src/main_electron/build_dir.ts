import { relative, resolve } from "path";
import {
  normalizePath,
  type BuildOptions,
  type ResolvedBuildOptions,
} from "vite";

/**
 * Set electron code build info.
 * @param {MainElectronPluginOption} option
 * @param {Object} config
 */
export function passElectronBuildDir(
  option: MainElectronPluginOption,
  config: { build: BuildOptions & ResolvedBuildOptions }
): ElectronMainBuildDirInfo {
  /// Set output electron dir.
  const output = normalizePath(
    resolve(config.build.outDir, option.output || "electron")
  );

  /// Check main output path is in out dir.
  const mainOutput = normalizePath(resolve("./", output, option.main.output));
  if (!mainOutput.startsWith(output))
    throw new Error(
      `main output path: ${mainOutput} not's of output: ${output}`
    );

  /// Set main input and output path.
  const dirInfo: ElectronMainBuildDirInfo = {
    output,
    main: {
      input: normalizePath(resolve("./", option.main.input)),
      output: normalizePath(relative(output, resolve(output, mainOutput))),
    },
  };

  if (option.preload) {
    /// Check preload output path is in out dir.
    const preloadOutput = normalizePath(
      resolve("./", output, option.preload.output)
    );
    if (!preloadOutput.startsWith(output))
      throw new Error(
        `preload output path: ${preloadOutput} not's of output: ${output}`
      );

    /// Set preload input and output path.
    dirInfo["preload"] = {
      input: normalizePath(resolve("./", option.preload.input)),
      output: normalizePath(relative(output, preloadOutput)),
    };
  }

  return dirInfo;
}
