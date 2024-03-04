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
      resume: {},
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
      db.Resume.findAll({ 
        where: condition.resume,
        include: [{
          model: db.Appointment,
          where: condition.appointment,
          required: true,
          include: [{
            model: db.Pet,
            where: condition.pet,
            required: true
          }, {
            model: db.PetOwner,
            where: condition.petOwner,
            required: true
          }, {
            model: db.Doctor,
            where: condition.doctor,
            required: true
          }]
        }],
        offset: params.perPage * (params.page - 1),
        limit: params.perPage
      }),
      db.Resume.count({ where: condition.resume })
    ]);

    const responseScheme = {
      computed: blueprint.object({
        id: types.transform(id => Masking(PREFIX.RESUME).set(id)),
        complaint: types.string,
        diagnose: types.string,
        visitAt: types.string,
        visitTime: types.string,
      }),
      pet: blueprint.object({
        id: types.transform(id => Masking(PREFIX.PET).set(id)),
        name: types.string,
        code: types.string,
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

    const data = rows.map((item) => {
      return {
        ...responseScheme.computed.serialize({ ...item.dataValues,
          visitAt: item.Appointment.visitAt,
          visitTime: item.Appointment.visitTime,
        }),
        pet: responseScheme.pet.serialize(item.Appointment.Pet),
        petOwner: responseScheme.pet.serialize(item.Appointment.PetOwner),
        doctor: responseScheme.pet.serialize(item.Appointment.Doctor),
      };
    });    

    res.status(200).json({
      rows: data || [],
      count: count || 0,
      page: params.page,
      perPage: params.perPage
    });
  } catch(err) {
    next(err);
  }
};