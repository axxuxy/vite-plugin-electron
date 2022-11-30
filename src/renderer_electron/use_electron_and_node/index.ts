import type { PluginOption } from "vite";
import { passViteResolvePlugin } from "../../pass_vite_resolve";
import { build } from "./build";
import { serve } from "./serve";
import { passEsbuildNode } from "../../pass-esbuild_node";

/** The function return electron renderer plugins */
export function rendererUseElectron(): PluginOption[] {
  return [passViteResolvePlugin(), build(), serve(), passEsbuildNode()];
}
