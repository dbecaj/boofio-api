import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

import { VPagination } from '../../shared/validators/pagination.validation';
import { IUser } from '../users/entities/user.entity';
import { FoundModel } from './entities/found.entity';
import { VFoundQuery, VSaveFound, VUpdateFound } from './found.validation';
import { GeoUtil } from '../../shared/utils/geo.util';

@Injectable()
export class FoundService {

    async get(id: mongoose.Types.ObjectId) {
        return await FoundModel.findById(id);
    }

    async create(user: IUser, saveFound: VSaveFound) {
        if (saveFound.location) saveFound.location = GeoUtil.locationToGeoJSONPoint(saveFound.location);
        const found = new FoundModel(saveFound);
        found.userId = user._id;

        await found.save();

        return found;
    }

    async update(id: mongoose.Types.ObjectId, updateFound: VUpdateFound) {
        if (updateFound.location) updateFound.location = GeoUtil.locationToGeoJSONPoint(updateFound.location);
        return await FoundModel.findByIdAndUpdate(id, updateFound, { new: true });
    }

    async delete(id: mongoose.Types.ObjectId) {
        return await FoundModel.findByIdAndDelete(id);
    }

    /**
     * Returns all documents created by the specified user
     * @param user Owner of the found documents
     * @param pagination Pagination
     */
    async getCreated(user: IUser, pagination: VPagination) {
        const query = FoundModel.find({ userId: user._id });
        pagination.applyTo(query);

        return await query.exec();
    }

    async getAll(foundQuery: VFoundQuery, pagination: VPagination) {
        const query = FoundModel.find({ ...foundQuery });
        pagination.applyTo(query);

        return query.exec();
    }
}
