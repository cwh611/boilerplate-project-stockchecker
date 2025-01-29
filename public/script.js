const output = document.getElementById("results-container");

document.getElementById("submit-btn").addEventListener("click", () => {
  const stock_1 = document.getElementById("stock-1-input").value;
  const stock_2 = document.getElementById("stock-2-input").value;
  if (!stock_1 && !stock_2) return alert("Please input at least one stock");
  const baseUrl = new URL('https://chunk-stockchecker-4201c325fca9.herokuapp.com/api/stock-prices?');
  let url = `${baseUrl}stock=${stock_1}`
  if (stock_2) url += `&stock=${stock_2}`
  if (document.getElementById("like-input").value === "like") {
    url += "&like=true"
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const result = JSON.stringify(data);
      if (!Array.isArray(result.stockData)) {
        output.innerHTML = `
          <div>
            $${result.stockData.symbol}
          </div>
          <div>
            $${result.stockData.latestPrice}
          </div>
          <div>
            Likes: ${result.stockData.likes}
          </div>`
      } else {
        output.innerHTML = `
          <div>
            <div>
              $${result.stockData[0].symbol}
            </div>
            <div>
              $${result.stockData[0].latestPrice}
            </div>
            <div>
              Likes: ${result.stockData[0].rel_likes}
            </div>
          </div>
          <div>
            <div>
              $${result.stockData[1].symbol}
            </div>
            <div>
              $${result.stockData[1].latestPrice}
            </div>
            <div>
              Likes: ${result.stockData[1].rel_likes}
            </div>
          </div>`
      }
    })
    .catch(error => {
      console.error('Error fetching stock prices:', error);
    });
});
