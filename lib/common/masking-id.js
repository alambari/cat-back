const Hashids = require('hashids/cjs');
const isUUID = require('validator/lib/isUUID');

const SALT = process.env.MASK_ID_SALT;

function Masking(prefix, minLength = 5, salt = SALT) {
  const hasher = new Hashids(`${prefix}${salt}`, minLength);

  this.set = function(decodeId) {
    return hasher.encode(decodeId);
  };

  this.get = function(encodeId) {
    const decoded = hasher.decode(encodeId);
    if (decoded.length === 0) {
      return null;
    }
  
    const isNumber = (num) => !isNaN(num) ? parseInt(num) : num;
    
    return decoded.length === 1 ? isNumber(decoded[0]) : isNumber(decoded);
  };

  this.setHex = function(decodeId) {
    return hasher.encodeHex(decodeId);
  };
  
  this.getHex = function(encodeId) {
    const decoded = hasher.decodeHex(encodeId);
    if (!decoded) {
      return null;
    }
  
    return decoded;
  };
  
  this.setUUID = function(decodeId) {
    if(!decodeId || !isUUID(decodeId)) {
      return null;
    }
  
    const hex = decodeId.toString().replaceAll('-','');
    return hasher.encodeHex(hex);
  };
  
  this.getUUID = function(encodeId) {
    const decoded = hasher.decodeHex(encodeId);
    if (!decoded) {
      return null;
    }
  
    const uuid = `${decoded.substring(0,8)}-${decoded.substring(8,12)}-${decoded.substring(12,16)}-${decoded.substring(16,20)}-${decoded.substring(20,32)}`;
  
    return uuid;
  };  
}

const PREFIX = {
  PET: 'pet',
  DOCTOR: 'doctor',
  MEDICAL: 'medical',
  RESUME: 'resume',
  PET_OWNER: 'pet-owner',
  APPOINTMENT: 'appointment',
};

module.exports = {
  Masking: function(...args) {
    return new Masking(...args);
  },
  PREFIX
};