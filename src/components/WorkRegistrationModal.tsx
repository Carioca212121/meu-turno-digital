import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Clock, Save } from "lucide-react";

interface WorkRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (record: {
    date: string;
    location: string;
    startTime: string;
    endTime: string;
    duration: number;
  }) => void;
}

export const WorkRegistrationModal = ({ open, onOpenChange, onSubmit }: WorkRegistrationModalProps) => {
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startInMinutes = startHour * 60 + startMin;
    const endInMinutes = endHour * 60 + endMin;
    
    let diffInMinutes = endInMinutes - startInMinutes;
    if (diffInMinutes < 0) {
      diffInMinutes += 24 * 60; // Add 24 hours if end is next day
    }
    
    return diffInMinutes / 60;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location || !startTime || !endTime) {
      return;
    }

    const duration = calculateDuration(startTime, endTime);
    const today = new Date().toISOString().split('T')[0];

    onSubmit({
      date: today,
      location,
      startTime,
      endTime,
      duration,
    });

    // Reset form
    setLocation("");
    setStartTime("");
    setEndTime("");
    onOpenChange(false);
  };

  const duration = calculateDuration(startTime, endTime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 shadow-large">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl">Registro de Trabalho</DialogTitle>
          <DialogDescription>
            Registre os detalhes do seu trabalho de hoje
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">Local de Trabalho</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 h-11"
                placeholder="Ex: Escritório Central, Cliente ABC..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-medium">Horário de Início</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-11"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium">Horário de Término</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-11"
                required
              />
            </div>
          </div>

          {startTime && endTime && (
            <div className="bg-secondary/50 p-4 rounded-lg border-2 border-secondary">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Duração Total:</span>
                <span className="text-lg font-bold text-primary">{duration.toFixed(1)} horas</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-primary hover:shadow-primary transition-all duration-300"
              disabled={!location || !startTime || !endTime}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Registro
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};