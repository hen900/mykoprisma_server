const MeasModel = require('../models/measurement.model');
var fs = require('fs'); // new


exports.insert = (req, res) => {

var outbox = JSON.parse(fs.readFileSync('./public/outbox.json', 'utf8')); // file containing user input on what to set actuators

  MeasModel.newMeas(req.body)
    .then((result) => {
      const latestMeasurement = {
        actuator1Set: outbox.actuator1Set, //upon measurement being posted, respond with command set
        actuator2Set: outbox.actuator2Set,
        actuator3Set: outbox.actuator3Set,
	actuator4Set: outbox.actuator4Set,
	actuator5Set: outbox.actuator5Set
      };
      res.setHeader('Content-Type', 'application/json'); //set headers for result and format
      res.end(JSON.stringify(latestMeasurement,null,3));
    });
};



exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    MeasModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};
