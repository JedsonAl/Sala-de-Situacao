import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("responsible"), // "admin" or "responsible"
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Municipalities table
export const municipalities = pgTable("municipalities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ibgeCode: text("ibge_code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health units table
export const healthUnits = pgTable("health_units", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cnesCode: text("cnes_code").notNull().unique(),
  municipalityId: integer("municipality_id").references(() => municipalities.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// User-Unit associations
export const userUnits = pgTable("user_units", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  unitId: integer("unit_id").references(() => healthUnits.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Database connection settings
export const dbSettings = pgTable("db_settings", {
  id: serial("id").primaryKey(),
  host: text("host").notNull(),
  port: integer("port").notNull(),
  database: text("database").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Indicators data (mock data structure)
export const indicators = pgTable("indicators", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // C1, C2, B1, etc.
  name: text("name").notNull(),
  category: text("category").notNull(), // "good-practices", "oral-health", "emulti"
  performance: real("performance").notNull(),
  numerator: integer("numerator").notNull(),
  denominator: integer("denominator").notNull(),
  unitId: integer("unit_id").references(() => healthUnits.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Indicator historical data
export const indicatorHistory = pgTable("indicator_history", {
  id: serial("id").primaryKey(),
  indicatorId: integer("indicator_id").references(() => indicators.id),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  performance: real("performance").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Patients for nominal lists
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cns: text("cns").notNull().unique(),
  birthDate: timestamp("birth_date").notNull(),
  acsName: text("acs_name").notNull(),
  unitId: integer("unit_id").references(() => healthUnits.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Patient indicator status
export const patientIndicatorStatus = pgTable("patient_indicator_status", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id),
  indicatorCode: text("indicator_code").notNull(),
  criteriaCode: text("criteria_code").notNull(), // A, B, C, D for different criteria
  status: boolean("status").notNull(),
  lastUpdate: timestamp("last_update"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertMunicipalitySchema = createInsertSchema(municipalities).omit({ id: true, createdAt: true });
export const insertHealthUnitSchema = createInsertSchema(healthUnits).omit({ id: true, createdAt: true });
export const insertDbSettingsSchema = createInsertSchema(dbSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertIndicatorSchema = createInsertSchema(indicators).omit({ id: true, createdAt: true });
export const insertPatientSchema = createInsertSchema(patients).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Municipality = typeof municipalities.$inferSelect;
export type InsertMunicipality = z.infer<typeof insertMunicipalitySchema>;
export type HealthUnit = typeof healthUnits.$inferSelect;
export type InsertHealthUnit = z.infer<typeof insertHealthUnitSchema>;
export type DbSettings = typeof dbSettings.$inferSelect;
export type InsertDbSettings = z.infer<typeof insertDbSettingsSchema>;
export type Indicator = typeof indicators.$inferSelect;
export type InsertIndicator = z.infer<typeof insertIndicatorSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type IndicatorHistory = typeof indicatorHistory.$inferSelect;
export type PatientIndicatorStatus = typeof patientIndicatorStatus.$inferSelect;
