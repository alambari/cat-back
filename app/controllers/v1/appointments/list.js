'use strict';

const moment = require('moment');
const { blueprint, types } = require('podeng');

const db = require(`${__base}app/models`);
const Joi = require(`${__base}lib/joi`);
const { Op } = require('sequelize');

const { Masking, PREFIX } = require(`${__base}lib/common/masking-id`);

module.exports = async (req, res, next) => {
  const schema = Joi.object().keys({
    startAt: Joi.date().iso().default(moment().startOf('day').toISOString()),
    endAt: Joi.date().iso().default(moment().endOf('day').toISOString()),
    name: Joi.string().allow(null, ''),
    ownerName: Joi.string().allow(null, ''),
    doctorName: Joi.string().allow(null, ''),
    status: Joi.array().items(Joi.string()).single().allow(null),
    page: Joi.number().integer().positive().default(1),
    perPage: Joi.number().integer().positive().default(25),
  });

  try {
    const params = await Joi.validate(req.query, schema, { allowUnknown: true });

    const condition = {
      pet: {},
      doctor: {},
      petOwner: {},
      appointment: {
        // visitAt: {
        //   [Op.gte]: params.startAt,
        //   [Op.lte]: params.endAt,
        // }
      }
    };
    if(params.name) {
      Object.assign(condition.appointment, {
        name: {
          [Op.iLike]: `%${params.name}%`
        }
      });
    }
    if(params.ownerName) {
      Object.assign(condition.petOwner, {
        name: {
          [Op.iLike]: `%${params.ownerName}%`
        }
      });
    }
    if(params.doctorName) {
      Object.assign(condition.doctor, {
        name: {
          [Op.iLike]: `%${params.doctorName}%`
        }
      });
    }

    if(params.status && params.status.length > 0) {
      Object.assign(condition.appointment, {
        status: {
          [Op.in]: params.status
        }
      });
    }
    
    const [ rows, count ] = await Promise.all([
      db.Appointment.findAll({
        where: condition.appointment,
        include: [{
          model: db.Pet,
          where: condition.pet,
          required: true,
        }, {
          model: db.Doctor,
          where: condition.doctor,
          required: true
        }, {
          model: db.PetOwner,
          where: condition.petOwner,
          required: true
        }],
        order: [['visitAt', 'ASC'], ['visitTime', 'ASC']],
        offset: params.perPage * (params.page - 1),
        limit: params.perPage
      }),
      db.Appointment.count({ where: condition.appointment })
    ]);

    const response = blueprint.array({
      id: types.transform(id => Masking(PREFIX.APPOINTMENT).set(id)),
      Pet: types.transform(pet => {
        return blueprint.object({
          id: types.transform(id => Masking(PREFIX.PET).set(id)),
          code: types.string,
          name: types.string,
        }).serialize(pet);
      }, { serialize: { to: 'pet' }}),
      PetOwner: types.transform(petOwner => {
        return blueprint.object({
          id: types.transform(id => Masking(PREFIX.PET_OWNER).set(id)),
          name: types.string,
          code: types.string,
          phone: types.string,
          address: types.string,
        }).serialize(petOwner);
      }, { serialize: { to: 'petOwner' }}),
      Doctor: types.transform(doctor => {
        return blueprint.object({
          id: types.transform(id => Masking(PREFIX.DOCTOR).set(id)),
          name: types.string,
        }).serialize(doctor);
      }, { serialize: { to: 'doctor' }}),
      visitAt: types.string,
      visitTime: types.string,
      service: types.string,
      status: types.string,
      notes: types.string,
    });

    res.status(200).json({
      rows: response.serialize(rows) || [],
      count: count || 0,
      page: params.page,
      perPage: params.perPage
    });
  } catch(err) {
    next(err);
  }
};