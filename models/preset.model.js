const mongoose = require('../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const presetSchema = new Schema({
    humidity: Number,
    co2: Number,
    temperature: Number
});

presetSchema.set('toJSON', {
    virtuals: true
});

const PresetModel = mongoose.model('test_data_56', presetSchema);

// Function to set the override buffer
PresetModel.set = async function (input) {
    try {
        // Check if there's an existing entry, if yes, remove it
        await PresetModel.deleteMany({});

        // Create a new entry with the provided override data
        await PresetModel.create(input);
        return true;
    } catch (error) {
        console.error("Error changing preset", error);
        return false;
    }
};

// Function to get the override buffer
PresetModel.get = async function () {
    try {
        // Find the latest entry (there should be only one)
        const presets = await PresetModel.findOne({});
        return presets;
    } catch (error) {
        console.error("Error setting presets", error);
        return null;
    }
};

module.exports = PresetModel;
