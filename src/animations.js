import gsap from "gsap";
import * as THREE from 'three';

export function playHoverAnimation(object, isHovering){
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

export function cameraAnimate(mesh,objVect,camX,camY,camZ,dist,offsetDirection,state,camera){
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
        }
    });
    
}