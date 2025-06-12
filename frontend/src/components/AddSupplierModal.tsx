import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

interface AddSupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddSupplierModal = ({ open, onOpenChange, onSuccess }: AddSupplierModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    entity: '',
    street: '',
    suite: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    wcClass: '',
    markupType: '',
    markupValue: '',
    commission: '',
    assignedTo: '',
    internalNotes: ''
  });

  const entityTypes = ['Corporation', 'LLC', 'Partnership'];
  const markupTypes = ['Percent', 'Dollar'];
  const managers = ['Manager A', 'Manager B', 'Manager C', 'Manager D'];
  const wcClasses = ['A', 'B', 'C', 'D', 'E'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      entity: '',
      street: '',
      suite: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      wcClass: '',
      markupType: '',
      markupValue: '',
      commission: '',
      assignedTo: '',
      internalNotes: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.entity || !formData.street || 
        !formData.city || !formData.state || !formData.zipCode) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        markupValue: formData.markupValue ? parseFloat(formData.markupValue) : undefined,
        commission: formData.commission ? parseFloat(formData.commission) : undefined,
      };

      // Remove empty optional fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key as keyof typeof submitData] === '') {
          delete submitData[key as keyof typeof submitData];
        }
      });

      const response = await apiService.createSupplier(submitData);

      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Fornecedor criado com sucesso",
        });
        onSuccess();
        onOpenChange(false);
        resetForm();
      } else {
        throw new Error(response.error || 'Falha ao criar fornecedor');
      }
    } catch (error: any) {
      console.error('Erro ao criar fornecedor:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar fornecedor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
            <DialogDescription>
              Criar um novo registro de fornecedor/contratado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Company Information */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Informações da Empresa</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Nome da Empresa *</Label>
                  <Input
                    id="companyName"
                    placeholder="Digite o nome da empresa"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="entity">Tipo de Entidade *</Label>
                  <Select 
                    value={formData.entity} 
                    onValueChange={(value) => handleInputChange('entity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de entidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {entityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Informações de Endereço</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="street">Endereço *</Label>
                <Input
                  id="street"
                  placeholder="Digite o endereço"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="suite">Complemento</Label>
                  <Input
                    id="suite"
                    placeholder="Sala, conjunto, etc."
                    value={formData.suite}
                    onChange={(e) => handleInputChange('suite', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    placeholder="Digite a cidade"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    placeholder="SP"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="zipCode">CEP *</Label>
                  <Input
                    id="zipCode"
                    placeholder="01234-567"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Informações Comerciais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="wcClass">Classe Workers' Comp</Label>
                  <Select 
                    value={formData.wcClass} 
                    onValueChange={(value) => handleInputChange('wcClass', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a classe WC" />
                    </SelectTrigger>
                    <SelectContent>
                      {wcClasses.map((wcClass) => (
                        <SelectItem key={wcClass} value={wcClass}>
                          Classe {wcClass}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Designado Para</Label>
                  <Select 
                    value={formData.assignedTo} 
                    onValueChange={(value) => handleInputChange('assignedTo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um gerente" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map((manager) => (
                        <SelectItem key={manager} value={manager}>
                          {manager}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="markupType">Tipo de Markup</Label>
                  <Select 
                    value={formData.markupType} 
                    onValueChange={(value) => handleInputChange('markupType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {markupTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === 'Percent' ? 'Porcentagem' : 'Valor Fixo'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="markupValue">Valor do Markup</Label>
                  <Input
                    id="markupValue"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={formData.markupType === 'Percent' ? '15' : '50'}
                    value={formData.markupValue}
                    onChange={(e) => handleInputChange('markupValue', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="commission">Comissão (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="10"
                    value={formData.commission}
                    onChange={(e) => handleInputChange('commission', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="grid gap-2">
              <Label htmlFor="internalNotes">Notas Internas</Label>
              <Textarea
                id="internalNotes"
                placeholder="Digite qualquer observação interna sobre este fornecedor..."
                rows={3}
                value={formData.internalNotes}
                onChange={(e) => handleInputChange('internalNotes', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Fornecedor'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupplierModal;