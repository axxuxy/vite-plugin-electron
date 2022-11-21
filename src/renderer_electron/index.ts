import type { PluginOption } from "vite";
import { rendererUseElectron } from "./use_electron_and_node";
import setOutput from "./set_output";

export default function ({
  output,
  useNode,
}: { output?: string; useNode?: boolean } = {}): PluginOption {
  const plugins: PluginOption[] = [];
  if (output) plugins.push(setOutput(output));
  if (useNode) plugins.push(...rendererUseElectron());
  return plugins;
}
