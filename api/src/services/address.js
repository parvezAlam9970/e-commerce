const { Types } = require("mongoose");
const addressModel = require("../models/address");
const { clearSearch } = require("../utilities/Helper");
const { paginationAggregate } = require('../utilities/pagination');


class AddressService {

    static async details(_id) {
        const response = { data: {}, status: false };

        try {
            _id = Types.ObjectId(_id);
            response.data = await addressModel.findById(_id);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
    

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };
        try {
            const search = {
                _id: query._id ? Types.ObjectId(query._id) : '',
                userId: query.userId ? Types.ObjectId(query.userId) : '',
                $or: [
                    {
                        name: { '$regex': new RegExp(query.key || ''), $options: 'i' }
                    },
                    {
                        address_line_1: { '$regex': new RegExp(query.key || ''), $options: 'i' }
                    },
                    {
                        pinCode: { '$regex': new RegExp(query.key || ''), $options: 'i' }
                    },
                    {
                        phone: { '$regex': new RegExp(query.key || ''), $options: 'i' }
                    }
                ],
                isDeleted: false
            };
            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        userId: 1,
                        name: 1,
                        phone: 1,
                        state: 1,
                        city :1,
                        address_line_1: 1,
                        pinCode: 1,
                        type :1,
                    }
                },
            ];
            response = await paginationAggregate(addressModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }


    static async save(data) {
        const _id = data._id;
        const response = { data: {}, status: false };

        try {
            const docData = _id ? await addressModel.findById(_id) : new addressModel();
            docData.userId = data.userId;
            docData.name = data.name;
            docData.phone = data.phone;
            docData.state = data.state;
            docData.state = data.city;
            docData.type = data.type;


            docData.address_line_1 = data.address_line_1;
            docData.pinCode = data.pinCode;

            await docData.save();

            response.data = docData;
            response.status = true;

            return response;

        } catch (err) {
            throw err;
        }
    }

    static async delete(ids) {
        const response = { status: false, ids: [] };
        try {
            if (Array.isArray(ids)) {
                await addressModel.updateMany({ _id: { $in: ids } }, { isDeleted: true });
            } else if (typeof ids === 'string') {
                await addressModel.updateOne({ _id: ids }, { isDeleted: true });
                response.id = ids
            }

            response.status = true;
            response.ids = ids;

            return response;
        } catch (err) {
            throw err;
        }
    }

}

module.exports = AddressService;