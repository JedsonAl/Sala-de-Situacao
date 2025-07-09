import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Heart, Users, AlertTriangle, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import GaugeChart from "@/components/charts/gauge";
import { useAuth } from "@/App";

interface DashboardStats {
  overall: number;
  categories: {
    "good-practices": number;
    "oral-health": number;
    "emulti": number;
  };
  alerts: Array<{
    code: string;
    name: string;
    performance: number;
    type: "warning" | "critical";
  }>;
}

export default function ResponsibleDashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  // Mock unitId for now - in real app this would come from user context
  const unitId = 1;

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats", { unitId }],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/stats?unitId=${unitId}`);
      return response.json();
    },
  });

  const handleCategoryClick = (category: string) => {
    navigate(`/category/${category}`);
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Sala de Situação" subtitle="Carregando..." />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        title="Sala de Situação" 
        subtitle={`${user?.fullName} - UBS Centro`}
        showBackButton={false}
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Performance Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Desempenho Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <GaugeChart 
                value={stats.overall} 
                label="Desempenho"
                color={stats.overall >= 75 ? "#22c55e" : stats.overall >= 50 ? "#f59e0b" : "#dc2626"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Good Practices Card */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCategoryClick("good-practices")}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Boas Práticas</h3>
                  <p className="text-sm text-gray-600">7 indicadores</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.categories["good-practices"]}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Oral Health Card */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCategoryClick("oral-health")}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Heart className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Saúde Bucal</h3>
                  <p className="text-sm text-gray-600">6 indicadores</p>
                  <p className="text-2xl font-bold text-green-600">{stats.categories["oral-health"]}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* eMulti Card */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCategoryClick("emulti")}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">eMulti</h3>
                  <p className="text-sm text-gray-600">2 indicadores</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.categories["emulti"]}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas e Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.alerts.length === 0 ? (
                <p className="text-gray-600">Nenhum alerta no momento.</p>
              ) : (
                stats.alerts.map((alert) => (
                  <div 
                    key={alert.code}
                    className={`flex items-center p-3 rounded-lg ${
                      alert.type === "critical" 
                        ? "bg-red-50" 
                        : "bg-yellow-50"
                    }`}
                  >
                    {alert.type === "critical" ? (
                      <XCircle className="w-5 h-5 text-red-600 mr-3" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${
                        alert.type === "critical" ? "text-red-800" : "text-yellow-800"
                      }`}>
                        {alert.code} - {alert.name}
                      </p>
                      <p className={`text-xs ${
                        alert.type === "critical" ? "text-red-700" : "text-yellow-700"
                      }`}>
                        {alert.type === "critical" 
                          ? `Indicador crítico (${alert.performance}%)`
                          : `Indicador abaixo da meta (${alert.performance}%)`
                        }
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
