const mongoose = require('../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const measSchema = new Schema({
    humidity: Number,
    co2: Number,
    temperature: Number,
    timestamp: Number,
    waterLevel: Number,
    actuator1Status: Boolean,
    actuator2Status: Boolean,
    actuator3Status: Boolean,
    actuator4Status: Boolean,
    actuator5Status: Boolean
    
});

measSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
measSchema.set('toJSON', {
    virtuals: true
});


const Meas = mongoose.model('test_data_72', measSchema);

exports.getChartData = async (dataPoint) => {
  const measurements = await Meas.find({}, dataPoint, { sort: { timestamp: -1 }, limit: 100 });
  const timestamps = measurements.map(measurement => new Date(measurement.timestamp));
  const values = measurements.map(measurement => measurement[dataPoint]);
  return { timestamps, values };
};


exports.list = (id) => {
	return Meas.find();
}

exports.newMeas = (measData) => {
    const meas = new Meas(measData);
    return meas.save();
};
