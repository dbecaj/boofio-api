import { IPoint } from '../entities/common.entity';

export class DLocation {
    address?: string;
    lat: number;
    lon: number;

    constructor(point: IPoint) {
        this.lat = point.coordinates[1];
        this.lon = point.coordinates[0];
    }
}