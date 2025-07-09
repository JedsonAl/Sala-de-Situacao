import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMunicipalitySchema, insertHealthUnitSchema, insertDbSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role,
          fullName: user.fullName 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(u => ({ ...u, password: undefined })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, userData);
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteUser(id);
      res.json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Municipality routes
  app.get("/api/municipalities", async (req, res) => {
    try {
      const municipalities = await storage.getAllMunicipalities();
      res.json(municipalities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch municipalities" });
    }
  });

  app.post("/api/municipalities", async (req, res) => {
    try {
      const municipalityData = insertMunicipalitySchema.parse(req.body);
      const municipality = await storage.createMunicipality(municipalityData);
      res.json(municipality);
    } catch (error) {
      res.status(400).json({ message: "Invalid municipality data" });
    }
  });

  app.put("/api/municipalities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const municipalityData = insertMunicipalitySchema.partial().parse(req.body);
      const municipality = await storage.updateMunicipality(id, municipalityData);
      res.json(municipality);
    } catch (error) {
      res.status(400).json({ message: "Failed to update municipality" });
    }
  });

  app.delete("/api/municipalities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMunicipality(id);
      res.json({ message: "Municipality deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete municipality" });
    }
  });

  // Health unit routes
  app.get("/api/health-units", async (req, res) => {
    try {
      const units = await storage.getAllHealthUnits();
      res.json(units);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health units" });
    }
  });

  app.post("/api/health-units", async (req, res) => {
    try {
      const unitData = insertHealthUnitSchema.parse(req.body);
      const unit = await storage.createHealthUnit(unitData);
      res.json(unit);
    } catch (error) {
      res.status(400).json({ message: "Invalid health unit data" });
    }
  });

  // Database settings routes
  app.get("/api/db-settings", async (req, res) => {
    try {
      const settings = await storage.getDbSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch database settings" });
    }
  });

  app.post("/api/db-settings", async (req, res) => {
    try {
      const settingsData = insertDbSettingsSchema.parse(req.body);
      const settings = await storage.saveDbSettings(settingsData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid database settings" });
    }
  });

  app.post("/api/db-settings/test", async (req, res) => {
    try {
      const { host, port, database, username, password } = req.body;
      
      // Mock database connection test
      // In a real implementation, you would actually test the PostgreSQL connection
      if (host && port && database && username && password) {
        res.json({ success: true, message: "Conexão testada com sucesso!" });
      } else {
        res.status(400).json({ success: false, message: "Parâmetros de conexão inválidos" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Erro ao testar conexão" });
    }
  });

  // Indicator routes
  app.get("/api/indicators", async (req, res) => {
    try {
      const { unitId, category } = req.query;
      let indicators;
      
      if (category) {
        indicators = await storage.getIndicatorsByCategory(Number(unitId), category as string);
      } else {
        indicators = await storage.getIndicatorsByUnit(Number(unitId));
      }
      
      res.json(indicators);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch indicators" });
    }
  });

  app.get("/api/indicators/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const { unitId } = req.query;
      const indicator = await storage.getIndicator(code, Number(unitId));
      res.json(indicator);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch indicator" });
    }
  });

  app.get("/api/indicators/:code/history", async (req, res) => {
    try {
      const { code } = req.params;
      const { unitId } = req.query;
      const indicator = await storage.getIndicator(code, Number(unitId));
      
      if (!indicator) {
        return res.status(404).json({ message: "Indicator not found" });
      }
      
      const history = await storage.getIndicatorHistory(indicator.id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch indicator history" });
    }
  });

  // Patient routes
  app.get("/api/patients", async (req, res) => {
    try {
      const { unitId, indicatorCode } = req.query;
      let patients;
      
      if (indicatorCode) {
        patients = await storage.getPatientsByIndicator(Number(unitId), indicatorCode as string);
      } else {
        patients = await storage.getPatientsByUnit(Number(unitId));
      }
      
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.get("/api/patients/:id/indicator-status", async (req, res) => {
    try {
      const { id } = req.params;
      const { indicatorCode } = req.query;
      const status = await storage.getPatientIndicatorStatus(Number(id), indicatorCode as string);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patient indicator status" });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const { unitId } = req.query;
      const indicators = await storage.getIndicatorsByUnit(Number(unitId));
      
      const categories = {
        "good-practices": indicators.filter(i => i.category === "good-practices"),
        "oral-health": indicators.filter(i => i.category === "oral-health"),
        "emulti": indicators.filter(i => i.category === "emulti"),
      };

      const stats = {
        overall: Math.round(indicators.reduce((sum, i) => sum + i.performance, 0) / indicators.length),
        categories: {
          "good-practices": Math.round(categories["good-practices"].reduce((sum, i) => sum + i.performance, 0) / categories["good-practices"].length),
          "oral-health": Math.round(categories["oral-health"].reduce((sum, i) => sum + i.performance, 0) / categories["oral-health"].length),
          "emulti": Math.round(categories["emulti"].reduce((sum, i) => sum + i.performance, 0) / categories["emulti"].length),
        },
        alerts: indicators.filter(i => i.performance < 70).map(i => ({
          code: i.code,
          name: i.name,
          performance: i.performance,
          type: i.performance < 50 ? "critical" : "warning"
        }))
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
