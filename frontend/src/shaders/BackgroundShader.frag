precision mediump float;

uniform float uTime;
varying vec2 vUv;

vec3 erot(vec3 p, vec3 ax, float ro) {
    return mix(dot(p, ax) * ax, p, cos(ro)) + sin(ro) * cross(ax, p);
}

float hash(vec3 x) {
    return fract(sin(dot(x, vec3(12.9898, 78.233, 54.53))) * 43758.5453123);
}

float waveletNoise(vec3 p, float z, float k) {
    float d = 0.0, s = 1.0, m = 0.0, a;
    for (int i = 0; i < 3; i++) {
        vec3 q = p * s;
        vec3 g = fract(floor(q) * vec3(123.34, 233.53, 314.15));
        g += dot(g, g + 23.234);
        a = fract(g.x * g.y) * 1e3 + z * (mod(g.x + g.y, 2.0) - 1.0);
        q = fract(q) - 0.5;
        q = erot(q, normalize(tan(g + 0.1)), a);
        d += sin(q.x * 10.0 + z) * smoothstep(0.25, 0.0, dot(q, q)) / s;
        p = erot(p, normalize(vec3(-1, 1, 0)), atan(sqrt(2.0))) + float(i);
        m += 1.0 / s;
        s *= k;
    }
    return d / m;
}

float starfield(vec3 p) {
    float density = 20.0;
    vec3 ip = floor(p * density);
    vec3 fp = fract(p * density);
    float d = length(fp - vec3(0.5));
    float star = step(0.02, 0.02 - d) * hash(ip);
    return clamp(star, 0.0, 1.0);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= 1.0;

    vec3 dir = normalize(vec3(uv, 1.0));
    float time = uTime * 0.3; // SAKTA rörelse

    vec3 from = vec3(0.0, 0.0, -2.0 + time * 0.2);

    float s = 0.1;
    float fade = 1.0;
    vec3 color = vec3(0.0);

    for (int i = 0; i < 20; i++) {
        vec3 p = from + s * dir;
        vec3 p2 = p * 2.5;
        float a = waveletNoise(p2, 0.0, 1.9) * 2.0 - 1.0;
        a *= a * a;
        color += vec3(s, s * s, s * s * s * s) * a * -6.0 * fade;
        fade *= 0.93;
        s += 0.04;
    }

    float stars = starfield(from + dir * 2.0);
    color += vec3(stars);

    color = mix(vec3(length(color)), color, 0.9);
    color = clamp(color * 0.01, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
}
