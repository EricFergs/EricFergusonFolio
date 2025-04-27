import * as THREE from 'three';

export function createCamera(sizes) {
    const camera = new THREE.PerspectiveCamera( 
        75, 
        sizes.width / sizes.height, 
        0.1,
        1000);
    camera.position.set(14.35,6.90,10.90);
    return camera;
}