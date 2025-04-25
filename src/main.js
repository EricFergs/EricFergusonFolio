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

const yAxisFans = []
let chair
//Loaders
const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/draco/' );

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const raycasterObjects = []
let currentIntersects = []

const socialLinks = {
    "Github" : "https://github.com/EricFergs",
    "LinkedIn" : "https://www.linkedin.com/in/eric-ferguson-10687225b/"
}


const environmentMap = new THREE.CubeTextureLoader()
	.setPath( 'textures/skybox/' )
	.load(['px.webp','nx.webp','py.webp','ny.webp','pz.webp','nz.webp']);

const textureMap = {
    One: "/textures/TrueBakeOne.webp",
    Two: "/textures/TrueBakeTwo.webp",
    Three: "/textures/TrueBakeThree.webp",
    Four: "/textures/TrueBakeFour.webp",
    Background: "/textures/TrueBakeFive.webp"
}
loader.load("/models/Room_Final_Compressed.glb", (glb) => {
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
                    if (child.name.includes("Target")) {
                        raycasterObjects.push(child);
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



const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd3dddc);
const camera = new THREE.PerspectiveCamera( 
    75, 
    sizes.width / sizes.height, 
    0.1,
    1000 );
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
camera.position.set(14.351001566716521,6.903370258003837,10.906939879591045)



const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 9
controls.maxDistance = 17
controls.minPolarAngle = 0
controls.maxPolarAngle = Math.PI/2
controls.minAzimuthAngle = 0
controls.maxAzimuthAngle = Math.PI/2
controls.update();
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.target.set(1.4315080506416726,1.94168476813741,-2.589729659045444)



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
	for ( let i = 0; i < currentIntersects.length; i ++ ) {
	}
    if(currentIntersects.length>0){
        const currentIntersectsObject = currentIntersects[0].object
        document.body.style.cursor = "pointer"
    }else{
        document.body.style.cursor = "default"
    }
    renderer.render( scene, camera );

    window.requestAnimationFrame(render)
}

render()