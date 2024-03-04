'use strict';

const { get } = require('lodash');
const moment = require('moment-timezone');
const { blueprint, types } = require('podeng');

const db = require(`${__base}app/models`);
const { Masking, PREFIX } = require(`${__base}lib/common/masking-id`);
const { ErrResponse } = require(`${__base}lib/response`);

module.exports = async (req, res, next) => {
  try {
    const id = Masking(PREFIX.RESUME).get(req.params.id);
    
    const resume = await db.Resume.findOne({ 
      where: { id },
      include: [{
        model: db.Appointment,
        required: true,
        include: [{
          model: db.GeneralCheck,
        }, {
          model: db.Pet,
          required: true
        }, {
          model: db.PetOwner,
          required: true
        }, {
          model: db.Doctor,
          required: true
        }]
      }]
    });
    if(!resume) {
      throw new ErrResponse('Resume not found', 400);
    }

    const responseScheme = {
      computed: blueprint.object({
        id: types.transform(id => Masking(PREFIX.RESUME).set(id)),
        common: types.any,
        anamnesis: types.any,
        complaint: types.string,
        physical: types.string,
        diagnose: types.string,
        prognose: types.string,
        treatment: types.string,
        steril: types.bool,
        age: types.any,
        height: types.number,
        weight: types.number,
        temperature: types.number,
        visitAt: types.string,
        visitTime: types.string,
      }),
      pet: blueprint.object({
        id: types.transform(id => Masking(PREFIX.PET).set(id)),
        name: types.string,
        code: types.string,
        gender: types.string,
        breed: types.string,
        species: types.string,
        additional: types.any
      }),
      petOwner: blueprint.object({
        id: types.transform(id => Masking(PREFIX.PET_OWNER).set(id)),
        name: types.string,
        phone: types.string,
      }),
      doctor: blueprint.object({
        id: types.transform(id => Masking(PREFIX.DOCTOR).set(id)),
        name: types.string,
      })
    };

    const data = {
      ...responseScheme.computed.serialize({
        ...resume.dataValues,
        visitAt: moment(get(resume, 'Appointment.visitAt')).format('YYYY-MM-DD'),
        visitTime: get(resume, 'Appointment.visitTime'),
        steril: get(resume, 'Appointment.GeneralCheck.steril', false),
        height: get(resume, 'Appointment.GeneralCheck.height'),
        weight: get(resume, 'Appointment.GeneralCheck.weight'),
        age: get(resume, 'Appointment.GeneralCheck.age'),
        temperature: get(resume, 'Appointment.GeneralCheck.temperature'),
      }),
      pet: responseScheme.pet.serialize(resume.Appointment.Pet),
      petOwner: responseScheme.petOwner.serialize(resume.Appointment.PetOwner),
      doctor: responseScheme.doctor.serialize(resume.Appointment.Doctor),
    };

    res.status(200).json({
      status: true,
      message: 'successfully get resume',
      data
    });
  } catch(err) {
    next(err);
  }
};