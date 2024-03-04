// 'use strict';
const { isString, isObject, get, isInteger } = require('lodash');

class Response {
  constructor(msg, code, res) {
    this.msg = msg;
    this.res = res;
    this.code = code;
    this.json = {};

    // this.init();
  }

  init() {
    this.msg.code = get(this.msg, 'code', 200);
    if(this.msg && this.msg.code >= 200 && this.msg.code <= 299) {
      this._success();
      delete this.msg.code;
      if(!isInteger(this.code)) {
        return this.code.status(200).json(this.json);
      } else if(isInteger(this.code) && this.res) {
        return this.res.status(this.code).json(this.json);
      }
    }
  }

  _defaultCode() {
    return (isInteger(this.code) && this.code) || (get(this.msg, 'status') || get(this.msg, 'code', 500));
  }

  _error() {
    this.json = {
      name: this._getCodeName(),
      status: this._defaultCode(),
      message: isString(this.msg) ? this.msg : get(this.msg, 'msg', 'Internal Server Error'),
      stack: get(this.msg, 'stack'),
      data: get(this.msg, 'data', {}),
    };
  }

  _success() {
    if(isString(this.msg)) {
      this.json = { message: this.msg || 'Successfully....' };
    }

    if(isObject(this.msg)) {
      this.json = this.msg;
    }
  }

  _getCodeName() {
    const names = {
      400: 'BadRequest',
      401: 'Unauthorized',
      402: 'PaymentRequired',
      403: 'Forbidden',
      404: 'NotFound',
      409: 'Conflict',
      422: 'UnprocessedEntity',
      429: 'TooManyRequests',
      500: 'InternalServerError',
      503: 'UnderMaintenance'
    };

    return get(this.msg, 'name') || names[this._defaultCode()] || names[500];
  }
}

class ErrResponse extends Response {
  constructor(...args) {
    super(...args);

    this._transform();
  }

  _transform() {
    this._error();

    if(isInteger(this.code)) {
      return new Error(this.json);
    }

    if(!isInteger(this.code)) {
      return this.code.status(this.json.status).json(this.json);
    }
  }
}

module.exports = {
  ErrResponse,
  Response
};