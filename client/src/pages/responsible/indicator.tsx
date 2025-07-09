import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, FileText, Download } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import LineChart from "@/components/charts/line-chart";
import BarChart from "@/components/charts/bar-chart";
import NominalList from "@/components/tables/nominal-list";
import HelpModal from "@/components/modals/help-modal";
import { useState } from "react";
import { INDICATORS } from "@/lib/indicators";
import { useToast } from "@/hooks/use-toast";

interface Indicator {
  id: number;
  code: string;
  name: string;
  category: string;
  performance: number;
  numerator: number;
  denominator: number;
  unitId: number;
}

interface IndicatorHistory {
  id: number;
  indicatorId: number;
  month: number;
  year: number;
  performance: number;
}

interface IndicatorDetailProps {
  onLogout?: () => void;
}

export default function IndicatorDetail({ onLogout }: IndicatorDetailProps) {
  const [location, navigate] = useLocation();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const { toast } = useToast();
  
  const indicatorCode = location.split("/indicator/")[1];
  const unitId = 1; // Mock unitId

  const { data: indicator } = useQuery<Indicator>({
    queryKey: ["/api/indicators", indicatorCode, { unitId }],
    queryFn: async () => {
      const response = await fetch(`/api/indicators/${indicatorCode}?unitId=${unitId}`);
      return response.json();
    },
  });

  const { data: history = [] } = useQuery<IndicatorHistory[]>({
    queryKey: ["/api/indicators", indicatorCode, "history", { unitId }],
    queryFn: async () => {
      const response = await fetch(`/api/indicators/${indicatorCode}/history?unitId=${unitId}`);
      return response.json();
    },
  });

  const indicatorInfo = INDICATORS.details[indicatorCode as keyof typeof INDICATORS.details];

  if (!indicator || !indicatorInfo) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Indicador não encontrado" subtitle="UBS Centro" onLogout={onLogout} />
      </div>
    );
  }

  const handleBack = () => {
    const categoryPath = `/category/${indicator.category}`;
    navigate(categoryPath);
  };

  const getPerformanceStatus = (performance: number) => {
    if (performance >= 75) return { label: "Ótimo", color: "bg-green-100 text-green-800" };
    if (performance >= 50) return { label: "Regular", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Crítico", color: "bg-red-100 text-red-800" };
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 75) return "#22c55e";
    if (performance >= 50) return "#f59e0b";
    return "#dc2626";
  };

  const exportToPDF = () => {
    toast({
      title: "Exportando para PDF",
      description: "Relatório sendo gerado...",
    });
  };

  const exportToExcel = () => {
    toast({
      title: "Exportando para Excel",
      description: "Planilha sendo gerada...",
    });
  };

  const status = getPerformanceStatus(indicator.performance);

  // Prepare historical data for chart
  const historicalData = history.map(h => ({
    month: `${h.month}/${h.year}`,
    performance: Math.round(h.performance)
  }));

  // Mock components data
  const componentsData = [
    { name: "Consulta", value: 78 },
    { name: "PA Aferida", value: 85 },
    { name: "Visitas ACS", value: 42 },
    { name: "Antropometria", value: 71 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        title={`${indicator.code} - ${indicator.name}`}
        subtitle="UBS Centro"
        showBackButton={true}
        onBack={handleBack}
        onLogout={onLogout}
        rightContent={
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsHelpModalOpen(true)}
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
        }
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Performance Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Desempenho Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getPerformanceColor(indicator.performance) === "#22c55e" ? "text-green-600" : getPerformanceColor(indicator.performance) === "#f59e0b" ? "text-orange-600" : "text-red-600"}`}>
                    {Math.round(indicator.performance)}%
                  </div>
                  <div className="text-sm text-gray-500">Desempenho</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-gray-900">{indicator.numerator.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Numerador</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-gray-900">{indicator.denominator.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Denominador</div>
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="h-3 rounded-full"
                style={{ 
                  width: `${indicator.performance}%`,
                  backgroundColor: getPerformanceColor(indicator.performance)
                }}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className={status.color}>
                {status.label}
              </Badge>
              <span className="text-sm text-gray-600">Meta: ≥75%</span>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Historical Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução Histórica</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart 
                data={historicalData}
                xKey="month"
                yKey="performance"
                color={getPerformanceColor(indicator.performance)}
              />
            </CardContent>
          </Card>

          {/* Components Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Componentes do Indicador</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={componentsData}
                xKey="name"
                yKey="value"
                colors={["#22c55e", "#22c55e", "#dc2626", "#f59e0b"]}
              />
            </CardContent>
          </Card>
        </div>

        {/* Nominal List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Lista Nominal de Acompanhamento</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={exportToPDF}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={exportToExcel}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <NominalList 
              unitId={unitId}
              indicatorCode={indicator.code}
            />
          </CardContent>
        </Card>
      </main>

      <HelpModal 
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        indicator={indicatorInfo}
      />
    </div>
  );
}
