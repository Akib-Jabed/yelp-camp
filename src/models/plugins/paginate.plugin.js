/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
const paginate = (schema) => {
    schema.statics.paginate = async function (filter, options) {
        // Handle Sorting Features
        let sort = '';
        if (options.sortBy) {
            const sortingCriteria = [];
            options.sortBy.split(',').forEach((option) => {
                const [key, order] = option.split(':');
                sortingCriteria.push((order === 'desc' ? '-' : '') + key);
            });
            sort = sortingCriteria.join(' ');
        } else {
            sort = 'createdAt';
        }

        // Handle Pagination / Query Limit Feature
        const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
        const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
        const skip = (page - 1) * limit;

        const count = this.countDocuments(filter).exec();
        let docs = this.find(filter).sort(sort).skip(skip).limit(limit);
        if (options.populate) {
            options.populate.split(',').forEach((option) => {
                docs = docs.populate(
                    option
                        .split('.')
                        .reverse()
                        .reduce((a, b) => ({ path: b, populate: a }))
                );
            });
        }
    };
};

module.exports = paginate;
