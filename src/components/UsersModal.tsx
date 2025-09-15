import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, UserPlus } from "lucide-react";

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'Gerente' | 'Funcionário' | 'Empresa';
}

interface UsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UsersModal = ({ open, onOpenChange }: UsersModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "" as User['role'] | ""
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const savedUsers = localStorage.getItem("systemUsers");
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        // Usuário padrão (admin)
        const defaultUsers = [
          {
            id: "1",
            username: "marcioandrade",
            password: "161271",
            role: "Gerente" as const
          }
        ];
        setUsers(defaultUsers);
        localStorage.setItem("systemUsers", JSON.stringify(defaultUsers));
      }
    }
  }, [open]);

  const handleSaveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem("systemUsers", JSON.stringify(updatedUsers));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password || !formData.role) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    if (editingUser) {
      // Editar usuário
        const updatedUsers = users.map(user => 
        user.id === editingUser.id 
          ? { ...user, username: formData.username, password: formData.password, role: formData.role as User['role'] }
          : user
      );
      handleSaveUsers(updatedUsers);
      toast({
        title: "Usuário atualizado!",
        description: "As alterações foram salvas com sucesso."
      });
    } else {
      // Novo usuário
      const existingUser = users.find(u => u.username === formData.username);
      if (existingUser) {
        toast({
          title: "Erro",
          description: "Nome de usuário já existe.",
          variant: "destructive"
        });
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        username: formData.username,
        password: formData.password,
        role: formData.role as User['role']
      };
      
      const updatedUsers = [...users, newUser];
      handleSaveUsers(updatedUsers);
      toast({
        title: "Usuário criado!",
        description: "Novo usuário adicionado com sucesso."
      });
    }

    setFormData({ username: "", password: "", role: "" });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      role: user.role
    });
    setShowForm(true);
  };

  const handleDelete = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    handleSaveUsers(updatedUsers);
    toast({
      title: "Usuário removido!",
      description: "O usuário foi deletado com sucesso."
    });
  };

  const handleCancel = () => {
    setFormData({ username: "", password: "", role: "" });
    setEditingUser(null);
    setShowForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciamento de Usuários</DialogTitle>
          <DialogDescription>
            Gerencie os usuários do sistema e suas permissões
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!showForm ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Usuários Cadastrados</h3>
                <Button onClick={() => setShowForm(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Novo Usuário
                </Button>
              </div>

              <div className="grid gap-4">
                {users.map((user) => (
                  <Card key={user.id} className="border-0 shadow-soft">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-muted-foreground">
                            Cargo: {user.role}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.username !== "marcioandrade" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>
                  {editingUser ? "Editar Usuário" : "Novo Usuário"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Nome do Usuário</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Digite o nome do usuário"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Digite a senha"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Cargo</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as User['role'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gerente">Gerente</SelectItem>
                        <SelectItem value="Funcionário">Funcionário</SelectItem>
                        <SelectItem value="Empresa">Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit">
                      {editingUser ? "Atualizar" : "Criar"} Usuário
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};