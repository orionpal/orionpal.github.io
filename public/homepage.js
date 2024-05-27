import * as THREE from 'three';
import { makeGround } from './base/ground.js'
import { createRenderer, createCamera, createScene } from './base/scene.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// -------------------------- Basic setup --------------------------
const canvas = document.querySelector('#c');
const renderer = createRenderer(canvas)
const camera = createCamera()
const scene = createScene()
const groundWidth = 100;
const groundLength = 200;
const ground = makeGround(scene, groundWidth, groundLength);
// Light to highlight character
const lightDirectional = new THREE.DirectionalLight(0xffffff, 1)
scene.add(lightDirectional)

window.addEventListener( "resize", (event) => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( window.innerWidth, window.innerHeight );
});

// -------------------------- Character object --------------------------
// Just loading in our character guys and their animations
const loader = new GLTFLoader();
let character, mixer, idleAction, walkAction, activeAction;
loader.load('/entities/ani-human.glb', function (gltf) {
    character = gltf.scene;
    character.scale.set(1, 1, 1);
    character.position.set(0, 5, 0);
    scene.add(character);

    mixer = new THREE.AnimationMixer(character);
    gltf.animations.forEach((clip) => {
        console.log('Animation name:', clip.name);
    });


    idleAction = mixer.clipAction(gltf.animations.find(clip => clip.name === 'Human Armature|Idle'));
    walkAction = mixer.clipAction(gltf.animations.find(clip => clip.name === 'Human Armature|Run'));

    idleAction.play();
    activeAction = idleAction;
});


// -------------------------- Controls --------------------------

// capture key events
var keyHash = {};

window.addEventListener('keydown', (event) => {
        keyHash[event.key] = true
        if (walkAction && activeAction !== walkAction) {
            activeAction.stop();
            walkAction.reset().play();
            activeAction = walkAction;
        }
    }
);
window.addEventListener('keyup', (event) => {
        keyHash[event.key] = false
        if (!keyHash['ArrowUp'] && !keyHash['ArrowDown'] && !keyHash['ArrowLeft'] && !keyHash['ArrowRight']) {
            if (idleAction && activeAction !== idleAction) {
                activeAction.stop();
                idleAction.reset().play();
                activeAction = idleAction;
            }
        }
    }
);

const clock = new THREE.Clock();
// Character movement speed
const speed = 0.3;
// Gravity and velocity
const gravity = -0.01;
let velocityY = 0;

function render() {
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    if (character) {
        velocityY += gravity;
        character.position.y += velocityY;
        let moving = false;
        let direction = new THREE.Vector3();

        if (keyHash['ArrowUp']) {
            character.position.z -= speed;
            direction.z = -1;
            moving = true;
        }
        if (keyHash['ArrowDown']) {
            character.position.z += speed;
            direction.z = 1
            moving = true;
        }
        if (keyHash['ArrowLeft']) {
            character.position.x -= speed;
            direction.x = -1
            moving = true;
        } 
        if (keyHash['ArrowRight']) {
            character.position.x += speed;
            direction.x = 1
            moving = true;
        }

        // Don't fall off ground
        if (character.position.x < -groundWidth/4) {
            character.position.x = -groundWidth/4;
        }
        if (character.position.x > groundWidth/4) {
            character.position.x = groundWidth/4
        }
        if (character.position.z < -groundLength/6) {
            character.position.z = -groundLength/6
        }
        if (character.position.z > groundLength / 14) {
            character.position.z = groundLength / 14
        }

        const groundLevel = 5;
        if (character.position.y < groundLevel) {
            character.position.y = groundLevel;
            velocityY = 0;
        }
        if (moving) {
            direction.normalize();
            const angle = Math.atan2(direction.x, direction.z);
            character.rotation.y = angle;
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);