'use strict';

const { blueprint, types } = require('podeng');

const db = require(`${__base}app/models`);
const { Masking, PREFIX } = require(`${__base}lib/common/masking-id`);

module.exports = async (req, res, next) => {
  try {
    const id = Masking(PREFIX.PET).get(req.params.id);
    
    const pet = await db.Pet.findOne({ 
      where: { id },
      include: [{
        model: db.PetOwner,
        required: true
      }, {
        model: db.GeneralCheck,
        order: [['createdAt', 'DESC']],
        limit: 1
      }]
    });
    
    const response = blueprint.object({
      id: types.transform(id => Masking(PREFIX.PET).set(id)),
      name: types.string,
      code: types.string,
      species: types.string,
      gender: types.string,
      breed: types.string,
      isActive: types.bool,
      additional: types.any,
      PetOwner: types.transform(item => {
        return blueprint.object({
          id: types.transform(id => Masking(PREFIX.PET_OWNER).set(id)),
          name: types.string,
          gender: types.string,
          phone: types.string,
          email: types.string,
          birthday: types.datetime,
          address: types.string,
          isActive: types.bool,
        }).serialize(item);
      }, { serialize: { to: 'petOwner' } })
    });    

    res.status(200).json({
      status: true,
      message: 'successfully get pet owner',
      data: response.serialize(pet)
    });
  } catch(err) {
    next(err);
  }
};