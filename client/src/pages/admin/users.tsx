import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
  createdAt: string;
}

interface HealthUnit {
  id: number;
  name: string;
  cnesCode: string;
  municipalityId: number;
}

export default function UsersManagement() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isLinkUserOpen, setIsLinkUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    fullName: "", 
    role: "responsible" 
  });
  const [searchTerm, setSearchTerm] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["/api/users"],
  });

  // Fetch health units
  const { data: healthUnits = [] } = useQuery({
    queryKey: ["/api/health-units"],
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
    onError: () => {
      toast({
        title: "Erro ao criar responsável",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Responsável excluído com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir responsável",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  // Filter users based on search
  const filteredUsers = users.filter((user: User) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower)
    );
  });

  const handleEmailChange = (email: string) => {
    setNewUser(prev => ({ ...prev, email, username: email }));
  };

  const openLinkDialog = (user: User) => {
    setSelectedUser(user);
    setIsLinkUserOpen(true);
  };

  if (loadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando responsáveis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Gestão de Responsáveis
            </CardTitle>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Responsável
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
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
                      onChange={(e) => handleEmailChange(e.target.value)}
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
                      disabled={
                        createUserMutation.isPending || 
                        !newUser.fullName || 
                        !newUser.email || 
                        !newUser.password
                      }
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
          <div className="mb-4">
            <Input
              placeholder="Buscar por nome, e-mail ou usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Equipes</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    {searchTerm ? "Nenhum responsável encontrado" : "Nenhum responsável cadastrado"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" ? "Administrador" : "Responsável"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-500">Não vinculado</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-500">-</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openLinkDialog(user)}
                          title="Vincular a unidade"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteUserMutation.mutate(user.id)}
                          disabled={deleteUserMutation.isPending}
                          title="Excluir responsável"
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

      {/* Link User to Unit Dialog */}
      <Dialog open={isLinkUserOpen} onOpenChange={setIsLinkUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular Responsável à Unidade</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>Responsável</Label>
                <Input
                  value={selectedUser.fullName}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="unit-select">Unidade de Saúde</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {healthUnits.map((unit: HealthUnit) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name} - {unit.cnesCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Equipes</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="esf1" className="rounded" />
                    <label htmlFor="esf1" className="text-sm">Equipe Saúde da Família 001</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="esf2" className="rounded" />
                    <label htmlFor="esf2" className="text-sm">Equipe Saúde da Família 002</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="esb1" className="rounded" />
                    <label htmlFor="esb1" className="text-sm">Equipe Saúde Bucal 001</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="emulti1" className="rounded" />
                    <label htmlFor="emulti1" className="text-sm">Equipe Multiprofissional 001</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsLinkUserOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Vinculação realizada com sucesso!",
                    description: "O responsável foi vinculado às equipes selecionadas.",
                  });
                  setIsLinkUserOpen(false);
                }}>
                  Salvar Vinculação
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
