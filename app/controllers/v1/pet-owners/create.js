'use strict';

const db = require(`${__base}app/models`);
const Joi = require(`${__base}lib/joi`);

module.exports = async (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    gender: Joi.string().valid('male', 'female').default('male'),
    birthplace: Joi.string(),
    birthday: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email(),
    address: Joi.string().allow(null, ''),
    isActive: Joi.boolean().default(true),
    additional: Joi.array().items({
      key: Joi.string(),
      value: Joi.string()
    }).allow(null),
  });

  try {
    const params = await Joi.validate(req.body, schema);

    await db.PetOwner.create(params);

    res.status(200).json({
      success: true,
      message: 'successfully create pet'
    });
  } catch(err) {
    next(err);
  }
};