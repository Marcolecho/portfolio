import * as THREE from 'three'

export class ShapeFactory {
    constructor(scene) {
        this.scene = scene;
    }

    createNeonMaterial(color, intensity) {
        return new THREE.MeshStandardMaterial({
            color: color, 
            emissive: color,            
            emissiveIntensity: intensity,     
            metalness: 0.3,
            flatShading: true 
        });
    }

    createCylinder({position, radiusTop, radiusBottom, height, radialSegments, color, intensity}) {
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        
        const material = this.createNeonMaterial(color, intensity);
        
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.copy(position);
        this.scene.add(cylinder);

        return cylinder;
    }

    createCable({p1, p2, radius, color, intensity}) {
        const path = new THREE.LineCurve3(p1, p2);

        const geometry = new THREE.TubeGeometry(path, 1, radius, 10, false);

        const material = this.createNeonMaterial(color, intensity);

        const cable = new THREE.Mesh(geometry, material);
        this.scene.add(cable);

        return cable;
    }

    create(type, config) {
        switch (type) {
        case 'cylinder':
            return this.createCylinder(config);
        case 'cable':
            return this.createCable(config);
        default:
            console.warn(`unknown shape: ${type}`);
            return null;
        }
    }
}