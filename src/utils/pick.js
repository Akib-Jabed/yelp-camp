const pick = (object, keys) => {
    console.log(object);
    console.log(keys);
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            // eslint-disable-next-line no-param-reassign
            obj[key] = object[key];
        }

        return obj;
    }, {});
};

module.exports = pick;
