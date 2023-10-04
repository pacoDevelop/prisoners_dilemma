// Función para simular una estrategia aleatoria con números únicos
function simulateRandomStrategy() {
  const numbers = Array.from({
    length: 100
  }, (_, index) => index + 1); // Generar números del 1 al 100
  const shuffledNumbers = shuffleArray(numbers); // Barajar los números aleatoriamente
  // Simular búsqueda aleatoria en los cajones (aquí puedes establecer cuántos cajones abrir por prisionero)
  for (let i = 0; i < shuffledNumbers.length; i++) {
    if (i == 50) {
      return false
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
		console.log(attempts,prisoner);
    if (attempts >= 50) {
      return false; // Si un prisionero no encuentra su número en 50 intentos, la estrategia falla
    }
  }

  return true; // La estrategia es exitosa si todos los prisioneros encuentran sus números
}

/* document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('start-button');
  const resultText = document.getElementById('result');

  startButton.addEventListener('click', function() {
    const randomSuccess = simulateRandomStrategy();
    const optimalSuccess = simulateOptimalStrategy();

    if (randomSuccess) {
      resultText.textContent = 'Estrategia Aleatoria: Éxito';
    } else {
      resultText.textContent = 'Estrategia Aleatoria: Fracaso';
    }

    if (optimalSuccess) {
      resultText.textContent += ' | Estrategia Óptima: Éxito';
    } else {
      resultText.textContent += ' | Estrategia Óptima: Fracaso';
    }
  });
}); */
document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('start-button');
  const resultText = document.getElementById('result');
  const chartContainer = document.getElementById('chart-container');

  startButton.addEventListener('click', function() {
    const iterations = 1000; // Cambia este número según la cantidad de simulaciones que desees

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

    // Crear y mostrar el gráfico
    const ctx = chartContainer.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Estrategia Aleatoria', 'Estrategia Óptima'],
        datasets: [
          {
            label: 'Probabilidad de Éxito (%)',
            data: [randomSuccessRate, optimalSuccessRate],
            backgroundColor: ['blue', 'green'],
          },
        ],
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
