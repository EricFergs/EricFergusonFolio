import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three';

export function setupLoaders(loadingManager){
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/draco/' );

    const gltfLoader = new GLTFLoader(loadingManager);
    gltfLoader.setDRACOLoader(dracoLoader);

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const environmentMap = new THREE.CubeTextureLoader(loadingManager)
                                .setPath('textures/skybox/')
                                .load(['px.webp','nx.webp','py.webp','ny.webp','pz.webp','nz.webp']);
    return {gltfLoader, textureLoader, environmentMap};
};


