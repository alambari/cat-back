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
    
    const [ rows, count ] = await Promise.all([
      db.Doctor.findAll({
        where: condition,
        offset: params.perPage * (params.page - 1),
        limit: params.perPage
      }),
      db.Doctor.count({ where: condition })
    ]);

    const response = blueprint.array({
      id: types.transform(id => Masking(PREFIX.DOCTOR).set(id)),
      name: types.string,
      gender: types.string,
      phone: types.string,
      email: types.transform(email => toLower(email)),
      birthday: types.datetime,
      specialist: types.string,
      address: types.string
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