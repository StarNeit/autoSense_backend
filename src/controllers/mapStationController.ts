import { Request, Response } from "express";
import { StationLocation } from "../models/geospatialStation";

export const getStationLocation = async (req: Request, res: Response) => {
  const { stationID } = req.params;

  try {
    const stationLocation = await StationLocation.findOne({
      stationId: stationID,
    });
    if (!stationLocation) {
      return res.status(404).json({ error: "Station location not found" });
    }

    res.status(200).json(stationLocation);
  } catch (error) {
    handleError(error, res);
  }
};

export const getNearbyStations = async (req: Request, res: Response) => {
  const { central_longitude, central_latitude, limit } = req.query;

  const longitude = parseFloat(central_longitude as string);
  const latitude = parseFloat(central_latitude as string);
  const limitNumber = parseInt(limit as string, 10);

  if (
    isNaN(longitude) ||
    isNaN(latitude) ||
    isNaN(limitNumber) ||
    limitNumber <= 0
  ) {
    return res
      .status(400)
      .json({ error: "Invalid or missing coordinates or limit" });
  }

  try {
    const nearbyStations = await StationLocation.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
    }).limit(limitNumber);

    res.status(200).json(nearbyStations);
  } catch (error) {
    handleError(error, res);
  }
};

const handleError = (error: unknown, res: Response) => {
  console.log("bi loi roi");
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: "An unknown error occurred" });
  }
};
