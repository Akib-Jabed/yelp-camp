class ApiFeatures {
    constructor(query, queryString={}) {
        this.query = query;
        this.queryString = queryString;
        this.filterConditions = {};
    }

    filter() {
        const queryObj = { ...this.queryString };
        
        const excludedFields = ['sort', 'page', 'limit'];
        excludedFields.forEach((el) => delete queryObj[el]);

        let queryString = {};
        if (queryObj['search']) {
            const searchValue = queryObj['search'];
            queryString = {
                $or: [
                    { 'title': { $regex: searchValue, $options: 'i' } },
                    { 'location': { $regex: searchValue, $options: 'i' } },
                    { 'description': { $regex: searchValue, $options: 'i' } },
                ]
            }
        }

        this.filterConditions = {...queryString};
        this.query = this.query.find(queryString);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 2;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    async getCount() {
        return await this.query.model.countDocuments(this.filterConditions);
    }
}

module.exports = ApiFeatures;
