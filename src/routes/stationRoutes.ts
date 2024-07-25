import { Router } from "express";
import {
  getStations,
  getStation,
  createStation,
  updateStation,
  deleteStation, getStationsWithPagination,
} from "../controllers/stationController";

const router = Router();

router.get("/stations", getStations);
router.get("/stations/:id", getStation);
router.post("/stations", createStation);
router.put("/stations/:id", updateStation);
router.delete("/stations/:id", deleteStation);
router.get("/stationsWithPagination", getStationsWithPagination);

export default router;
