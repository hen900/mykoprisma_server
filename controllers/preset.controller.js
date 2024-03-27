const PresetModel = require('../models/preset.model.js');

// Controller function to set the preset data
exports.set = async (req, res) => {
  const newPresetData = req.body; // Assuming preset data is sent in the request body

  try {
    const result = await PresetModel.set(newPresetData);

    if (result) {
      res.status(200).json({ message: "Preset set successfully." });
    } else {
      res.status(500).json({ message: "Failed to set preset" });
    }
  } catch (error) {
    console.error("Error setting preset data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller function to get the preset data
exports.get = async (req, res) => {
  try {
    const presetData = await PresetModel.findOne().select('-_id -__v');

    if (presetData) {
      res.status(200).json(presetData);
    } else {
      res.status(404).json({ message: "Preset data not found." });
    }
  } catch (error) {
    console.error("Error getting preset data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};