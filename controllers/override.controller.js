const BufferModel = require('../models/override.model.js');

// Controller function to set the override buffer
exports.set = async (req, res) => {
  const overrideData = req.body; // Assuming override data is sent in the request body

  try {
    // Get the existing override buffer
    const existingBuffer = await BufferModel.findOne();

    if (existingBuffer) {
      // Merge the existing buffer with the new override data
      Object.assign(existingBuffer, overrideData);

      // Save the updated buffer
      const result = await existingBuffer.save();

      if (result) {
        res.status(200).json({ message: "Override buffer updated successfully." });
      } else {
        res.status(500).json({ message: "Failed to update override buffer." });
      }
    } else {
      // Create a new override buffer if it doesn't exist
      const newBuffer = new BufferModel(overrideData);
      const result = await newBuffer.save();

      if (result) {
        res.status(201).json({ message: "Override buffer created successfully." });
      } else {
        res.status(500).json({ message: "Failed to create override buffer." });
      }
    }
  } catch (error) {
    console.error("Error updating/creating override buffer:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller function to get the override buffer
exports.get = async (req, res) => {
  try {
    const overrideBuffer = await BufferModel.findOne().select('-_id -__v');

    if (overrideBuffer) {
      res.status(200).json(overrideBuffer);
    } else {
      res.status(404).json({ message: "Override buffer not found." });
    }
  } catch (error) {
    console.error("Error getting override buffer:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
