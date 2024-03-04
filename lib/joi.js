'use strict';

const Joi = require('joi');
const moment = require('moment');
const { Masking, PREFIX } = require(`${__base}lib/common/masking-id`);

const NAME_REGEX_PATTERN = /^(?!.*[.`~!@#$%&*()-+=[\]{}'";:/?><£€¥^_\\|•’“√π÷×¶∆°¢✓©®™,]).*$/;
const PHONE_REGEX_PATTERN = /^[+]?[\s.0-9]*[(]?[0-9]{1,4}[)]?[-\s.0-9]*$/;

const customJoi = Joi.extend(joi => {
  return {
    type: 'string',
    base: joi.string(),
    messages: {
      'string.masking': '{{#label}} must be a valid masking',
      'string.name': '{{#label}} only allow alphabet, hypen, and spaces',
      'string.phone': '{{#label}} must be a valid phone number',
      'string.dateOnly': '{{#label}} must be a valid date',
      'string.timeOnly': '{{#label}} must be a valid time',
    },  
    rules: {
      masking: {
        method(prefix) {
          return this.$_addRule({ name: 'masking', args: { prefix } });
        },
        validate(value, helpers, { prefix }) {
          const mask = Masking(prefix).get(value);
  
          const invalid = [];
          if(!Object.values(PREFIX).includes(prefix)) {
            invalid.push(prefix);
          }
          
          if(mask) {
            return mask;
          }
  
          return helpers.error('string.masking', { value, invalid });
        }
      },
      name: {
        method() {
          return this.$_addRule({ name: 'name' });
        },
        validate(value, helpers) {
          if (!NAME_REGEX_PATTERN.test(value.trim())) {
            return helpers.error('string.name', { value });
          }

          return value.trim();
        }
      },
      phone: {
        method() {
          return this.$_addRule({ name: 'phone' });
        },
        validate(value, helpers) {
          if (!PHONE_REGEX_PATTERN.test(value.trim())) {
            return helpers.error('string.phone', { value });
          }

          return value.replace(/ /g, '').trim();
        }
      },
      dateOnly: {
        method() {
          return this.$_addRule({ name: 'dateOnly' });
        },
        validate(value, helpers) {
          const date = moment(value);
          if(!date.isValid()) {
            return helpers.error('string.dateOnly', { value });
          }

          return moment(value).format('YYYY-MM-DD');  
        }
      },
      timeOnly: {
        method() {
          return this.$_addRule({ name: 'timeOnly' });
        },
        validate(value, helpers) {
          const time = `${moment().format('YYYY-MM-DD')} ${value}`;
          const date = moment(time);

          if(!date.isValid()) {
            return helpers.error('string.timeOnly', { value });
          }

          return moment(time).format('HH:mm:ss');
        }
      }
    }
  };
});

customJoi.validate = (data, schema, options = {}) => schema.validateAsync(data, options);
customJoi.validateSync = (data, schema, options = {}) => schema.validate(data, options);

module.exports = customJoi;
