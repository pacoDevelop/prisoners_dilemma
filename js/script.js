	const prisonersSize = 100;

	// Función para simular la estrategia aleatoria con números únicos para un prisionero
	function simulateRandomStrategyPrisioner() {
	  const numbers = Array.from({
	    length: 100
	  }, (_, index) => index + 1); // Generar números del 1 al 100
	  const shuffledNumbers = shuffleArray(numbers); // Barajar los números aleatoriamente
	  const selectedNumbers = []; // Usar un array para mantener un seguimiento de los números seleccionados
	  let attempts = 0;

	  while (attempts < 50) {
	    let randomIndex = Math.floor(Math.random() * 100);

	    // Verificar si el índice ya existe en selectedNumbers
	    while (selectedNumbers.includes(randomIndex)) {
	      randomIndex = Math.floor(Math.random() * 100);
	    }

	    selectedNumbers.push(randomIndex); // Agregar el índice seleccionado al array

	    if (shuffledNumbers[randomIndex] === attempts + 1) {
	      return true; // El prisionero encuentra su número, la estrategia es exitosa
	    }
	    attempts++;
	  }
	  return false; // La estrategia es fallida, el prisionero no encontró su número en 50 intentos
	}

	function simulateRandomStrategy() {
	  for (let prisoner = 1; prisoner <= prisonersSize; prisoner++) {
	    if (!simulateRandomStrategyPrisioner()) {
	      return false;
	    }
	  }
	  return true;
	}



	// Función para barajar un array aleatoriamente (algoritmo de Fisher-Yates)
	function shuffleArray(array) {
	  const shuffled = [...array];
	  for (let i = shuffled.length - 1; i > 0; i--) {
	    const j = Math.floor(Math.random() * (i + 1));
	    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	  }
	  return shuffled;
	}

	// Función para simular la estrategia óptima
	function simulateOptimalStrategy() {
	  const boxes = Array.from({
	    length: 100
	  }, (_, index) => index + 1);
	  const shuffledBoxes = shuffleArray(boxes);
	  for (let prisoner = 1; prisoner <= prisonersSize; prisoner++) {
	    let attempts = 0;
	    let currentBox = prisoner;
	    while (attempts < 50) {
	      const openBox = shuffledBoxes[currentBox - 1];
	      if (openBox === prisoner) {
	        break; // El prisionero encuentra su número, detener la búsqueda
	      } else {
	        currentBox = openBox;
	        attempts++;
	      }
	    }
	    if (attempts >= 50) {
	      return false; // Si un prisionero no encuentra su número en 50 intentos, la estrategia falla
	    }
	  }

	  return true; // La estrategia es exitosa si todos los prisioneros encuentran sus números
	}

	document.addEventListener('DOMContentLoaded', function() {

	  const startButton = document.getElementById('start-button');
	  const resultTextRandom = document.getElementById('result-random');
	  const resultTextOptimal = document.getElementById('result-optimal');
	  const chartContainer = document.getElementById('chart-container');
	  let myChart; // Variable para almacenar la instancia del gráfico
	  const increaseButton = document.getElementById('increase-iterations');
	  const decreaseButton = document.getElementById('decrease-iterations');
	  let iterations = 1000; // Inicialmente, 1000 iteraciones
	  const simulations = document.getElementById('iteration-counter');
	  simulations.value = iterations;

	  function updateIterationCounter() {
	    simulations.value = iterations;
	  }

	  updateIterationCounter();

	  simulations.addEventListener('change', function() {
	    iterations = parseInt(simulations.value);
	  });


	  increaseButton.addEventListener('click', function() {
	    iterations += 100; // Aumentar en 100 iteraciones
	    updateIterationCounter();
	  });

	  decreaseButton.addEventListener('click', function() {
	    if (iterations > 100) {
	      iterations -= 100; // Disminuir en 100 iteraciones, mínimo 100
	      updateIterationCounter();
	    }
	  });

startButton.addEventListener('click', function() {
    startButton.disabled = true;
    startButton.textContent = "Espere";

    const randomSuccessData = [];
    const optimalSuccessData = [];
    const batchSize = 1000; // Número de iteraciones por lote
    let currentIteration = 0;

    function runSimulationBatch() {
        for (let i = 0; i < batchSize; i++) {
            if (currentIteration >= iterations) {
                // Todas las iteraciones han terminado, mostrar resultados y habilitar el botón
                const randomSuccess = randomSuccessData.reduce((a, b) => a + b, 0);
                const optimalSuccess = optimalSuccessData.reduce((a, b) => a + b, 0);
                const randomSuccessRate = (randomSuccess / iterations) * 100;
                const optimalSuccessRate = (optimalSuccess / iterations) * 100;

                resultTextRandom.textContent = `Estrategia Aleatoria: ${randomSuccessRate.toFixed(2)}% Éxito | Números de éxitos ${randomSuccess}`;
                resultTextOptimal.textContent = `Estrategia Óptima: ${optimalSuccessRate.toFixed(2)}% Éxito | Números de éxitos ${optimalSuccess}`;

                // Destruir el gráfico anterior si existe
                if (myChart) {
                    myChart.destroy();
                }

                // Crear y mostrar el nuevo gráfico
                const ctx = chartContainer.getContext('2d');
                myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Probabilidad de Éxito (%)'],
                        datasets: [{
                            label: ' Estrategia Aleatoria',
                            data: [randomSuccessRate],
                            backgroundColor: ['blue'],
                        }, {
                            label: 'Estrategia Óptima',
                            data: [optimalSuccessRate],
                            backgroundColor: ['green'],
                        }],
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                            },
                        },
                    },
                });

                setTimeout(function() {
                    startButton.disabled = false;
                    startButton.textContent = "Iniciar simulación";
                }, 200); // Habilitar el botón después de 1 segundo
                return;
            }

            const randomSuccess = simulateRandomStrategy();
            const optimalSuccess = simulateOptimalStrategy();

            randomSuccessData.push(randomSuccess ? 1 : 0);
            optimalSuccessData.push(optimalSuccess ? 1 : 0);

            currentIteration++;
        }

        // Realizar el siguiente lote de iteraciones después de un breve retraso
        setTimeout(runSimulationBatch, 0);
    }

    // Comenzar la simulación dividida en lotes
    runSimulationBatch();
});
	});
