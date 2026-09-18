import { Element } from "./Element";

export class NodeElement extends Element{
  constructor(id, name, description, linkHTML, type, family, positionOrigin, colorON, colorOFF, intensityON, intensityOFF, mesh) {
    super(type, colorON, colorOFF, intensityON, intensityOFF, mesh)
    this.id = id
    this.name = name
    this.description = description
    this.linkHTML= linkHTML
    this.family = family
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