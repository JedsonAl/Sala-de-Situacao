import { useState } from "react";
import Header from "@/components/layout/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Database, Shield } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Municipality {
  id: number;
  name: string;
  ibgeCode: string;
  createdAt: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
  createdAt: string;
}

interface DbSettings {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

interface AdminDashboardProps {
  onLogout?: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("municipalities");
  const [isAddMunicipalityOpen, setIsAddMunicipalityOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newMunicipality, setNewMunicipality] = useState({ name: "", ibgeCode: "" });
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", fullName: "", role: "responsible" });
  const [dbSettings, setDbSettings] = useState<DbSettings>({
    host: "",
    port: 5432,
    database: "",
    username: "",
    password: ""
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch municipalities
  const { data: municipalities = [] } = useQuery({
    queryKey: ["/api/municipalities"],
  });

  // Fetch users
  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  // Fetch database settings
  const { data: currentDbSettings } = useQuery({
    queryKey: ["/api/db-settings"],
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
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (user: typeof newUser) => {
      const response = await apiRequest("POST", "/api/users", user);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsAddUserOpen(false);
      setNewUser({ username: "", email: "", password: "", fullName: "", role: "responsible" });
      toast({
        title: "Responsável criado com sucesso!",
      });
    },
  });

  // Save database settings mutation
  const saveDbSettingsMutation = useMutation({
    mutationFn: async (settings: DbSettings) => {
      const response = await apiRequest("POST", "/api/db-settings", settings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/db-settings"] });
      toast({
        title: "Configuração salva com sucesso!",
      });
    },
  });

  // Test database connection
  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const response = await apiRequest("POST", "/api/db-settings/test", dbSettings);
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Conexão testada com sucesso!",
          description: "Todos os parâmetros estão corretos.",
        });
      } else {
        toast({
          title: "Erro na conexão",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao testar conexão",
        description: "Verifique os parâmetros e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        title="Painel Administrativo" 
        subtitle="Administrador Geral" 
        showBackButton={false}
        onLogout={onLogout}
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="municipalities">Municípios e Unidades</TabsTrigger>
            <TabsTrigger value="users">Responsáveis</TabsTrigger>
            <TabsTrigger value="database">Configuração BD</TabsTrigger>
          </TabsList>

          <TabsContent value="municipalities" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gestão de Municípios e Unidades</CardTitle>
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
                            disabled={createMunicipalityMutation.isPending}
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
                  <Input placeholder="Buscar por nome..." className="flex-1" />
                  <Input placeholder="Código IBGE..." className="w-32" />
                  <Input placeholder="CNES..." className="w-32" />
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
                    {municipalities.map((municipality: Municipality) => (
                      <TableRow key={municipality.id}>
                        <TableCell className="font-medium">{municipality.name}</TableCell>
                        <TableCell>{municipality.ibgeCode}</TableCell>
                        <TableCell>-</TableCell>
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
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gestão de Responsáveis</CardTitle>
                  <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Responsável
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Responsável</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="user-name">Nome Completo</Label>
                          <Input
                            id="user-name"
                            value={newUser.fullName}
                            onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                            placeholder="Digite o nome completo"
                          />
                        </div>
                        <div>
                          <Label htmlFor="user-email">E-mail</Label>
                          <Input
                            id="user-email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value, username: e.target.value }))}
                            placeholder="Digite o e-mail"
                          />
                        </div>
                        <div>
                          <Label htmlFor="user-password">Senha Inicial</Label>
                          <Input
                            id="user-password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Digite a senha inicial"
                          />
                        </div>
                        <div>
                          <Label htmlFor="user-role">Função</Label>
                          <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a função" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="responsible">Responsável de Unidade</SelectItem>
                              <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsAddUserOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            onClick={() => createUserMutation.mutate(newUser)}
                            disabled={createUserMutation.isPending}
                          >
                            {createUserMutation.isPending ? "Salvando..." : "Salvar"}
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
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: User) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role === "admin" ? "Administrador" : "Responsável"}
                          </Badge>
                        </TableCell>
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
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Configuração do Banco de Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-lg">
                  <div>
                    <Label htmlFor="db-host">Servidor</Label>
                    <Input
                      id="db-host"
                      value={dbSettings.host}
                      onChange={(e) => setDbSettings(prev => ({ ...prev, host: e.target.value }))}
                      placeholder="localhost ou IP do servidor"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="db-port">Porta</Label>
                    <Input
                      id="db-port"
                      type="number"
                      value={dbSettings.port}
                      onChange={(e) => setDbSettings(prev => ({ ...prev, port: Number(e.target.value) }))}
                      placeholder="5432"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="db-database">Banco de Dados</Label>
                    <Input
                      id="db-database"
                      value={dbSettings.database}
                      onChange={(e) => setDbSettings(prev => ({ ...prev, database: e.target.value }))}
                      placeholder="esus"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="db-username">Usuário do Banco</Label>
                    <Input
                      id="db-username"
                      value={dbSettings.username}
                      onChange={(e) => setDbSettings(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="esus_leitura"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="db-password">Senha do Usuário</Label>
                    <Input
                      id="db-password"
                      type="password"
                      value={dbSettings.password}
                      onChange={(e) => setDbSettings(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="********"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={testConnection}
                      disabled={isTestingConnection}
                    >
                      {isTestingConnection ? "Testando..." : "Testar Conexão"}
                    </Button>
                    <Button 
                      onClick={() => saveDbSettingsMutation.mutate(dbSettings)}
                      disabled={saveDbSettingsMutation.isPending}
                    >
                      {saveDbSettingsMutation.isPending ? "Salvando..." : "Salvar Configuração"}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-md">
                  <div className="flex">
                    <Shield className="w-5 h-5 text-yellow-400 mr-2" />
                    <div>
                      <p className="text-sm text-yellow-800">
                        <strong>Segurança:</strong> As credenciais são armazenadas de forma segura no servidor usando variáveis de ambiente.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
