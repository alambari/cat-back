'use strict';

const { blueprint, types } = require('podeng');

const db = require(`${__base}app/models`);
const { Masking, PREFIX } = require(`${__base}lib/common/masking-id`);
const { ErrResponse } = require(`${__base}lib/response`);

module.exports = async (req, res, next) => {
  try {
    const id = Masking(PREFIX.PET_OWNER).get(req.params.id);
    
    const result = await db.PetOwner.findOne({ 
      where: { id },
      include: [{
        model: db.Pet,
        required: true
      }]
    });

    if(!result) {
      throw new ErrResponse('Pet Owner not found', 400);
    }

    const response = blueprint.object({
      id: types.transform(id => Masking(PREFIX.PET_OWNER).set(id)),
      name: types.string,
      code: types.string,
      gender: types.string,
      phone: types.string,
      email: types.string,
      birthday: types.datetime,
      address: types.string,
      isActive: types.bool,
      Pets: types.transform(item => {
        return blueprint.array({
          id: types.transform(id => Masking(PREFIX.PET).set(id)),
          name: types.string,
          species: types.string,
          breed: types.string,
          isActive: types.bool,
        }).serialize(item);  
      }, { serialize: { to: 'pets' } })
    });

    res.status(200).json({
      status: true,
      message: 'successfully get pet owner',
      data: response.serialize(result)
    });
  } catch(err) {
    next(err);
  }
};