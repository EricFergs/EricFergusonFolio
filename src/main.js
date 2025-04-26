import './style.scss';
import * as THREE from 'three';
import { createScene } from './scene.js';
import { createCamera } from './camera.js';
import { setupControls } from './controls.js';
import { setupLoaders } from './loaders.js';
import { playHoverAnimation } from './animations.js';
import { createOutlinePass } from './OutlinePass.js';

const canvas = document.querySelector("#experience-canvas");
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const scene = createScene();
const camera = createCamera(sizes);
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = setupControls(camera, renderer);
const {gltfLoader, textureLoader, environmentMap} = setupLoaders();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const raycasterObjects = [];
let currentIntersects = [];
let currentHoveredObject = null;

const { composer, outlinePass } = createOutlinePass(renderer, scene, camera);


const textureMap = {
    One: "/textures/TrueBakeOne.webp",
    Two: "/textures/TrueBakeTwo.webp",
    Three: "/textures/TrueBakeThree.webp",
    Four: "/textures/TrueBakeFour.webp",
    Background: "/textures/TrueBakeFive.webp"
};

const yAxisFans = [];
let chair;


gltfLoader.load("/models/Room_Final_Compressed.glb", (glb) => {
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
                    if(child.name.includes("Fan")){
                        yAxisFans.push(child)
                    }
                    if(child.name.includes("Chair")){
                        chair = child
                        child.userData.initialRotation = new THREE.Euler().copy(child.rotation);
                    }
                    if(child.name.includes("Frieren")){ 
                        child.userData.initialScale = new THREE.Vector3().copy(child.scale);
                    }
                    if(child.name.includes("Github")){
                        child.userData.initialScale = new THREE.Vector3().copy(child.scale);
                    }
                    if(child.name.includes("LinkedIn")){
                        child.userData.initialScale = new THREE.Vector3().copy(child.scale);
                    }
                    if (child.name.includes("Target")) {
                        child.geometry.computeVertexNormals();
                        raycasterObjects.push(child);
                        outlinePass.selectedObjects.push(child)
                    }
                }
                if(child.name.includes("Glass")){
                    child.material = new THREE.MeshPhysicalMaterial({
                        envMap : environmentMap,
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


const socialLinks = {
    "Github" : "https://github.com/EricFergs",
    "LinkedIn" : "https://www.linkedin.com/in/eric-ferguson-10687225b/"
}


window.addEventListener("resize", ()=>{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener("mousemove", (e) => {
    pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
})

window.addEventListener("click",(e) =>{
    if(currentIntersects.length > 0){
        const object = currentIntersects[0].object

        Object.entries(socialLinks).forEach(([key, url]) => {
            if(object.name.includes(key)){
                const newWindow = window.open()
                newWindow.opener = null
                newWindow.location = url
                newWindow.target= "_blank"
                newWindow.rel = "noopener noreferrer"
            }
        })
    }
})


const render = (timestamp) => {
    controls.update()

    yAxisFans.forEach(fan => {
        fan.rotation.x += 0.03
    })
    if(chair) {
        const time = timestamp * 0.001;
        const baseAmplitude = Math.PI / 8;
    
        const rotationOffset =
          baseAmplitude *
          Math.sin(time * 0.5) *
          (1 - Math.abs(Math.sin(time * 0.5)) * 0.3);
    
        chair.rotation.y = chair.userData.initialRotation.y + rotationOffset;
    }

    raycaster.setFromCamera( pointer, camera );
	currentIntersects = raycaster.intersectObjects( raycasterObjects );
	
    if(currentIntersects.length>0){
        const currentIntersectsObject = currentIntersects[0].object
        document.body.style.cursor = "pointer"
        if (currentIntersectsObject.name.includes("Frieren") || currentIntersectsObject.name.includes("Github") || currentIntersectsObject.name.includes("LinkedIn")){
            if(currentIntersectsObject !== currentHoveredObject){
                if (currentHoveredObject) {
                    playHoverAnimation(currentHoveredObject, false);
                }
                currentHoveredObject = currentIntersectsObject
                playHoverAnimation(currentHoveredObject, true);
            }
        }else{
            if (currentHoveredObject){
                playHoverAnimation(currentHoveredObject, false);
                currentHoveredObject = null;
            }
        }
    }else{
        if (currentHoveredObject) {
            playHoverAnimation(currentHoveredObject, false);
            currentHoveredObject = null;
        }
        document.body.style.cursor = "default"
    }
    // renderer.render( scene, camera );
    composer.render();

    window.requestAnimationFrame(render)
}

render()