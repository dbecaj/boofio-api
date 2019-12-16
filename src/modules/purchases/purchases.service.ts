import { BadRequestException, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

import { ValidatorPipe } from '../../shared/pipes/validator.pipe';
import { VPagination } from '../../shared/validators/pagination.validation';
import AdModel, { IAd } from '../ads/entities/ad.entity';
import PetModel from '../pets/entities/pet.entity';
import ServiceModel, { IService } from '../services/entities/service.entity';
import { IUser } from '../users/entities/user.entity';
import PurchaseModel, { IPurchase } from './purchase.entity';
import { VSavePurchase, VSavePurchaseAd, VSavePurchaseLost, VSavePurchaseService } from './purchase.validation';
import { NotProcessedException } from '../../shared/exceptions/rest.exception';

@Injectable()
export class PurchasesService {

    /**
     * Validates purchase, applies the purchase via callback and saves it
     * @param user user who the purchase will apply to
     * @param savePurchase purchase data
     * @param applyPurchaseCallback callback that will be called before purchase is saved
     */
    async processPurchase(user: IUser, savePurchase: VSavePurchase,
            applyPurchaseCallback?: (purchase: IPurchase) => void) {
        // Do any necessary validation here

        // Create purchase
        const purchase = new PurchaseModel(savePurchase);
        purchase.userId = user._id;
        purchase._id = mongoose.Types.ObjectId();

        // Process purchase
        await applyPurchaseCallback(purchase);

        // Save purchase
        return purchase.save();
    }

    public async get(id: mongoose.Types.ObjectId) {
        return await PurchaseModel.findById(id);
    }

    public async delete(id: mongoose.Types.ObjectId) {
        return await PurchaseModel.findByIdAndDelete(id);
    }

    /**
     * Returns all purchases documents owned by the specified user
     * @param user Owner of the purchases
     * @param pagination Pagination
     */
    public async getCreated(user: IUser, pagination: VPagination) {
        const query =  PurchaseModel.find({ userId: user._id });
        pagination.applyTo(query);

        return query.exec();
    }
}
