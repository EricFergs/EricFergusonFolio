import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export function setupControls(camera, renderer){
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 9;
    controls.maxDistance = 20;
    controls.minPolarAngle = Math.PI/6;
    controls.maxPolarAngle = Math.PI/2.5;
    controls.minAzimuthAngle = 0;
    controls.maxAzimuthAngle = Math.PI/2.1;
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;
    controls.target.set(1.43,1.94,-2.58)
    controls.update();
    return controls;
}