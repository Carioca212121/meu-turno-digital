import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Save } from "lucide-react";
import type { WorkRecord } from "@/types/work";

interface EditWorkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (record: WorkRecord) => void;
  record: WorkRecord | null;
}

export const EditWorkModal = ({ open, onOpenChange, onSubmit, record }: EditWorkModalProps) => {
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (record) {
      setLocation(record.location);
    }
  }, [record]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location || !record) {
      return;
    }

    onSubmit({
      ...record,
      location,
      // Manter o createdBy original
    });

    onOpenChange(false);
  };

  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 shadow-large">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl">Editar Registro</DialogTitle>
          <DialogDescription>
            Edite os detalhes do registro de trabalho
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">Data</Label>
            <Input
              id="date"
              type="date"
              value={record.date}
              disabled
              className="h-11 bg-muted"
            />
          </div>

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
              disabled={!location}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};