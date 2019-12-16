import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

import { GeoUtil } from '../../shared/utils/geo.util';
import { VPagination } from '../../shared/validators/pagination.validation';
import FileModel from '../common/files/file.entity';
import { FilesService } from '../common/files/files.service';
import { IService } from '../services/entities/service.entity';
import { IUser } from '../users/entities/user.entity';
import { VAdNearQuery, VAdQuery, VSaveAd, VUpdateAd } from './ads.validation';
import AdModel, { IAd } from './entities/ad.entity';
import { ImageService } from '../common/image/image.service';
import { IPurchase } from '../purchases/purchase.entity';

@Injectable()
export class AdsService {

    constructor(
        private imageService: ImageService,
    ) {}

    async get(id: mongoose.Types.ObjectId) {
        return await AdModel.findById(id);
    }

    async create(user: IUser, service: IService, saveAd: VSaveAd) {
        if (saveAd.location) saveAd.location = GeoUtil.locationToGeoJSONPoint(saveAd.location);
        let ad = new AdModel(saveAd);
        ad.ownerId = user._id;

        // Set default values for expireDate and range
        const defaultExpireDate = new Date();
        defaultExpireDate.setDate(defaultExpireDate.getDate() + +process.env.DEFAULT_DURATION);
        ad.expireDate = defaultExpireDate;
        ad.range = +process.env.DEFAULT_RANGE;

        await ad.save();

        if (saveAd.image){
            await this.imageService.setImageAssigned(ad.image);
            this.uploadImage(ad);
        }

        return ad;
    }

    async update(id: mongoose.Types.ObjectId, updateAd: VUpdateAd) {
        if (updateAd.location) updateAd.location = GeoUtil.locationToGeoJSONPoint(updateAd.location);
        const ad =  await AdModel.findByIdAndUpdate(id, updateAd, { new: true });

        if (updateAd.image) {
            this.imageService.setImageAssigned(updateAd.image);
            this.uploadImage(ad);
        }

        return ad;
    }

    async uploadImage(ad: IAd) {
        ad.image = await this.imageService.uploadImage(ad.image);
        await ad.save();
    }

    async delete(ad: IAd) {
        if (ad.image) this.imageService.deleteImage(ad.image);

        return await AdModel.findByIdAndDelete(ad._id);
    }

    /**
     * Gets all ads created by the user
     * @param user Owner of the ads
     * @param pagination Pagination
     */
    async getCreated(user: IUser, pagination: VPagination) {
        const query = AdModel.find({ ownerId: user._id });
        pagination.applyTo(query);

        return query.exec();
    }

    async getAll(adQuery: VAdQuery, pagination: VPagination) {
        const query = AdModel.find({ ...adQuery });
        pagination.applyTo(query);

        return query.exec();
    }

    /**
     * Returns all ads that have range to the location and satisfies other requirements in search query and return them.
     * Query sorts results by distance from our location and prioritizes ads with valid purchases
     * @param adQuery Search query to find nearby ads
     * @param pagination Pagination
     */
    async getNear(adQuery: VAdNearQuery, pagination: VPagination) : Promise<IAd[]>  {
        const { location, ...matchFields } = adQuery;
        var queryList = [];
        if (location) {
            // Create query for the items that are near
            queryList = queryList.concat(GeoUtil.createNearQuery(location));
        }

        // Add query for the simple match fields that just check if the value is ==
        queryList.push({
            $match: { ...matchFields, expireDate: { $gt: new Date() } }
        });

        const query = AdModel.aggregate(queryList);
        pagination.applyTo(query);

        let result = await query.exec();

        // Filter purchased ads to the top of the query
        return result.sort((a, b) => {
            return b.purchases.length - a.purchases.length;
        });
    }

    async applyPurchase(ad: IAd, purchase: IPurchase) {
        if (purchase.duration) {
            ad.expireDate.setDate(ad.expireDate.getDate() + purchase.duration.ammount);
        }
        if (purchase.range) {
            ad.range = purchase.range.ammount;
        }
        ad.purchases.push(purchase._id);

        return await AdModel.findByIdAndUpdate(ad._id, ad, { new: true });
    }
}
