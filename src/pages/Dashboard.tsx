import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Plus, 
  FileText, 
  LogOut, 
  User, 
  Calendar,
  MapPin,
  Timer,
  TrendingUp
} from "lucide-react";
import { WorkRegistrationModal } from "@/components/WorkRegistrationModal";
import { ReportsModal } from "@/components/ReportsModal";

interface WorkRecord {
  id: string;
  date: string;
  location: string;
  startTime: string;
  endTime: string;
  duration: number;
}

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [workRecords, setWorkRecords] = useState<WorkRecord[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const savedUsername = localStorage.getItem("username");
    const savedRecords = localStorage.getItem("workRecords");

    if (!auth) {
      navigate("/");
      return;
    }

    setIsAuthenticated(true);
    setUsername(savedUsername || "");
    
    if (savedRecords) {
      setWorkRecords(JSON.parse(savedRecords));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
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

  const totalHoursThisMonth = workRecords
    .filter(record => {
      const recordDate = new Date(record.date);
      const now = new Date();
      return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
    })
    .reduce((total, record) => total + record.duration, 0);

  const totalDaysThisMonth = new Set(
    workRecords
      .filter(record => {
        const recordDate = new Date(record.date);
        const now = new Date();
        return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
      })
      .map(record => record.date)
  ).size;

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
                <User className="w-4 h-4" />
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Horas Este Mês</p>
                  <p className="text-2xl font-bold">{totalHoursThisMonth.toFixed(1)}h</p>
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
                  <p className="text-sm text-muted-foreground">Dias Trabalhados</p>
                  <p className="text-2xl font-bold">{totalDaysThisMonth}</p>
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

          <Card className="border-0 shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center border">
                  <FileText className="w-5 h-5 text-foreground" />
                </div>
                Relatórios
              </CardTitle>
              <CardDescription>
                Gere relatórios detalhados do seu trabalho
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
                      <div className="text-right">
                        <p className="font-medium">{record.startTime} - {record.endTime}</p>
                        <p className="text-sm text-muted-foreground">{record.duration.toFixed(1)}h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
    </div>
  );
};

export default Dashboard;