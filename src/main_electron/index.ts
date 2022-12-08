import { spawn } from "child_process";
import { writeFileSync } from "fs";
import { dirname, extname, resolve } from "path";
import { normalizePath, PluginOption } from "vite";
import { passElectronBuildDir } from "./build_dir";

export default (option: MainElectronPluginOption): PluginOption[] => {
  return [
    {
      name: "vite-plugin-build-electron-main",
      enforce: "pre",
      configResolved(_) {
        writeFileSync(
          resolve(__dirname, "build.json"),
          JSON.stringify({
            watch: _.command === "serve",
            ...passElectronBuildDir(option, _),
          })
        );
      },
    },
    {
      name: "vite-plugin-build-electron-main-serve",
      apply: "serve",
      configureServer(serve) {
        /// On serve started,start build and watch electron code.
        serve.httpServer!.once("listening", () => {
          if (!process.env.VITEST) {
            const watch = build();
            watch.once("exit", (code) => {
              if (code !== null) process.exit();
            });
            serve.httpServer!.once("close", () => watch.kill());
          }
        });
      },
    },
    {
      name: "vite-plugin-build-electron-main-build",
      apply: "build",
      closeBundle() {
        /// Build electron code.
        build();
      },
    },
  ];
};

function build() {
  const vite = normalizePath(
    resolve(
      dirname(require.resolve("vite/package.json")),
      require("vite/package.json").bin.vite
    )
  );
  return spawn(
    "node",
    [
      vite,
      "build",
      "-c",
      normalizePath(resolve(__dirname, `build${extname(__filename)}`)),
    ],
    {
      stdio: "inherit",
    }
  );
}
