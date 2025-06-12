function findRoute(startStation, endStation) {
    console.log('🚀 Iniciando búsqueda de ruta:', { startStation, endStation });
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<div class="status-message">🔍 Buscando ruta...</div>';

    fetch('/api/optimize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ startStation, endStation })
    })
    .then(response => {
        console.log('📥 Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('✨ Procesando datos:', data);
        
        if (data?.status === 'success' && data?.data) {
            resultDiv.innerHTML = `
                <div class="status-message success">✅ Ruta encontrada</div>
                <div class="route-details">
                    <p><strong>De:</strong> ${startStation}</p>
                    <p><strong>A:</strong> ${endStation}</p>
                    <p><strong>Distancia:</strong> ${data.data.distance.toFixed(2)} km</p>
                    <p><strong>Tiempo estimado:</strong> ${data.data.estimatedDuration}</p>
                    <div class="stations-list">
                        <h3>Estaciones de la ruta:</h3>
                        <ol>
                            ${data.data.stops.map(stop => `<li>${stop.name}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            `;
            console.log('✅ UI actualizada con éxito');
        } else {
            throw new Error('Formato de respuesta inválido');
        }
    })
    .catch(error => {
        console.error('🔴 Error:', error);
        resultDiv.innerHTML = `
            <div class="status-message error">
                ❌ Error: ${error.message}
            </div>
        `;
    });
}

// Add this where findRoute is called (likely in an event listener)
document.querySelector('#search-route-button').addEventListener('click', () => {
    const startStation = document.querySelector('#start-station').value;
    const endStation = document.querySelector('#end-station').value;
    
    console.log('🎯 Llamando a findRoute:', { startStation, endStation });
    findRoute(startStation, endStation);
});