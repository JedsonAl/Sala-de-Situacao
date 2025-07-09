// Mock data utilities for consistent data across the application
// This provides structured mock data that matches the database schema

export interface MockIndicatorData {
  code: string;
  name: string;
  category: string;
  performance: number;
  numerator: number;
  denominator: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface MockPatientData {
  id: number;
  name: string;
  cns: string;
  birthDate: string;
  acsName: string;
  status: {
    [key: string]: {
      achieved: boolean;
      lastUpdate: string;
      notes: string;
    };
  };
}

export interface MockHistoricalData {
  month: number;
  year: number;
  performance: number;
}

// Mock indicators data that matches the database structure
export const MOCK_INDICATORS: MockIndicatorData[] = [
  // Good Practices Indicators (C.1 - C.7)
  {
    code: "C1",
    name: "Acesso",
    category: "good-practices",
    performance: 89,
    numerator: 1247,
    denominator: 1401,
    trend: "up",
    lastUpdated: "2024-12-01"
  },
  {
    code: "C2",
    name: "Cuidado da Criança",
    category: "good-practices",
    performance: 76,
    numerator: 856,
    denominator: 1126,
    trend: "stable",
    lastUpdated: "2024-12-01"
  },
  {
    code: "C3",
    name: "Cuidado da Gestante",
    category: "good-practices",
    performance: 82,
    numerator: 164,
    denominator: 200,
    trend: "up",
    lastUpdated: "2024-12-01"
  },
  {
    code: "C4",
    name: "Cuidado do Diabético",
    category: "good-practices",
    performance: 68,
    numerator: 892,
    denominator: 1312,
    trend: "down",
    lastUpdated: "2024-12-01"
  },
  {
    code: "C5",
    name: "Cuidado do Hipertenso",
    category: "good-practices",
    performance: 64,
    numerator: 1847,
    denominator: 2886,
    trend: "down",
    lastUpdated: "2024-12-01"
  },
  {
    code: "C6",
    name: "Cuidado da Pessoa Idosa",
    category: "good-practices",
    performance: 79,
    numerator: 1156,
    denominator: 1463,
    trend: "stable",
    lastUpdated: "2024-12-01"
  },
  {
    code: "C7",
    name: "Cuidado da Mulher",
    category: "good-practices",
    performance: 85,
    numerator: 967,
    denominator: 1138,
    trend: "up",
    lastUpdated: "2024-12-01"
  },
  
  // Oral Health Indicators (B.1 - B.6)
  {
    code: "B1",
    name: "Primeira Consulta",
    category: "oral-health",
    performance: 78,
    numerator: 234,
    denominator: 300,
    trend: "up",
    lastUpdated: "2024-12-01"
  },
  {
    code: "B2",
    name: "Tratamento Concluído",
    category: "oral-health",
    performance: 72,
    numerator: 189,
    denominator: 262,
    trend: "stable",
    lastUpdated: "2024-12-01"
  },
  {
    code: "B3",
    name: "Razão de Exodontias",
    category: "oral-health",
    performance: 45,
    numerator: 67,
    denominator: 149,
    trend: "down",
    lastUpdated: "2024-12-01"
  },
  {
    code: "B4",
    name: "Escovação Dental",
    category: "oral-health",
    performance: 83,
    numerator: 456,
    denominator: 549,
    trend: "up",
    lastUpdated: "2024-12-01"
  },
  {
    code: "B5",
    name: "Preventivos",
    category: "oral-health",
    performance: 76,
    numerator: 345,
    denominator: 454,
    trend: "stable",
    lastUpdated: "2024-12-01"
  },
  {
    code: "B6",
    name: "ART",
    category: "oral-health",
    performance: 68,
    numerator: 123,
    denominator: 181,
    trend: "up",
    lastUpdated: "2024-12-01"
  },
  
  // eMulti Indicators (M.1 - M.2)
  {
    code: "M1",
    name: "Média de Atendimentos",
    category: "emulti",
    performance: 74,
    numerator: 1234,
    denominator: 1668,
    trend: "stable",
    lastUpdated: "2024-12-01"
  },
  {
    code: "M2",
    name: "Ações Interprofissionais",
    category: "emulti",
    performance: 68,
    numerator: 789,
    denominator: 1160,
    trend: "up",
    lastUpdated: "2024-12-01"
  }
];

// Mock patients data for nominal lists
export const MOCK_PATIENTS: MockPatientData[] = [
  {
    id: 1,
    name: "João Silva Santos",
    cns: "123456789012345",
    birthDate: "1965-03-15",
    acsName: "Maria Silva",
    status: {
      A: { achieved: true, lastUpdate: "2024-11-10", notes: "Consulta realizada em 10/11/2024" },
      B: { achieved: true, lastUpdate: "2024-11-10", notes: "PA aferida em 10/11/2024: 140x90 mmHg" },
      C: { achieved: false, lastUpdate: "2024-09-15", notes: "Última visita em 15/09/2024" },
      D: { achieved: true, lastUpdate: "2024-11-10", notes: "Peso/altura em 10/11/2024: 78kg/1.70m" }
    }
  },
  {
    id: 2,
    name: "Maria Oliveira Costa",
    cns: "987654321098765",
    birthDate: "1958-08-22",
    acsName: "João Santos",
    status: {
      A: { achieved: false, lastUpdate: "2024-08-15", notes: "Última consulta em 15/08/2024" },
      B: { achieved: false, lastUpdate: "2024-08-15", notes: "Última aferição em 15/08/2024" },
      C: { achieved: true, lastUpdate: "2024-11-05", notes: "Visitas em 05/11/2024 e 10/10/2024" },
      D: { achieved: true, lastUpdate: "2024-08-15", notes: "Peso/altura em 15/08/2024: 65kg/1.60m" }
    }
  },
  {
    id: 3,
    name: "Pedro Almeida",
    cns: "456789123456789",
    birthDate: "1972-12-10",
    acsName: "Ana Costa",
    status: {
      A: { achieved: true, lastUpdate: "2024-10-28", notes: "Consulta realizada em 28/10/2024" },
      B: { achieved: true, lastUpdate: "2024-10-28", notes: "PA aferida em 28/10/2024: 130x85 mmHg" },
      C: { achieved: true, lastUpdate: "2024-11-01", notes: "Visitas em 01/11/2024 e 15/10/2024" },
      D: { achieved: false, lastUpdate: "2024-01-15", notes: "Última medição em 15/01/2024" }
    }
  },
  {
    id: 4,
    name: "Ana Beatriz Souza",
    cns: "789123456789012",
    birthDate: "1980-05-20",
    acsName: "Carlos Lima",
    status: {
      A: { achieved: true, lastUpdate: "2024-11-15", notes: "Consulta realizada em 15/11/2024" },
      B: { achieved: true, lastUpdate: "2024-11-15", notes: "PA aferida em 15/11/2024: 125x80 mmHg" },
      C: { achieved: true, lastUpdate: "2024-11-10", notes: "Visitas regulares mantidas" },
      D: { achieved: true, lastUpdate: "2024-11-15", notes: "Dados antropométricos atualizados" }
    }
  },
  {
    id: 5,
    name: "José Carlos Ferreira",
    cns: "321654987321654",
    birthDate: "1955-11-30",
    acsName: "Luciana Santos",
    status: {
      A: { achieved: false, lastUpdate: "2024-07-20", notes: "Não compareceu às últimas consultas" },
      B: { achieved: false, lastUpdate: "2024-07-20", notes: "Aferição pendente há 4 meses" },
      C: { achieved: false, lastUpdate: "2024-06-10", notes: "Visitas domiciliares sem sucesso" },
      D: { achieved: false, lastUpdate: "2024-03-15", notes: "Dados desatualizados há 8 meses" }
    }
  }
];

// Generate historical data for charts (last 12 months)
export function generateHistoricalData(basePerformance: number, variance: number = 10): MockHistoricalData[] {
  const data: MockHistoricalData[] = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const randomVariation = (Math.random() - 0.5) * variance;
    const performance = Math.max(0, Math.min(100, basePerformance + randomVariation));
    
    data.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      performance: Math.round(performance)
    });
  }
  
  return data;
}

// Generate component performance data for bar charts
export function generateComponentData(indicatorCode: string) {
  const componentMap: { [key: string]: string[] } = {
    C5: ["Consulta", "PA Aferida", "Visitas ACS", "Antropometria"],
    C4: ["Consulta", "HbA1c", "Fundo de Olho", "Orientações"],
    C3: ["Pré-natal Precoce", "6+ Consultas", "Exames", "Puerpério"],
    B1: ["Agendamento", "Comparecimento", "Registro", "Acolhimento"],
    B2: ["Início Tratamento", "Continuidade", "Conclusão", "Registro"],
    M1: ["Atendimentos", "Registro", "Qualidade", "Integração"]
  };
  
  const components = componentMap[indicatorCode] || ["Critério A", "Critério B", "Critério C", "Critério D"];
  
  return components.map(name => ({
    name,
    value: Math.round(50 + Math.random() * 40) // Random value between 50-90%
  }));
}

// Utility functions for data manipulation
export function getIndicatorsByCategory(category: string): MockIndicatorData[] {
  return MOCK_INDICATORS.filter(indicator => indicator.category === category);
}

export function getIndicatorByCode(code: string): MockIndicatorData | undefined {
  return MOCK_INDICATORS.find(indicator => indicator.code === code);
}

export function calculateCategoryAverage(category: string): number {
  const indicators = getIndicatorsByCategory(category);
  if (indicators.length === 0) return 0;
  
  const sum = indicators.reduce((acc, indicator) => acc + indicator.performance, 0);
  return Math.round(sum / indicators.length);
}

export function calculateOverallAverage(): number {
  if (MOCK_INDICATORS.length === 0) return 0;
  
  const sum = MOCK_INDICATORS.reduce((acc, indicator) => acc + indicator.performance, 0);
  return Math.round(sum / MOCK_INDICATORS.length);
}

export function getAlertsData(): Array<{
  code: string;
  name: string;
  performance: number;
  type: "warning" | "critical";
}> {
  return MOCK_INDICATORS
    .filter(indicator => indicator.performance < 70)
    .map(indicator => ({
      code: indicator.code,
      name: indicator.name,
      performance: indicator.performance,
      type: indicator.performance < 50 ? "critical" as const : "warning" as const
    }));
}

// Performance classification helpers
export function getPerformanceStatus(performance: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (performance >= 90) {
    return {
      label: "Excelente",
      color: "text-green-800",
      bgColor: "bg-green-100"
    };
  } else if (performance >= 75) {
    return {
      label: "Bom",
      color: "text-blue-800",
      bgColor: "bg-blue-100"
    };
  } else if (performance >= 50) {
    return {
      label: "Regular",
      color: "text-yellow-800",
      bgColor: "bg-yellow-100"
    };
  } else {
    return {
      label: "Crítico",
      color: "text-red-800",
      bgColor: "bg-red-100"
    };
  }
}

export function getPerformanceColor(performance: number): string {
  if (performance >= 75) return "#22c55e"; // green
  if (performance >= 50) return "#f59e0b"; // yellow
  return "#dc2626"; // red
}

// Date formatting utilities
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR");
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("pt-BR");
}

// ACS (Community Health Agent) utilities
export function getUniqueAcsNames(): string[] {
  return [...new Set(MOCK_PATIENTS.map(patient => patient.acsName))];
}

export function getPatientsByAcs(acsName: string): MockPatientData[] {
  return MOCK_PATIENTS.filter(patient => patient.acsName === acsName);
}

// Export/import simulation utilities
export function generatePDFExportData(indicatorCode: string, filters: any) {
  return {
    title: `Lista Nominal - Indicador ${indicatorCode}`,
    generatedAt: new Date().toISOString(),
    filters,
    data: MOCK_PATIENTS,
    summary: {
      total: MOCK_PATIENTS.length,
      achieved: MOCK_PATIENTS.filter(p => p.status.A?.achieved).length,
      pending: MOCK_PATIENTS.filter(p => !p.status.A?.achieved).length
    }
  };
}

export function generateExcelExportData(indicatorCode: string, filters: any) {
  return {
    filename: `indicador_${indicatorCode}_${new Date().toISOString().split('T')[0]}.xlsx`,
    data: MOCK_PATIENTS.map(patient => ({
      "Nome": patient.name,
      "CNS": patient.cns,
      "Data Nascimento": formatDate(patient.birthDate),
      "ACS": patient.acsName,
      "Consulta": patient.status.A?.achieved ? "Sim" : "Não",
      "PA Aferida": patient.status.B?.achieved ? "Sim" : "Não",
      "Visitas ACS": patient.status.C?.achieved ? "Sim" : "Não",
      "Antropometria": patient.status.D?.achieved ? "Sim" : "Não"
    }))
  };
}
