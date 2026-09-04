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

            // si il faut faire un dossier
            if (node.type === "branch") {
                const details = document.createElement('details');
                details.id = `folder_${node.id}`;
                details.className = 'folder-node';

                const summary = document.createElement('summary');
                summary.innerHTML = `
                    <span class="folder-header">
                    <span class="chevron">▸</span>
                    <span class="folder-title">${node.name}</span>
                    </span>
                `;

                // gestion de la transi ouverture/fermeture
                summary.addEventListener('click', (e) => {
                    e.preventDefault();

                    const content = childrenWrapper; 

                    if (details.open) {
                        const startHeight = `${content.offsetHeight}px`;

                        const closingAnimation = content.animate([
                            { height: startHeight, opacity: 1 },
                            { height: '0px', opacity: 0 }
                        ], {
                            duration: 250,
                            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                        });

                        closingAnimation.onfinish = () => {
                            details.removeAttribute('open');
                        };

                        summary.querySelector('.chevron').style.transform = 'rotate(0deg)';
                    } 
                    
                    else {
                        details.setAttribute('open', ''); 
                        const targetHeight = `${childrenContainer.offsetHeight}px`; 

                        content.animate([
                            { height: '0px', opacity: 0 },
                            { height: targetHeight, opacity: 1 }
                        ], {
                            duration: 250,
                            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                        });

                        summary.querySelector('.chevron').style.transform = 'rotate(90deg)';
                    }
                });

                details.appendChild(summary);

                const childrenWrapper = document.createElement('div');
                childrenWrapper.className = 'folder-content';

                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'folder-children';
                
                childrenWrapper.appendChild(childrenContainer);
                details.appendChild(childrenWrapper);

                folderContainers.set(node.id, childrenContainer);

                if (!node.parent || node.parent.type === "root") {
                    sectionExplorer.appendChild(details);
                } 
                else {
                    const parentContainer = folderContainers.get(node.parent.id);
                    if (parentContainer) parentContainer.appendChild(details);
                }
            } 
            else { // Element du dossier
                const leafDiv = document.createElement('div');
                leafDiv.id = `leaf_${node.id}`;
                leafDiv.className = 'file-node';
                leafDiv.innerHTML = `• ${node.name}`;

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


