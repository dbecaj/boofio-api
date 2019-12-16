import { Injectable, BadRequestException, HttpException, InternalServerErrorException } from '@nestjs/common';
import * as mongoose from 'mongoose';

import { AlreadyExistsException, FileIntegrityException, NotFoundException, InternalServerException } from '../../shared/exceptions/rest.exception';
import { VPagination } from '../../shared/validators/pagination.validation';
import { FilesService } from '../common/files/files.service';
import { ImageService } from '../common/image/image.service';
import UserModel, { IUser } from '../users/entities/user.entity';
import PetModel, { IPet } from './entities/pet.entity';
import { VPetQuery, VSavePet, VUpdatePet } from './pets.validation';
import FileModel from '../common/files/file.entity';
import { IImage } from '../common/image/image.entity';
import { async } from 'rxjs/internal/scheduler/async';
import { MongoError } from 'mongodb';

@Injectable()
export class PetsService {

    constructor(
        private imageService: ImageService,
    ) {}

    async get(id: mongoose.Types.ObjectId): Promise<IPet> {
        return await PetModel.findById(id).populate('image');
    }

    async create(user: IUser, savePet: VSavePet) {
        const pet = new PetModel(savePet);
        pet.authorId = user._id;
        await pet.save();

        if (savePet.image) {
            await this.imageService.setImageAssigned(savePet.image);
            this.uploadImage(pet);
        }

        return pet;
    }

    async update(id: mongoose.Types.ObjectId, updatePet: VUpdatePet) {
        const pet =  await PetModel.findOneAndUpdate({ _id: id }, updatePet, { new: true });

        if (updatePet.image) {
            await this.imageService.setImageAssigned(pet.image);
            this.uploadImage(pet);
        }

        return pet;
    }

    async uploadImage(pet: IPet) {
        pet.image = await this.imageService.uploadImage(pet.image);
        await pet.save();
    }

    async delete(pet: IPet) {
        if (pet.image) this.imageService.deleteImage(pet.image);

        return await PetModel.findByIdAndDelete(pet._id);
    }

    async getCreated(user: IUser, pagination: VPagination): Promise<IPet[]> {
        const query = PetModel.find({ authorId: user._id });
        pagination.applyTo(query);

        return query.exec();
    }

    async getAll(petQuery: VPetQuery, pagination: VPagination) {
        const query = PetModel.find({ ...petQuery });
        pagination.applyTo(query);
        
        return query.exec();
    }

    /**
     * Adds new owner for the pet which allows access to the pet document
     * @param pet Pet to add the new owner to
     * @param userId Id of the new owner
     */
    async addOwner(user: IUser, pet: IPet, userId: mongoose.Types.ObjectId) {
        if (pet.owners.indexOf(userId) >= 0 || pet.authorId.toHexString() == user._id.toHexString()) {
            throw new AlreadyExistsException('owner');
        }

        return await PetModel.findByIdAndUpdate({ _id: pet._id}, {
            $push: {
                owners: userId
            }
        }, { new: true });
    }

    /**
     * Removes the owner from the pet owners array if it exists
     * @param pet Pet with the owner
     * @param userId Owner to delete
     */
    async deleteOwner(pet: IPet, userId: mongoose.Types.ObjectId) {
        if (pet.owners.indexOf(userId) < 0) {
            throw new NotFoundException(`owner with id ${userId}`);
        }

        return await PetModel.findOneAndUpdate({ _id: pet._id}, {
            $pull: {
                owners: userId
            }
        }, { new: true });
    }
}
