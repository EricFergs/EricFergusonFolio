import './style.scss';
import * as THREE from 'three';
import { createScene } from './scene.js';
import { createCamera } from './camera.js';
import { setupControls } from './controls.js';
import { setupLoaders } from './loaders.js';
import { playHoverAnimation,performHover, cameraAnimate, animateFans, animateChair } from './animations.js';
import { createOutlinePass } from './OutlinePass.js';
import { initComponents } from '../utils/componentLoader.js';
import { setupEventListeners, handleCameraAnimations, showModal, hideModal, modals} from './eventHandler.js';
import gsap from "gsap"
import { outline } from 'three/examples/jsm/tsl/display/OutlineNode.js';


initComponents().then(() => {
    initializeExperience();
});
  
let picture;
let degree;
//ModalView is when we're veiwing something and don't want camera controls
//IsAnimating is so other animation can't play while we're animating
function initializeExperience() {

const backButton = document.getElementById("back-button")
const state = {
    isAnimating: false,
    modalView: false,
    currentHoveredObject: null,
    get control() {
        return controls.enabled; 
    },
    set control(value) {
        controls.enabled = value; 
    },
    get backButton(){
        return backButton.style.display;
    },
    set backButton(value){
        backButton.style.display = value;
    }
}

const canvas = document.querySelector("#experience-canvas");
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

modals.Contact = document.querySelector(".modal.contact");
modals.Frieren = document.querySelector(".frieren.modal");
modals.Aboutme = document.querySelector(".Aboutme.modal");
modals.Education = document.querySelector(".Education.modal");

const AboutButton = document.getElementById("about_button");
AboutButton.addEventListener("click",(e)=>{
    handleCameraAnimations(picture, state, camera);
})
const ProjectsButton = document.getElementById("projects_button");
ProjectsButton.addEventListener("click",(e)=>{
    showModal(modals.Contact);
})
const ExperienceButton = document.getElementById("experiece_button");
ExperienceButton.addEventListener("click",(e)=>{
    showModal(modals.Contact);
})
const EducationButton = document.getElementById("education_button");
EducationButton.addEventListener("click",(e)=>{
    handleCameraAnimations(degree, state, camera);
})
const contactButton = document.getElementById("contact_button");
contactButton.addEventListener("click",(e)=>{
    showModal(modals.Contact);
})
   


const scene = createScene();
const camera = createCamera(sizes);
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

const controls = setupControls(camera, renderer);
const {gltfLoader, textureLoader, environmentMap} = setupLoaders();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const raycasterObjects = [];
let currentIntersects = [];


const { composer, outlinePass } = createOutlinePass(renderer, scene, camera);
setupEventListeners(state, camera, controls, raycaster, pointer, raycasterObjects, modals,renderer,controls);


const textureMap = {
    One: "/textures/TrueBakeOne.webp",
    Two: "/textures/TrueBakeTwo.webp",
    Three: "/textures/TrueBakeThree.webp",
    Four: "/textures/TrueBakeFour.webp",
    Background: "/textures/TrueBakeFive.webp"
};

const yAxisFans = [];
let chair;
const scaleTargets = ["Frieren", "Github", "LinkedIn","Jigglypuff","Jirachi","Mouse","Headphones","Switch"];

///models/Empty.glb
//
gltfLoader.load("/models/UpdatedUV.glb", (glb) => {
    glb.scene.traverse((child) => {
        if (child.isMesh) {
            child.visible = true;
            Object.keys(textureMap).forEach((key) => {
                if (child.name.includes(key)){
                    const texture = textureLoader.load(textureMap[key]);
                    texture.colorSpace = THREE.SRGBColorSpace
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
                    if (scaleTargets.some(name => child.name.includes(name))) {
                        child.userData.initialScale = new THREE.Vector3().copy(child.scale);
                    }
                    if(child.name.includes("Picture")){
                        picture = child;
                        const myPictureTexture = textureLoader.load('/images/Me.jpg'); 
                        myPictureTexture.flipY = false;
                        myPictureTexture.colorSpace = THREE.SRGBColorSpace
                        picture.material = new THREE.MeshBasicMaterial({
                            map: myPictureTexture
                        });
                    }
                    if (child.name.includes("Degree")){
                        degree = child;
                    }
                    if (child.name.includes("Target")) {
                        child.geometry.computeVertexNormals();
                        raycasterObjects.push(child);
                    }
                    if (child.name.includes("Glow")){
                        outlinePass.selectedObjects.push(child);
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





const render = (timestamp) => {
    if(!state.modalView){
        controls.update();
        outlinePass.enabled = true;
    }else {
        outlinePass.enabled = false; // Disable OutlinePass when modalView is true
    }

    animateChair(chair,timestamp)
    animateFans(yAxisFans)
    

    raycaster.setFromCamera( pointer, camera );
	currentIntersects = raycaster.intersectObjects( raycasterObjects );
	
    if(currentIntersects.length>0 ){
        performHover(currentIntersects,state)
    }else{
        if (state.currentHoveredObject) {
            playHoverAnimation(state.currentHoveredObject, false);
            state.currentHoveredObject = null;}
        document.body.style.cursor = "default";
    }
    // console.log("position", camera.position)
    // console.log(controls.target)
    // renderer.render(scene, camera);
    // To test rendering without the compositor, comment out the composer.render() line.
    composer.render();
    window.requestAnimationFrame(render);
}

render();

}