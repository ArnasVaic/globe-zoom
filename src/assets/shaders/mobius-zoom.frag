out vec4 FragColor;
varying vec2 vUv;

uniform float u_time;
uniform float u_zoom;
uniform sampler2D u_texture;
uniform vec2 u_pole;

#define PI 3.1415926535

vec3 sphericalToCartesian(float phi, float theta) {
    return vec3(
        sin(theta) * cos(phi),
        cos(theta),
        sin(theta) * sin(phi)
    );
}

vec2 cartesianToSpherical(vec3 pos) {
    float theta = acos(pos.y); // Polar angle
    float phi = atan(pos.z, pos.x); // Azimuthal angle
    return vec2(phi, theta);
}

mat3 getRotationMatrix(vec3 newPole) {
    // Calculate a rotation matrix to align the new pole
    vec3 zAxis = normalize(newPole); // New pole as Z-axis
    vec3 xAxis = normalize(cross(vec3(0.0, 1.0, 0.0), zAxis));
    vec3 yAxis = cross(zAxis, xAxis);

    return mat3(xAxis, yAxis, zAxis);
}

vec2 zoom(vec2 uv) {
    return vec2(uv.x, pow(uv.y, u_zoom));
}

void main() {

    vec2 pole = u_pole;

    vec2 uv = zoom(vUv);

    // Step 1: Convert UV to spherical coordinates
    float phi = 2.0 * PI * uv.x;    // Longitude
    float theta = PI * (1.0 - uv.y); // Latitude

    // Step 2: Convert spherical to Cartesian coordinates
    vec3 pos = sphericalToCartesian(phi, theta);

    // Step 3: Rotate the position to align the new pole
    vec3 newPoleCartesian = sphericalToCartesian(pole.x, pole.y);
    mat3 rotationMatrix = getRotationMatrix(newPoleCartesian);
    vec3 rotatedPos = rotationMatrix * pos;

    // Step 4: Convert back to spherical coordinates
    vec2 rotatedSpherical = cartesianToSpherical(rotatedPos);

    // Step 5: Map back to UV coordinates
    vec2 newUv;
    newUv.x = (rotatedSpherical.x / (2.0 * PI)) + 0.5; // Normalize longitude
    newUv.y = 1.0 - rotatedSpherical.y / PI;           // Normalize latitude

    vec3 color1 = vec3(.9, .9, 1.0);
    vec3 color2 = vec3(.1, .1, .2);
    float scale = 32.0;
    vec2 scaledUV = newUv * scale;

    scaledUV.x = 2.0 * scaledUV.x;

    // Determine the row and column indices
    int checkerX = int(floor(scaledUV.x));
    int checkerY = int(floor(scaledUV.y));

    // Compute the checkerboard pattern using the parity of the indices
    bool isEven = (checkerX + checkerY) % 2 == 0;

    // Select the color based on the checkerboard pattern
    vec3 color = isEven ? color1 : color2;

    // Set the fragment color
    FragColor = vec4(color, 1.0);
}
