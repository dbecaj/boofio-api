import { Injectable, ConflictException } from '@nestjs/common';
import * as mongoose from 'mongoose';

import { ILocation } from '../../shared/entities/common.entity';
import { BadRequestException } from '../../shared/exceptions/rest.exception';
import { VPagination } from '../../shared/validators/pagination.validation';
import { ILost } from './entities/lost.entity';
import PetModel, { IPet } from './entities/pet.entity';
import { VLostNearQuery, VLostQuery, VSaveLost, VUpdateLost } from './pets.validation';
import { GeoUtil } from '../../shared/utils/geo.util';
import { IPurchase } from '../purchases/purchase.entity';

@Injectable()
export class LostService {
    
    async getLost(id: mongoose.Types.ObjectId) {
        const result = await this.getLostWithPet(id);
    
        // Check if we actually got something back before getting lost object
        return result ? result.lost : result;
    }
    
    async getLostWithPet(id: mongoose.Types.ObjectId) {
        const result = await PetModel.aggregate([
            { $unwind: "$lost" },
            { $match: { "lost._id": id }}
        ]);
        
        return result[0];
    }
    
    /**
     * Adds the lost object to the pet lost array
     * @param pet Pet to add the lost object to
     * @param saveLost Lost object to add
     */
    async addLost(pet: IPet, saveLost: VSaveLost) {
        if (saveLost.location) saveLost.location = GeoUtil.locationToGeoJSONPoint(saveLost.location);
        // Check if any lost objects have found set to false (indicating the pet is already lost)
        pet.lost.forEach((lost) => {
            if (!lost.found) 
                throw new ConflictException('You cannot add new lost object while other lost objects has found set to false');
        })

        // Set default values for expireDate and range
        const defaultExpireDate = new Date();
        defaultExpireDate.setDate(defaultExpireDate.getDate() + +process.env.DEFAULT_DURATION);
        saveLost.expireDate = defaultExpireDate;
        saveLost.range = +process.env.DEFAULT_RANGE;
    
        return await PetModel.findByIdAndUpdate({ _id: pet._id}, {
            $push: {
                lost: { ...saveLost }
            }
        }, { new: true });
    }
    
    /**
     * Updates the existing lost object with the defined fields in updateLost
     * @param pet Pet with the lost object belongs to
     * @param lost Current Lost object
     * @param updateLost Object with updated files for the new lost object
     */
    async updateLost(pet: IPet, lost: ILost, updateLost: VUpdateLost) {
        if (updateLost.location) updateLost.location = GeoUtil.locationToGeoJSONPoint(updateLost.location);
        lost.description = updateLost.description || lost.description;
        lost.reward = updateLost.reward || lost.reward;
        lost.location = updateLost.location || lost.location;
        lost.found = updateLost.found || lost.found;
    
        return await PetModel.findOneAndUpdate({ "lost._id": lost._id}, { "$set": { "lost.$": lost }}, { new: true });
    }
    
    /**
     * Remove lost object from pet lost array
     * @param pet Pet to which lost object belongs to
     * @param lost Lost object to delete
     */
    async deleteLost(pet: IPet, lost: ILost) {
        return await PetModel.findOneAndUpdate({ "_id": pet._id}, {
            $pull: {
                lost: {
                    _id: lost._id
                }
            }
        }, { new: true });
    }

    async getAll(lostQuery: VLostQuery, pagination: VPagination) {
        //db.users.aggregate({$unwind: '$purchases'},{$sort: {'purchases.time': 1}},{$group: {_id: 0, 'purchases': {$push: '$purchases'}}})
        const query = PetModel.aggregate([
            { $unwind: '$lost' },
            { $group: {
                _id: 0,
                lost: { $push: '$lost' }
            }}
        ])
        pagination.applyTo(query);

        const result = await query.exec();

        return result[0] ? result[0].lost : result
    }

    /**
     * Returns all lost pets that have range to the location and satisfies other requirements in search query and return them.
     * Query sorts results by distance from our location and prioritizes lost pets with valid purchases
     * @param serviceQuery Search query to find nearby pets
     * @param pagination Pagination
     */
    async getLostNear(serviceQuery: VLostNearQuery, pagination: VPagination) {
        const { location, ...matchFields } = serviceQuery;
        var queryList = [];
        if (location) {
            // Create query for the items that are near
            queryList = queryList.concat(this.createLostNearQuery(location));
        }

        queryList.push({
            $match: { ...matchFields, "lost.expireDate": { $gt: new Date() }}
        });

        const query = PetModel.aggregate(queryList);
        pagination.applyTo(query);

        let result = await query.exec();

        // Filter purchased losts to the top of the query
        return result.sort((a, b) => {
            return b.lost.purchases.length - a.lost.purchases.length;
        });
    }

    createLostNearQuery(location: ILocation) {
        return [{ $geoNear: {
            near : {
              type: 'Point',
              coordinates: [
                  location.lon, 
                  location.lat,
              ]
              },
              distanceField: "distance",
              spherical: true,
              query: { "lost.found": false }
          }
        },
        {
            $unwind: "$lost"
        },
        {
            $addFields: {
                delta: {
                    $subtract: [
                      '$lost.range',
                      '$distance'
                    ]
                }
            }
        },
        {
            $match: {
                "lost.found": false,
                delta: { $gt: 0 }
            }
        }];
    }

    async applyPurchase(pet: IPet, lost: ILost, purchase: IPurchase) {
        if (purchase.duration) {
            lost.expireDate.setDate(lost.expireDate.getDate() + purchase.duration.ammount);
        }
        if (purchase.range) {
            lost.range = purchase.range.ammount;
        }

        lost.purchases.push(purchase._id);

        return await PetModel.findOneAndUpdate({ "lost._id": lost._id}, { "$set": { "lost.$": lost }}, { new: true });
    }
}