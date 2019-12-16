import { Types } from 'mongoose';

import { IPet, IPetDeleteReason } from '../entities/pet.entity';
import { PET_TYPE } from '../pets.enum';
import { DLost } from './lost.dto';
import { IImage } from '../../common/image/image.entity';

export class DPetProfile {
    name: String;
    type: PET_TYPE;
    birthday: Date;
    image?: IImage;

    constructor(pet: IPet) {
        this.name = pet.name;
        this.type = pet.type;
        this.birthday = pet.birthday;
        this.image = pet.image;
    }
}

export class DPet {
    _id: Types.ObjectId;
    authorId: Types.ObjectId;
    type: PET_TYPE;
    name: String;
    birthday: Date;
    owners: Types.ObjectId[];
    deleteReason?: IPetDeleteReason;
    image: IImage;
    lost?: DLost[];

    constructor(pet: IPet) {
        this._id = pet._id;
        this.authorId = pet.authorId;
        this.type = pet.type;
        this.name = pet.name;
        this.birthday = pet.birthday;
        this.owners = pet.owners;
        this.deleteReason = pet.deleteReason;
        this.image = pet.image;
        this.lost = pet.lost.map((lost) => new DLost(lost));
    }
}