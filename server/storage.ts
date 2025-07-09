import { 
  users, 
  municipalities, 
  healthUnits, 
  userUnits, 
  dbSettings, 
  indicators, 
  indicatorHistory, 
  patients, 
  patientIndicatorStatus,
  type User, 
  type InsertUser,
  type Municipality,
  type InsertMunicipality,
  type HealthUnit,
  type InsertHealthUnit,
  type DbSettings,
  type InsertDbSettings,
  type Indicator,
  type InsertIndicator,
  type Patient,
  type InsertPatient,
  type IndicatorHistory,
  type PatientIndicatorStatus
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  getAllUsers(): Promise<User[]>;

  // Municipality operations
  getAllMunicipalities(): Promise<Municipality[]>;
  createMunicipality(municipality: InsertMunicipality): Promise<Municipality>;
  updateMunicipality(id: number, municipality: Partial<InsertMunicipality>): Promise<Municipality>;
  deleteMunicipality(id: number): Promise<void>;

  // Health unit operations
  getAllHealthUnits(): Promise<HealthUnit[]>;
  getHealthUnitsByMunicipality(municipalityId: number): Promise<HealthUnit[]>;
  createHealthUnit(unit: InsertHealthUnit): Promise<HealthUnit>;
  updateHealthUnit(id: number, unit: Partial<InsertHealthUnit>): Promise<HealthUnit>;
  deleteHealthUnit(id: number): Promise<void>;

  // Database settings
  getDbSettings(): Promise<DbSettings | undefined>;
  saveDbSettings(settings: InsertDbSettings): Promise<DbSettings>;

  // Indicator operations
  getIndicatorsByUnit(unitId: number): Promise<Indicator[]>;
  getIndicatorsByCategory(unitId: number, category: string): Promise<Indicator[]>;
  getIndicator(code: string, unitId: number): Promise<Indicator | undefined>;
  createIndicator(indicator: InsertIndicator): Promise<Indicator>;
  updateIndicator(id: number, indicator: Partial<InsertIndicator>): Promise<Indicator>;

  // Indicator history
  getIndicatorHistory(indicatorId: number): Promise<IndicatorHistory[]>;
  createIndicatorHistory(history: Omit<IndicatorHistory, 'id' | 'createdAt'>): Promise<IndicatorHistory>;

  // Patient operations
  getPatientsByUnit(unitId: number): Promise<Patient[]>;
  getPatientsByIndicator(unitId: number, indicatorCode: string): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  
  // Patient indicator status
  getPatientIndicatorStatus(patientId: number, indicatorCode: string): Promise<PatientIndicatorStatus[]>;
  updatePatientIndicatorStatus(patientId: number, indicatorCode: string, criteriaCode: string, status: boolean): Promise<PatientIndicatorStatus>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private municipalities: Map<number, Municipality>;
  private healthUnits: Map<number, HealthUnit>;
  private userUnits: Map<number, { userId: number; unitId: number; }>;
  private dbSettings?: DbSettings;
  private indicators: Map<number, Indicator>;
  private indicatorHistory: Map<number, IndicatorHistory>;
  private patients: Map<number, Patient>;
  private patientIndicatorStatus: Map<number, PatientIndicatorStatus>;
  
  private currentUserId: number = 1;
  private currentMunicipalityId: number = 1;
  private currentHealthUnitId: number = 1;
  private currentUserUnitId: number = 1;
  private currentIndicatorId: number = 1;
  private currentHistoryId: number = 1;
  private currentPatientId: number = 1;
  private currentStatusId: number = 1;

  constructor() {
    this.users = new Map();
    this.municipalities = new Map();
    this.healthUnits = new Map();
    this.userUnits = new Map();
    this.indicators = new Map();
    this.indicatorHistory = new Map();
    this.patients = new Map();
    this.patientIndicatorStatus = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin@saude.gov.br",
      email: "admin@saude.gov.br",
      password: "admin123", // In real app, this would be hashed
      role: "admin",
      fullName: "Administrador Geral",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Sample responsible user
    const responsibleUser: User = {
      id: this.currentUserId++,
      username: "joao.silva@saude.sp.gov.br",
      email: "joao.silva@saude.sp.gov.br",
      password: "joao123",
      role: "responsible",
      fullName: "Dr. João Silva",
      createdAt: new Date(),
    };
    this.users.set(responsibleUser.id, responsibleUser);

    // Sample municipality
    const municipality: Municipality = {
      id: this.currentMunicipalityId++,
      name: "São Paulo",
      ibgeCode: "3550308",
      createdAt: new Date(),
    };
    this.municipalities.set(municipality.id, municipality);

    // Sample health unit
    const healthUnit: HealthUnit = {
      id: this.currentHealthUnitId++,
      name: "UBS Centro",
      cnesCode: "2077469",
      municipalityId: municipality.id,
      createdAt: new Date(),
    };
    this.healthUnits.set(healthUnit.id, healthUnit);

    // Link user to unit
    this.userUnits.set(this.currentUserUnitId++, { userId: responsibleUser.id, unitId: healthUnit.id });

    // Sample indicators
    const indicatorData = [
      { code: "C1", name: "Acesso", category: "good-practices", performance: 89, numerator: 1247, denominator: 1401 },
      { code: "C2", name: "Cuidado da Criança", category: "good-practices", performance: 76, numerator: 856, denominator: 1126 },
      { code: "C3", name: "Cuidado da Gestante", category: "good-practices", performance: 82, numerator: 164, denominator: 200 },
      { code: "C4", name: "Cuidado do Diabético", category: "good-practices", performance: 68, numerator: 892, denominator: 1312 },
      { code: "C5", name: "Cuidado do Hipertenso", category: "good-practices", performance: 64, numerator: 1847, denominator: 2886 },
      { code: "C6", name: "Cuidado da Pessoa Idosa", category: "good-practices", performance: 79, numerator: 1156, denominator: 1463 },
      { code: "C7", name: "Cuidado da Mulher", category: "good-practices", performance: 85, numerator: 967, denominator: 1138 },
      { code: "B1", name: "Primeira Consulta", category: "oral-health", performance: 78, numerator: 234, denominator: 300 },
      { code: "B2", name: "Tratamento Concluído", category: "oral-health", performance: 72, numerator: 189, denominator: 262 },
      { code: "B3", name: "Razão de Exodontias", category: "oral-health", performance: 45, numerator: 67, denominator: 149 },
      { code: "B4", name: "Escovação Dental", category: "oral-health", performance: 83, numerator: 456, denominator: 549 },
      { code: "B5", name: "Preventivos", category: "oral-health", performance: 76, numerator: 345, denominator: 454 },
      { code: "B6", name: "ART", category: "oral-health", performance: 68, numerator: 123, denominator: 181 },
      { code: "M1", name: "Média de Atendimentos", category: "emulti", performance: 74, numerator: 1234, denominator: 1668 },
      { code: "M2", name: "Ações Interprofissionais", category: "emulti", performance: 68, numerator: 789, denominator: 1160 },
    ];

    indicatorData.forEach(data => {
      const indicator: Indicator = {
        id: this.currentIndicatorId++,
        code: data.code,
        name: data.name,
        category: data.category,
        performance: data.performance,
        numerator: data.numerator,
        denominator: data.denominator,
        unitId: healthUnit.id,
        createdAt: new Date(),
      };
      this.indicators.set(indicator.id, indicator);

      // Add historical data (last 12 months)
      for (let i = 0; i < 12; i++) {
        const history: IndicatorHistory = {
          id: this.currentHistoryId++,
          indicatorId: indicator.id,
          month: (new Date().getMonth() - i + 12) % 12 + 1,
          year: new Date().getFullYear() - (i > new Date().getMonth() ? 1 : 0),
          performance: data.performance + (Math.random() - 0.5) * 10,
          createdAt: new Date(),
        };
        this.indicatorHistory.set(history.id, history);
      }
    });

    // Sample patients
    const patientData = [
      { name: "João Silva Santos", cns: "123456789012345", birthDate: new Date("1965-03-15"), acsName: "Maria Silva" },
      { name: "Maria Oliveira Costa", cns: "987654321098765", birthDate: new Date("1958-08-22"), acsName: "João Santos" },
      { name: "Pedro Almeida", cns: "456789123456789", birthDate: new Date("1972-12-10"), acsName: "Ana Costa" },
    ];

    patientData.forEach(data => {
      const patient: Patient = {
        id: this.currentPatientId++,
        name: data.name,
        cns: data.cns,
        birthDate: data.birthDate,
        acsName: data.acsName,
        unitId: healthUnit.id,
        createdAt: new Date(),
      };
      this.patients.set(patient.id, patient);

      // Add sample indicator status
      const statuses = [
        { criteriaCode: "A", status: Math.random() > 0.3 },
        { criteriaCode: "B", status: Math.random() > 0.2 },
        { criteriaCode: "C", status: Math.random() > 0.5 },
        { criteriaCode: "D", status: Math.random() > 0.3 },
      ];

      statuses.forEach(statusData => {
        const status: PatientIndicatorStatus = {
          id: this.currentStatusId++,
          patientId: patient.id,
          indicatorCode: "C5",
          criteriaCode: statusData.criteriaCode,
          status: statusData.status,
          lastUpdate: new Date(),
          notes: statusData.status ? "Alcançado" : "Pendente",
          createdAt: new Date(),
        };
        this.patientIndicatorStatus.set(status.id, status);
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { 
      ...user, 
      id, 
      createdAt: new Date(),
      role: user.role || "responsible"
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    const updatedUser = { ...existingUser, ...user };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Municipality operations
  async getAllMunicipalities(): Promise<Municipality[]> {
    return Array.from(this.municipalities.values());
  }

  async createMunicipality(municipality: InsertMunicipality): Promise<Municipality> {
    const id = this.currentMunicipalityId++;
    const newMunicipality: Municipality = { ...municipality, id, createdAt: new Date() };
    this.municipalities.set(id, newMunicipality);
    return newMunicipality;
  }

  async updateMunicipality(id: number, municipality: Partial<InsertMunicipality>): Promise<Municipality> {
    const existing = this.municipalities.get(id);
    if (!existing) {
      throw new Error("Municipality not found");
    }
    const updated = { ...existing, ...municipality };
    this.municipalities.set(id, updated);
    return updated;
  }

  async deleteMunicipality(id: number): Promise<void> {
    this.municipalities.delete(id);
  }

  // Health unit operations
  async getAllHealthUnits(): Promise<HealthUnit[]> {
    return Array.from(this.healthUnits.values());
  }

  async getHealthUnitsByMunicipality(municipalityId: number): Promise<HealthUnit[]> {
    return Array.from(this.healthUnits.values()).filter(unit => unit.municipalityId === municipalityId);
  }

  async createHealthUnit(unit: InsertHealthUnit): Promise<HealthUnit> {
    const id = this.currentHealthUnitId++;
    const newUnit: HealthUnit = { 
      ...unit, 
      id, 
      createdAt: new Date(),
      municipalityId: unit.municipalityId || null
    };
    this.healthUnits.set(id, newUnit);
    return newUnit;
  }

  async updateHealthUnit(id: number, unit: Partial<InsertHealthUnit>): Promise<HealthUnit> {
    const existing = this.healthUnits.get(id);
    if (!existing) {
      throw new Error("Health unit not found");
    }
    const updated = { ...existing, ...unit };
    this.healthUnits.set(id, updated);
    return updated;
  }

  async deleteHealthUnit(id: number): Promise<void> {
    this.healthUnits.delete(id);
  }

  // Database settings
  async getDbSettings(): Promise<DbSettings | undefined> {
    return this.dbSettings;
  }

  async saveDbSettings(settings: InsertDbSettings): Promise<DbSettings> {
    const dbSettings: DbSettings = {
      id: 1,
      ...settings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.dbSettings = dbSettings;
    return dbSettings;
  }

  // Indicator operations
  async getIndicatorsByUnit(unitId: number): Promise<Indicator[]> {
    return Array.from(this.indicators.values()).filter(indicator => indicator.unitId === unitId);
  }

  async getIndicatorsByCategory(unitId: number, category: string): Promise<Indicator[]> {
    return Array.from(this.indicators.values()).filter(
      indicator => indicator.unitId === unitId && indicator.category === category
    );
  }

  async getIndicator(code: string, unitId: number): Promise<Indicator | undefined> {
    return Array.from(this.indicators.values()).find(
      indicator => indicator.code === code && indicator.unitId === unitId
    );
  }

  async createIndicator(indicator: InsertIndicator): Promise<Indicator> {
    const id = this.currentIndicatorId++;
    const newIndicator: Indicator = { 
      ...indicator, 
      id, 
      createdAt: new Date(),
      unitId: indicator.unitId || null
    };
    this.indicators.set(id, newIndicator);
    return newIndicator;
  }

  async updateIndicator(id: number, indicator: Partial<InsertIndicator>): Promise<Indicator> {
    const existing = this.indicators.get(id);
    if (!existing) {
      throw new Error("Indicator not found");
    }
    const updated = { ...existing, ...indicator };
    this.indicators.set(id, updated);
    return updated;
  }

  // Indicator history
  async getIndicatorHistory(indicatorId: number): Promise<IndicatorHistory[]> {
    return Array.from(this.indicatorHistory.values())
      .filter(history => history.indicatorId === indicatorId)
      .sort((a, b) => a.year - b.year || a.month - b.month);
  }

  async createIndicatorHistory(history: Omit<IndicatorHistory, 'id' | 'createdAt'>): Promise<IndicatorHistory> {
    const id = this.currentHistoryId++;
    const newHistory: IndicatorHistory = { ...history, id, createdAt: new Date() };
    this.indicatorHistory.set(id, newHistory);
    return newHistory;
  }

  // Patient operations
  async getPatientsByUnit(unitId: number): Promise<Patient[]> {
    return Array.from(this.patients.values()).filter(patient => patient.unitId === unitId);
  }

  async getPatientsByIndicator(unitId: number, indicatorCode: string): Promise<Patient[]> {
    return Array.from(this.patients.values()).filter(patient => patient.unitId === unitId);
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const id = this.currentPatientId++;
    const newPatient: Patient = { 
      ...patient, 
      id, 
      createdAt: new Date(),
      unitId: patient.unitId || null
    };
    this.patients.set(id, newPatient);
    return newPatient;
  }

  // Patient indicator status
  async getPatientIndicatorStatus(patientId: number, indicatorCode: string): Promise<PatientIndicatorStatus[]> {
    return Array.from(this.patientIndicatorStatus.values()).filter(
      status => status.patientId === patientId && status.indicatorCode === indicatorCode
    );
  }

  async updatePatientIndicatorStatus(
    patientId: number, 
    indicatorCode: string, 
    criteriaCode: string, 
    status: boolean
  ): Promise<PatientIndicatorStatus> {
    const existing = Array.from(this.patientIndicatorStatus.values()).find(
      s => s.patientId === patientId && s.indicatorCode === indicatorCode && s.criteriaCode === criteriaCode
    );

    if (existing) {
      existing.status = status;
      existing.lastUpdate = new Date();
      return existing;
    }

    const id = this.currentStatusId++;
    const newStatus: PatientIndicatorStatus = {
      id,
      patientId,
      indicatorCode,
      criteriaCode,
      status,
      lastUpdate: new Date(),
      notes: status ? "Alcançado" : "Pendente",
      createdAt: new Date(),
    };
    this.patientIndicatorStatus.set(id, newStatus);
    return newStatus;
  }
}

export const storage = new MemStorage();
