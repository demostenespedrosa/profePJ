"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type SubscriptionData = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: string;
  amount?: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  stripeSubscriptionId?: string;
  trialEnd?: string;
};

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchSubscriptions();
  }, [statusFilter]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const params = new URLSearchParams();
      
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/admin/subscriptions?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions);
      } else {
        console.error('Failed to fetch subscriptions:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, cancelAtPeriodEnd?: boolean) => {
    if (cancelAtPeriodEnd) {
      return <Badge className="bg-orange-600">Cancelará</Badge>;
    }
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Ativo</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-600">Trial</Badge>;
      case 'canceled':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'past_due':
        return <Badge className="bg-orange-600">Atrasado</Badge>;
      case 'unpaid':
        return <Badge variant="destructive">Não Pago</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount / 100); // Stripe uses cents
  };

  const openInStripe = (subscriptionId: string) => {
    if (subscriptionId && subscriptionId !== 'trial') {
      window.open(`https://dashboard.stripe.com/subscriptions/${subscriptionId}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assinaturas</h1>
        <p className="text-muted-foreground">Gerenciar todas as assinaturas da plataforma</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Lista de Assinaturas</CardTitle>
              <CardDescription>
                {subscriptions.length} assinatura{subscriptions.length !== 1 ? 's' : ''} encontrada{subscriptions.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="trialing">Trial</SelectItem>
                  <SelectItem value="canceled">Canceladas</SelectItem>
                  <SelectItem value="past_due">Atrasadas</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={fetchSubscriptions}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Valor</TableHead>
                    <TableHead className="hidden lg:table-cell">Próxima Cobrança</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Nenhuma assinatura encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    subscriptions.map((sub) => (
                      <TableRow key={`${sub.userId}-${sub.id}`}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{sub.userName}</div>
                            <div className="text-xs text-muted-foreground">{sub.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(sub.status, sub.cancelAtPeriodEnd)}
                          {sub.cancelAtPeriodEnd && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Fim em {sub.currentPeriodEnd ? format(new Date(sub.currentPeriodEnd), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {sub.amount ? formatCurrency(sub.amount) : (
                            <span className="text-muted-foreground">R$ 0,00</span>
                          )}
                          {sub.amount && (
                            <div className="text-xs text-muted-foreground">/mês</div>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {sub.status === 'trialing' && sub.trialEnd ? (
                            <div>
                              <div>Trial até</div>
                              <div className="text-sm">{format(new Date(sub.trialEnd), "dd/MM/yyyy", { locale: ptBR })}</div>
                            </div>
                          ) : sub.currentPeriodEnd ? (
                            format(new Date(sub.currentPeriodEnd), "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {sub.stripeSubscriptionId && sub.stripeSubscriptionId !== 'trial' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openInStripe(sub.stripeSubscriptionId!)}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Stripe</span>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
