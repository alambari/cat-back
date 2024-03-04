'use strict';

const db = require(`${__base}app/models`);
const Joi = require(`${__base}lib/joi`);
const { Masking, PREFIX } = require(`${__base}lib/common/masking-id`);
const { ErrResponse } = require(`${__base}lib/response`);

module.exports = async (req, res, next) => {
  const schema = Joi.object().keys({
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
    const id = Masking(PREFIX.PET).get(req.params.id);

    const pet = await db.Pet.findOne({
      where: { id }
    });

    if(!pet) {
      throw new ErrResponse('Pet not found', 400);
    }

    await pet.update({
      ...params
    });

    res.status(200).json({
      success: true,
      message: 'successfully update pet'
    });
  } catch(err) {
    next(err);
  }
};