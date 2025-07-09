import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Municipality {
  id: number;
  name: string;
  ibgeCode: string;
  createdAt: string;
}

interface HealthUnit {
  id: number;
  name: string;
  cnesCode: string;
  municipalityId: number;
  createdAt: string;
}

export default function Municipalities() {
  const [isAddMunicipalityOpen, setIsAddMunicipalityOpen] = useState(false);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [newMunicipality, setNewMunicipality] = useState({ name: "", ibgeCode: "" });
  const [newUnit, setNewUnit] = useState({ name: "", cnesCode: "", municipalityId: 0 });
  const [searchName, setSearchName] = useState("");
  const [searchIbge, setSearchIbge] = useState("");
  const [searchCnes, setSearchCnes] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch municipalities
  const { data: municipalities = [], isLoading: loadingMunicipalities } = useQuery({
    queryKey: ["/api/municipalities"],
  });

  // Fetch health units
  const { data: healthUnits = [], isLoading: loadingUnits } = useQuery({
    queryKey: ["/api/health-units"],
  });

  // Create municipality mutation
  const createMunicipalityMutation = useMutation({
    mutationFn: async (municipality: typeof newMunicipality) => {
      const response = await apiRequest("POST", "/api/municipalities", municipality);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/municipalities"] });
      setIsAddMunicipalityOpen(false);
      setNewMunicipality({ name: "", ibgeCode: "" });
      toast({
        title: "Município criado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar município",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  // Create health unit mutation
  const createUnitMutation = useMutation({
    mutationFn: async (unit: typeof newUnit) => {
      const response = await apiRequest("POST", "/api/health-units", unit);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-units"] });
      setIsAddUnitOpen(false);
      setNewUnit({ name: "", cnesCode: "", municipalityId: 0 });
      toast({
        title: "Unidade criada com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar unidade",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  // Delete municipality mutation
  const deleteMunicipalityMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/municipalities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/municipalities"] });
      toast({
        title: "Município excluído com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir município",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  // Filter municipalities based on search
  const filteredMunicipalities = municipalities.filter((municipality: Municipality) => {
    const matchesName = municipality.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesIbge = municipality.ibgeCode.includes(searchIbge);
    return matchesName && matchesIbge;
  });

  // Get units count for each municipality
  const getUnitsCount = (municipalityId: number) => {
    return healthUnits.filter((unit: HealthUnit) => unit.municipalityId === municipalityId).length;
  };

  // Get municipality name by ID
  const getMunicipalityName = (municipalityId: number) => {
    const municipality = municipalities.find((m: Municipality) => m.id === municipalityId);
    return municipality?.name || "N/A";
  };

  if (loadingMunicipalities || loadingUnits) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Municipalities Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestão de Municípios</CardTitle>
            <Dialog open={isAddMunicipalityOpen} onOpenChange={setIsAddMunicipalityOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Município
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Município</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="municipality-name">Nome do Município</Label>
                    <Input
                      id="municipality-name"
                      value={newMunicipality.name}
                      onChange={(e) => setNewMunicipality(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Digite o nome do município"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ibge-code">Código IBGE</Label>
                    <Input
                      id="ibge-code"
                      value={newMunicipality.ibgeCode}
                      onChange={(e) => setNewMunicipality(prev => ({ ...prev, ibgeCode: e.target.value }))}
                      placeholder="Digite o código IBGE"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddMunicipalityOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={() => createMunicipalityMutation.mutate(newMunicipality)}
                      disabled={createMunicipalityMutation.isPending || !newMunicipality.name || !newMunicipality.ibgeCode}
                    >
                      {createMunicipalityMutation.isPending ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Input 
              placeholder="Buscar por nome..." 
              className="flex-1"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Input 
              placeholder="Código IBGE..." 
              className="w-32"
              value={searchIbge}
              onChange={(e) => setSearchIbge(e.target.value)}
            />
            <Input 
              placeholder="CNES..." 
              className="w-32"
              value={searchCnes}
              onChange={(e) => setSearchCnes(e.target.value)}
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Município</TableHead>
                <TableHead>IBGE</TableHead>
                <TableHead>Unidades</TableHead>
                <TableHead>Responsáveis</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMunicipalities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    Nenhum município encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredMunicipalities.map((municipality: Municipality) => (
                  <TableRow key={municipality.id}>
                    <TableCell className="font-medium">{municipality.name}</TableCell>
                    <TableCell>{municipality.ibgeCode}</TableCell>
                    <TableCell>{getUnitsCount(municipality.id)}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteMunicipalityMutation.mutate(municipality.id)}
                          disabled={deleteMunicipalityMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Health Units Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestão de Unidades de Saúde</CardTitle>
            <Dialog open={isAddUnitOpen} onOpenChange={setIsAddUnitOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Unidade
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Unidade de Saúde</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="unit-name">Nome da Unidade</Label>
                    <Input
                      id="unit-name"
                      value={newUnit.name}
                      onChange={(e) => setNewUnit(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Digite o nome da unidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnes-code">Código CNES</Label>
                    <Input
                      id="cnes-code"
                      value={newUnit.cnesCode}
                      onChange={(e) => setNewUnit(prev => ({ ...prev, cnesCode: e.target.value }))}
                      placeholder="Digite o código CNES"
                    />
                  </div>
                  <div>
                    <Label htmlFor="municipality">Município</Label>
                    <select
                      id="municipality"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      value={newUnit.municipalityId}
                      onChange={(e) => setNewUnit(prev => ({ ...prev, municipalityId: Number(e.target.value) }))}
                    >
                      <option value={0}>Selecione um município</option>
                      {municipalities.map((municipality: Municipality) => (
                        <option key={municipality.id} value={municipality.id}>
                          {municipality.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddUnitOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={() => createUnitMutation.mutate(newUnit)}
                      disabled={createUnitMutation.isPending || !newUnit.name || !newUnit.cnesCode || !newUnit.municipalityId}
                    >
                      {createUnitMutation.isPending ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unidade</TableHead>
                <TableHead>CNES</TableHead>
                <TableHead>Município</TableHead>
                <TableHead>Responsáveis</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    Nenhuma unidade encontrada
                  </TableCell>
                </TableRow>
              ) : (
                healthUnits.map((unit: HealthUnit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell>{unit.cnesCode}</TableCell>
                    <TableCell>{getMunicipalityName(unit.municipalityId)}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
