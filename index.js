const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
axios.get('https://coinmarketcap.com/').then(response => {
  // Load the web page source code into a cheerio instance
  const $ = cheerio.load(response.data);

  // The pre.highlight.shell CSS selector matches all `pre` elements
  // that have both the `highlight` and `shell` class
  const urlElems = $('tbody').find('tr');
  const coins = [];
  // We now loop through all the elements found
  for (let i = 0; i < urlElems.length; i++) {
    const name = $(urlElems[i])
      .find('a.currency-name-container')
      .text();
    const price = $(urlElems[i])
      .find('a.price')
      .text();
    const percent_change = $(urlElems[i])
      .find('td.percent-change')
      .text();
    const market_cap = $(urlElems[i])
      .find('td.market-cap')
      .text()
      .trim();
    const volume = $(urlElems[i])
      .find('a.volume')
      .text()
      .trim();
    const circulating_supply = $(urlElems[i])
      .find('td.circulating-supply')
      .attr('data-sort');
    let coin = {
      name: name,
      price: price,
      percent_change: percent_change,
      market_cap: market_cap,
      volume: volume,
      circulating_supply: circulating_supply
    };
    coins.push(coin);
  }
  fs.writeFile('output.json', JSON.stringify(coins, null, 4), function(err) {
    console.log(
      'File successfully written! - Check your project directory for the output.json file'
    );
  });
});
