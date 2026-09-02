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
}