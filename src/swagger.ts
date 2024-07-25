import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fuel Station API",
      version: "1.0.0",
      description: "API documentation for the Fuel Station project",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      schemas: {
        Pump: {
          type: "object",
          required: ["fuel_type", "price", "available"],
          properties: {
            fuel_type: {
              type: "string",
            },
            price: {
              type: "number",
            },
            available: {
              type: "boolean",
            },
          },
        },
        Station: {
          type: "object",
          required: [
            "name",
            "address",
            "city",
            "latitude",
            "longitude",
            "pumps",
          ],
          properties: {
            name: {
              type: "string",
            },
            address: {
              type: "string",
            },
            city: {
              type: "string",
            },
            latitude: {
              type: "number",
            },
            longitude: {
              type: "number",
            },
            pumps: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Pump",
              },
            },
          },
        },
        StationLocation: {
          type: "object",
          required: ["stationId", "location"],
          properties: {
            stationId: {
              type: "string",
            },
            location: {
              type: "object",
              required: ["type", "coordinates"],
              properties: {
                type: {
                  type: "string",
                  enum: ["Point"],
                },
                coordinates: {
                  type: "array",
                  items: {
                    type: "number",
                  },
                  minItems: 2,
                  maxItems: 2,
                },
              },
            },
          },
        },
      },
    },
    paths: {
      "/stations": {
        get: {
          summary: "Retrieves a list of stations",
          tags: ["Stations"],
          responses: {
            200: {
              description: "A list of stations",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Station",
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Creates a new station",
          tags: ["Stations"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Station",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Station created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Station",
                  },
                },
              },
            },
            500: {
              description: "Server error",
            },
          },
        },
      },
      "/stations/{id}": {
        get: {
          summary: "Retrieves a single station by id",
          tags: ["Stations"],
          parameters: [
            {
              in: "path",
              name: "id",
              schema: {
                type: "string",
              },
              required: true,
              description: "The station id",
            },
          ],
          responses: {
            200: {
              description: "A single station",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Station",
                  },
                },
              },
            },
            404: {
              description: "Station not found",
            },
          },
        },
        put: {
          summary: "Updates an existing station",
          tags: ["Stations"],
          parameters: [
            {
              in: "path",
              name: "id",
              schema: {
                type: "string",
              },
              required: true,
              description: "The station id",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Station",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Station updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Station",
                  },
                },
              },
            },
            404: {
              description: "Station not found",
            },
            500: {
              description: "Server error",
            },
          },
        },
        delete: {
          summary: "Deletes a station",
          tags: ["Stations"],
          parameters: [
            {
              in: "path",
              name: "id",
              schema: {
                type: "string",
              },
              required: true,
              description: "The station id",
            },
          ],
          responses: {
            200: {
              description: "Station deleted successfully",
            },
            404: {
              description: "Station not found",
            },
            500: {
              description: "Server error",
            },
          },
        },
      },
      "/stationLocations/{stationID}": {
        get: {
          summary: "Retrieves the location of a station by ID",
          tags: ["StationLocations"],
          parameters: [
            {
              in: "path",
              name: "stationID",
              schema: {
                type: "string",
              },
              required: true,
              description: "The ID of the station",
            },
          ],
          responses: {
            200: {
              description: "Station location retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/StationLocation",
                  },
                },
              },
            },
            404: {
              description: "Station location not found",
            },
            500: {
              description: "Server error",
            },
          },
        },
      },
      "/nearbyStations": {
        get: {
          summary: "Retrieves nearby stations based on coordinates",
          tags: ["StationLocations"],
          parameters: [
            {
              in: "query",
              name: "central_longitude",
              schema: {
                type: "string",
              },
              required: true,
              description: "Central longitude",
            },
            {
              in: "query",
              name: "central_latitude",
              schema: {
                type: "string",
              },
              required: true,
              description: "Central latitude",
            },
            {
              in: "query",
              name: "limit",
              schema: {
                type: "string",
              },
              required: true,
              description: "Limit of nearby stations to retrieve",
            },
          ],
          responses: {
            200: {
              description: "Nearby stations retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/StationLocation",
                    },
                  },
                },
              },
            },
            400: {
              description: "Invalid or missing coordinates or limit",
            },
            500: {
              description: "Server error",
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
