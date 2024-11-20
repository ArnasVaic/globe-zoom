import * as THREE from 'three';
import vertexShader from "./assets/shaders/mobius-zoom.vert"
import fragmentShader from "./assets/shaders/mobius-zoom.frag"
import earth from "./assets/textures/earth.jpg"

let scene, camera, renderer, sphere, clock;

let zoom_factor = 1

// Initialize the scene
function init() {
    // Scene, Camera, Renderer
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 3;

    // Sphere with Shader Material
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const texture = new THREE.TextureLoader().load(earth);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            u_texture: { value: texture },
            u_time: { value: 0 },
            u_zoom_factor: { value: zoom_factor },
            u_new_pole: { value: new THREE.Vector2(0.1, 0.000001) }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        glslVersion: THREE.GLSL3,
    });

    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Event Listeners
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    clock.start()
    animate();
}

// Key press event handler
function onKeyDown(event) {
    let speed = 0.05

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    switch (event.key) {
        case 'ArrowRight':
            sphere.rotation.y -= speed
            break;
        case 'ArrowLeft':
            sphere.rotation.y += speed
            break;
        case 'ArrowUp':
            sphere.rotation.x += speed
            break;
        case 'ArrowDown':
            sphere.rotation.x -= speed
            break;
        case 'w':
            zoom_factor += speed;
            zoom_factor = clamp(zoom_factor, 1/4, 4)
            sphere.material.uniforms.u_zoom_factor.value = zoom_factor
            break;
        case 's':
            zoom_factor -= speed;
            zoom_factor = clamp(zoom_factor, 1/4, 4)
            sphere.material.uniforms.u_zoom_factor.value = zoom_factor
            break;
    }

    // Update material uniforms
    // sphere.material.uniforms.uvOffset.value.set(uvOffsetX, uvOffsetY);
    // sphere.material.uniforms.stretchFactor.value = stretchFactor;
}

// Key release event handler
function onKeyUp(event) {
    if (event.key === 'w') {
        // stretchFactor = 1.0;  // Reset the stretch factor
        // sphere.material.uniforms.stretchFactor.value = stretchFactor;
    }
}

// Animation loop
function animate() {
    sphere.material.uniforms.u_time.value = clock.getElapsedTime();

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
