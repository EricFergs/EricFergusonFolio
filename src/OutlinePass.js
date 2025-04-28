import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import * as THREE from 'three';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';


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
    if (renderer.outputEncoding === THREE.sRGBEncoding) {
        composer.renderTarget1.texture.encoding = THREE.sRGBEncoding;
        composer.renderTarget2.texture.encoding = THREE.sRGBEncoding;
    }

    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    

    window.addEventListener('resize', () => {
        composer.setSize(window.innerWidth, window.innerHeight);
        outlinePass.resolution.set(window.innerWidth, window.innerHeight);
    });

    return { composer, outlinePass };
}