// Cameras page functionality
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadCameras();
    setupCameraFilters();
});

function loadCameras() {
    const camerasGrid = document.getElementById('camerasGrid');
    const cameras = getCamerasData();
    
    camerasGrid.innerHTML = '';
    
    cameras.forEach(camera => {
        const cameraElement = document.createElement('div');
        cameraElement.className = 'camera-card';
        cameraElement.dataset.filter = camera.category;
        cameraElement.onclick = () => openCameraModal(camera);
        
        cameraElement.innerHTML = `
            <div class="camera-feed">
                <img src="${camera.imageUrl}" alt="Feed da câmera ${camera.name}">
                <div class="camera-overlay">
                    ${camera.detections.map(detection => `
                        <div class="detection-box" style="top: ${detection.y}%; left: ${detection.x}%; width: ${detection.width}%; height: ${detection.height}%;">
                            <span class="detection-label">${detection.label}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="camera-info">
                <div class="camera-header">
                    <div class="camera-title">${camera.name}</div>
                    <span class="status-badge ${camera.status}">${getStatusText(camera.status)}</span>
                </div>
                <div class="camera-location">📍 ${camera.location}</div>
                <div class="camera-detections">
                    ${camera.aiDetections.map(detection => `
                        <span class="detection-tag">${detection}</span>
                    `).join('')}
                </div>
            </div>
        `;
        
        camerasGrid.appendChild(cameraElement);
    });
}

function setupCameraFilters() {
    const filterButtons = document.querySelectorAll('.camera-filters .filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterCameras(filter);
        });
    });
}

function filterCameras(filter) {
    const cameraCards = document.querySelectorAll('.camera-card');
    
    cameraCards.forEach(card => {
        if (filter === 'all' || card.dataset.filter === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function openCameraModal(camera) {
    const modal = document.getElementById('cameraModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalCameraImage');
    const modalLocation = document.getElementById('modalLocation');
    const modalStatus = document.getElementById('modalStatus');
    const modalLastUpdate = document.getElementById('modalLastUpdate');
    const modalDetections = document.getElementById('modalDetections');
    
    modalTitle.textContent = camera.name;
    modalImage.src = camera.imageUrl;
    modalLocation.textContent = camera.location;
    modalStatus.textContent = getStatusText(camera.status);
    modalStatus.className = `status-badge ${camera.status}`;
    modalLastUpdate.textContent = camera.lastUpdate;
    
    modalDetections.innerHTML = camera.aiDetections.map(detection => `
        <span class="detection-tag">${detection}</span>
    `).join('');
    
    modal.classList.add('active');
}

function closeCameraModal() {
    const modal = document.getElementById('cameraModal');
    modal.classList.remove('active');
}

function getStatusText(status) {
    const statusTexts = {
        alert: 'Alerta',
        warning: 'Atenção',
        normal: 'Normal'
    };
    return statusTexts[status] || 'Desconhecido';
}

function getCamerasData() {
    return [
        {
            id: 1,
            name: 'CAM-001 Marginal Tietê',
            location: 'Marginal Tietê, próximo à Ponte das Bandeiras',
            status: 'alert',
            category: 'flood',
            imageUrl: 'https://images.pexels.com/photos/2448749/pexels-photo-2448749.jpeg?auto=compress&cs=tinysrgb&w=400',
            lastUpdate: '14:35:22',
            aiDetections: ['Nível de Água Alto', 'Veículos Parados'],
            detections: [
                { x: 20, y: 60, width: 60, height: 30, label: 'Água na Pista' }
            ]
        },
        {
            id: 2,
            name: 'CAM-002 Av. Paulista',
            location: 'Avenida Paulista, altura do MASP',
            status: 'warning',
            category: 'traffic',
            imageUrl: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400',
            lastUpdate: '14:34:15',
            aiDetections: ['Congestionamento', 'Fluxo Lento'],
            detections: []
        },
        {
            id: 3,
            name: 'CAM-003 Vila Madalena',
            location: 'Rua Harmonia com Rua Aspicuelta',
            status: 'normal',
            category: 'traffic',
            imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
            lastUpdate: '14:33:45',
            aiDetections: ['Trânsito Normal'],
            detections: []
        },
        {
            id: 4,
            name: 'CAM-004 Túnel Anhangabaú',
            location: 'Túnel Anhangabaú - Entrada Centro',
            status: 'alert',
            category: 'flood',
            imageUrl: 'https://images.pexels.com/photos/2448749/pexels-photo-2448749.jpeg?auto=compress&cs=tinysrgb&w=400',
            lastUpdate: '14:32:10',
            aiDetections: ['Alagamento Detectado', 'Acesso Bloqueado'],
            detections: [
                { x: 10, y: 70, width: 80, height: 25, label: 'Água Acumulada' }
            ]
        },
        {
            id: 5,
            name: 'CAM-005 Brooklin',
            location: 'Av. Eng. Luís Carlos Berrini',
            status: 'warning',
            category: 'flood',
            imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
            lastUpdate: '14:31:33',
            aiDetections: ['Chuva Intensa', 'Visibilidade Reduzida'],
            detections: []
        },
        {
            id: 6,
            name: 'CAM-006 Itaim Bibi',
            location: 'Av. Faria Lima com Av. Cidade Jardim',
            status: 'normal',
            category: 'traffic',
            imageUrl: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400',
            lastUpdate: '14:30:55',
            aiDetections: ['Fluxo Normal'],
            detections: []
        },
        {
            id: 7,
            name: 'CAM-007 Morumbi',
            location: 'Av. Giovanni Gronchi',
            status: 'alert',
            category: 'emergency',
            imageUrl: 'https://images.pexels.com/photos/2448749/pexels-photo-2448749.jpeg?auto=compress&cs=tinysrgb&w=400',
            lastUpdate: '14:29:18',
            aiDetections: ['Acidente Detectado', 'Ambulância Solicitada'],
            detections: [
                { x: 40, y: 45, width: 30, height: 20, label: 'Veículos Envolvidos' }
            ]
        },
        {
            id: 8,
            name: 'CAM-008 Santana',
            location: 'Av. Cruzeiro do Sul',
            status: 'normal',
            category: 'traffic',
            imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
            lastUpdate: '14:28:42',
            aiDetections: ['Trânsito Fluindo'],
            detections: []
        }
    ];
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('cameraModal');
    if (e.target === modal) {
        closeCameraModal();
    }
});

// Make functions globally available
window.closeCameraModal = closeCameraModal;