import gsap from "gsap";
import * as THREE from 'three';
import {showModal, hideModal } from './eventHandler.js';

export function playHoverAnimation(object, isHovering){
    if (!object || !object.userData || !object.userData.initialScale) {
        console.warn("Cannot animate object without initialScale:", object?.name);
        return;
    }

    
    let scale = 1.2;
    
    gsap.killTweensOf(object.scale);
    if (isHovering) {
            // Scale animation for all objects
        gsap.to(object.scale, {
            x: object.userData.initialScale.x * scale,
            y: object.userData.initialScale.y * scale,
            z: object.userData.initialScale.z * scale,
            duration: 0.5,
            ease: "back.out(2)",
    })}else{
        // Reset scale for all objects
        gsap.to(object.scale, {
          x: object.userData.initialScale.x,
          y: object.userData.initialScale.y,
          z: object.userData.initialScale.z,
          duration: 0.3,
          ease: "back.out(2)",
    })}
}
export function cameraAnimatePosition(state,camera,position,controls,target){
    if(state.isAnimating) return;

    state.isAnimating = true;
    state.control = false;
    state.modalView = true;
    gsap.to(camera.position, {
        duration: 2,
        x: position.x,
        y: position.y,
        z: position.z, 
        onUpdate: () => {
            camera.lookAt(target);
            
        },
        onComplete: () => {
            controls.target.set(target)
            state.backButton = "block";
            state.isAnimating = false;
        }
    });
    
}
export function cameraAnimate(mesh,objVect,camX,camY,camZ,dist,offsetDirection,state,camera,modal){
    if(state.isAnimating) return;

    state.isAnimating = true;
    state.modalView = true;
    state.control = false;
    

    const objectPosition = new THREE.Vector3();
    mesh.getWorldPosition(objectPosition);
    objectPosition.add(objVect);

    const cameraDistance = dist; 
    const cameraTargetPos = objectPosition.clone().add(offsetDirection.multiplyScalar(cameraDistance));

    gsap.to(camera.position, {
        duration: 2,
        x: cameraTargetPos.x + camX,
        y: cameraTargetPos.y + camY,
        z: cameraTargetPos.z + camZ,
        onUpdate: () => {
            camera.lookAt(objectPosition);
        },
        onComplete: () => {
            state.backButton = "block";
            state.isAnimating = false;
            showModal(modal)
        }
    });
    
}

export function animateFans(yAxisFans){
    yAxisFans.forEach(fan => {
            fan.rotation.x += 0.03;
    });  
}

export function animateChair(chair,timestamp){
    if (!chair) return;
    
    const time = timestamp * 0.001;
    const baseAmplitude = Math.PI / 8;

    const rotationOffset =
        baseAmplitude *
        Math.sin(time * 0.5) *
        (1 - Math.abs(Math.sin(time * 0.5)) * 0.3);

    chair.rotation.y = chair.userData.initialRotation.y + rotationOffset;
}

const hoverTargets = ["Frieren", "Github", "LinkedIn","Jigglypuff","Jirachi","Mouse","Headphones","Switch"];
const pointerTargets = ["Frieren", "Github", "LinkedIn","Degree","Screen","Picture"];

export function performHover(currentIntersects,state){
    const currentIntersectsObject = currentIntersects[0].object
    if(pointerTargets.some(name => currentIntersectsObject.name.includes(name))){
        document.body.style.cursor = "pointer";
    }
    if (hoverTargets.some(name => currentIntersectsObject.name.includes(name))){
        if(currentIntersectsObject !== state.currentHoveredObject){
            if (state.currentHoveredObject) {
                playHoverAnimation(state.currentHoveredObject, false);
            }
            state.currentHoveredObject = currentIntersectsObject
            playHoverAnimation(state.currentHoveredObject, true);
        }
    }else{
        if (state.currentHoveredObject){
            playHoverAnimation(state.currentHoveredObject, false);
            state.currentHoveredObject = null;
        }
    }
}
