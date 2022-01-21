const { Op } = require("sequelize");

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {})
};

const pickLTE = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = { [Op.lte]: `${object[key]}T23:59:59Z` };
    }
    return obj;
  }, {});
};
const pickEQ = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = { [Op.eq]: `${object[key]}` };
    }
    return obj;
  }, {});
};
const pickGTE = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = { [Op.gte]: object[key] };
    }
    return obj;
  }, {});
};

const pickLike = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = { [Op.like]: `${object[key]}%` };
    }
    return obj;
  }, {});
};
const pickFullLike = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = { [Op.like]: `%${object[key]}` };
    }
    return obj;
  }, {});
};


module.exports = { pick, pickLTE, pickGTE, pickLike, pickEQ,pickFullLike };
