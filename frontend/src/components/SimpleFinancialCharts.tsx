import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface FinancialChartsProps {
  bills: any[];
  reports: any;
}

const SimpleFinancialCharts = ({ bills, reports }: FinancialChartsProps) => {
  // Simple financial summary calculations
  const financialSummary = useMemo(() => {
    if (!bills || bills.length === 0) return null;

    const statusCounts = bills.reduce((acc: any, bill) => {
      acc[bill.status] = (acc[bill.status] || 0) + 1;
      return acc;
    }, {});

    const monthlyRevenue = bills
      .filter(bill => bill.status === 'Paid')
      .reduce((total, bill) => total + bill.totalClient, 0);

    const monthlyProfit = bills
      .filter(bill => bill.status === 'Paid')
      .reduce((total, bill) => total + (bill.totalClient - bill.totalProvider), 0);

    const topClients = bills.reduce((acc: any, bill) => {
      const clientName = bill.client.companyName;
      if (!acc[clientName]) {
        acc[clientName] = { name: clientName, revenue: 0, bills: 0 };
      }
      if (bill.status === 'Paid') {
        acc[clientName].revenue += bill.totalClient;
      }
      acc[clientName].bills += 1;
      return acc;
    }, {});

    const topClientsList = Object.values(topClients)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      statusCounts,
      monthlyRevenue,
      monthlyProfit,
      topClientsList
    };
  }, [bills]);

  if (!financialSummary) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-gray-500">No data available for financial analysis</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(financialSummary.monthlyRevenue)}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              From {bills.filter(b => b.status === 'Paid').length} paid bills
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Monthly Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {formatCurrency(financialSummary.monthlyProfit)}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Profit margin: {financialSummary.monthlyRevenue > 0 
                ? ((financialSummary.monthlyProfit / financialSummary.monthlyRevenue) * 100).toFixed(1)
                : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-blue-600" />
              Bill Status Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(financialSummary.statusCounts).map(([status, count]: [string, any]) => (
                <div key={status} className="flex justify-between">
                  <span className="text-sm">{status}:</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top Clients by Revenue
          </CardTitle>
          <CardDescription>
            Highest revenue generating clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialSummary.topClientsList.map((client: any, index: number) => (
              <div key={client.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.bills} bills</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(client.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bills Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Bills Overview</CardTitle>
          <CardDescription>
            Summary of all bills in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {financialSummary.statusCounts.Paid || 0}
              </div>
              <p className="text-sm text-green-700">Paid Bills</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {financialSummary.statusCounts.Pending || 0}
              </div>
              <p className="text-sm text-yellow-700">Pending Bills</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {financialSummary.statusCounts.Overdue || 0}
              </div>
              <p className="text-sm text-red-700">Overdue Bills</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleFinancialCharts;