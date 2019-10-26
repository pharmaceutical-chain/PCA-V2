const path = require('path');
const express = require('express');
const compression = require('compression');

const CONTEXT = `/${process.env.CONTEXT || 'pharma-chain-application'}`;
const PORT = process.env.PORT || 4200;

const app = express();

app.use(compression());
app.use(
  CONTEXT,
  express.static(
    path.resolve(__dirname, '../../dist/pharma-chain-application')
  )
);
app.use(
  '/',
  express.static(
    path.resolve(__dirname, '../../dist/pharma-chain-application')
  )
);
app.use(
  '/*',
  express.static(
    path.resolve(__dirname, '../../dist/pharma-chain-application')
  )
);

app.listen(PORT, () =>
  console.log(`App running on http://localhost:${PORT}${CONTEXT}`)
);
