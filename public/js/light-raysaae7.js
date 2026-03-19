/**
 * Light Rays Background — vanilla WebGL
 * Ported from reactbits.dev/backgrounds/light-rays (OGL + React → raw WebGL)
 * Settings: raysSpeed=1.4, lightSpread=0.8, rayLength=3, fadeDistance=1, saturation=1, mouseInfluence=0.1
 */
(function () {
  'use strict';

  /* ── Config ── */
  const CONFIG = {
    raysOrigin:     'top-center',
    raysColor:      '#ee0000',
    raysSpeed:      1.4,
    lightSpread:    0.8,
    rayLength:      3,
    pulsating:      false,
    fadeDistance:    1.0,
    saturation:     1.0,
    followMouse:    true,
    mouseInfluence: 0.1,
    noiseAmount:    0.0,
    distortion:     0.0
  };

  /* ── Helpers ── */
  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
  }

  function getAnchorAndDir(origin, w, h) {
    const outside = 0.2;
    switch (origin) {
      case 'top-left':       return { anchor: [0, -outside * h],           dir: [0, 1] };
      case 'top-right':      return { anchor: [w, -outside * h],           dir: [0, 1] };
      case 'left':           return { anchor: [-outside * w, 0.5 * h],     dir: [1, 0] };
      case 'right':          return { anchor: [(1 + outside) * w, 0.5 * h],dir: [-1, 0] };
      case 'bottom-left':    return { anchor: [0, (1 + outside) * h],      dir: [0, -1] };
      case 'bottom-center':  return { anchor: [0.5 * w, (1 + outside) * h],dir: [0, -1] };
      case 'bottom-right':   return { anchor: [w, (1 + outside) * h],      dir: [0, -1] };
      default:               return { anchor: [0.5 * w, -outside * h],     dir: [0, 1] };
    }
  }

  /* ── Shaders ── */
  const VERT = `
attribute vec2 position;
varying   vec2 vUv;
void main() {
  vUv         = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const FRAG = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;
uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2  sourceToCoord  = coord - raySource;
  vec2  dirNorm        = normalize(sourceToCoord);
  float cosAngle       = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  float spreadFactor   = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance       = length(sourceToCoord);
  float maxDistance     = iResolution.x * rayLength;
  float lengthFalloff  = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  float fadeFalloff    = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse          = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3  + 0.2  * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);

  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}`;

  /* ── WebGL bootstrap ── */
  var container = document.getElementById('lightRaysContainer');
  if (!container) return;

  var canvas = document.createElement('canvas');
  canvas.style.width  = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
  if (!gl) { console.warn('Light Rays: WebGL not supported'); return; }

  function compileShader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  var vs = compileShader(gl.VERTEX_SHADER, VERT);
  var fs = compileShader(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(prog));
    return;
  }
  gl.useProgram(prog);

  /* Full-screen triangle (covers [-1,1]) */
  var posAttr = gl.getAttribLocation(prog, 'position');
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(posAttr);
  gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

  /* Uniform locations */
  var loc = {};
  ['iTime','iResolution','rayPos','rayDir','raysColor','raysSpeed',
   'lightSpread','rayLength','pulsating','fadeDistance','saturation',
   'mousePos','mouseInfluence','noiseAmount','distortion'].forEach(function (n) {
    loc[n] = gl.getUniformLocation(prog, n);
  });

  /* Mouse tracking */
  var mouse  = { x: 0.5, y: 0.5 };
  var smooth = { x: 0.5, y: 0.5 };

  if (CONFIG.followMouse) {
    window.addEventListener('mousemove', function (e) {
      var rect = container.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
    });
  }

  /* Resize helper */
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W, H;

  function resize() {
    var cw = container.clientWidth;
    var ch = container.clientHeight;
    W = cw * dpr;
    H = ch * dpr;
    canvas.width  = W;
    canvas.height = H;
    gl.viewport(0, 0, W, H);
  }
  window.addEventListener('resize', resize);
  resize();

  /* Static uniforms */
  var rgb = hexToRgb(CONFIG.raysColor);
  gl.uniform3f(loc.raysColor,      rgb[0], rgb[1], rgb[2]);
  gl.uniform1f(loc.raysSpeed,      CONFIG.raysSpeed);
  gl.uniform1f(loc.lightSpread,    CONFIG.lightSpread);
  gl.uniform1f(loc.rayLength,      CONFIG.rayLength);
  gl.uniform1f(loc.pulsating,      CONFIG.pulsating ? 1.0 : 0.0);
  gl.uniform1f(loc.fadeDistance,    CONFIG.fadeDistance);
  gl.uniform1f(loc.saturation,     CONFIG.saturation);
  gl.uniform1f(loc.mouseInfluence, CONFIG.mouseInfluence);
  gl.uniform1f(loc.noiseAmount,    CONFIG.noiseAmount);
  gl.uniform1f(loc.distortion,     CONFIG.distortion);

  /* Animation loop */
  var rafId;
  function loop(t) {
    gl.uniform1f(loc.iTime, t * 0.001);
    gl.uniform2f(loc.iResolution, W, H);

    var placement = getAnchorAndDir(CONFIG.raysOrigin, W, H);
    gl.uniform2f(loc.rayPos, placement.anchor[0], placement.anchor[1]);
    gl.uniform2f(loc.rayDir, placement.dir[0], placement.dir[1]);

    if (CONFIG.followMouse && CONFIG.mouseInfluence > 0) {
      var sm = 0.92;
      smooth.x = smooth.x * sm + mouse.x * (1 - sm);
      smooth.y = smooth.y * sm + mouse.y * (1 - sm);
      gl.uniform2f(loc.mousePos, smooth.x, smooth.y);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);
})();
