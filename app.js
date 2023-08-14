const express = require('express');
const app = express();

app.use(express.json());

const professionalRoute = require('./routes/professional');
const companyRoute = require('./routes/company');

app.use('/', professionalRoute);
app.use('/', companyRoute);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
