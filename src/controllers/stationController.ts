import { Request, Response } from "express";
import { Station } from "../models/station";
import { Types } from "mongoose";
import {StationLocation} from "../models/geospatialStation";
export const getStations = async (req: Request, res: Response) => {
  try {
    const stations = await Station.find();
    res.status(200).json(stations);
  } catch (error) {
    handleError(error, res);
  }
};

export const getStation = async (req: Request, res: Response) => {
  try {
    const station = await Station.findOne({ _id: req.params.id });
    if (station) {
      res.status(200).json(station);
    } else {
      res.status(404).json({ message: "Station not found" });
    }
  } catch (error) {
    handleError(error, res);
  }
};

export const createStation = async (req: Request, res: Response) => {
  try {
    const { name, address, city, latitude, longitude, pumps } = req.body;

    // Ensure pumps do not have _id fields in the request body
    const processedPumps = pumps.map((pump: any) => ({
      fuel_type: pump.fuel_type,
      price: pump.price,
      available: pump.available
    }));

    // Create a new Station using the request body, without providing _id for pumps
    const station = new Station({
      name,
      address,
      city,
      latitude,
      longitude,
      pumps: processedPumps
    });

    // Save the new Station document to the database
    await station.save();

    // Create a new StationLocation document using the Station's _id, latitude, and longitude
    const stationLocation = new StationLocation({
      stationId: station._id,
      location: {
        type: 'Point',
        coordinates: [station.longitude, station.latitude]
      }
    });

    // Save the new StationLocation document to the database
    await stationLocation.save();

    // Return the created Station document in the response
    res.status(201).json(station);
  } catch (error) {
    handleError(error, res);
  }
};
export const updateStation = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid station ID format" });
  }

  try {
    // Find the existing station to get current coordinates
    const existingStation = await Station.findById(id);
    if (!existingStation) {
      return res.status(404).json({ message: "Station not found" });
    }

    // Ensure pumps do not have _id fields in the request body
    if (req.body.pumps) {
      req.body.pumps = req.body.pumps.map((pump: any) => ({
        fuel_type: pump.fuel_type,
        price: pump.price,
        available: pump.available
      }));
    }

    // Update the station
    const updatedStation = await Station.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true, runValidators: true }
    );

    if (updatedStation) {
      // Check if latitude or longitude has changed
      const { latitude, longitude } = req.body;
      if (
          latitude !== undefined &&
          longitude !== undefined &&
          (latitude !== existingStation.latitude || longitude !== existingStation.longitude)
      ) {
        // Update the corresponding StationLocation
        await StationLocation.findOneAndUpdate(
            { stationId: id },
            {
              location: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
            },
            { new: true }
        );
      }

      res.status(200).json(updatedStation);
    } else {
      res.status(404).json({ message: "Station not found" });
    }
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteStation = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "Invalid station ID format" });
  }

  try {
    const station = await Station.findByIdAndDelete(id);
    if (station) {
      // Delete the corresponding StationLocation
      await StationLocation.findOneAndDelete({ stationId: id });

      res.status(200).json({ message: "Station and its location deleted successfully" });
    } else {
      res.status(404).json({ message: "Station not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const getStationsWithPagination = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({ error: 'Invalid page or limit number' });
    }

    const stations = await Station.find()
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    const totalStations = await Station.countDocuments();
    const totalPages = Math.ceil(totalStations / limitNumber);

    res.status(200).json({
      page: pageNumber,
      limit: limitNumber,
      totalStations,
      totalPages,
      stations,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const validateObjectId = (id: string): boolean => Types.ObjectId.isValid(id);

const handleError = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: "An unknown error occurred" });
  }
};
