'use strict';

const { blueprint, types } = require('podeng');

const db = require(`${__base}app/models`);
const { Masking, PREFIX } = require(`${__base}lib/common/masking-id`);
const { ErrResponse } = require(`${__base}lib/response`);

module.exports = async (req, res, next) => {
  try {
    const id = Masking(PREFIX.APPOINTMENT).get(req.params.id);
    
    const appointment = await db.Appointment.findOne({ 
      where: { id },
      include: [{
        model: db.GeneralCheck
      },{
        model: db.Pet,
        required: true
      }, {
        model: db.PetOwner,
        required: true
      }, {
        model: db.Doctor,
        required: true
      }]
    });
    if(!appointment) {
      throw new ErrResponse('Appointment not found', 400);
    }

    const response = blueprint.object({
      id: types.transform(id => Masking(PREFIX.APPOINTMENT).set(id)),
      visitAt: types.string,
      visitTime: types.string,
      status: types.string,
      reason: types.string,
      GeneralCheck: types.transform(item => {
        return blueprint.object({
          weight: types.string,
          height: types.string,
          age: types.string,
          steril: types.string,
          temperature: types.string
        }).serialize(item);
      }, { serialize: { to: 'generalCheck' } }),
      Pet: types.transform(item => {
        return blueprint.object({
          id: types.transform(id => Masking(PREFIX.PET).set(id)),
          name: types.string,
          gender: types.string,
          code: types.string,
          breed: types.string,
          species: types.string,
          additional: types.any
        }).serialize(item);
      }, { serialize: { to: 'pet' } }),
      PetOwner: types.transform(item => {
        return blueprint.object({
          id: types.transform(id => Masking(PREFIX.PET_OWNER).set(id)),
          name: types.string,
          code: types.string,
          gender: types.string,
          phone: types.string,
          email: types.string,
          birthday: types.datetime,
          address: types.string,
        }).serialize(item);
      }, { serialize: { to: 'petOwner' } }),
      Doctor: types.transform(item => {
        return blueprint.object({
          id: types.transform(id => Masking(PREFIX.DOCTOR).set(id)),
          name: types.string,
          gender: types.string,
          phone: types.string,
          email: types.string,
          birthday: types.datetime,
          address: types.string,
        }).serialize(item);
      }, { serialize: { to: 'doctor' } })
    });    

    res.status(200).json({
      status: true,
      message: 'successfully get appointment',
      data: response.serialize(appointment)
    });
  } catch(err) {
    next(err);
  }
};