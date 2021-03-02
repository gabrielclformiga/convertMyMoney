const express = require('express');
const app = express();
const path = require('path');
const convert = require('./lib/convert');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/quotation', (req, res) => {
  const { quotation, quantity } = req.query;

  if (quotation && quantity) {
    const conversion = convert.convert(quotation, quantity)

    res.render('quotation', {
      error: false,
      quotation: convert.toMoney(quotation),
      quantity: convert.toMoney(quantity),
      conversion: convert.toMoney(conversion)
    });
  } else {
    res.render('quotation', {
      error: 'Invalid Values'
    });
  }
});

app.listen(3000, err => {
  if (err) {
    console.log('We could not initiate');
  } else {
    console.log('ConvertMyMoney is online');
  }
});