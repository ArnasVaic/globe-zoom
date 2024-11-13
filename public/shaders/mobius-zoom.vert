varying vec2 vUv;

const float PI = 3.1415926535897932384626433832795028841971693993751058209749;

float getPhi(in float y, in float x) {
    if(x == 0.0) {
        if(y == 0.0) {
            return 0.0;
        } else if(y > 0.0) {
            return PI / 2.0;
        } else {
            return -1.0 * PI / 2.0;
        }
    } else if(x > 0.0) {
        return atan(y / x);
    } else if(x < 0.0) {
        if(y >= 0.0) {
            return atan(y / x) + PI;
        } else {
            return atan(y / x) + PI;
        }
    }
}

vec3 toPolar(in vec3 cart) {
    float xySquared = (cart.x * cart.x) + (cart.y * cart.y);
    float radius = sqrt(xySquared + (cart.z * cart.z));
    return vec3(radius, atan(sqrt(xySquared), cart.z), getPhi(cart.y, cart.x));
}

vec3 toCartesian(in vec3 sph) {
    return vec3(sin(sph.y) * cos(sph.z) * sph.x, sin(sph.y) * sin(sph.z) * sph.x, cos(sph.y) * sph.x);
}

float psin(float a, float L) {
    return 2.0 * L * sin(a) / (cos(a) * (L * L - 1.0) + 1.0 + L * L);
}

float pcos(float a, float L) {
    float numer = cos(a) * (L * L + 1.0) - 1.0 + L * L;
    float denum = cos(a) * (L * L - 1.0) + 1.0 + L * L;
    return numer / denum;
}

void main() {
    vUv = uv;

    vec3 polar = toPolar(position);

    float phi = polar.z;
    float theta = polar.y;
    float L = 0.5;

    float y = sin(theta) * pcos(phi, L);
    float z = sin(theta) * psin(phi, L);
    float x = cos(theta);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
}