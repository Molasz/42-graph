import { createContext, useContext } from "react";

export const EngineContext = createContext({
  engine: "webgl2",
  quality: "high",
  sphereDetail: 32,
  starCount: 1,
  useShaderAtmo: true,
});

export function useEngine() {
  return useContext(EngineContext);
}
