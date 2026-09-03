


export class FileExplorerManager {
    constructor(listNodeElement, treeManager) {
        this.listNodeElement = listNodeElement
        this.treeManager = treeManager
    }

    createStructureFolder() {
        const sectionExplorer = document.getElementById('file-explorer');
        sectionExplorer.innerHTML = ''; 

        const folderContainers = new Map();

        this.listNodeElement.forEach(node => {
            if (node.type === "root") return;

            if (node.type === "branch") {
                
                const details = document.createElement('details');
                details.id = `folder_${node.id}`;
                details.className = 'folder-node';

                const summary = document.createElement('summary');
                summary.textContent = `${node.name}`;
                details.appendChild(summary);

                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'folder-children';
                details.appendChild(childrenContainer);

                folderContainers.set(node.id, childrenContainer);

                if (!node.parent || node.parent.type === "root") {
                    sectionExplorer.appendChild(details);
                } else {
                    const parentContainer = folderContainers.get(node.parent.id);
                    if (parentContainer) parentContainer.appendChild(details);
                }

            } else {
                const leafDiv = document.createElement('div');
                leafDiv.id = `leaf_${node.id}`;
                leafDiv.className = 'file-node';
                leafDiv.textContent = `${node.name}`;

                leafDiv.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    this.treeManager.highlightPathToNode(node.id); 
                });

                const parentContainer = folderContainers.get(node.parent.id);
                if (parentContainer) {
                    parentContainer.appendChild(leafDiv);
                } else {
                    sectionExplorer.appendChild(leafDiv);
                }
            }
        });
    }
}


