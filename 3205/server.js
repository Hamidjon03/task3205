const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = [
  { email: 'jim@gmail.com', number: '221122' },
  { email: 'jam@gmail.com', number: '830347' },
  { email: 'john@gmail.com', number: '221122' },
  { email: 'jams@gmail.com', number: '349425' },
  { email: 'jams@gmail.com', number: '141424' },
  { email: 'jill@gmail.com', number: '822287' },
  { email: 'jill@gmail.com', number: '822286' },
];

let timeoutId = null;

app.post('/search', (req, res) => {
  const { email, number } = req.body;

  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    const result = users.filter(user => {
      return user.email.includes(email) && (!number || user.number.includes(number.replace(/-/g, '')));
    });
    res.json(result);
  }, 5000);
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});