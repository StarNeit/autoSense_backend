import { Schema, model, Document, Types } from "mongoose";

interface GeoJSONPoint {
    type: "Point";
    coordinates: [number, number];
}

interface StationLocation extends Document {
    stationId: Types.ObjectId;
    location: GeoJSONPoint;
}


const stationLocationSchema = new Schema<StationLocation>({
    stationId: { type: Schema.Types.ObjectId, required: true, ref: 'Station' },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
}, { versionKey: false });

stationLocationSchema.index({ location: '2dsphere' });

export const StationLocation = model<StationLocation>("StationLocation", stationLocationSchema);
