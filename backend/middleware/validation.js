import validator from 'validator';

export const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (email && !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
  }
  next();
};

export const validatePhone = (req, res, next) => {
  const { phone } = req.body;
  if (phone && !validator.isMobilePhone(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number',
    });
  }
  next();
};

export const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if (password && password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }
  next();
};

export const validateBloodGroup = (req, res, next) => {
  const { bloodGroup } = req.body;
  const validGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  if (bloodGroup && !validGroups.includes(bloodGroup)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid blood group',
    });
  }
  next();
};

export const validateLocation = (req, res, next) => {
  const { latitude, longitude } = req.body.location || {};
  if ((latitude || longitude) && (!validator.isLatLong(`${latitude},${longitude}`))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid location coordinates',
    });
  }
  next();
};

export const validateRequired = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }
    next();
  };
};
