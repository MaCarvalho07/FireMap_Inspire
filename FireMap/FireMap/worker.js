// worker.js
self.onmessage = function(e) {
    const data = e.data;
    const markers = data.map(fire => {
        return {
            lat: parseFloat(fire.latitude),
            lon: parseFloat(fire.longitude),
            brightness: parseFloat(fire.brightness) || 0,
            info: `<b>Data:</b> ${fire.acq_date}<br>
                   <b>Hora:</b> ${fire.acq_time}<br>
                   <b>Confiança:</b> ${fire.confidence}<br>
                   <b>Brilho:</b> ${fire.brightness}`
        };
    });
    postMessage(markers);
};
