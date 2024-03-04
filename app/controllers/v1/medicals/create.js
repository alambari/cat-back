'use strict';

const db = require(`${__base}app/models`);
const Joi = require(`${__base}lib/joi`);

const { PREFIX } = require(`${__base}lib/common/masking-id`);
const { ErrResponse } = require(`${__base}lib/response`);

module.exports = async (req, res, next) => {
  const schema = Joi.object().keys({
    appointmentId: Joi.string().masking(PREFIX.APPOINTMENT),
    complaint: Joi.string().required(),
    physical: Joi.string(),
    diagnose: Joi.string().required(),
    prognose: Joi.string(),
    treatment: Joi.string().required(),
    common: Joi.object().allow(null),
    anamnesis: Joi.object().allow(null),
    additional: Joi.object().allow(null),
    notes: Joi.string().allow(null, ''),
  });

  try {
    const params = await Joi.validate(req.body, schema);

    const appointment = await db.Appointment.findOne({
      where: {
        id: params.appointmentId
      }
    });
    if(!appointment) {
      throw new ErrResponse('Appointment not found', 400);
    }

    const resume = await db.Resume.findOne({
      AppointmentId: appointment.id
    });
    if(resume) {
      return res.status(200).json({
        success: true,
        message: 'successfully create resume'
      });
    }

    await db.Resume.create({
      AppointmentId: appointment.id,
      PetId: appointment.PetId,
      complaint: params.complaint,
      physical: params.physical,
      diagnose: params.diagnose,
      prognose: params.prognose,
      treatment: params.treatment,
      common: params.common,
      anamnesis: params.anamnesis,
      additional: params.additional,
      notes: params.notes
    });

    await appointment.update({
      status: 'completed'
    });

    res.status(200).json({
      success: true,
      message: 'successfully create resume'
    });
  } catch(err) {
    next(err);
  }
};