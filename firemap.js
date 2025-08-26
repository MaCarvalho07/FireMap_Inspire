let map, velocityLayer;
const markers = [];
let loading = 2; // 1 para fogo, 1 para vento

const state = {
    showWind: true,
    showFireMarkers: true,
    darkTheme: true
};

// Camadas de tile
const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap & CartoDB'
});
const lightLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap & CartoDB'
});

// Controle de loading
function toggleLoadingScreen() {
    const screen = document.getElementById("loading-screen");
    if (loading <= 0) screen.classList.add("hide");
    else screen.classList.remove("hide");
}

// Inicializa mapa
function initializeMap() {
    map = L.map('firemap', { zoomControl: false, minZoom: 3, maxZoom: 10 }).setView([0, 0], 2);

    darkLayer.addTo(map); // camada inicial escura
    window.markerCluster = L.markerClusterGroup();

    fetchFireData();
    fetchWindData();
}

// ================= FIRE DATA =================
async function fetchFireData() {
    loading = 1;
    toggleLoadingScreen();

    try {
        const dayRange = document.getElementById("dayRange").value || 7;
        const apiKey = "7ab43f3e1371fd8d78d87831d73a7e30";
        const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/VIIRS_SNPP_NRT/world/${dayRange}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao buscar dados FIRMS");

        const csvText = await response.text();
        const data = d3.csvParse(csvText);

        markers.length = 0;
        data.forEach(fire => {
            if (fire.latitude && fire.longitude) {
                markers.push({
                    lat: parseFloat(fire.latitude),
                    lon: parseFloat(fire.longitude),
                    brightness: parseFloat(fire.brightness) || 0,
                    info: `<b>Data:</b> ${fire.acq_date}<br>
                           <b>Hora:</b> ${fire.acq_time}<br>
                           <b>Confiança:</b> ${fire.confidence}<br>
                           <b>Brilho:</b> ${fire.brightness}`
                });
            }
        });

        updateFireMarkers();
    } catch (error) {
        console.error("Erro carregando focos de queimada:", error);
    } finally {
        loading--;
        toggleLoadingScreen();
    }
}

function updateFireMarkers() {
    window.markerCluster.clearLayers();
    if (state.showFireMarkers) {
        markers.forEach(({ lat, lon, brightness, info }) => {
            window.markerCluster.addLayer(
                L.marker([lat, lon], {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="background:${getMarkerColor(brightness)}; width:10px; height:10px; border-radius:50%;"></div>`
                    })
                }).bindPopup(info)
            );
        });
        map.addLayer(window.markerCluster);
    }
}

function getMarkerColor(brightness) {
    return brightness > 400 ? '#ff0000' : brightness > 350 ? '#ffa500' : '#ffff00';
}

// ================= WIND DATA =================
async function fetchWindData() {
    loading = 1;
    toggleLoadingScreen();

    try {
        const response = await fetch('gfs.json');
        const data = await response.json();

        if (velocityLayer) map.removeLayer(velocityLayer);

        velocityLayer = L.velocityLayer({
            displayValues: true,
            displayOptions: {
                velocityType: "Wind",
                displayPosition: "bottomleft",
                displayEmptyString: "No wind data"
            },
            data,
            maxVelocity: 15
        });

        if (state.showWind) velocityLayer.addTo(map);
    } catch (err) {
        console.error("Erro carregando vento:", err);
    } finally {
        loading--;
        toggleLoadingScreen();
    }
}

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("loading-screen").classList.remove("hide");
    initializeMap();

    // Alternar foco de incêndio
    document.getElementById("toggleFiremarkers").addEventListener("change", e => {
        state.showFireMarkers = e.target.checked;
        updateFireMarkers();
    });

    // Alternar vento
    document.getElementById("toggleVelocity").addEventListener("change", e => {
        e.target.checked ? velocityLayer.addTo(map) : map.removeLayer(velocityLayer);
    });

    // Alterar intervalo de dados
    document.getElementById("dayRange").addEventListener("change", () => {
        document.getElementById("loading-screen").classList.remove("hide");
        fetchFireData();
    });

    // Alternar tema claro/escuro
    document.getElementById("toggleMapTheme").addEventListener("change", e => {
        state.darkTheme = !e.target.checked;
        if (state.darkTheme) {
            map.removeLayer(lightLayer);
            darkLayer.addTo(map);
        } else {
            map.removeLayer(darkLayer);
            lightLayer.addTo(map);
        }
    });
});
