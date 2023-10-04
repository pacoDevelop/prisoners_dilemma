// Función para simular una estrategia aleatoria con números únicos
function simulateRandomStrategy() {
  const numbers = Array.from({
    length: 100
  }, (_, index) => index + 1); // Generar números del 1 al 100
  const shuffledNumbers = shuffleArray(numbers); // Barajar los números aleatoriamente
  // Simular búsqueda aleatoria en los cajones (aquí puedes establecer cuántos cajones abrir por prisionero)
  for (let i = 0; i < shuffledNumbers.length; i++) {
    if (i == 50) {
      return false;
    }
    if (shuffledNumbers[i] === i + 1) {
      return true; // Si un prisionero no encuentra su número, la estrategia falla
    }

  }

  return false; // La estrategia es exitosa si todos los prisioneros encuentran sus números
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
  for (let prisoner = 1; prisoner <= 100; prisoner++) {
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
  const resultText = document.getElementById('result');
  const chartContainer = document.getElementById('chart-container');
  let myChart; // Variable para almacenar la instancia del gráfico
  const increaseButton = document.getElementById('increase-iterations');
  const decreaseButton = document.getElementById('decrease-iterations');
  let iterations = 1000; // Inicialmente, 1000 iteraciones
  const simulations = document.getElementById('iteration-counter');
  simulations.value = iterations ;

  function updateIterationCounter() {
    simulations.value = iterations;
  }

  updateIterationCounter();

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
    const randomSuccessData = [];
    const optimalSuccessData = [];

    for (let i = 0; i < iterations; i++) {
      const randomSuccess = simulateRandomStrategy();
      const optimalSuccess = simulateOptimalStrategy();

      randomSuccessData.push(randomSuccess ? 1 : 0);
      optimalSuccessData.push(optimalSuccess ? 1 : 0);
    }

    const randomSuccessRate = (randomSuccessData.reduce((a, b) => a + b, 0) / iterations) * 100;
    const optimalSuccessRate = (optimalSuccessData.reduce((a, b) => a + b, 0) / iterations) * 100;

    resultText.textContent = `Estrategia Aleatoria: ${randomSuccessRate.toFixed(2)}% Éxito`;
    resultText.textContent += ` | Estrategia Óptima: ${optimalSuccessRate.toFixed(2)}% Éxito`;

    // Destruir el gráfico anterior si existe
    if (myChart) {
      myChart.destroy();
    }

    // Crear y mostrar el nuevo gráfico
    const ctx = chartContainer.getContext('2d');
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Estrategia Aleatoria', 'Estrategia Óptima'],
        datasets: [{
          label: 'Probabilidad de Éxito (%)',
          data: [randomSuccessRate, optimalSuccessRate],
          backgroundColor: ['blue', 'green'],
        }, ],
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
  });
});
