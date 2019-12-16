import { ILocation, IPoint } from '../entities/common.entity';

export class GeoUtil {

    /**
     * Transforms Location to Point
     * @param location Location to transform
     */
    public static locationToGeoJSONPoint(location: any): IPoint {
        return {
            type: 'Point',
            coordinates: [location.lon, location.lat],
        };
    }

    /**
     * Transforms Point to Location without address
     * @param point Point to transform
     */
    public static GeoJSONPointToLocation(point: IPoint): ILocation {
        return {
            'lat': point.coordinates[1],
            'lon': point.coordinates[0],
        };
    }

    /**
    * Generate MongoDB query that returns objects in range of our location based on GeoJSON location
    * @param location Our location
    */
   public static createNearQuery(location: ILocation): any {
       return [{
           $geoNear : {
             near : {
               type: 'Point',
               coordinates: [
                   location.lon, 
                   location.lat,
               ]
               },
               distanceField: "distance",
               spherical: true
           }
         },
         {
             $addFields: {
                 delta: {
                     $subtract: [
                       '$range',
                       '$distance'
                     ]
                 }
             }
         },
         {
             $match: {
                 delta: { $gt: 0 }
             }
         }];
   }
}