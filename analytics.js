// Analytics page functionality
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeCharts();
    setupTimeRangeFilter();
});

function initializeCharts() {
    createIncidentsChart();
    createResponseTimeChart();
    createFloodAlertsChart();
    createEfficiencyChart();
}

function createIncidentsChart() {
    const ctx = document.getElementById('incidentsChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [
                {
                    label: 'Enchentes',
                    data: [12, 19, 8, 15, 22, 18, 25, 20, 16, 14, 10, 8],
                    borderColor: '#00aaff',
                    backgroundColor: 'rgba(0, 170, 255, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Acidentes',
                    data: [25, 30, 22, 28, 35, 32, 40, 38, 30, 25, 20, 18],
                    borderColor: '#ff9900',
                    backgroundColor: 'rgba(255, 153, 0, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Falhas de Energia',
                    data: [8, 12, 6, 10, 15, 12, 18, 16, 12, 8, 6, 4],
                    borderColor: '#ff3333',
                    backgroundColor: 'rgba(255, 51, 51, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#cccccc'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#cccccc'
                    },
                    grid: {
                        color: '#333'
                    }
                },
                y: {
                    ticks: {
                        color: '#cccccc'
                    },
                    grid: {
                        color: '#333'
                    }
                }
            }
        }
    });
}

function createResponseTimeChart() {
    const ctx = document.getElementById('responseTimeChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [{
                label: 'Tempo Médio (minutos)',
                data: [15, 12, 10, 8, 7, 6, 5, 5, 6, 7, 8, 9],
                backgroundColor: 'rgba(0, 204, 102, 0.8)',
                borderColor: '#00cc66',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#cccccc'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#cccccc'
                    },
                    grid: {
                        color: '#333'
                    }
                },
                y: {
                    ticks: {
                        color: '#cccccc'
                    },
                    grid: {
                        color: '#333'
                    }
                }
            }
        }
    });
}

function createFloodAlertsChart() {
    const ctx = document.getElementById('floodAlertsChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Centro', 'Zona Sul', 'Zona Norte', 'Zona Leste', 'Zona Oeste'],
            datasets: [{
                data: [25, 30, 20, 15, 10],
                backgroundColor: [
                    '#00aaff',
                    '#0066cc',
                    '#004499',
                    '#003366',
                    '#002244'
                ],
                borderWidth: 2,
                borderColor: '#1a1a1a'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#cccccc',
                        padding: 20
                    }
                }
            }
        }
    });
}

function createEfficiencyChart() {
    const ctx = document.getElementById('efficiencyChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [
                {
                    label: 'Precisão IA (%)',
                    data: [85, 87, 89, 91, 92, 93, 94, 94, 95, 94, 94, 94],
                    borderColor: '#00cc66',
                    backgroundColor: 'rgba(0, 204, 102, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Satisfação Usuários (%)',
                    data: [78, 80, 82, 85, 87, 89, 91, 92, 93, 94, 95, 96],
                    borderColor: '#00aaff',
                    backgroundColor: 'rgba(0, 170, 255, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#cccccc'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#cccccc'
                    },
                    grid: {
                        color: '#333'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    min: 70,
                    max: 100,
                    ticks: {
                        color: '#cccccc'
                    },
                    grid: {
                        color: '#333'
                    }
                }
            }
        }
    });
}

function setupTimeRangeFilter() {
    const timeRangeSelect = document.getElementById('timeRange');
    
    timeRangeSelect.addEventListener('change', function() {
        // In a real application, this would update all charts with new data
        console.log('Time range changed to:', this.value);
        // For demo purposes, we'll just log the change
        // You could implement actual data filtering here
    });
}

// Chart.js global configuration for dark theme
Chart.defaults.color = '#cccccc';
Chart.defaults.borderColor = '#333';
Chart.defaults.backgroundColor = 'rgba(0, 170, 255, 0.1)';