// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeMap();
    loadIncidents();
    setupFilters();
    
    // Auto-refresh incidents every 30 seconds
    setInterval(loadIncidents, 30000);
});

let map;
let incidentMarkers = [];

function initializeMap() {
    // Initialize Leaflet map centered on São Paulo
    map = L.map('map').setView([-23.5505, -46.6333], 11);
    
    // Dark theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    // Add incident markers
    addIncidentMarkers();
}

function addIncidentMarkers() {
    const incidents = getIncidentsData();
    
    incidents.forEach(incident => {
        const marker = L.marker([incident.lat, incident.lng])
            .addTo(map)
            .bindPopup(`
                <div class="incident-popup">
                    <h4>${incident.title}</h4>
                    <p><strong>Tipo:</strong> ${incident.type}</p>
                    <p><strong>Severidade:</strong> ${incident.severity}</p>
                    <p><strong>Horário:</strong> ${incident.time}</p>
                    <p>${incident.description}</p>
                </div>
            `);
        
        incidentMarkers.push({
            marker: marker,
            type: incident.category
        });
    });
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterIncidents(filter);
        });
    });
}

function filterIncidents(filter) {
    incidentMarkers.forEach(item => {
        if (filter === 'all' || item.type === filter) {
            map.addLayer(item.marker);
        } else {
            map.removeLayer(item.marker);
        }
    });
}

function loadIncidents() {
    const incidentsList = document.getElementById('incidentsList');
    const incidents = getIncidentsData();
    
    incidentsList.innerHTML = '';
    
    incidents.forEach(incident => {
        const incidentElement = document.createElement('div');
        incidentElement.className = 'incident-item';
        incidentElement.innerHTML = `
            <div class="incident-icon ${incident.category}">
                ${getIncidentIcon(incident.category)}
            </div>
            <div class="incident-details">
                <h4>${incident.title}</h4>
                <p>${incident.description}</p>
            </div>
            <div class="incident-time">${incident.time}</div>
        `;
        
        incidentsList.appendChild(incidentElement);
    });
}

function getIncidentIcon(category) {
    const icons = {
        flood: '🌊',
        accident: '🚗',
        power: '⚡',
        fire: '🔥',
        medical: '🚑'
    };
    return icons[category] || '⚠️';
}

function getIncidentsData() {
    return [
        {
            id: 1,
            title: 'Enchente na Marginal Tietê',
            description: 'Nível da água subindo rapidamente próximo à Ponte das Bandeiras',
            category: 'flood',
            type: 'Enchente',
            severity: 'Alta',
            time: '14:32',
            lat: -23.5236,
            lng: -46.6234
        },
        {
            id: 2,
            title: 'Acidente na Av. Paulista',
            description: 'Colisão entre dois veículos bloqueando faixa da direita',
            category: 'accident',
            type: 'Acidente de Trânsito',
            severity: 'Média',
            time: '14:15',
            lat: -23.5614,
            lng: -46.6562
        },
        {
            id: 3,
            title: 'Queda de Energia - Vila Madalena',
            description: 'Falha no transformador afetando 3 quarteirões',
            category: 'power',
            type: 'Falta de Energia',
            severity: 'Média',
            time: '13:45',
            lat: -23.5505,
            lng: -46.6889
        },
        {
            id: 4,
            title: 'Alagamento Túnel Anhangabaú',
            description: 'Água acumulada impedindo passagem de veículos',
            category: 'flood',
            type: 'Alagamento',
            severity: 'Alta',
            time: '13:20',
            lat: -23.5431,
            lng: -46.6291
        },
        {
            id: 5,
            title: 'Emergência Médica - Shopping Center Norte',
            description: 'Solicitação de ambulância para atendimento urgente',
            category: 'medical',
            type: 'Emergência Médica',
            severity: 'Alta',
            time: '12:58',
            lat: -23.5186,
            lng: -46.6094
        },
        {
            id: 6,
            title: 'Congestionamento BR-116',
            description: 'Trânsito intenso devido a acidente anterior',
            category: 'accident',
            type: 'Congestionamento',
            severity: 'Baixa',
            time: '12:30',
            lat: -23.6821,
            lng: -46.5775
        }
    ];
}

// Refresh button functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('refresh-btn')) {
        loadIncidents();
        // Add visual feedback
        e.target.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            e.target.style.transform = 'rotate(0deg)';
        }, 500);
    }
});