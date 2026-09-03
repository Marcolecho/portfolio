import gsap from 'gsap';
import * as THREE from 'three'

export class Element{
    constructor(type, colorON, colorOFF, intensityON, intensityOFF, mesh) {

        if (this.constructor == Element) {
            throw new Error('Abstract class');
        }

        this.type = type
        this.colorON = colorON;
        this.colorOFF = colorOFF;
        this.intensityON = intensityON;
        this.intensityOFF = intensityOFF;
        this.mesh = mesh
    }

    setGlow(glow, delay = 0) {
        if (!this.mesh || !this.mesh.material) return;

        const targetIntensity = glow ? this.intensityON : this.intensityOFF;
        const targetColorHex = glow ? this.colorON : this.colorOFF;

        // L'option delay permet de décaler l'exécution
        gsap.to(this.mesh.material, {
            emissiveIntensity: targetIntensity,
            duration: 0.4,
            delay: delay, // <-- Décalage en secondes
            ease: 'power2.out',
            overwrite: 'auto'
        });

        const targetColor = new THREE.Color(targetColorHex);
        gsap.to(this.mesh.material.color, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: 0.4,
            delay: delay,
            ease: 'power2.out'
        });
    }
}