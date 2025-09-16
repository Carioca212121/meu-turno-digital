import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Clock, Save } from "lucide-react";
import type { WorkRecord } from "@/types/work";

interface WorkRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (record: Omit<WorkRecord, "id">) => void;
  currentUser: string;
}

export const WorkRegistrationModal = ({ open, onOpenChange, onSubmit, currentUser }: WorkRegistrationModalProps) => {
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location || !startTime || !endTime) {
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    onSubmit({
      date: today,
      startTime,
      endTime,
      location,
      createdBy: currentUser,
    });

    // Reset form
    setLocation("");
    setStartTime("08:00");
    setEndTime("17:00");
    onOpenChange(false);
  };

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
              <Label htmlFor="startTime" className="text-sm font-medium">Hora Início</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium">Hora Fim</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>
          </div>

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