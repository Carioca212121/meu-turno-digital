import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Plus, 
  FileText, 
  LogOut, 
  UserIcon, 
  Calendar,
  MapPin,
  Timer,
  TrendingUp,
  Users
} from "lucide-react";
import { WorkRegistrationModal } from "@/components/WorkRegistrationModal";
import { ReportsModal } from "@/components/ReportsModal";
import { EditWorkModal } from "@/components/EditWorkModal";
import { UsersModal, type User } from "@/components/UsersModal";
import type { WorkRecord } from "@/types/work";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState<User['role'] | null>(null);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorkRecord | null>(null);
  const [workRecords, setWorkRecords] = useState<WorkRecord[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const savedUsername = localStorage.getItem("username");
    const savedUserRole = localStorage.getItem("userRole") as User['role'];
    const savedRecords = localStorage.getItem("workRecords");

    console.log("Dashboard useEffect - auth:", auth);
    console.log("Dashboard useEffect - savedUsername:", savedUsername);
    console.log("Dashboard useEffect - savedUserRole:", savedUserRole);
    console.log("Dashboard useEffect - savedRecords:", savedRecords);

    if (!auth) {
      navigate("/");
      return;
    }

    setIsAuthenticated(true);
    setUsername(savedUsername || "");
    setUserRole(savedUserRole || "Gerente"); // Default para Gerente se não existir
    
    if (savedRecords) {
      const records = JSON.parse(savedRecords);
      console.log("Parsed records:", records);
      setWorkRecords(records);
    }

    console.log("Final userRole set to:", savedUserRole || "Gerente");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate("/");
  };

  const addWorkRecord = (record: Omit<WorkRecord, "id">) => {
    const newRecord = {
      ...record,
      id: Date.now().toString(),
    };
    
    const updatedRecords = [...workRecords, newRecord];
    setWorkRecords(updatedRecords);
    localStorage.setItem("workRecords", JSON.stringify(updatedRecords));
    
    toast({
      title: "Registro adicionado!",
      description: "Trabalho registrado com sucesso.",
    });
  };

  const totalDaysThisMonth = workRecords
    .filter(record => {
      const recordDate = new Date(record.date);
      const now = new Date();
      return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
    }).length;

  const handleEditRecord = (record: WorkRecord) => {
    setEditingRecord(record);
    setShowEditModal(true);
  };

  const handleUpdateRecord = (updatedRecord: WorkRecord) => {
    const updatedRecords = workRecords.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    );
    setWorkRecords(updatedRecords);
    localStorage.setItem("workRecords", JSON.stringify(updatedRecords));
    
    toast({
      title: "Registro atualizado!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleDeleteRecord = (recordId: string) => {
    const updatedRecords = workRecords.filter(record => record.id !== recordId);
    setWorkRecords(updatedRecords);
    localStorage.setItem("workRecords", JSON.stringify(updatedRecords));
    
    toast({
      title: "Registro removido!",
      description: "O registro foi deletado com sucesso.",
    });
  };

  if (!isAuthenticated) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-medium">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Timer className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">Sistema de Controle</h1>
                <p className="text-primary-foreground/80 text-sm">Gestão de Trabalho</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-primary-foreground">
                <UserIcon className="w-4 h-4" />
                <span className="font-medium">{username}</span>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleLogout}
                className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            {userRole === "Gerente" && (
              <TabsTrigger value="users">
                <Users className="w-4 h-4 mr-2" />
                Usuários
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dias Este Mês</p>
                      <p className="text-2xl font-bold">{totalDaysThisMonth}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Registros Únicos</p>
                      <p className="text-2xl font-bold">{new Set(workRecords.map(r => r.date)).size}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Registros</p>
                      <p className="text-2xl font-bold">{workRecords.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(!userRole || userRole === "Gerente" || userRole === "Funcionário") && (
                <Card className="border-0 shadow-soft hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Plus className="w-5 h-5 text-primary-foreground" />
                      </div>
                      Registro de Trabalho
                    </CardTitle>
                    <CardDescription>
                      Registre um novo dia de trabalho no sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => setShowWorkModal(true)}
                      className="w-full h-12 bg-gradient-primary hover:shadow-primary transition-all duration-300"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Novo Registro
                    </Button>
                  </CardContent>
                </Card>
              )}

              {(!userRole || userRole === "Gerente" || userRole === "Empresa") && (
                <Card className="border-0 shadow-soft hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center border">
                        <FileText className="w-5 h-5 text-foreground" />
                      </div>
                      Relatórios
                    </CardTitle>
                    <CardDescription>
                      Gere relatórios detalhados do trabalho
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowReportsModal(true)}
                      className="w-full h-12 border-2 hover:bg-secondary/50 transition-all duration-300"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Gerar Relatório
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Records */}
            {workRecords.length > 0 && (
              <div className="mt-8">
                <Card className="border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle>Registros Recentes</CardTitle>
                    <CardDescription>Últimos trabalhos registrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {workRecords.slice(-5).reverse().map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{record.location}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(record.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          {(!userRole || userRole === "Gerente") && (
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditRecord(record)}
                                className="h-8 px-2"
                              >
                                Editar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteRecord(record.id)}
                                className="h-8 px-2"
                              >
                                Deletar
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>
                  Gerencie os usuários do sistema e suas permissões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowUsersModal(true)}>
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar Usuários
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <WorkRegistrationModal 
        open={showWorkModal}
        onOpenChange={setShowWorkModal}
        onSubmit={addWorkRecord}
      />
      
      <ReportsModal 
        open={showReportsModal}
        onOpenChange={setShowReportsModal}
        workRecords={workRecords}
      />
      
      <EditWorkModal 
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSubmit={handleUpdateRecord}
        record={editingRecord}
      />
      
      <UsersModal 
        open={showUsersModal}
        onOpenChange={setShowUsersModal}
      />
    </div>
  );
};

export default Dashboard;