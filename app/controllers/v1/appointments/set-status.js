'use strict';

const db = require(`${__base}app/models`);
const Joi = require(`${__base}lib/joi`);

const { Masking, PREFIX } = require(`${__base}lib/common/masking-id`);
const { ErrResponse } = require(`${__base}lib/response`);

module.exports = async (req, res, next) => {
  const schema = Joi.object().keys({
    status: Joi.string().valid('new', 'canceled', 'confirmed', 'completed').required(),
    reason: Joi.string()
  });

  try {
    const params = await Joi.validate(req.body, schema);

    const id = Masking(PREFIX.APPOINTMENT).get(req.params.id);

    const appointment = await db.Appointment.findOne({
      where: { id }
    });
    if(!appointment) {
      throw new ErrResponse('Appointment not found', 400);
    }

    await appointment.update({
      reason: params.reason,
      status: params.status
    });

    res.status(200).json({
      success: true,
      message: 'successfully update appointment status'
    });
  } catch(err) {
    next(err);
  }
};