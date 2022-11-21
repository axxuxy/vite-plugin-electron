import type { PluginOption } from "vite";
import { build } from "./build";
import { passElectronBuildDir } from "./build_dir";

export default (option: MainElectronPluginOption): PluginOption[] => {
  let buildOption: ElectronMainBuildOption;
  return [
    {
      name: "vite-plugin-build-electron-main",
      configResolved(_) {
        buildOption = {
          watch: _.command === "serve",
          ...passElectronBuildDir(option, _),
        };
      },
    },
    {
      name: "vite-plugin-build-electron-main-serve",
      apply: "serve",
      configureServer(serve) {
        /// On serve started,start build and watch electron code.
        serve.httpServer?.once("listening", () => {
          if (!process.env.VITEST) {
            build(buildOption).then((watch) => {
              /// If serve close, close this build serve
              serve.httpServer!.once("close", () =>
                (watch as { close: () => Promise<void> }).close()
              );
            });
          }
        });
      },
    },
    {
      name: "vite-plugin-build-electron-main-build",
      apply: "build",
      closeBundle() {
        /// Build electron code.
        build(buildOption);
      },
    },
  ];
};
