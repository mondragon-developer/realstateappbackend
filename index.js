const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/propertyDB', { useNewUrlParser: true, useUnifiedTopology: true });

const propertySchema = new mongoose.Schema({
  address: String,
  city: String,
  zipCode: String,
  previousSales: Array,
  price: Number,
  value: Number,
  owner: String,
});

const Property = mongoose.model('Property', propertySchema);

app.post('/api/property', async (req, res) => {
  const { address, city, zipCode } = req.body;
  try {
    
    const response = await axios.get(`https://api.bridgedataoutput.com/api/v2/OData/dataset_id/Property/replication?access_token=access_token`);
    const propertyData = response.data;

    const property = new Property({
      address,
      city,
      zipCode,
      previousSales: propertyData.previousSales,
      price: propertyData.price,
      value: propertyData.value,
      owner: propertyData.owner,
    });

    await property.save();
    res.json(property);
  } catch (error) {
    console.error('Error fetching property data', error);
    res.status(500).send('Server error');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});