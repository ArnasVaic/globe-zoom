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

    FragColor = texture2D(u_texture, newUv);

    // if (distance(zoomedPos, newPoleCartesian) < 0.03)
    // {
    //     FragColor = vec4(1, 0.5, 0.5, 1.0);
    // }
    // else
    // {
        
    // }

    // vec2 newZoomedRotatedSpherical = vec2(2.0 * PI * newUv.x, PI * (1.0 - newUv.y));

    // vec3 rotatedZoomedPos = sphericalToCartesian(newZoomedRotatedSpherical.x, newZoomedRotatedSpherical.y);

    // vec3 zoomedPos = inverse(rotationMatrix) * rotatedZoomedPos;

    // vec2 zoomedSpherical = cartesianToSpherical(zoomedPos);

    // vec2 zoomedUv;
    // zoomedUv.x = (zoomedSpherical.x / (2.0 * PI)) + 0.5; // Normalize longitude
    // zoomedUv.y = 1.0 - zoomedSpherical.y / PI;           // Normalize latitude
}
