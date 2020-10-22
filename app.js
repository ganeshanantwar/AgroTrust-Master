const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8000;

const masterRouter = require('./routes/master');
const operationsRouter = require('./routes/operations.js');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/master', masterRouter);
app.use('/operations', operationsRouter);

app.listen(port, () => {
	console.log(`AgroTrust Master is running on ${port}`);
});
