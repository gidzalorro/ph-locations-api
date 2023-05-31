let defaultLimit = 20;
let database;

const setDb = (inDatabase) => {
    database = inDatabase;
}

const createResponse = async(collectionName, query, page, limit) => {
    if(!database){
        throw 'Database is not defined!'
    }

    let response = {};
    let data = {
        'id': 1,
        'name': 1,
        '_id': 0
    }
    switch(collectionName){
        case 'provinces':
            data['region_code'] = 1;
            break;
        case 'cities':
            data['region_code'] = 1;
            data['province_code'] = 1;
            break;
        case 'brangays':
            data['region_code'] = 1;
            data['province_code'] = 1;
            data['city_code'] = 1;
            break;
    }

    const collection = await database.collection(collectionName);
    const totalDocs = await collection.countDocuments(query);
    response['data'] = await collection
                        .find(query)
                        .project(data)
                        .skip(page*limit)
                        .limit(limit)
                        .toArray();
    response['totalDocs'] = totalDocs;
    response['currentPage'] = page + 1;
    response['totalPages'] = limit > 0 ? Math.ceil(totalDocs/limit) : 1;        
    return response;
}

const validateReqQuery = (requestQuery) => {
    let { id , name , page, limit, region_code, province_code, city_code } = requestQuery ? requestQuery : null;
    let resQuery = {};
    let response = {};
    let resPage = 0;
    let resLimit = defaultLimit;

    if(page){
        resPage = +page;
        if(isNaN(resPage)){
            throw "Page should be a number."
        }
        if(!isNaN(resPage) && resPage <= 0){
            throw "Page should be positive integer and greater than zero."
        }
        if(resPage && resPage > 0){
            resPage = resPage - 1;
        }
    }

    if(limit){
        resLimit = +limit;
        if(isNaN(resLimit)){
            throw "Limit should be a number."
        }
        if(!isNaN(resLimit) && resLimit < 0){
            throw "Limit should be positive integer or zero."
        }
    }

    if(name){
        name = name.toUpperCase();
        const regEx = {
            $regex : name
        }
        resQuery['name'] = regEx;
    }

    if(id){
        if(isNaN(+id)){
            throw "Id should be a number."
        }
        if(typeof id == 'string' && id.length === 1){
            id = "0"+id;
        }
        resQuery['id'] = id;
    }

    if(region_code){
        if(isNaN(+region_code)){
            throw "Region code should be a number."
        }
        if(typeof region_code == 'string' && region_code.length === 1){
            region_code = "0"+region_code;
        }
        resQuery['region_code'] = region_code;
    }

    if(province_code){
        if(isNaN(+province_code)){
            throw "Province code should be a number."
        }
        resQuery['province_code'] = province_code;
    }

    if(city_code){
        if(isNaN(+city_code)){
            throw "City code should be a number."
        }
        resQuery['city_code'] = city_code;
    }

    response['query'] = resQuery;
    response['page'] = resPage;
    response['limit'] = resLimit;

    return response;
}

const call = async(reqQuery, collectionName) => {
    let dbQuery = {};
    let dbPage = 0;
    let dbLimit = defaultLimit;
    let result = {};

    try{
        let { query , page, limit } = validateReqQuery(reqQuery);
        dbQuery = query;
        dbPage = page;
        dbLimit = limit;
        result = await createResponse(collectionName, dbQuery, dbPage, dbLimit);
    }catch(e){
        result['error'] = e;
    }

    return result
}

module.exports = { call , setDb }