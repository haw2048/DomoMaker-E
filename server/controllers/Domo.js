const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    console.log(query);
    const docs = await Domo.find(query).select('name age country').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retriving domos!' });
  }
};

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.country) {
    return res.status(400).json({ error: 'Both name, age, and birth country are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    country: req.body.country,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, country: newDomo.country });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

const deleteDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.country) {
    return res.status(400).json({ error: 'Both name, age, and birth country are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    country: req.body.country,
    owner: req.session.account._id,
  };

  try {
    await Domo.deleteOne(domoData);

    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
