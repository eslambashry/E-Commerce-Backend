import { pagination } from "../utilities/pagination.js"


export class apiFeatures {
    constructor(mongooQuery, queryData) {
        this.mongooQuery = mongooQuery
        this.queryData = queryData
    }

    //pagination
    pagination() {
        const { page, size } = this.queryData
        const { limit, skip } = pagination({ page, size })
        this.mongooQuery.limit(limit).skip(skip)
        return this
    }


//sort 
    sort() {
        this.mongooQuery.sort(this.queryData.sort?.replaceAll(',', ' '))
        return this
    }

//select
    select() {
        this.mongooQuery.select(this.queryData.select?.replaceAll(',', ' '))
        return this
    }

    //filter
    filter() {
        const queryInestance = { ...this.queryData }

        const execuldKeyArr = ['page', 'size', 'sort', 'select', 'search']

        execuldKeyArr.forEach((key) => delete queryInestance[key])
        const queryString = JSON.parse(
            JSON.stringify(queryInestance).replace(
                /gt|gte|lt|lte|in|nin|eq|neq|regex/g,
                (match) => `$${match}`,
            )
        )
        this.mongooQuery.find(queryString)
        return this
    }
}