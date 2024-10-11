const express = require('express');
const app = express();
const port = 3001;

// Ruta simple para el hello world
app.get('/', (req, res) => {
  res.send('Hello World from Backend!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
