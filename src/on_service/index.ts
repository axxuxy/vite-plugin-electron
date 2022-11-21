import type { PluginOption } from "vite";

export function onService(onService: (url: string) => void): PluginOption {
  return {
    name: "vite-plugin-on-service",
    configureServer(serve) {
      serve.httpServer?.once("listening", () => {
        const addressInfo = serve.httpServer?.address();
        if (!addressInfo) throw new Error("not address info.");
        if (typeof addressInfo === "string") {
          onService(addressInfo);
        } else {
          const url = new URL("http://localhost");
          url.host = addressInfo.address;
          url.port = addressInfo.port.toString();
          onService(url.toString());
        }
      });
    },
  };
}
