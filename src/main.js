import './style.scss';
import * as THREE from 'three';
import { createScene } from './scene.js';
import { createCamera } from './camera.js';
import { setupControls } from './controls.js';
import { setupLoaders } from './loaders.js';
import { playHoverAnimation,performHover, cameraAnimate, animateFans, animateChair } from './animations.js';
import { createOutlinePass } from './OutlinePass.js';
import { initComponents } from '../utils/componentLoader.js';
import gsap from "gsap"


initComponents().then(() => {
    // After components are loaded, initialize the 3D experience
    initializeExperience();
});
  

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


const modals = {
    Contact: document.querySelector(".modal.contact")
};
const AboutButton = document.getElementById("about_button")
AboutButton.addEventListener("click",(e)=>{
    showModal(modals.Contact)
})
const ProjectsButton = document.getElementById("projects_button")
ProjectsButton.addEventListener("click",(e)=>{
    showModal(modals.Contact)
})
const ExperienceButton = document.getElementById("experiece_button")
ExperienceButton.addEventListener("click",(e)=>{
    showModal(modals.Contact)
})
const EducationButton = document.getElementById("education_button")
EducationButton.addEventListener("click",(e)=>{
    showModal(modals.Contact)
})
const contactButton = document.getElementById("contact_button")
contactButton.addEventListener("click",(e)=>{
    showModal(modals.Contact)
})
   

document.querySelectorAll(".modal-exit-button").forEach(button=>{
    button.addEventListener("click",(e)=>{
        const modal = e.target.closest(".modal");
        hideModal(modal);
    })
})

backButton.addEventListener("click", (e) => {
    if (!state.isAnimating) {
        state.isAnimating = true
        backButton.style.display = "none";
        const initialCameraPos = new THREE.Vector3(14.351001566716521, 6.903370258003837, 10.906939879591045);
        const initialTarget = new THREE.Vector3(1.43, 1.94, -2.58);
        gsap.to(camera.position, {
            duration: 2,
            x: initialCameraPos.x,
            y: initialCameraPos.y,
            z: initialCameraPos.z,
            onUpdate: () => {
            camera.lookAt(initialTarget);
            },
            onComplete: () => {
                controls.target.copy(initialTarget);
                controls.enabled = true;
                state.modalView = false;
                state.isAnimating = false
                console.log("back button was fired");
        }
    });
    }
});

const showModal = (modal) => {
    modal.style.display = "block";

    gsap.set(modal, {opacity: 0});

    gsap.to(modal, {
        opacity:1,
        duration: 0.5,
    });
};
const hideModal = (modal) => {
    gsap.to(modal, {
        opacity:0,
        duration: 0.5,
        onComplete: ()=> {
            modal.style.display = "none";
        }
    });
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
                    // texture.colorSpace = THREE.SRGBColorSpace
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

const XAxis = new THREE.Vector3(1, 0, 0);
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

        if (object.name.includes("Picture")) {
            
            const objVect = new THREE.Vector3(0,0.2,0.5);
            cameraAnimate(object,objVect,0,0,0,1,XAxis,state,camera);
        }
        else if (object.name.includes("Frieren")){
            const objVect = new THREE.Vector3(0,0.8,0.4);
            cameraAnimate(object,objVect,0,0,0.3,1,XAxis,state,camera);
        }
        else if (object.name.includes("Degree")){
            const objVect = new THREE.Vector3(0,0.1,0);
            cameraAnimate(object,objVect,0,0,0,1,new THREE.Vector3(0, 0, 1.3),state,camera);
        }
        else if (object.name.includes("ScreenBig")){
            const objVect = new THREE.Vector3(0,0,0);
            cameraAnimate(object,objVect,0,0,0,1,new THREE.Vector3(0.4, 0, 1.3),state,camera);
        }
        else if(object.name.includes("ScreenSmall")){
            const objVect = new THREE.Vector3(0,0,0);
            cameraAnimate(object,objVect,0,0,0,1,new THREE.Vector3(-0.3, 0, 1.3),state,camera);
        }
    }

    
})


const render = (timestamp) => {
    if(!state.modalView){
        controls.update();
    };
    
    animateChair(chair,timestamp)
    animateFans(yAxisFans)
    

    raycaster.setFromCamera( pointer, camera );
	currentIntersects = raycaster.intersectObjects( raycasterObjects );
	
    if(currentIntersects.length>0){
        document.body.style.cursor = "pointer";
        performHover(currentIntersects,state)
    }else{
        if (state.currentHoveredObject) {
            playHoverAnimation(state.currentHoveredObject, false);
            state.currentHoveredObject = null;}
        document.body.style.cursor = "default";
    }
    
    // renderer.render(scene, camera);
    // To test rendering without the compositor, comment out the composer.render() line.
    composer.render();
    window.requestAnimationFrame(render);
}

render();

}