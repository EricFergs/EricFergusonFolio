import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import * as THREE from 'three';

export function createOutlinePass(renderer, scene, camera) {
    // Initialize EffectComposer
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // Initialize OutlinePass
    const outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        scene,
        camera
    );

    // Configure OutlinePass properties
    outlinePass.edgeStrength = 1.1; // Strength of the outline
    outlinePass.edgeGlow = 2.0; // Glow intensity
    outlinePass.edgeThickness = 2.0; // Thickness of the outline
    outlinePass.visibleEdgeColor.set('#FFFFFF'); // Color of the visible edges
    outlinePass.hiddenEdgeColor.set('#FFFFFF'); // Color of the hidden edges

    composer.addPass(outlinePass);

    // Handle window resize
    window.addEventListener('resize', () => {
        composer.setSize(window.innerWidth, window.innerHeight);
        outlinePass.resolution.set(window.innerWidth, window.innerHeight);
    });

    return { composer, outlinePass };
}