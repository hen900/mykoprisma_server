const MeasModel = require('../models/measurement.model.js');
const PresetModel = require('../models/preset.model.js');

exports.set = (req, res) => {
  MeasModel.newMeas(req.body)
    .then((result) => {
      // Retrieve the current preset data (which includes override data)
      return PresetModel.get();
    })
    .then((preset) => {
      if (preset) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(preset, null, 3));
      } else {
        res.status(404).send('Preset data not found');
      }
    })
    .catch((error) => {
      console.error('Error inserting measurement:', error);
      res.status(500).send('Internal Server Error');
    });
};

exports.get = (req, res) => {
  let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;

  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }

  const from = req.query.from;
  const to = req.query.to;

  const query = {};
  if (from && to) {
    query.timestamp = { $gte: new Date(from), $lte: new Date(to) };
  } else if (from) {
    query.timestamp = { $gte: new Date(from) };
  } else if (to) {
    query.timestamp = { $lte: new Date(to) };
  }

  MeasModel.list(query, limit, page)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error('Error retrieving measurements:', error);
      res.status(500).send('Internal Server Error');
    });
};