import * as THREE from 'three';

let ground_choices = {
    grass1 : 0xbff280
}
let color_choices = Object.keys(ground_choices).map(function(key){
    return ground_choices[key];
});
let colorIndex = 0;

export function makeGround(scene, width, length) {
    const planeGeo = new THREE.PlaneGeometry(width, length);
    const planeMat = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: ground_choices.grass1
    });
    const ground = new THREE.Mesh(planeGeo, planeMat);
    ground.rotation.x = Math.PI * -.5;
    scene.add(ground);
    return ground
}

export function changeGroundColor(ground){
    console.log(color_choices[colorIndex])
    ground.material.color.set(color_choices[2]);
    colorIndex = (colorIndex + 1) % color_choices.length;
}