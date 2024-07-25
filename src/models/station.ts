  import { Schema, model, Document } from "mongoose";

  interface Pump {
    _id: string;
    fuel_type: string;
    price: number;
    available: boolean;
  }

  interface Station extends Document {
    _id: string;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    pumps: Pump[];
  }

  const pumpSchema = new Schema<Pump>({
    fuel_type: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, required: true },
  });

  const stationSchema = new Schema<Station>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    pumps: { type: [pumpSchema], required: true },
  });

  export const Station = model<Station>("Station", stationSchema);
