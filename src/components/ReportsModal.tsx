import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Download, MapPin, User } from "lucide-react";
import jsPDF from 'jspdf';
import type { WorkRecord } from "@/types/work";

interface ReportsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workRecords: WorkRecord[];
}

export const ReportsModal = ({ open, onOpenChange, workRecords }: ReportsModalProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("todos");

  const generateReport = () => {
    if (!startDate || !endDate) {
      return;
    }

    // Obter lista única de usuários
    const uniqueUsers = Array.from(new Set(workRecords.map(record => record.createdBy || "Usuário Desconhecido")));

    let filteredRecords = workRecords.filter(record => {
      const recordDate = new Date(record.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dateInRange = recordDate >= start && recordDate <= end;
      
      // Filtrar por usuário se não for "todos"
      if (selectedUser === "todos") {
        return dateInRange;
      } else {
        return dateInRange && (record.createdBy || "Usuário Desconhecido") === selectedUser;
      }
    });

    if (filteredRecords.length === 0) {
      return;
    }

    // Generate PDF
    const pdf = new jsPDF();
    
    // Title
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("RELATÓRIO DE TRABALHO", 105, 20, { align: "center" });
    
    // Period and user info
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Período: ${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}`, 20, 40);
    pdf.text(`Usuário: ${selectedUser === "todos" ? "Todos os usuários" : selectedUser}`, 20, 50);
    pdf.text(`Total de registros: ${filteredRecords.length}`, 20, 60);
    
    // Records
    let yPosition = 80;
    pdf.setFont("helvetica", "bold");
    pdf.text("DETALHES:", 20, yPosition);
    yPosition += 10;
    
    pdf.setFont("helvetica", "normal");
    filteredRecords.forEach((record, index) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.text(`${index + 1}. Data: ${new Date(record.date).toLocaleDateString('pt-BR')}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`   Local: ${record.location}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`   Usuário: ${record.createdBy || "Usuário Desconhecido"}`, 20, yPosition);
      yPosition += 15;
    });
    
    // Footer
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    
    yPosition += 10;
    pdf.setFont("helvetica", "italic");
    pdf.text(`Relatório gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, yPosition);
    
    // Download PDF
    const fileName = selectedUser === "todos" 
      ? `relatorio-trabalho-todos-${startDate}-${endDate}.pdf`
      : `relatorio-trabalho-${selectedUser}-${startDate}-${endDate}.pdf`;
    pdf.save(fileName);
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl border-0 shadow-large max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center border">
            <FileText className="w-6 h-6 text-foreground" />
          </div>
          <DialogTitle className="text-xl">Relatórios de Trabalho</DialogTitle>
          <DialogDescription>
            Gere relatórios detalhados filtrados por período e usuário
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Date Selection */}
          <Card className="border-2 border-secondary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Período do Relatório
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userSelect" className="text-sm font-medium">Usuário</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os usuários</SelectItem>
                    {Array.from(new Set(workRecords.map(record => record.createdBy || "Usuário Desconhecido")))
                      .sort()
                      .map(user => (
                        <SelectItem key={user} value={user}>{user}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
              
              <Button 
                onClick={generateReport}
                className="w-full bg-gradient-primary hover:shadow-primary transition-all duration-300"
                disabled={!startDate || !endDate}
              >
                <Download className="w-4 h-4 mr-2" />
                Gerar e Baixar Relatório PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};