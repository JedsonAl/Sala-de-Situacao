import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import { INDICATORS } from "@/lib/indicators";

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

export default function Category() {
  const [location, navigate] = useLocation();
  const categoryParam = location.split("/category/")[1];
  
  // Mock unitId for now
  const unitId = 1;

  const { data: indicators = [] } = useQuery<Indicator[]>({
    queryKey: ["/api/indicators", { unitId, category: categoryParam }],
    queryFn: async () => {
      const response = await fetch(`/api/indicators?unitId=${unitId}&category=${categoryParam}`);
      return response.json();
    },
  });

  const categoryInfo = INDICATORS.categories[categoryParam as keyof typeof INDICATORS.categories];

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Categoria não encontrada" subtitle="UBS Centro" />
      </div>
    );
  }

  const handleIndicatorClick = (code: string) => {
    navigate(`/indicator/${code}`);
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 75) return "text-green-600 bg-green-600";
    if (performance >= 50) return "text-orange-600 bg-orange-600";
    return "text-red-600 bg-red-600";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        title={categoryInfo.name} 
        subtitle="UBS Centro"
        showBackButton={true}
        onBack={() => navigate("/")}
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {indicators.map((indicator) => (
            <Card 
              key={indicator.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleIndicatorClick(indicator.code)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {indicator.code} - {indicator.name}
                  </h3>
                  <span className={`text-2xl font-bold ${getPerformanceColor(indicator.performance).split(" ")[0]}`}>
                    {Math.round(indicator.performance)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full ${getPerformanceColor(indicator.performance).split(" ")[1]}`}
                    style={{ width: `${indicator.performance}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Numerador: {indicator.numerator}</span>
                  <span>Denominador: {indicator.denominator}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
