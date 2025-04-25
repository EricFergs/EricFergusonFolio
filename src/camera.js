import * as THREE from 'three';


export function createCamera(sizes) {
    const camera = new THREE.PerspectiveCamera( 
        75, 
        sizes.width / sizes.height, 
        0.1,
        1000);
    camera.position.set(14.351001566716521,6.903370258003837,10.906939879591045);
    return camera;
}