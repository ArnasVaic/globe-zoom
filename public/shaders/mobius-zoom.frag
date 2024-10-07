out vec4 FragColor;
varying vec2 vUv;
uniform sampler2D uTexture;

void main() {
    vec4 color = texture2D(uTexture, vUv);
    FragColor = vec4(color.xyz, 1.0);
}