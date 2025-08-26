// Recebe mensagem do main thread
self.onmessage = async function(e) {
    try {
        const response = await fetch('gfs.json'); // seu arquivo JSON do vento
        const data = await response.json();
        self.postMessage({ success: true, data });
    } catch (err) {
        self.postMessage({ success: false, error: err.message });
    }
};
