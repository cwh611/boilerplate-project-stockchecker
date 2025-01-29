const output = document.getElementById("results-container");

document.getElementById("submit-btn").addEventListener("click", () => {
  const stock_1 = document.getElementById("stock-1-input").value;
  const stock_2 = document.getElementById("stock-2-input").value;
  if (!stock_1 && !stock_2) return alert("Please input at least one stock");
  const baseUrl = new URL('https://chunk-stockchecker-4201c325fca9.herokuapp.com/api/stock-prices?');
  let url = `${baseUrl}stock=${stock_1}`
  if (stock_2) url += `&stock=${stock_2}`
  if (document.getElementById("like-input").checked) {
    url += "&like=true"
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data.stockData)) {
        output.innerHTML = `
          <div>
            $${data.stockData.stock}
          </div>
          <div>
            $${data.stockData.price}
          </div>
          <div>
            Likes: ${data.stockData.likes}
          </div>`
      } else {
        output.innerHTML = `
          <div>
            <div>
              $${data.stockData[0].stock}
            </div>
            <div>
              $${data.stockData[0].price}
            </div>
            <div>
              Likes: ${data.stockData[0].rel_likes}
            </div>
          </div>
          <div>
            <div>
              $${data.stockData[1].stock}
            </div>
            <div>
              $${data.stockData[1].price}
            </div>
            <div>
              Likes: ${data.stockData[1].rel_likes}
            </div>
          </div>`
      }
    })
    .catch(error => {
      console.error('Error fetching stock prices:', error);
    });
});
