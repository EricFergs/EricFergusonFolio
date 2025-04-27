import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import * as THREE from 'three';

export function createOutlinePass(renderer, scene, camera) {
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    
    const outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        scene,
        camera
    );

    outlinePass.edgeStrength = 1.1; 
    outlinePass.edgeGlow = 2.0; 
    outlinePass.edgeThickness = 2.0; 
    outlinePass.visibleEdgeColor.set('#FFFFFF'); 
    outlinePass.hiddenEdgeColor.set('#FFFFFF'); 

    composer.addPass(outlinePass);

    window.addEventListener('resize', () => {
        composer.setSize(window.innerWidth, window.innerHeight);
        outlinePass.resolution.set(window.innerWidth, window.innerHeight);
    });

    return { composer, outlinePass };
}