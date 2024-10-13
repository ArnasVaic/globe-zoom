out vec4 FragColor;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uPlaneHitCoord;
uniform vec2 uResolution;

void main() {

    vec2 fragCoord = gl_FragCoord.xy / uResolution;

    //vec2 dist = uPlaneHitCoord + vec2(.5, .5) - gl_PointCoord.xy;
    vec4 color = texture2D(uTexture, vUv);
    FragColor = vec4(color.xyz, 1.0);
    // if(dist.x * dist.x + dist.y * dist.y > .1)
    // {
    //     FragColor = vec4(1.0, 0.0, 0.0, 1.0);    
    // }
    // else
    // {
    //     vec4 color = texture2D(uTexture, vUv);
    //     FragColor = vec4(color.xyz, 1.0);
    // }
}