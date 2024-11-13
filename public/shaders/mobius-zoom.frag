uniform float u_zoom;
uniform float u_rotationAngle;
uniform sampler2D u_texture;
uniform vec2 u_clickUv;
varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(u_texture, vUv);

}