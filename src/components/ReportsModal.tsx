import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Download, MapPin, Clock } from "lucide-react";

interface WorkRecord {
  id: string;
  date: string;
  location: string;
  startTime: string;
  endTime: string;
  duration: number;
}

interface ReportsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workRecords: WorkRecord[];
}

export const ReportsModal = ({ open, onOpenChange, workRecords }: ReportsModalProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showReport, setShowReport] = useState(false);

  const generateReport = () => {
    if (!startDate || !endDate) return;
    setShowReport(true);
  };

  const filteredRecords = workRecords.filter(record => {
    if (!showReport || !startDate || !endDate) return false;
    return record.date >= startDate && record.date <= endDate;
  });

  const totalHours = filteredRecords.reduce((sum, record) => sum + record.duration, 0);
  const totalDays = filteredRecords.length;
  const averageHoursPerDay = totalDays > 0 ? totalHours / totalDays : 0;

  const downloadReport = () => {
    const reportData = {
      period: `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`,
      totalHours: totalHours.toFixed(1),
      totalDays,
      averageHoursPerDay: averageHoursPerDay.toFixed(1),
      records: filteredRecords.map(record => ({
        date: new Date(record.date).toLocaleDateString('pt-BR'),
        location: record.location,
        startTime: record.startTime,
        endTime: record.endTime,
        duration: record.duration.toFixed(1)
      }))
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `relatorio_trabalho_${startDate}_${endDate}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>

          {/* Report Results */}
          {showReport && (
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Relatório Gerado</CardTitle>
                    <CardDescription>
                      {new Date(startDate).toLocaleDateString('pt-BR')} - {new Date(endDate).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={downloadReport}
                    disabled={filteredRecords.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{totalHours.toFixed(1)}h</p>
                    <p className="text-xs text-muted-foreground">Total de Horas</p>
                  </div>
                  <div className="text-center p-3 bg-success/5 rounded-lg">
                    <p className="text-2xl font-bold text-success">{totalDays}</p>
                    <p className="text-xs text-muted-foreground">Dias Trabalhados</p>
                  </div>
                  <div className="text-center p-3 bg-warning/5 rounded-lg">
                    <p className="text-2xl font-bold text-warning">{averageHoursPerDay.toFixed(1)}h</p>
                    <p className="text-xs text-muted-foreground">Média por Dia</p>
                  </div>
                </div>

                {/* Records List */}
                {filteredRecords.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    <h4 className="font-medium text-sm text-muted-foreground">Registros Detalhados:</h4>
                    {filteredRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{record.location}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(record.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {record.startTime} - {record.endTime}
                          </div>
                          <p className="font-medium">{record.duration.toFixed(1)}h</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum registro encontrado no período selecionado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};