import gsap from "gsap";

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