import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

/**
 * Checks that the field is null or undefined
 */
export function IsUndefined(property?: string, validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName?: string) {
        registerDecorator({
            name: "isUndefined",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value?: any, args?: ValidationArguments) {
                    return object == null;
                },

                defaultMessage(args?: ValidationArguments) {
                    return `${propertyName} must be undefined!`;
                }
            }
        });
   };
}