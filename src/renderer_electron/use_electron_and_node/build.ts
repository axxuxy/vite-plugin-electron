import { builtinModules } from "module";
import type { PluginOption } from "vite";

/** This is electron renderer build pulgin. */
export function build(): PluginOption {
  /// Electron build plugin.
  return {
    name: "vite-plugin-electron-renderer:build",
    apply: "build",
    configResolved(config) {
      /// Set not build NodeJS and ElectronJS module.
      const external = [...builtinModules, /^electron(\/)?/];
      if (!config.build.rollupOptions.external)
        config.build.rollupOptions.external = external;
      else if (Array.isArray(config.build.rollupOptions.external))
        config.build.rollupOptions.external.push(...external);
      else if (
        typeof config.build.rollupOptions.external === "string" ||
        config.build.rollupOptions.external instanceof RegExp
      )
        config.build.rollupOptions.external = [
          config.build.rollupOptions.external as string | RegExp,
          ...external,
        ];
      else
        config.build.rollupOptions.external = function (...args) {
          if (
            builtinModules.includes(args[0]) ||
            /^electron(\/)?/.test(args[0])
          )
            return true;
          return (config.build.rollupOptions.external as Function).call(
            this,
            ...args
          );
        };

      /// Set output.
      const output: typeof config.build.rollupOptions.output = {
        format: "umd",
        globals: (id) => id,
      };
      if (config.build.rollupOptions.output)
        (function setOutput(option: typeof config.build.rollupOptions.output) {
          if (!option) return;
          if (Array.isArray(option)) option.forEach(setOutput);
          else Object.assign(option, output);
        })(config.build.rollupOptions.output);
      else config.build.rollupOptions.output = output;

      /// IF config use relative path need set assetsDir to root dir, of else could not find static assets.
      if (config.base === "./") config.build.assetsDir = "";
    },
    transformIndexHtml: {
      enforce: "pre",
      transform(html) {
        const htmlLine = html.split("\n");
        const index = htmlLine.findIndex((line) => /<meta /.test(line));
        htmlLine.splice(
          index,
          0,
          htmlLine[index].replace(
            /<.+/,
            "<script>var exports = module.exports</script>"
          )
        );
        return {
          html: htmlLine.join("\n"),
          tags: [],
        };
      },
    },
  };
}
