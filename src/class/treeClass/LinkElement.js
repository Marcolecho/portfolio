import { Element } from "./Element";

export class LinkElement extends Element{
    constructor(type, NodeElement1, NodeElement2, colorON, colorOFF, intensityON, intensityOFF, mesh) {
        super(type, colorON, colorOFF, intensityON, intensityOFF, mesh)
        this.NodeElement1 = NodeElement1;
        this.NodeElement2 = NodeElement2;
    }
}