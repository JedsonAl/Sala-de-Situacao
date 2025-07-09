import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Database, Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DbSettings {
  id?: number;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function DatabaseConfiguration() {
  const [dbSettings, setDbSettings] = useState<DbSettings>({
    host: "",
    port: 5432,
    database: "",
    username: "",
    password: ""
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  const [connectionMessage, setConnectionMessage] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current database settings
  const { data: currentDbSettings, isLoading } = useQuery({
    queryKey: ["/api/db-settings"],
  });

  // Update form when data is loaded
  useEffect(() => {
    if (currentDbSettings) {
      setDbSettings({
        host: currentDbSettings.host || "",
        port: currentDbSettings.port || 5432,
        database: currentDbSettings.database || "",
        username: currentDbSettings.username || "",
        password: currentDbSettings.password || ""
      });
    }
  }, [currentDbSettings]);

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
        description: "As configurações do banco de dados foram atualizadas.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar configuração",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  // Test database connection
  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus("idle");
    setConnectionMessage("");

    try {
      const response = await apiRequest("POST", "/api/db-settings/test", dbSettings);
      const result = await response.json();
      
      if (result.success) {
        setConnectionStatus("success");
        setConnectionMessage("Conexão estabelecida com sucesso!");
        toast({
          title: "Conexão testada com sucesso!",
          description: "Todos os parâmetros estão corretos.",
        });
      } else {
        setConnectionStatus("error");
        setConnectionMessage(result.message || "Erro na conexão");
        toast({
          title: "Erro na conexão",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus("error");
      setConnectionMessage("Erro ao testar conexão");
      toast({
        title: "Erro ao testar conexão",
        description: "Verifique os parâmetros e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleInputChange = (field: keyof DbSettings, value: string | number) => {
    setDbSettings(prev => ({ ...prev, [field]: value }));
    // Reset connection status when settings change
    if (connectionStatus !== "idle") {
      setConnectionStatus("idle");
      setConnectionMessage("");
    }
  };

  const isFormValid = dbSettings.host && dbSettings.port && dbSettings.database && dbSettings.username && dbSettings.password;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Configuração do Banco de Dados e-SUS PEC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-lg">
            <div>
              <Label htmlFor="db-host">Servidor</Label>
              <Input
                id="db-host"
                value={dbSettings.host}
                onChange={(e) => handleInputChange("host", e.target.value)}
                placeholder="localhost ou IP do servidor"
              />
              <p className="text-xs text-gray-500 mt-1">
                Endereço IP ou hostname do servidor PostgreSQL
              </p>
            </div>
            
            <div>
              <Label htmlFor="db-port">Porta</Label>
              <Input
                id="db-port"
                type="number"
                value={dbSettings.port}
                onChange={(e) => handleInputChange("port", Number(e.target.value))}
                placeholder="5432"
              />
              <p className="text-xs text-gray-500 mt-1">
                Porta do serviço PostgreSQL (padrão: 5432)
              </p>
            </div>
            
            <div>
              <Label htmlFor="db-database">Banco de Dados</Label>
              <Input
                id="db-database"
                value={dbSettings.database}
                onChange={(e) => handleInputChange("database", e.target.value)}
                placeholder="esus"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nome do banco de dados do e-SUS PEC
              </p>
            </div>
            
            <div>
              <Label htmlFor="db-username">Usuário do Banco</Label>
              <Input
                id="db-username"
                value={dbSettings.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="esus_leitura"
              />
              <p className="text-xs text-gray-500 mt-1">
                Usuário com permissão de leitura no banco
              </p>
            </div>
            
            <div>
              <Label htmlFor="db-password">Senha do Usuário</Label>
              <Input
                id="db-password"
                type="password"
                value={dbSettings.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="********"
              />
              <p className="text-xs text-gray-500 mt-1">
                Senha do usuário do banco de dados
              </p>
            </div>

            {/* Connection Status */}
            {connectionMessage && (
              <div className="mt-4">
                <div className={`flex items-center p-3 rounded-lg ${
                  connectionStatus === "success" 
                    ? "bg-green-50 text-green-800" 
                    : "bg-red-50 text-red-800"
                }`}>
                  {connectionStatus === "success" ? (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 mr-2" />
                  )}
                  <span className="text-sm font-medium">{connectionMessage}</span>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3 pt-4">
              <Button 
                variant="outline" 
                onClick={testConnection}
                disabled={isTestingConnection || !isFormValid}
              >
                {isTestingConnection ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testando...
                  </>
                ) : (
                  "Testar Conexão"
                )}
              </Button>
              <Button 
                onClick={() => saveDbSettingsMutation.mutate(dbSettings)}
                disabled={saveDbSettingsMutation.isPending || !isFormValid}
              >
                {saveDbSettingsMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Configuração"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-800">
            <Shield className="w-5 h-5 mr-2" />
            Informações de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>
                <strong>Armazenamento Seguro:</strong> As credenciais são armazenadas de forma segura no servidor 
                usando variáveis de ambiente criptografadas.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>
                <strong>Permissões de Leitura:</strong> Recomenda-se criar um usuário específico no PostgreSQL 
                com permissões apenas de leitura (SELECT) nas tabelas necessárias.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>
                <strong>Conexão Segura:</strong> Para ambientes de produção, configure SSL/TLS na conexão 
                com o banco de dados.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>
                <strong>Backup de Configuração:</strong> Mantenha backup das configurações de conexão 
                em local seguro e separado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Requisitos de Conexão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Badge variant="outline" className="mr-2">PostgreSQL</Badge>
              <span>Versão 9.6 ou superior</span>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className="mr-2">e-SUS PEC</Badge>
              <span>Versão 4.2 ou superior</span>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className="mr-2">Rede</Badge>
              <span>Conectividade TCP/IP entre servidor e banco</span>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className="mr-2">Firewall</Badge>
              <span>Porta 5432 liberada para conexão</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
