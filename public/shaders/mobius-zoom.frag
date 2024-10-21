out vec4 FragColor;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uPlaneHitCoord;
uniform vec2 uResolution;

void main() {

    vec2 fragCoord = gl_FragCoord.xy / uResolution; // min(uResolution.x, uResolution.y);
    float aspect = uResolution.x / uResolution.y;

    // top left (0, 0)
    vec2 hit = uPlaneHitCoord.xy + vec2(0.5, 0.5);

    vec4 color = vec4(1.0, 0.0, 0.0, 1.0);

    if (distance(hit, fragCoord) >= 0.1)
    {
        color = texture2D(uTexture, vUv);
    }
    
    FragColor = vec4(color.xyz, 1.0);
}