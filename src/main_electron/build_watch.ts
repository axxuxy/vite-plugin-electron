import { spawn, type ChildProcess } from "child_process";
import electron from "electron";
import type { PluginOption } from "vite";

export default function (): PluginOption {
  /** The spwan for electron */
  let electron_spawn: ChildProcess | null = null;

  return {
    name: "vite-plugin-build-electron-main-watch",
    apply: "build",
    closeBundle() {
      /// If electron_spawn exist and electron_spawn not's killed, kill the spawn of electron_spawn.
      if (electron_spawn && !electron_spawn.killed) electron_spawn.kill();

      /// Startup electron.
      electron_spawn = spawn(electron.toString(), ["."], {
        stdio: "inherit",
      });

      console.log("\x1b[45mStartup electron\x1b[0m");

      /// Watching the spawn of electron.
      /// If close electron by in app, exit code equal to 0. Then this exit the process.
      electron_spawn.on("exit", (code) => {
        if (code === 0) process.exit();
      });
    },
    closeWatcher() {
      if (electron_spawn && !electron_spawn.killed) electron_spawn.kill();
    },
  };
}
