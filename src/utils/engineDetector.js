const REQUIRED_EXTENSIONS_WEBGL2 = [
  "EXT_color_buffer_float",
];

const DESIRED_EXTENSIONS = [
  "OES_texture_float_linear",
  "EXT_float_blend",
  "WEBGL_compressed_texture_s3tc",
];

function probeContext(canvas, contextId) {
  try {
    const attrs = {
      alpha: false,
      antialias: true,
      depth: true,
      stencil: false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
    };
    const gl = canvas.getContext(contextId, attrs);
    if (!gl) return null;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const vendor = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      : gl.getParameter(gl.VENDOR);
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER);

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxCubeMapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
    const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

    const extensions = {};
    for (const ext of [...REQUIRED_EXTENSIONS_WEBGL2, ...DESIRED_EXTENSIONS]) {
      extensions[ext] = gl.getExtension(ext) !== null;
    }

    const isSoftware =
      /swiftshader|llvmpipe|softpipe|software|mesa .* software/i.test(renderer);

    const loseExt = gl.getExtension("WEBGL_lose_context");
    if (loseExt) loseExt.loseContext();

    return {
      contextId,
      vendor,
      renderer,
      maxTextureSize,
      maxCubeMapSize,
      maxRenderbufferSize,
      extensions,
      isSoftware,
    };
  } catch {
    return null;
  }
}

let _cached = null;

export function detectEngine() {
  if (_cached) return _cached;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  let probe = probeContext(canvas, "webgl2");
  let engine = probe ? "webgl2" : null;

  if (!probe) {
    probe = probeContext(canvas, "webgl");
    engine = probe ? "webgl" : null;
  }

  if (!probe) {
    _cached = {
      engine: "none",
      supported: false,
      quality: "low",
      info: null,
      glProps: {},
      dprRange: [1, 1],
      sphereDetail: 8,
      starCount: 0,
      useShaderAtmo: false,
    };
    return _cached;
  }

  let quality = "high";

  if (engine === "webgl") {
    quality = "medium";
  }

  if (probe.isSoftware) {
    quality = "low";
  } else if (probe.maxTextureSize < 4096) {
    quality = quality === "high" ? "medium" : "low";
  }

  const glProps = {
    antialias: quality !== "low",
    powerPreference: "high-performance",
    ...(engine === "webgl" ? { forceWebGL1: true } : {}),
  };

  if (engine === "webgl2") {
    glProps.toneMapping = 4;
    glProps.toneMappingExposure = 1.25;
  } else {
    glProps.toneMapping = 1;
    glProps.toneMappingExposure = 1.1;
  }

  const dprRange =
    quality === "high" ? [1, 2] : quality === "medium" ? [1, 1.5] : [1, 1];

  const sphereDetail = quality === "high" ? 32 : quality === "medium" ? 24 : 16;

  const starCount = quality === "high" ? 1 : quality === "medium" ? 0.6 : 0.3;

  const useShaderAtmo = engine === "webgl2" || quality !== "low";

  _cached = {
    engine,
    supported: true,
    quality,
    info: probe,
    glProps,
    dprRange,
    sphereDetail,
    starCount,
    useShaderAtmo,
  };

  return _cached;
}

export function resetEngineCache() {
  _cached = null;
}
