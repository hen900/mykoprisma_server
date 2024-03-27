const temperatureElement = document.getElementById('temperature');
const humidityElement = document.getElementById('humidity');
const co2Element = document.getElementById('co2');
const actuator1StatusElement = document.getElementById('actuator1Status');
const actuator2StatusElement = document.getElementById('actuator2Status');
const actuator3StatusElement = document.getElementById('actuator3Status');

async function getLatestMeasurement() {
    const response = await fetch('/getMeas');
    const data = await response.json();
    return data[data.length - 1];
}

async function updateDashboard(data) {
    const timestamps = data.map(measurement => new Date(measurement.timestamp));
    const temperatureData = data.map(measurement => measurement.temperature);
    const humidityData = data.map(measurement => measurement.humidity);
    const co2Data = data.map(measurement => measurement.co2);
    document.getElementById('actuator1Status').textContent = data.actuator1Status ? 'ON' : 'OFF';
    document.getElementById('actuator2Status').textContent = data.actuator2Status ? 'ON' : 'OFF';
    document.getElementById('actuator3Status').textContent = data.actuator3Status ? 'ON' : 'OFF';
}

//note: this is coded using chart.js
function createChart(){
    fetch('/getMeas').then(response => response.json()).then(data => {
        const timestamps = data.map(measurement => new Date (measurement.timestamp));
        const temperatureData = data.map(measurement => measurement.temperature);
        const humidityData = data.map(measurement => measurement.humidity);
        const co2Data = data.map(measurement => measurement.co2);

        const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
        const temperatureChart = new Chart(temperatureCtx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Temperature',
                    data: temperatureData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Timestamp"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Temperature (C)"
                        }
                    }
                }
            }
        });

        const humidityCtx = document.getElementById('humidityChart').getContext('2d');
        const humidityChart = new Chart(humidityCtx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Humidity',
                    data: humidityData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Timestamp"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Humidity (%)"
                        }
                    }
                }
            }
        });

        const co2Ctx = document.getElementById('co2Chart').getContext('2d');
        const co2Chart = new Chart(co2Ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'CO2',
                    data: co2Data,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        //display: false,   //this takes away the actual invalid date stuff
                        title: {
                            display: true,
                            text: "Timestamp"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "CO2 Levels (ppm)"
                        }
                    }
                }
            }
        });

        setInterval(function() {
            temperatureChart.data.labels = timestamps;
            temperatureChart.data.datasets[0].data = temperatureData;
            temperatureChart.update();

            humidityChart.data.labels = timestamps;
            humidityChart.data.datasets[0].data = humidityData;
            humidityChart.update();

            co2Chart.data.labels = timestamps;
            co2Chart.data.datasets[0].data = co2Data;
            co2Chart.update();
        }, 1000);
    });
}

async function updateUI(latestMeasurement) {
    const {
        temperature,
        humidity,
        co2,
        actuator1Status,
        actuator2Status,
        actuator3Status
    } = latestMeasurement;

    const temperatureF = temperature * 9 / 5 + 32;

    temperatureElement.textContent = `${temperature}\u00B0C / ${temperatureF}\u00B0F`;
    humidityElement.textContent = `${humidity}%`;
    co2Element.textContent = `${co2} ppm`;
    actuator1StatusElement.textContent = actuator1Status ? 'ON' : 'OFF';
    actuator2StatusElement.textContent = actuator2Status ? 'ON' : 'OFF';
    actuator3StatusElement.textContent = actuator3Status ? 'ON' : 'OFF';

    createChart();
}

async function setActuator(actuatorNumber, set, latestMeasurement) {
    const {
        actuator1Status,
        actuator2Status,
        actuator3Status
    } = latestMeasurement;

    const data = {
        actuator1Status,
        actuator2Status,
        actuator3Status
    };

    data[`actuator${actuatorNumber}Status`] = set;

    await fetch('/setComm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    alert(`Actuator ${actuatorNumber} set to ${set ? 'ON' : 'OFF'}`);
}

updateUI(await getLatestMeasurement());

document.getElementById('actuator1').addEventListener('change', () => {
    setActuator(1, document.getElementById('actuator1').checked, getLatestMeasurement());
});
