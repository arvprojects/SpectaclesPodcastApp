const express = require('express');
const app = express();
const port = 3000;

// Route to handle Spotify redirect (this should match your redirect URI)
app.get('/', (req, res) => {
  const authorizationCode = req.query.code;
  if (authorizationCode) {
    res.send(`Authorization Code: ${authorizationCode}`);
    console.log(`Authorization Code received: ${authorizationCode}`);
  } else {
    res.send('Authorization failed or user denied access');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
