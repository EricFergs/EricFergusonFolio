import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three';

export function setupLoaders(){
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/draco/' );

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const textureLoader = new THREE.TextureLoader();
    const environmentMap = new THREE.CubeTextureLoader()
                                .setPath('textures/skybox/')
                                .load(['px.webp','nx.webp','py.webp','ny.webp','pz.webp','nz.webp']);
    return {gltfLoader, textureLoader, environmentMap};
};


