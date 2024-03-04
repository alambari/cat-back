'use strict';

const db = require(`${__base}app/models`);
const Joi = require(`${__base}lib/joi`);

const { PREFIX } = require(`${__base}lib/common/masking-id`);
const { ErrResponse } = require(`${__base}lib/response`);

module.exports = async (req, res, next) => {
  const schema = Joi.object().keys({
    appointmentId: Joi.string().masking(PREFIX.APPOINTMENT).required(),
    age: Joi.object().keys({
      year: Joi.number().allow(null),
      month: Joi.number().allow(null),
      day: Joi.number().allow(null),  
    }).allow(null),
    weight: Joi.number().allow(null),
    height: Joi.number().allow(null),
    steril: Joi.boolean().default(false),
    temperature: Joi.number().allow(null),
    additional: Joi.object().allow(null),
  });

  try {
    const params = await Joi.validate(req.body, schema);

    const appointment = await db.Appointment.findOne({
      where: { 
        id: params.appointmentId 
      },
      include: [db.Pet]
    });
    if(!appointment) {
      throw new ErrResponse('Appointment not found', 400);
    }

    const generalCheck = await db.GeneralCheck.findOne({
      where: { 
        AppointmentId: appointment.id
      }
    });
    const data = {
      age: params.age,
      height: params.height,
      weight: params.weight,
      steril: params.steril,
      temperature: params.temperature,
      additional: params.additional
    };
    if(generalCheck) {
      await generalCheck.update(data);
    } else {
      await db.GeneralCheck.create({
        AppointmentId: appointment.id,
        PetId: appointment.Pet.id,
        ...data,
      });
    }

    res.status(200).json({
      success: true,
      message: 'successfully create general checkup'
    });
  } catch(err) {
    next(err);
  }
};