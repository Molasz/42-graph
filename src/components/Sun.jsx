import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export function Sun({ onSelect, onHover }) {
  const sunMeshRef = useRef();
  const innerCoronaRef = useRef();
  const outerCoronaRef = useRef();

  const sunShaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          colorDeep: { value: new THREE.Color(0x042f2e) },
          colorMid: { value: new THREE.Color(0x0d9488) },
          colorBright: { value: new THREE.Color(0x2dd4bf) },
          colorHot: { value: new THREE.Color(0xf0fdfa) },
        },
        vertexShader: `
          varying vec3 vPosition;
          varying vec3 vNormal;
          varying vec2 vUv;
          void main() {
            vPosition = position;
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 colorDeep;
          uniform vec3 colorMid;
          uniform vec3 colorBright;
          uniform vec3 colorHot;
          varying vec3 vPosition;
          varying vec3 vNormal;
          varying vec2 vUv;

          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(
                      i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }

          void main() {
            vec3 pos = normalize(vPosition) * 3.5;
            float n1 = snoise(pos + vec3(time * 0.18, time * 0.12, time * 0.15));
            float n2 = snoise(pos * 2.2 - vec3(time * 0.25, time * 0.20, time * 0.18));
            float noise = n1 * 0.65 + n2 * 0.35;

            float intensity = clamp(noise * 0.5 + 0.5, 0.0, 1.0);

            vec3 surfaceColor = mix(colorDeep, colorMid, smoothstep(0.1, 0.5, intensity));
            surfaceColor = mix(surfaceColor, colorBright, smoothstep(0.45, 0.8, intensity));
            surfaceColor = mix(surfaceColor, colorHot, smoothstep(0.75, 1.0, intensity));

            float fresnel = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
            fresnel = pow(fresnel, 2.2);
            surfaceColor += colorBright * fresnel * 0.75;

            gl_FragColor = vec4(surfaceColor, 1.0);
          }
        `,
      }),
    []
  );

  const innerCoronaMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(0x2dd4bf) },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform float time;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            intensity = clamp(intensity, 0.0, 1.0);
            gl_FragColor = vec4(color, intensity * 0.85);
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  const outerCoronaMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0x0284c7) },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.58 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
            intensity = clamp(intensity, 0.0, 1.0);
            gl_FragColor = vec4(color, intensity * 0.5);
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  useFrame((_, delta) => {
    if (sunShaderMaterial.uniforms) {
      sunShaderMaterial.uniforms.time.value += delta;
    }
    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y += delta * 0.06;
    }
    if (innerCoronaRef.current) {
      const pulse = 1 + Math.sin(sunShaderMaterial.uniforms.time.value * 2.2) * 0.035;
      innerCoronaRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const sunData = useMemo(
    () => ({
      isSun: true,
      id: "sun_42",
      name: "42 Core (Holy Graph)",
      title: ["42", "Core"],
      group: "common",
      tags: ["Root", "42 Network", "Foundation", "Peer-to-Peer"],
      desc: "The heart of the 42 Network — where peer-to-peer pedagogy, practical problem solving, and software craftsmanship ignite.",
      link: "https://42barcelona.com",
    }),
    []
  );

  return (
    <group position={[0, 0, 0]}>
      <mesh
        ref={sunMeshRef}
        material={sunShaderMaterial}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(sunData, [0, 0, 0]);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(sunData, e);
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[14, 48, 48]} />
      </mesh>

      <pointLight color={0x2dd4bf} intensity={3.5} distance={1200} decay={1.2} />
      <pointLight color={0xffffff} intensity={2.0} distance={800} decay={1.5} />

      <mesh ref={innerCoronaRef} material={innerCoronaMaterial}>
        <sphereGeometry args={[17, 24, 24]} />
      </mesh>

      <mesh ref={outerCoronaRef} material={outerCoronaMaterial}>
        <sphereGeometry args={[21, 24, 24]} />
      </mesh>

      <Html position={[0, 21, 0]} center distanceFactor={90} style={{ pointerEvents: "none" }}>
        <div
          style={{
            background: "rgba(6, 16, 34, 0.9)",
            border: "1px solid #14b8a6",
            borderRadius: "10px",
            padding: "5px 14px",
            color: "#ffffff",
            textAlign: "center",
            boxShadow: "0 0 20px rgba(20, 184, 166, 0.6)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: "18px", color: "#2dd4bf", letterSpacing: "1.5px" }}>42</div>
          <div style={{ fontWeight: 700, fontSize: "9.5px", color: "#ffffff", opacity: 0.9 }}>BARCELONA</div>
        </div>
      </Html>
    </group>
  );
}
