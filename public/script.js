document.getElementById("submit-btn").addEventListener("click", () => {
  const stock_1 = document.getElementById("stock-1-input").value.trim;
  const stock_2 = document.getElementById("stock-2-input").value.trim;
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
      console.log('Response:', data);
      document.getElementById("results-container").innerText = JSON.stringify(data)
    })
    .catch(error => {
      console.error('Error fetching stock prices:', error);
    });
});
