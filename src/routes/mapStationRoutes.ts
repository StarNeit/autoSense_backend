import { Router } from "express";
import {
  getNearbyStations,
  getStationLocation,
} from "../controllers/mapStationController";

const router: Router = Router();

router.get("/station_list/:stationID", getStationLocation);

//
// remove it cause that already in createStation, updateStation, deleteStation
//
// router.post('/station_list/:stationID', addStationLocation);
// router.put('/station_list/:stationID', updateStationLocation);
// router.delete('/station_list/:stationID', deleteStationLocation);

router.get("/nearby_stations", getNearbyStations);

export default router;
