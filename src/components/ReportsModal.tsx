import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Download, MapPin } from "lucide-react";
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

  const generateReport = () => {
    if (!startDate || !endDate) {
      return;
    }

    const filteredRecords = workRecords.filter(record => {
      const recordDate = new Date(record.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return recordDate >= start && recordDate <= end;
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
    
    // Period
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Período: ${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}`, 20, 40);
    pdf.text(`Total de registros: ${filteredRecords.length}`, 20, 50);
    
    // Records
    let yPosition = 70;
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
    pdf.save(`relatorio-trabalho-${startDate}-${endDate}.pdf`);
    
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
            Gere relatórios detalhados filtrados por período
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