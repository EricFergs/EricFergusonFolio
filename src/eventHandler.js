import * as THREE from 'three';
import gsap from 'gsap';
import { cameraAnimate, cameraAnimatePosition } from './animations.js';

export let activeModal = null; 
export const modals = {
    Contact: document.querySelector(".modal.contact"),
    Frieren: document.querySelector(".frieren.modal"),
    Aboutme: document.querySelector(".Aboutme.modal"),
    Education: document.querySelector(".Education.modal"),
    Experience: document.querySelector(".Experience.modal"),
    Project: document.querySelector(".Project.modal")
};

export function setupEventListeners(state, camera, controls, raycaster, pointer, raycasterObjects, modals, renderer) {
    // Window resize event
    window.addEventListener("resize", () => {
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Mouse move event
    window.addEventListener("mousemove", (e) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Mouse click event
    window.addEventListener("click", (e) => {
        handleClick(e, state, camera, raycaster, pointer, raycasterObjects,controls);
    });

    // Back button event
    setupBackButton(state, camera, controls);

    // Navigation buttons
    //setupNavigationButtons(modals);

    // Modal exit buttons
    setupModalExitButtons();
}

function handleClick(e, state, camera, raycaster, pointer, raycasterObjects,controls) {
    if(state.modalView) return;
    raycaster.setFromCamera(pointer, camera);
    const currentIntersects = raycaster.intersectObjects(raycasterObjects);

    if (currentIntersects.length > 0) {
        const object = currentIntersects[0].object;

        // Handle social links
        const socialLinks = {
            "Github": "https://github.com/EricFergs",
            "LinkedIn": "https://www.linkedin.com/in/eric-ferguson-10687225b/"
        };

        Object.entries(socialLinks).forEach(([key, url]) => {
            if (object.name.includes(key)) {
                const newWindow = window.open();
                newWindow.opener = null;
                newWindow.location = url;
                newWindow.target = "_blank";
                newWindow.rel = "noopener noreferrer";
            }
        });

        // Handle camera animations for different objects
        handleCameraAnimations(object, state, camera,controls);
    }
}
export function handleCameraAnimations(object, state, camera, controls) {
    const XAxis = new THREE.Vector3(1, 0, 0);
    if (object.name.includes("Picture")) {
        const objVect = new THREE.Vector3(0, 0.1, 0.7);
        cameraAnimate(object, objVect, 0, 0.3, 0, 1, XAxis, state, camera, modals.Aboutme);
    }
    else if (object.name.includes("Frieren")) {
        const objVect = new THREE.Vector3(0, 0.8, 0.8);
        cameraAnimate(object, objVect, 0, 0, 0.3, 1, XAxis, state, camera, modals.Frieren);
    }
    else if (object.name.includes("Degree")) {
        const objVect = new THREE.Vector3(0, 0.1, 0);
        cameraAnimate(object, objVect, 0, 0, 0, 1, new THREE.Vector3(0, 0, 1.3), state, camera,modals.Education);
    }
    else if (object.name.includes("ScreenBig")) {
        const cameraPosition = new THREE.Vector3(3.996363339720619,5.10974612037147, -2.484212515101146);
        const targetPosition = new THREE.Vector3( 3.35695769929049,5.0716730358333235, -3.9044527120561168);
        cameraAnimatePosition(state, camera, cameraPosition,controls,targetPosition,modals.Project)
    }
    else if (object.name.includes("ScreenSmall")) {
        const cameraPosition = new THREE.Vector3(5.550240951025817,4.949093159051029,-2.435369062903706);
        const targetPosition = new THREE.Vector3(6.4062869385630385,4.480498965798785,-4.162776168818836);
        cameraAnimatePosition(state, camera, cameraPosition,controls,targetPosition,modals.Experience)
    }
}

function setupBackButton(state, camera, controls) {
    const backButton = document.getElementById("back-button");
    
    backButton.addEventListener("click", (e) => {
        if (!state.isAnimating) {
            state.isAnimating = true;
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
                    if(activeModal){
                        hideModal(activeModal);
                    };
                },
                onComplete: () => {
                    controls.target.copy(initialTarget);
                    controls.enabled = true;
                    state.modalView = false;
                    state.isAnimating = false;
                    
                }
            });
        }
    });
}

function setupModalExitButtons() {
    document.querySelectorAll(".modal-exit-button").forEach(button => {
        button.addEventListener("click", (e) => {
            const modal = e.target.closest(".modal");
            hideModal(modal);
        });
    });
}

export function showModal(modal) {
    activeModal = modal; // Set the active modal in the state
    modal.style.display = "block";

    gsap.set(modal, { opacity: 0 });

    gsap.to(modal, {
        opacity: 1,
        duration: 0.5,
    });
}

export function hideModal(modal) {
    gsap.to(modal, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            modal.style.display = "none";
            activeModal = null;
        }
    });
}