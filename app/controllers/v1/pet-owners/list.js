'use strict';

const { toLower } = require('lodash');
const { blueprint, types } = require('podeng');

const db = require(`${__base}app/models`);
const Joi = require(`${__base}lib/joi`);
const { Op } = require('sequelize');
const { Masking, PREFIX } = require(`${__base}lib/common/masking-id`);

module.exports = async (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().allow(null, ''),
    code: Joi.string().allow(null, ''),
    phone: Joi.string().allow(null, ''),
    page: Joi.number().integer().positive().default(1),
    perPage: Joi.number().integer().positive().default(25),
  });

  try {
    const params = await Joi.validate(req.query, schema);

    const condition = {};
    if(params.name) {
      Object.assign(condition, {
        name: {
          [Op.iLike]: `%${params.name}%`
        }
      });
    }

    if(params.code) {
      Object.assign(condition, {
        code: {
          [Op.iLike]: `%${params.code}%`
        }
      });
    }

    if(params.phone) {
      Object.assign(condition, {
        phone: {
          [Op.iLike]: `%${params.phone}%`
        }
      });
    }
    
    const [ rows, count ] = await Promise.all([
      db.PetOwner.findAll({
        where: condition,
        include: [{
          model: db.Pet,
          required: true,
        }],
        offset: params.perPage * (params.page - 1),
        limit: params.perPage
      }),
      db.PetOwner.count({ where: condition })
    ]);

    const response = blueprint.array({
      id: types.transform(id => Masking(PREFIX.PET_OWNER).set(id)),
      name: types.string,
      code: types.string,
      gender: types.string,
      phone: types.string,
      email: types.transform(email => toLower(email)),
      birthday: types.datetime,
      address: types.string,
      Pets: types.transform(item => {
        return blueprint.array({
          id: types.transform(id => Masking(PREFIX.PET).set(id)),
          name: types.string,
          code: types.string,
          species: types.string,
          breed: types.string,
        }).serialize(item);  
      }, { serialize: { to: 'pets' } })
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