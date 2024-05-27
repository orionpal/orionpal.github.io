import * as THREE from 'three';

export function createRenderer(canvas) {
    // Renderer that does legwork
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight)
    return renderer
}

export function createCamera() {
    // Camera that uses the renderer on a scene
    const fov = 45;     // field of view?
    const aspect = window.innerWidth / window.innerHeight;;   // the canvas default, x-dim / y-dim
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 15, 30);
    var point = new THREE.Vector3(0, 10, 0);

    camera.lookAt(point);
    return camera
}

export function createScene() {
    // Scene that has the objects we want to look at
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7fe4ff);

    // Ambient light
    const color = 0xFFFFFF; // 0x9eaeff
    const intensity = 0.5;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
    return scene
}

