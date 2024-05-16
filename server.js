/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('mongodbVSCodePlaygroundDB');

// Insert a few documents into the sales collection.
db.getCollection('sales').insertMany([
  { 'item': 'abc', 'price': 10, 'quantity': 2, 'date': new Date('2014-03-01T08:00:00Z') },
  { 'item': 'jkl', 'price': 20, 'quantity': 1, 'date': new Date('2014-03-01T09:00:00Z') },
  { 'item': 'xyz', 'price': 5, 'quantity': 10, 'date': new Date('2014-03-15T09:00:00Z') },
  { 'item': 'xyz', 'price': 5, 'quantity': 20, 'date': new Date('2014-04-04T11:21:39.736Z') },
  { 'item': 'abc', 'price': 10, 'quantity': 10, 'date': new Date('2014-04-04T21:23:13.331Z') },
  { 'item': 'def', 'price': 7.5, 'quantity': 5, 'date': new Date('2015-06-04T05:08:13Z') },
  { 'item': 'def', 'price': 7.5, 'quantity': 10, 'date': new Date('2015-09-10T08:43:00Z') },
  { 'item': 'abc', 'price': 10, 'quantity': 5, 'date': new Date('2016-02-06T20:20:13Z') },
]);

// Run a find command to view items sold on April 4th, 2014.
const salesOnApril4th = db.getCollection('sales').find({
  date: { $gte: new Date('2014-04-04'), $lt: new Date('2014-04-05') }
}).count();

// Print a message to the output window.
console.log(`${salesOnApril4th} sales occurred in 2014.`);

// Here we run an aggregation and open a cursor to the results.
// Use '.toArray()' to exhaust the cursor to return the whole result set.
// You can use '.hasNext()/.next()' to iterate through the cursor page by page.
db.getCollection('sales').aggregate([
  // Find all of the sales that occurred in 2014.
  { $match: { date: { $gte: new Date('2014-01-01'), $lt: new Date('2015-01-01') } } },
  // Group the total sales for each product.
  { $group: { _id: '$item', totalSaleAmount: { $sum: { $multiply: [ '$price', '$quantity' ] } } } }
]);

mongoimport --uri "your_mongo_db_atlas_connection_string" --collection balades --file paris.json --jsonArray

const mongoose = require('mongoose');

const baladeSchema = new mongoose.Schema({
    nom_poi: { type: String, required: true },
    adresse: String,
    categorie: { type: String, required: true },
    texte_intro: String,
    texte_description: String,
    url_site: String,
    mot_cle: [String],
    date_publication: Date,
    num: Number
});

module.exports = mongoose.model('Balade', baladeSchema);
const express = require('express');
const router = express.Router();
const Balade = require('../models/Balade');

// Route pour lister toutes les balades
router.get('/all', async (req, res) => {
    try {
        const balades = await Balade.find();
        res.json(balades);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route pour afficher une balade via son identifiant unique
router.get('/id/:id', getBalade, (req, res) => {
    res.json(res.balade);
});

// Middleware pour récupérer une balade par ID
async function getBalade(req, res, next) {
    let balade;
    try {
        balade = await Balade.findById(req.params.id);
        if (balade == null) {
            return res.status(404).json({ message: 'Balade non trouvée' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.balade = balade;
    next();
}

// Autres routes similaires à ajouter ici...

module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const baladeRoutes = require('./routes/balades');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use('/balades', baladeRoutes);

app.listen(1235, () => console.log('Server Started on port 1235'));
// Route pour rechercher des balades par nom_poi ou texte_intro
router.get('/search/:search', async (req, res) => {
    try {
        const regex = new RegExp(req.params.search, 'i');
        const balades = await Balade.find({ 
            $or: [{ nom_poi: regex }, { texte_intro: regex }]
        });
        res.json(balades);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route pour les balades avec un site internet
router.get('/site-internet', async (req, res) => {
    try {
        const balades = await Balade.find({ url_site: { $ne: null } });
        res.json(balades);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route pour les balades avec plus de 5 mots clés
router.get('/mot-cle', async (req, res) => {
    try {
        const balades = await Balade.find({ mot_cle: { $size: { $gt: 5 } } });
        res.json(balades);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

       