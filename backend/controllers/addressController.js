import Address from "../models/Address.js";

// ✅ Save Address (duplicate रोकने के साथ)
export const saveAddress = async (req, res) => {
  try {
    const { userId, addressLine, city, pincode } = req.body;

    // duplicate check
    const existing = await Address.findOne({
      userId,
      addressLine,
      city,
      pincode,
    });

    if (existing) {
      return res.json({
        message: "Address already exists",
        address: existing,
      });
    }

    const address = await Address.create(req.body);

    res.json({
      message: "Address saved successfully",
      address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving address" });
  }
};

// ✅ Get Addresses
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      userId: req.params.userId,
    });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching addresses" });
  }
};

// ✅ Delete Address
export const deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};