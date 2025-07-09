import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Patient {
  id: number;
  name: string;
  cns: string;
  birthDate: string;
  acsName: string;
  unitId: number;
}

interface PatientStatus {
  criteriaCode: string;
  status: boolean;
  lastUpdate: string;
  notes: string;
}

interface NominalListProps {
  unitId: number;
  indicatorCode: string;
}

export default function NominalList({ unitId, indicatorCode }: NominalListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAcs, setSelectedAcs] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedAgeRange, setSelectedAgeRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients", { unitId, indicatorCode }],
    queryFn: async () => {
      const response = await fetch(`/api/patients?unitId=${unitId}&indicatorCode=${indicatorCode}`);
      return response.json();
    },
  });

  // Get unique ACS names for filter
  const acsNames = [...new Set(patients.map(p => p.acsName))];

  // Filter patients based on search and filters
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.cns.includes(searchTerm);
    const matchesAcs = selectedAcs === "all" || patient.acsName === selectedAcs;
    
    return matchesSearch && matchesAcs;
  });

  // Paginate results
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusIcon = (status: boolean, notes: string, lastUpdate?: string) => {
    if (status) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-green-600 cursor-pointer">✅</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{notes}</p>
              {lastUpdate && <p className="text-xs">Última atualização: {formatDate(lastUpdate)}</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className="text-red-600 cursor-pointer">❌</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{notes}</p>
            {lastUpdate && <p className="text-xs">Última atualização: {formatDate(lastUpdate)}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Mock status data for demonstration
  const getMockStatus = (patientId: number, criteriaCode: string) => {
    const random = Math.random();
    const status = random > 0.3;
    return {
      status,
      notes: status ? "Alcançado" : "Pendente",
      lastUpdate: new Date().toISOString()
    };
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search">Buscar por nome/CNS</Label>
          <Input
            id="search"
            placeholder="Digite nome ou CNS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="acs">ACS Responsável</Label>
          <Select value={selectedAcs} onValueChange={setSelectedAcs}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {acsNames.map(acs => (
                <SelectItem key={acs} value={acs}>{acs}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="complete">Em dia</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="overdue">Atrasado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="age-range">Faixa Etária</Label>
          <Select value={selectedAgeRange} onValueChange={setSelectedAgeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="18-39">18-39 anos</SelectItem>
              <SelectItem value="40-59">40-59 anos</SelectItem>
              <SelectItem value="60+">60+ anos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Cidadão</TableHead>
              <TableHead>CNS</TableHead>
              <TableHead>Data Nascimento</TableHead>
              <TableHead>ACS</TableHead>
              <TableHead>Consulta</TableHead>
              <TableHead>PA Aferida</TableHead>
              <TableHead>Visitas ACS</TableHead>
              <TableHead>Antropometria</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.cns}</TableCell>
                <TableCell>{formatDate(patient.birthDate)}</TableCell>
                <TableCell>{patient.acsName}</TableCell>
                <TableCell>{getStatusIcon(getMockStatus(patient.id, "A").status, getMockStatus(patient.id, "A").notes, getMockStatus(patient.id, "A").lastUpdate)}</TableCell>
                <TableCell>{getStatusIcon(getMockStatus(patient.id, "B").status, getMockStatus(patient.id, "B").notes, getMockStatus(patient.id, "B").lastUpdate)}</TableCell>
                <TableCell>{getStatusIcon(getMockStatus(patient.id, "C").status, getMockStatus(patient.id, "C").notes, getMockStatus(patient.id, "C").lastUpdate)}</TableCell>
                <TableCell>{getStatusIcon(getMockStatus(patient.id, "D").status, getMockStatus(patient.id, "D").notes, getMockStatus(patient.id, "D").lastUpdate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
          <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredPatients.length)}</span> de{" "}
          <span className="font-medium">{filteredPatients.length}</span> registros
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Próxima
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
