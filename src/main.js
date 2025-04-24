import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const canvas = document.querySelector("#experience-canvas")
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Loaders
const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/draco/' );

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const textureMap = {
    One: "/textures/SuccesfulBakeOne.webp",
    Two: "/textures/SuccesfulBakeTwo.webp",
    Three: "/textures/SuccesfulBakeThree.webp",
    Four: "/textures/SuccesfulBakeFour.webp"
}
loader.load("/models/Room_Port_compressed.glb", (glb) => {
    glb.scene.traverse((child) => {
        if (child.isMesh) {
            child.visible = true;
            Object.keys(textureMap).forEach((key) => {
                if (child.name.includes(key)){
                    const texture = textureLoader.load(textureMap[key]);
                    texture.flipY = false; 
                    const material = new THREE.MeshBasicMaterial({
                        map: texture
                    });
                    child.material = material
                    if (child.material.map){
                        child.material.map.minFilter = THREE.LinearFilter
                    }
                }
                if(child.name.includes("Glass")){
                    child.material = new THREE.MeshPhysicalMaterial({
                        
                        transmission: 1,
                        opacity: 1,
                        metalness: 0,
                        roughness: 0,
                        ior: 1.5,
                        thickness: 0.01,
                        specularIntensity: 1,
                        envMapIntensity: 1,
                        lightIntensity: 1,
                        exposure: 1,
                        
                    })
                }
            })
        }
        
        
    })
    scene.add(glb.scene)
})
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
const camera = new THREE.PerspectiveCamera( 
    75, 
    sizes.width / sizes.height, 
    0.1,
    1000 );
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))





const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
controls.enableDamping = true; 
controls.dampingFactor = 0.05;

window.addEventListener("resize", ()=>{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const render = () => {
    controls.update()

    renderer.render( scene, camera );

    window.requestAnimationFrame(render)
}

render()