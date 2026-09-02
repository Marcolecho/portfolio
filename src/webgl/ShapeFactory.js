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

    createCylinder({position, radius, height, radialSegments, color, intensity}) {
        const geometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments);
        
        const material = this.createNeonMaterial(color, intensity);
        
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.copy(position);
        this.scene.add(cylinder);

        return cylinder;
    }

    createSphere({position, radius, segments, color, intensity}) {
        const geometry = new THREE.SphereGeometry(radius, segments, segments);
        const material = this.createNeonMaterial(color, intensity);
        const sphere = new THREE.Mesh(geometry, material);

        sphere.position.copy(position);
        this.scene.add(sphere);

        return sphere;
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
            case 'root':
                return this.createCylinder(config);
            case 'branch':
                return this.createCylinder(config);
            case 'leaf':
                return this.createSphere(config);
            case 'cable':
                return this.createCable(config);
            default:
                console.warn(`unknown shape: ${type}`);
                return null;
        }
    }
}