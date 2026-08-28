export const gitTreeData = [
  {
    id: "root",
    label: "Racine (Début d'études)",
    type: "root",
    position: { x: 0, y: 0, z: 0 },
    children: ["branch-formation", "branch-projets"]
  },
  {
    id: "branch-formation",
    label: "Formation",
    type: "branch",
    position: { x: -3, y: 3, z: -1 },
    children: ["leaf-ingénieur"]
  },
  {
    id: "leaf-ingénieur",
    label: "Diplôme Ingénieur Informatique",
    type: "leaf",
    category: "Formation",
    date: "2024 - 2026",
    description: "Spécialisation en génie logiciel et architecture 3D.",
    position: { x: -5, y: 6, z: -2 }
  },
  {
    id: "branch-projets",
    label: "Projets",
    type: "branch",
    position: { x: 3, y: 3, z: 1 },
    children: ["leaf-portfolio"]
  },
  {
    id: "leaf-portfolio",
    label: "Portfolio Git 3D Néon",
    type: "leaf",
    category: "Projets",
    date: "2026",
    description: "Portfolio interactif développé avec Three.js et WebGL.",
    position: { x: 5, y: 7, z: 2 }
  }
];