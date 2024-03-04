'use strict';

const { blueprint, types } = require('podeng');

const db = require(`${__base}app/models`);
const { Masking, PREFIX } = require(`${__base}lib/common/masking-id`);

module.exports = async (req, res, next) => {
  try {
    const id = Masking(PREFIX.DOCTOR).get(req.params.id);
    
    const result = await db.Doctor.findOne({ 
      where: { id },
    });

    const response = blueprint.object({
      id: types.transform(id => Masking(PREFIX.DOCTOR).set(id)),
      name: types.string,
      specialist: types.string,
      gender: types.string,
      phone: types.string,
      email: types.string,
      birthday: types.datetime,
      address: types.string,
      isActive: types.bool,
    });

    res.status(200).json({
      status: true,
      message: 'successfully get doctor',
      data: response.serialize(result)
    });
  } catch(err) {
    next(err);
  }
};