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

    setGlow(glow) {
        if (!this.mesh || !this.mesh.material) return;

        const activeColor = glow ? this.colorON : this.colorOFF;
        const intensity = glow ? this.intensityON : this.intensityOFF;

        this.mesh.material.color.setHex(activeColor);
        if (this.mesh.material.emissive) {
            this.mesh.material.emissive.setHex(activeColor);
            this.mesh.material.emissiveIntensity = intensity;
        }
    }
}