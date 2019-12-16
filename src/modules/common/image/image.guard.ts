import FileModel from "../files/file.entity";
import { MissingException, NotFoundException, FileIntegrityException } from "../../../shared/exceptions/rest.exception";
import { DiskStorage } from "../files/disk.storage";
import { InternalServerErrorException, ExecutionContext, CanActivate, Injectable, UseGuards, createParamDecorator } from "@nestjs/common";

@Injectable()
export class ImageResolveGuard implements CanActivate {

    constructor(
        private where: string,
        private image: string
    ) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

        const image = req[this.where][this.image];
        if (!image) {
            return true;
        }

        const imageUrls = [ image.thumb, image.small ];
        const files = await FileModel.find({ url: { $in: imageUrls }});

        const fileUrls = files.map((file) => file.url);
        const diff = imageUrls.filter(key => fileUrls.indexOf(key) < 0);
        if (diff.length > 0) {
            throw new NotFoundException(diff.join(', '));
        }

        // Check if the files actually exist on the disk (this is a check for the developer)
        files.forEach((file) => {
            if (!DiskStorage.doesExist(file.key)) {
                throw new FileIntegrityException(`${file.key} has a record in files but doesn't exist on disk!`);
            }
        });

        return true;
    }
}

/**
 * Guard checks the existance of image files
 * @param where Specifies where in the request object the image resides
 * @param image Specifies in what field in request object the image is
 */
export const ResolveImage = (where: string = 'body', image: string = 'image') => UseGuards(new ImageResolveGuard(where, image));