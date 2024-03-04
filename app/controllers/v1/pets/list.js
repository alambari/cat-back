'use strict';

const { blueprint, types } = require('podeng');

const db = require(`${__base}app/models`);
const Joi = require(`${__base}lib/joi`);
const { Op } = require('sequelize');

const { Masking, PREFIX } = require(`${__base}lib/common/masking-id`);

module.exports = async (req, res, next) => {
  const schema = Joi.object().keys({
    ownerId: Joi.string().masking(PREFIX.PET_OWNER).allow(null, ''),
    ownerName: Joi.string().allow(null, ''),
    name: Joi.string().allow(null, ''),
    code: Joi.string().allow(null, ''),
    species: Joi.string().valid('cat', 'dog').allow(null, ''),
    gender: Joi.string().valid('male', 'female', 'other').allow(null, ''),
    breed: Joi.string().allow(null, ''),
    page: Joi.number().integer().positive().default(1),
    perPage: Joi.number().integer().positive().default(25),
  });

  try {
    const params = await Joi.validate(req.query, schema);

    const condition = {
      pet: {
        where: {}
      },
      petOwner: {
        where: {}
      }
    };
    
    if(params.name) {
      Object.assign(condition.pet.where, {
        name: {
          [Op.iLike]: `%${params.name}%`
        }
      });
    }

    if(params.code) {
      Object.assign(condition.pet.where, {
        code: {
          [Op.iLike]: `%${params.code}%`
        }
      });
    }

    if(params.species) {
      Object.assign(condition.pet.where, {
        species: params.species
      });
    }

    if(params.gender) {
      Object.assign(condition.pet.where, {
        gender: params.gender
      });
    }

    if(params.ownerId) {
      Object.assign(condition.petOwner.where, {
        id: params.ownerId
      });
    }

    if(params.ownerName) {
      Object.assign(condition.petOwner.where, {
        name: {
          [Op.iLike]: `%${params.ownerName}%`
        }
      });
    }
  
    const [ rows, count ] = await Promise.all([
      db.Pet.findAll({
        ...condition.pet,
        include: [{
          model: db.PetOwner,
          ...condition.petOwner,
          required: true,
        }],
        offset: params.perPage * (params.page - 1),
        limit: params.perPage
      }),
      db.Pet.count({ ...condition.pet })
    ]);

    const response = blueprint.array({
      id: types.transform(id => Masking(PREFIX.PET).set(id)),
      name: types.string,
      code: types.string,
      species: types.string,
      breed: types.string,
      gender: types.string,
      additional: types.any,
      PetOwner: types.transform(item => {
        return blueprint.object({
          id: types.transform(id => Masking(PREFIX.PET_OWNER).set(id)),
          name: types.string,
          code: types.string,
          gender: types.string,
          phone: types.string,
          email: types.transform(email => email.toLowerCase()),
          birthday: types.datetime,
        }).serialize(item);
      }, { serialize: { to: 'petOwner' } })
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