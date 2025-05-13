// === Voice Commands using Annyang ===
document.addEventListener('DOMContentLoaded', () => {
  if (typeof annyang !== 'undefined') {
    const commands = {
      'hello': () => alert('Hello World'),

      'change the color to *color': (color) => {
        document.body.style.backgroundColor = color;
      },

      'navigate to *page': (page) => {
        const path = page.toLowerCase();
        if (['home', 'index'].includes(path)) {
          window.location.href = 'index.html';
        } else if (path === 'stocks') {
          window.location.href = 'stocks.html';
        } else if (path === 'dogs') {
          window.location.href = 'dogs.html';
        }
      },

      'lookup *stock': (stock) => {
        const input = document.getElementById('ticker-input');
        if (input) {
          input.value = stock.toUpperCase();
          fetchStockData();
        }
      },

      'load dog breed *breed': (breed) => {
        const buttons = document.querySelectorAll('#breed-buttons button');
        buttons.forEach((btn) => {
          if (btn.innerText.toLowerCase() === breed.toLowerCase()) {
            btn.click();
          }
        });
      }
    };

    annyang.addCommands(commands);
    annyang.start({ autoRestart: true, continuous: false });
  }
});

// === Stocks Page ===
async function fetchStockData() {
  const tickerInput = document.getElementById('ticker-input');
  const rangeSelect = document.getElementById('range-select');
  const canvas = document.getElementById('stock-chart');

  if (!tickerInput || !rangeSelect || !canvas) return;

  const ticker = tickerInput.value.trim().toUpperCase();
  const range = parseInt(rangeSelect.value, 10);
  const apiKey = 'kp_RbKt7QGijDZbTvGgvKAyv80Axmznl';

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - range);

  const from = startDate.toISOString().split('T')[0];
  const to = endDate.toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid data format');
    }

    const labels = data.results.map((r) => new Date(r.t).toLocaleDateString());
    const prices = data.results.map((r) => r.c);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: ticker,
          data: prices,
          borderColor: 'blue',
          fill: false
        }]
      },
      options: { responsive: true }
    });
  } catch (err) {
    console.error('Error fetching stock data:', err);
  }
}

// === Reddit Top Stocks Table ===
async function fetchRedditStocks() {
  try {
    const res = await fetch('https://tradestie.com/api/v1/apps/reddit');
    const data = await res.json();
    const top5 = data.slice(0, 5);

    const tbody = document.querySelector('#reddit-stocks tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    top5.forEach((stock) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
        <td>${stock.no_of_comments}</td>
        <td>${stock.sentiment} ${stock.sentiment === 'Bullish' ? '📈' : '📉'}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Error loading Reddit stocks:', err);
  }
}

// === Dogs Page - Carousel ===
async function loadCarousel() {
  try {
    const res = await fetch('https://dog.ceo/api/breeds/image/random/10');
    const { message } = await res.json();
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    carousel.innerHTML = '';
    message.forEach(img => {
      const imgEl = document.createElement('img');
      imgEl.src = img;
      imgEl.style.width = '200px';
      imgEl.style.margin = '10px';
      carousel.appendChild(imgEl);
    });
  } catch (err) {
    console.error('Error loading dog images:', err);
  }
}

// === Dogs Page - Breed Buttons ===
async function loadDogBreeds() {
  try {
    const res = await fetch('https://api.thedogapi.com/v1/breeds');
    const breeds = await res.json();
    const btnContainer = document.getElementById('breed-buttons');
    const infoDiv = document.getElementById('breed-info');
    if (!btnContainer || !infoDiv) return;

    btnContainer.innerHTML = '';
    breeds.forEach(breed => {
      const btn = document.createElement('button');
      btn.className = 'custom-btn';
      btn.textContent = breed.name;
      btn.onclick = () => {
        infoDiv.style.display = 'block';
        infoDiv.innerHTML = `
          <h3>${breed.name}</h3>
          <p><strong>Temperament:</strong> ${breed.temperament || 'No data'}</p>
          <p><strong>Life Span:</strong> ${breed.life_span}</p>
        `;
      };
      btnContainer.appendChild(btn);
    });
  } catch (err) {
    console.error('Error loading dog breeds:', err);
  }
}

// === Page-Specific Initializer ===
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#reddit-stocks')) fetchRedditStocks();
  if (document.querySelector('#carousel')) loadCarousel();
  if (document.querySelector('#breed-buttons')) loadDogBreeds();
});
