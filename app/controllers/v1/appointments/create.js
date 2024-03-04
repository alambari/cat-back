'use strict';

const db = require(`${__base}app/models`);
const Joi = require(`${__base}lib/joi`);

const { PREFIX } = require(`${__base}lib/common/masking-id`);
const { ErrResponse } = require(`${__base}lib/response`);

module.exports = async (req, res, next) => {
  const schema = Joi.object().keys({
    petId: Joi.string().masking(PREFIX.PET).allow(null, ''),
    doctorId: Joi.string().masking(PREFIX.DOCTOR).required(),
    petOwnerId: Joi.string().masking(PREFIX.PET_OWNER).allow(null, ''),
    
    name: Joi.string().allow(null, ''),
    gender: Joi.string().valid('male', 'female').allow(null, ''),
    species: Joi.string().valid('cat', 'dog', 'other').allow(null, ''),

    ownerName: Joi.string().allow(null ,''),
    ownerPhone: Joi.string().phone().allow(null, ''),
    ownerEmail: Joi.string().email().allow(null, ''),
    ownerAddress: Joi.string().allow(null, ''),
    
    visitAt: Joi.string().dateOnly().required(),
    visitTime: Joi.string().timeOnly().required(),
    notes: Joi.string().allow(null, ''),
  });

  try {
    const params = await Joi.validate(req.body, schema);

    let petNew = false;
    if(!params.petId && !params.petOwnerId) {
      petNew = true;
    }

    let petOwner, pet;
    if(petNew) {
      petOwner = await db.PetOwner.create({
        name: params.ownerName,
        phone: params.ownerPhone,
        email: params.ownerEmail,
        address: params.ownerAddress,
      });

      if(petOwner) {
        pet = await db.Pet.create({
          PetOwnerId: petOwner.id,
          name: params.name,
          gender: params.gender,
          species: params.species
        });
      }
    } else {
      petOwner = await db.PetOwner.findOne({
        where: {
          id: params.petOwnerId
        }
      });
      if(!petOwner) {
        throw new ErrResponse('Pet Owner not found', 400);
      }

      pet = await db.Pet.findOne({
        where: {
          id: params.petId
        }
      });
      if(!pet) {
        throw new ErrResponse('Pet not found', 400);
      }
    }

    const doctor = await db.Doctor.findOne({
      where: {
        id: params.doctorId
      }
    });
    if(!doctor) {
      throw new ErrResponse('Doctor not found', 400);
    }

    await db.Appointment.create({
      PetId: pet.id,
      DoctorId: doctor.id,
      PetOwnerId: petOwner.id,
      visitAt: params.visitAt,
      visitTime: params.visitTime,
      notes: params.notes,
      status: 'new'
    });

    res.status(200).json({
      success: true,
      message: 'successfully create appointment'
    });
  } catch(err) {
    next(err);
  }
};