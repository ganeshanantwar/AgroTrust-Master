const express = require('express');
const app=express();
const bodyParser = require("body-parser");
const cors = require('cors');
const port = process.env.PORT || 8000;

const farmerRouter=require('./routes/farmer.js');
const fieldRouter=require('./routes/field.js');
const materialRouter=require('./routes/material.js');
const skuRouter=require('./routes/sku.js');
const locationRouter=require('./routes/location.js');
const operationsRouter=require('./routes/operations.js');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/farmer',farmerRouter);
app.use('/field',fieldRouter);
app.use('/material',materialRouter);
app.use('/sku',skuRouter);
app.use('/location',locationRouter);
app.use('/operations',operationsRouter);

app.listen(port, () => {
    console.log(`AgroTrust Core is running on ${port}`);
});