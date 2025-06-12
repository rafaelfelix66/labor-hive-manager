import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, 
  FileText, 
  Building, 
  User, 
  Clock, 
  DollarSign, 
  Calendar, 
  Download,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

interface ViewBillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billId: string | null;
}

const ViewBillModal = ({ open, onOpenChange, billId }: ViewBillModalProps) => {
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && billId) {
      fetchBillDetails();
    }
  }, [open, billId]);

  const fetchBillDetails = async () => {
    if (!billId) return;

    try {
      setLoading(true);
      const response = await apiService.getBill(billId);
      
      if (response.success && response.data) {
        setBill(response.data);
      } else {
        throw new Error(response.error || 'Falha ao buscar detalhes da fatura');
      }
    } catch (error: any) {
      console.error('Erro ao buscar detalhes da fatura:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao carregar detalhes da fatura",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!billId) return;

    try {
      const response = await apiService.generateBillPDF(billId);
      if (response.success) {
        toast({
          title: "PDF Gerado",
          description: "PDF da fatura foi gerado com sucesso",
        });
        // TODO: Implement actual PDF download
      }
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar PDF da fatura",
        variant: "destructive",
      });
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Overdue':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'default';
      case 'Overdue':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'Pago';
      case 'Overdue':
        return 'Vencido';
      case 'Pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  if (!bill && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes da Fatura
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre a fatura e cálculos aplicados
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando detalhes da fatura...</span>
          </div>
        ) : bill ? (
          <div className="space-y-6">
            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Número da Fatura</p>
                <p className="text-xl font-bold">{bill.billNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge variant={getStatusVariant(bill.status)} className="mt-1">
                  {getStatusIcon(bill.status)}
                  <span className="ml-1">{getStatusLabel(bill.status)}</span>
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Data de Criação</p>
                <p className="font-medium">{formatDate(bill.createdAt)}</p>
              </div>
            </div>

            <Separator />

            {/* Client and Provider Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="font-semibold">{bill.client.companyName}</p>
                    <p className="text-sm text-gray-600">{bill.client.entity}</p>
                  </div>
                  <div className="text-sm">
                    <p>{bill.client.street}</p>
                    {bill.client.suite && <p>{bill.client.suite}</p>}
                    <p>{bill.client.city}, {bill.client.state} {bill.client.zipCode}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Provedor de Serviço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="font-semibold">
                      {bill.provider.application.firstName} {bill.provider.application.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{bill.provider.services.join(', ')}</p>
                  </div>
                  <div className="text-sm">
                    <p>Email: {bill.provider.application.email}</p>
                    <p>Telefone: {bill.provider.application.phone}</p>
                    <p>Taxa: {formatCurrency(bill.provider.hourlyRate)}/hora</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Detalhes do Serviço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Serviço Prestado</p>
                    <p className="font-semibold">{bill.service}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Horas Trabalhadas</p>
                    <p className="font-semibold">{bill.hoursWorked}h</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Taxa por Hora</p>
                    <p className="font-semibold">{formatCurrency(bill.serviceRate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Financial Breakdown */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Resumo Financeiro
                </CardTitle>
                <CardDescription>
                  Cálculos detalhados com markup e comissões aplicadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Base</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(bill.hoursWorked * bill.serviceRate)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Cliente Paga</p>
                    <p className="text-xl font-semibold text-green-600">
                      {formatCurrency(bill.totalClient)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Provedor Recebe</p>
                    <p className="text-xl font-semibold text-blue-600">
                      {formatCurrency(bill.totalProvider)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Lucro da Empresa</p>
                    <p className="text-xl font-semibold text-purple-600">
                      {formatCurrency(bill.clientMarkup)}
                    </p>
                  </div>
                </div>

                {/* Breakdown Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t pt-4">
                  {bill.client.markupType && bill.client.markupValue && (
                    <div className="flex justify-between">
                      <span>Markup ({bill.client.markupType}):</span>
                      <span className="font-medium">
                        {bill.client.markupType === 'Percent' 
                          ? `${bill.client.markupValue}%`
                          : formatCurrency(bill.client.markupValue)
                        }
                      </span>
                    </div>
                  )}
                  {bill.client.commission && (
                    <div className="flex justify-between">
                      <span>Comissão:</span>
                      <span className="font-medium">{bill.client.commission}%</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Margem de Lucro:</span>
                    <span className="font-medium">{bill.profitMargin}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data de Criação
                </p>
                <p className="font-medium">{formatDate(bill.createdAt)}</p>
              </div>
              {bill.dueDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Data de Vencimento</p>
                  <p className="font-medium">{formatDate(bill.dueDate)}</p>
                </div>
              )}
              {bill.paidDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Data de Pagamento</p>
                  <p className="font-medium">{formatDate(bill.paidDate)}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Detalhes da fatura não encontrados</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewBillModal;