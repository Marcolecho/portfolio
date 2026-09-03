import { Element } from "./Element";

export class NodeElement extends Element{
  constructor(id, name, type, positionOrigin, colorON, colorOFF, intensityON, intensityOFF, mesh) {
    super(type, colorON, colorOFF, intensityON, intensityOFF, mesh)
    this.id = id
    this.name = name
    this.positionOrigin = positionOrigin;
    this.childrens = []
    this.parent = null
  }

  addChildren(node){
    this.childrens.push(node)
  }

  addParent(node){
    this.parent = node
  }
}