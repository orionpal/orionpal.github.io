import * as THREE from 'three';


function makeGround(scene) {
    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
}

function main() {
    // How we access the HTML
    const canvas = document.querySelector('#c');

    // Renderer that does legwork
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setSize(window.innerWidth, window.innerHeight)

    // Camera that uses the renderer on a scene
    const fov = 90;     // field of view?
    const aspect = 2;   // the canvas default, x-dim / y-dim
    const near = 0.1;   // Not sure what this does
    const far = 100;      // Not sure what this does
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);
    
    // Scene that has the objects we want to look at
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7fe4ff);

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);

    //makeGround(scene);
    // Make a lil boxxy box
    const boxWidth = 10;
    const boxHeight = 10;
    const boxDepth = 10;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});

    // Mesh is represented by:
    // 1. Geometry, boundaries of a shape
    // 2. Material, the texture and colors of the shape
    // 3. Position, where the shape exists in the world
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Function to call for animation
    function render(time) {
        time *= 0.001;  // convert time to seconds
    
        cube.rotation.x = time;
        cube.rotation.y = time;
    
        renderer.render(scene, camera);
    
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


main();