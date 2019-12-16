import { AUTH_TYPE, IAuth } from './auth.interfaces';

export class DAuth {
    type: AUTH_TYPE;
    email?: string;
    facebookId?: number;

    constructor(auth: IAuth) {
        this.type = auth.type;
        this.email = auth.email;
        this.facebookId = auth.facebookId;
    }
}