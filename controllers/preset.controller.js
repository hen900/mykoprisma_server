const PresetModel = require('../models/preset.model.js');
const OverrideModel =  require('../models/override.model.js');

// Controller function to set the override buffer
exports.set= async (req, res) => {
    const newPresetData = req.body; // Assuming override data is sent in the request body

    try {
        const result = await PresetModel.set(newPresetData);
        if (result) {
            res.status(200).json({ message: "Preset  set successfully." });
        } else {
            res.status(500).json({ message: "Failed to set preset" });
        }
    } catch (error) {
        console.error("Error setting override buffer:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
exports.get = async (req, res) => {
  try {
    const presetData = await PresetModel.findOne().select('-_id -__v');
    const overrideData = await OverrideModel.findOne().select('-_id -__v');

    // Merge the preset and override data
    const mergedData = { ...presetData.toObject(), ...overrideData.toObject() };

    // Send the merged data as the response
    res.status(200).json(mergedData);
  } catch (error) {
    console.error("Error getting preset data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
