import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

import { GeoUtil } from '../../shared/utils/geo.util';
import { VPagination } from '../../shared/validators/pagination.validation';
import { FilesService } from '../common/files/files.service';
import { IUser } from '../users/entities/user.entity';
import ServiceModel, { IService } from './entities/service.entity';
import { VSaveService, VServiceNearQuery, VServiceQuery, VServiceUpdate } from './services.validator';
import { Logger } from '../../shared/logger';
import AdModel from '../ads/entities/ad.entity';
import { ImageService } from '../common/image/image.service';
import { VSavePurchaseService } from '../purchases/purchase.validation';
import { IPurchase } from '../purchases/purchase.entity';

@Injectable()
export class ServicesService {

    constructor(
        private imageService: ImageService,
    ) {}

    async create(user: IUser, saveService: VSaveService) {
        if (saveService.location) saveService.location = GeoUtil.locationToGeoJSONPoint(saveService.location);

        // Set business hours to null if opening or closing is null
        Object.keys(saveService.openingHours).forEach(day => {
            const hours = saveService.openingHours[day];
            if (!hours.opening || !hours.closing) {
                saveService.openingHours[day] = null;
            }
        });

        const service = new ServiceModel(saveService);
        service.ownerId = user._id;

        // Set default values and range
        service.range = +process.env.DEFAULT_RANGE;

        await service.save();

        if (saveService.image) {
            await this.imageService.setImageAssigned(service.image);
            this.uploadImage(service);
        }

        return service;
    }

    async get(id: mongoose.Types.ObjectId) {
        return await ServiceModel.findById(id);
    }

    async update(id: mongoose.Types.ObjectId, updateService: VServiceUpdate) {
        if (updateService.location) updateService.location = GeoUtil.locationToGeoJSONPoint(updateService.location);
        const service = await ServiceModel.findByIdAndUpdate(id, updateService, { new: true}).exec();

        if (updateService.image) {
            await this.imageService.setImageAssigned(service.image);
            this.uploadImage(service);
        }

        return service;
    }

    private async uploadImage(service: IService) {
        service.image = await this.imageService.uploadImage(service.image);
        await service.save();
    }

    async delete(service: IService) {
        if (service.image) this.imageService.deleteImage(service.image);

        return await ServiceModel.findByIdAndDelete(service._id);
    }

    async getCreated(user: IUser, pagination: VPagination) {
        const query = ServiceModel.find({ ownerId: user._id });
        pagination.applyTo(query);

        return await query.exec();
    }

    async getAll(serviceQuery: VServiceQuery, pagination: VPagination) {

        const query = ServiceModel.find({ ...serviceQuery });
        pagination.applyTo(query);

        return query.exec();
    }
    
    /**
     * Returns all services that have range to the location and satisfies other requirements in search query and return them.
     * Query sorts results by distance from our location and prioritizes services with valid purchases
     * @param serviceQuery Search query to find nearby services
     * @param pagination Pagination
     */
    async getNear(serviceQuery: VServiceNearQuery, pagination: VPagination) : Promise<IService[]> {
        const { location, ...matchFields } = serviceQuery;
        var queryList = [];
        if (location) {
            // Create query for the items that are near
            queryList = queryList.concat(GeoUtil.createNearQuery(location));
        }

        // Add query for the simple match fields that just check if the value is ==
        queryList.push({
            $match: { ...matchFields }
        });

        const query = ServiceModel.aggregate(queryList);
        pagination.applyTo(query);

        let result = await query.exec();

        // Filter purchased services to the top of the query
        return result.sort((a, b) => {
            return b.purchases.length - a.purchases.length;
        });
    }

    async getServiceAds(service: IService, pagination: VPagination) {
        const query = AdModel.find({ serviceId: service._id });
        pagination.applyTo(query);

        return query.exec();
    }

    async applyPurchase(service: IService, purchase: IPurchase) {
        if (purchase.range) {
            service.range = purchase.range.ammount;
        }
        service.purchases.push(purchase._id);

        return await ServiceModel.findByIdAndUpdate(service._id, service, { new: true });
    }
}
