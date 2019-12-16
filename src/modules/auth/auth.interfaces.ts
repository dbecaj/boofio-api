import * as mongoose from 'mongoose';

export enum AUTH_TYPE {
  LOCAL = 'LOCAL',
  FACEBOOK = 'FACEBOOK',
}

export interface IAuth {
  type: AUTH_TYPE,
  email?: string,
  password?: string,
  facebookId?: number,
}

export const AuthSchema = new mongoose.Schema({
  type: { type: AUTH_TYPE, required: true },
  email: { type: String },
  password: { type: String },
  facebookId: { type: Number },
})