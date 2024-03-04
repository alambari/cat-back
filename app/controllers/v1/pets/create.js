'use strict';

const db = require(`${__base}app/models`);
const Joi = require(`${__base}lib/joi`);
const { PREFIX } = require(`${__base}lib/common/masking-id`);

module.exports = async (req, res, next) => {
  const schema = Joi.object().keys({
    PetOwnerId: Joi.string().masking(PREFIX.PET_OWNER).required(),
    name: Joi.string().required(),
    gender: Joi.string().valid('male', 'female').default('male'),
    species: Joi.string().allow(null, ''),
    breed: Joi.string().allow(null, ''),
    isActive: Joi.boolean().default(true),
    additional: Joi.array().items({
      key: Joi.string(),
      value: Joi.string()
    }).allow(null),
  });

  try {
    const params = await Joi.validate(req.body, schema);

    await db.Pet.create(params);

    res.status(200).json({
      success: true,
      message: 'successfully create pet'
    });
  } catch(err) {
    next(err);
  }
};