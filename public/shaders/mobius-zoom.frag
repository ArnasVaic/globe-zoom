out vec4 FragColor;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec3 uHit;
uniform vec2 uResolution;

#define M_PI 3.1415926535897932384626433832795

void main() {

    // uHit is a 3d vector point from center of sphere to point of hit (may need to update maginute)
    // uHit \in [-1, 1]^2 \times [0, 1]

    // vec2 fragCoord = gl_FragCoord.xy / uResolution.xx; // min(uResolution.x, uResolution.y);
    // float aspect = uResolution.x / uResolution.y;

    // // top left (0, 0)
    // vec2 hit = uPlaneHitCoord.xy + vec2(0.5, 0.5);

    vec4 color = vec4(1.0, 0.0, 0.0, 1.0);

    // if (distance(hit, fragCoord) >= 0.02)
    // {
        color = texture2D(uTexture, vUv);
    // }
    
    FragColor = vec4(color.xyz, 1.0);
    
    // vec3 hit = normalize(uHit);
    // float theta = acos(hit.z);
    // float phi = sign(hit.y) * acos(hit.x / sqrt(hit.x * hit.x + hit.y * hit.y));


    // float x = theta / M_PI;
    // float y = phi / (M_PI);



    // FragColor = vec4(x, y, 0.0, 1.0);
}