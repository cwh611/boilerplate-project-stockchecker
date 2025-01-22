'use strict';

module.exports = function (app) {

  app.route('/api/stock-prices')

    .get( async (req, res) => {
      console.log(req.query)
      const {stock, like} = req.query;
      if (stock.length > 1) {
        const stock_1 = stock[0];
        const stock_2 = stock[1];
        if (like) {
          
        }
        const url_1 = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock_1}/quote`;
        const url_2 = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock_2}/quote`;
        const requests = [
          fetch(url_1).then(response => response.json()), 
          fetch(url_2).then(response => response.json())
        ]
        try {
          const [data_1, data_2] = await Promise.all(requests);
          const result = [{
            stockData: {
              'stock': stock_1,
              'price': data_1.latestPrice,
              'rel_likes': 0 // figure out w db later
              }
            }, 
            {
              stockData: {
                'stock': stock_2,
                'price': data_2.latestPrice,
                'rel_likes': 0 // figure out w db later
              }
          }];
          res.json(result)
        } catch (err) {
            console.log(err);
        }
      }
    })
  }