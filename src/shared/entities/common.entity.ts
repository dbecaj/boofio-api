import * as mongoose from 'mongoose';

export interface ILocation {
    address?: string,
    lat: number,
    lon: number,
}

export const LocationSchema = new mongoose.Schema ({
    address: { type: String, required: false },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
}, { _id: false })

export interface IPoint {
    type: string,
    coordinates: number[],
}

export const PointSchema = new mongoose.Schema({
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
}, { _id: false });

export interface IPayment {
    date: Date,
    paymentId: string,
    ammount: number,
}

export const PaymentSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    paymentId: { type: String, required: true },
    ammount: { type: Number, required: true },
}, { _id: false });