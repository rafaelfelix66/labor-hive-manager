import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Factory, MapPin, Calendar, DollarSign, FileText, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

interface ViewSupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierId: string | null;
}

const ViewSupplierModal = ({ open, onOpenChange, supplierId }: ViewSupplierModalProps) => {
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && supplierId) {
      fetchSupplierDetails();
    }
  }, [open, supplierId]);

  const fetchSupplierDetails = async () => {
    if (!supplierId) return;

    try {
      setLoading(true);
      const response = await apiService.getSupplier(supplierId);
      
      if (response.success && response.data) {
        setSupplier(response.data);
      } else {
        throw new Error(response.error || 'Falha ao buscar detalhes do fornecedor');
      }
    } catch (error: any) {
      console.error('Erro ao buscar detalhes do fornecedor:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao carregar detalhes do fornecedor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  if (!supplier && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Detalhes do Fornecedor
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre a empresa fornecedora
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando detalhes do fornecedor...</span>
          </div>
        ) : supplier ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Factory className="h-4 w-4" />
                Informações da Empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome da Empresa</p>
                  <p className="text-lg font-semibold">{supplier.companyName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Entidade</p>
                  <Badge variant="outline" className="mt-1">
                    {supplier.entity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge variant={supplier.active ? "default" : "secondary"} className="mt-1">
                    {supplier.active ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ativo
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Inativo
                      </>
                    )}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Designado Para</p>
                  <p className="font-medium">{supplier.assignedTo || 'Não designado'}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Informações de Endereço
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Endereço</p>
                  <p>
                    {supplier.street}
                    {supplier.suite && `, ${supplier.suite}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Cidade, Estado, CEP</p>
                  <p>{supplier.city}, {supplier.state} {supplier.zipCode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">País</p>
                  <p>{supplier.country}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Business Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Informações Comerciais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Classe Workers' Comp</p>
                  <p>{supplier.wcClass ? `Classe ${supplier.wcClass}` : 'Não especificado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Markup</p>
                  <p>
                    {supplier.markupType && supplier.markupValue ? (
                      supplier.markupType === 'Percent' 
                        ? `${supplier.markupValue}%` 
                        : formatCurrency(parseFloat(supplier.markupValue))
                    ) : 'Não especificado'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Comissão</p>
                  <p>{supplier.commission ? `${supplier.commission}%` : 'Não especificado'}</p>
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            {supplier.internalNotes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notas Internas
                  </h3>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{supplier.internalNotes}</p>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Recent Bills */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Faturas Recentes
              </h3>
              {supplier.bills && supplier.bills.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Últimas Faturas</CardTitle>
                    <CardDescription>
                      Mostrando as {supplier.bills.length} faturas mais recentes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fatura #</TableHead>
                          <TableHead>Serviço</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {supplier.bills.map((bill: any) => (
                          <TableRow key={bill.id}>
                            <TableCell className="font-medium">{bill.billNumber}</TableCell>
                            <TableCell>{bill.service}</TableCell>
                            <TableCell>{formatCurrency(parseFloat(bill.totalProvider))}</TableCell>
                            <TableCell>
                              <Badge variant={
                                bill.status === 'Paid' ? 'default' : 
                                bill.status === 'Overdue' ? 'destructive' : 'secondary'
                              }>
                                {bill.status === 'Paid' ? 'Pago' : 
                                 bill.status === 'Overdue' ? 'Vencido' : 'Pendente'}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(bill.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>Nenhuma fatura encontrada para este fornecedor</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Dates */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Datas Importantes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Criado</p>
                  <p>{formatDate(supplier.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Última Atualização</p>
                  <p>{formatDate(supplier.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Detalhes do fornecedor não encontrados</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewSupplierModal;