/**
 * Main and preload ouput of electron if is absolute path or relative path,
 * the can't out of range to outDir.
 */
interface MainElectronPluginOption {
  output?: string;
  main: Entry;
  preload?: Entry;
}

/** Entry interface, include input and output of path */
interface Entry {
  input: string;
  output: string;
}

/** Main electron dir info */
interface ElectronMainBuildDirInfo {
  output: string;
  main: Entry;
  preload?: Entry;
}

/** Electron main build option */
interface ElectronMainBuildOption extends ElectronMainBuildDirInfo {
  watch?: boolean;
}
