async function loadMeasurements() {
    try {
        const response = await fetch("/api/measurements");

        if (!response.ok) {
            throw new Error("API Fehler");
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            document.getElementById("moisture").textContent = "Noch keine Daten";
            document.getElementById("adc").textContent = "ADC: -";
            document.getElementById("time").textContent = "Zeitpunkt: -";
            document.getElementById("measurements").textContent =
                "Noch keine Messungen vorhanden.";

            return;
        }

        const latest = data[0];

        document.getElementById("moisture").textContent =
            latest.moisture + " %";

        document.getElementById("adc").textContent =
            "ADC: " + latest.adc;

        document.getElementById("time").textContent =
            "Zeitpunkt: " + latest.created_at;

        const container =
            document.getElementById("measurements");

        container.innerHTML = "";

        data.forEach(measurement => {
            const div = document.createElement("div");

            div.className = "measurement";

            div.textContent =
                measurement.created_at +
                " — " +
                measurement.moisture +
                "% — ADC " +
                measurement.adc;

            container.appendChild(div);
        });

    } catch (error) {
        console.error(error);

        document.getElementById("measurements").textContent =
            "Fehler beim Laden der Messungen.";
    }
}

loadMeasurements();

setInterval(loadMeasurements, 30000);