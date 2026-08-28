import { ShapeFactory } from './webgl/ShapeFactory.js';
import { SceneManager } from './webgl/SceneManager.js';
import * as THREE from 'three'

const canvas = document.getElementById('webgl-canvas');
const scenemanager = new SceneManager(canvas);
const shapeFactory = new ShapeFactory(scenemanager.getScene());

const pointA = new THREE.Vector3(-2, 2, 0);
const pointB = new THREE.Vector3(3, 2, -2);
const pointC = new THREE.Vector3(10, 2, 4);
const pointD = new THREE.Vector3(10, 2, 10);

shapeFactory.create('cylinder', {
    position: pointA,
    radiusTop: 1,
    radiusBottom: 1,
    height: 1,
    radialSegments: 6,
    color: 0x1CFFEC,
    intensity: 0.8
});
shapeFactory.create('cylinder', {
    position: pointB,
    radiusTop: 1,
    radiusBottom: 1,
    height: 1,
    radialSegments: 6,
    color: 0x1CFFEC,
    intensity: 0.8
});
shapeFactory.create('cylinder', {
    position: pointC,
    radiusTop: 1,
    radiusBottom: 1,
    height: 1,
    radialSegments: 6,
    color: 0x0EA194,
    intensity: 0
});
shapeFactory.create('cylinder', {
    position: pointD,
    radiusTop: 1,
    radiusBottom: 1,
    height: 1,
    radialSegments: 6,
    color: 0x0EA194,
    intensity: 0
});

shapeFactory.create('cable', {
    p1: pointA,
    p2: pointB,
    radius: 0.1,
    color: 0x00f3ff,
    intensity: 0.8
});
shapeFactory.create('cable', {
    p1: pointB,
    p2: pointC,
    radius: 0.1,
    color: 0x0EA194,
    intensity: 0
});
shapeFactory.create('cable', {
    p1: pointC,
    p2: pointD,
    radius: 0.1,
    color: 0x0EA194,
    intensity: 0
});

scenemanager.render(() => {});