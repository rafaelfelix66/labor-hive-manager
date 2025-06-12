import { Request, Response, NextFunction } from 'express';
import { PrismaClient, BillStatus } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { generateBillPDF as generatePDF } from '../services/pdfService';

const prisma = new PrismaClient();

// Get all bills with filtering and pagination
export const getBills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      clientId,
      providerId,
      startDate,
      endDate,
      search
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status as BillStatus;
    }

    if (clientId) {
      where.clientId = clientId as string;
    }

    if (providerId) {
      where.providerId = providerId as string;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    if (search) {
      where.OR = [
        { billNumber: { contains: search as string, mode: 'insensitive' } },
        { service: { contains: search as string, mode: 'insensitive' } },
        { client: { companyName: { contains: search as string, mode: 'insensitive' } } },
        { provider: { application: { firstName: { contains: search as string, mode: 'insensitive' } } } },
        { provider: { application: { lastName: { contains: search as string, mode: 'insensitive' } } } }
      ];
    }

    // Get bills with relations
    const [bills, total] = await Promise.all([
      prisma.bill.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              companyName: true,
              entity: true,
              markupType: true,
              markupValue: true,
              commission: true
            }
          },
          provider: {
            include: {
              application: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.bill.count({ where })
    ]);

    // Format bills with calculated values
    const formattedBills = bills.map(bill => ({
      id: bill.id,
      billNumber: bill.billNumber,
      clientId: bill.clientId,
      providerId: bill.providerId,
      service: bill.service,
      hoursWorked: parseFloat(bill.hoursWorked.toString()),
      serviceRate: parseFloat(bill.serviceRate.toString()),
      totalClient: parseFloat(bill.totalClient.toString()),
      totalProvider: parseFloat(bill.totalProvider.toString()),
      status: bill.status,
      dueDate: bill.dueDate,
      paidDate: bill.paidDate,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt,
      client: bill.client,
      provider: {
        id: bill.provider.id,
        services: bill.provider.services,
        hourlyRate: parseFloat(bill.provider.hourlyRate.toString()),
        assignedTo: bill.provider.assignedTo,
        active: bill.provider.active,
        application: bill.provider.application
      },
      // Calculate margins and commissions
      clientMarkup: parseFloat(bill.totalClient.toString()) - parseFloat(bill.totalProvider.toString()),
      profitMargin: ((parseFloat(bill.totalClient.toString()) - parseFloat(bill.totalProvider.toString())) / parseFloat(bill.totalClient.toString()) * 100).toFixed(2)
    }));

    res.status(200).json({
      success: true,
      data: formattedBills,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get bill by ID
export const getBillById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        client: true,
        provider: {
          include: {
            application: true
          }
        }
      }
    });

    if (!bill) {
      throw createError('Bill not found', 404);
    }

    const formattedBill = {
      id: bill.id,
      billNumber: bill.billNumber,
      clientId: bill.clientId,
      providerId: bill.providerId,
      service: bill.service,
      hoursWorked: parseFloat(bill.hoursWorked.toString()),
      serviceRate: parseFloat(bill.serviceRate.toString()),
      totalClient: parseFloat(bill.totalClient.toString()),
      totalProvider: parseFloat(bill.totalProvider.toString()),
      status: bill.status,
      dueDate: bill.dueDate,
      paidDate: bill.paidDate,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt,
      client: bill.client,
      provider: {
        id: bill.provider.id,
        services: bill.provider.services,
        hourlyRate: parseFloat(bill.provider.hourlyRate.toString()),
        assignedTo: bill.provider.assignedTo,
        active: bill.provider.active,
        application: bill.provider.application
      },
      clientMarkup: parseFloat(bill.totalClient.toString()) - parseFloat(bill.totalProvider.toString()),
      profitMargin: ((parseFloat(bill.totalClient.toString()) - parseFloat(bill.totalProvider.toString())) / parseFloat(bill.totalClient.toString()) * 100).toFixed(2)
    };

    res.status(200).json({
      success: true,
      data: formattedBill
    });
  } catch (error) {
    next(error);
  }
};

// Create new bill with automatic calculations
export const createBill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      clientId,
      providerId,
      service,
      hoursWorked,
      serviceRate,
      dueDate
    } = req.body;

    // Validate required fields
    if (!clientId || !providerId || !service || !hoursWorked || !serviceRate) {
      throw createError('Missing required fields: clientId, providerId, service, hoursWorked, serviceRate', 400);
    }

    // Get client and provider details for calculations
    const [client, provider] = await Promise.all([
      prisma.company.findUnique({
        where: { id: clientId, type: 'client' }
      }),
      prisma.serviceProvider.findUnique({
        where: { id: providerId },
        include: { application: true }
      })
    ]);

    if (!client) {
      throw createError('Client not found', 404);
    }

    if (!provider) {
      throw createError('Service provider not found', 404);
    }

    // Calculate totals with markup
    const baseTotal = parseFloat(hoursWorked) * parseFloat(serviceRate);
    let totalClient = baseTotal;
    let totalProvider = baseTotal;

    // Apply client markup if configured
    if (client.markupType && client.markupValue) {
      if (client.markupType === 'Percent') {
        totalClient = baseTotal * (1 + parseFloat(client.markupValue.toString()) / 100);
      } else if (client.markupType === 'Dollar') {
        totalClient = baseTotal + parseFloat(client.markupValue.toString());
      }
    }

    // Apply commission deduction if configured
    if (client.commission) {
      const commissionAmount = totalProvider * (parseFloat(client.commission.toString()) / 100);
      totalProvider = totalProvider - commissionAmount;
    }

    // Generate unique bill number
    const billCount = await prisma.bill.count();
    const billNumber = `BILL-${String(billCount + 1).padStart(4, '0')}`;

    // Create the bill
    const newBill = await prisma.bill.create({
      data: {
        billNumber,
        clientId,
        providerId,
        service,
        hoursWorked: parseFloat(hoursWorked),
        serviceRate: parseFloat(serviceRate),
        totalClient: totalClient,
        totalProvider: totalProvider,
        status: 'Pending',
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: {
        client: true,
        provider: {
          include: {
            application: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: newBill,
      message: 'Bill created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update bill
export const updateBill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      service,
      hoursWorked,
      serviceRate,
      status,
      dueDate,
      paidDate
    } = req.body;

    // Check if bill exists
    const existingBill = await prisma.bill.findUnique({
      where: { id },
      include: { client: true }
    });

    if (!existingBill) {
      throw createError('Bill not found', 404);
    }

    // If updating financial data, recalculate totals
    let updateData: any = {
      service,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      paidDate: paidDate ? new Date(paidDate) : undefined
    };

    if (hoursWorked !== undefined && serviceRate !== undefined) {
      const baseTotal = parseFloat(hoursWorked) * parseFloat(serviceRate);
      let totalClient = baseTotal;
      let totalProvider = baseTotal;

      // Apply client markup if configured
      if (existingBill.client.markupType && existingBill.client.markupValue) {
        if (existingBill.client.markupType === 'Percent') {
          totalClient = baseTotal * (1 + parseFloat(existingBill.client.markupValue.toString()) / 100);
        } else if (existingBill.client.markupType === 'Dollar') {
          totalClient = baseTotal + parseFloat(existingBill.client.markupValue.toString());
        }
      }

      // Apply commission deduction if configured
      if (existingBill.client.commission) {
        const commissionAmount = totalProvider * (parseFloat(existingBill.client.commission.toString()) / 100);
        totalProvider = totalProvider - commissionAmount;
      }

      updateData = {
        ...updateData,
        hoursWorked: parseFloat(hoursWorked),
        serviceRate: parseFloat(serviceRate),
        totalClient,
        totalProvider
      };
    }

    // Update the bill
    const updatedBill = await prisma.bill.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        provider: {
          include: {
            application: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: updatedBill,
      message: 'Bill updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete bill
export const deleteBill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if bill exists
    const existingBill = await prisma.bill.findUnique({
      where: { id }
    });

    if (!existingBill) {
      throw createError('Bill not found', 404);
    }

    // Prevent deletion of paid bills
    if (existingBill.status === 'Paid') {
      throw createError('Cannot delete paid bills', 400);
    }

    await prisma.bill.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Bill deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get financial reports and statistics
export const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      startDate,
      endDate,
      period = 'month' // month, quarter, year
    } = req.query;

    // Build date filter
    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        dateFilter.createdAt.lte = new Date(endDate as string);
      }
    } else {
      // Default to current month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      dateFilter.createdAt = {
        gte: startOfMonth,
        lte: endOfMonth
      };
    }

    // Get bills summary
    const [
      totalBills,
      paidBills,
      pendingBills,
      overdueBills,
      totalRevenue,
      totalProviderPayments,
      recentBills
    ] = await Promise.all([
      prisma.bill.count({ where: dateFilter }),
      prisma.bill.count({ where: { ...dateFilter, status: 'Paid' } }),
      prisma.bill.count({ where: { ...dateFilter, status: 'Pending' } }),
      prisma.bill.count({ 
        where: { 
          ...dateFilter, 
          status: 'Overdue'
        } 
      }),
      prisma.bill.aggregate({
        where: { ...dateFilter, status: 'Paid' },
        _sum: { totalClient: true }
      }),
      prisma.bill.aggregate({
        where: { ...dateFilter, status: 'Paid' },
        _sum: { totalProvider: true }
      }),
      prisma.bill.findMany({
        where: dateFilter,
        include: {
          client: { select: { companyName: true } },
          provider: { 
            include: { 
              application: { 
                select: { firstName: true, lastName: true } 
              } 
            } 
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    // Calculate profit
    const revenue = parseFloat(totalRevenue._sum.totalClient?.toString() || '0');
    const providerPayments = parseFloat(totalProviderPayments._sum.totalProvider?.toString() || '0');
    const profit = revenue - providerPayments;
    const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : '0';

    // Get top clients by revenue
    const topClients = await prisma.bill.groupBy({
      by: ['clientId'],
      where: { ...dateFilter, status: 'Paid' },
      _sum: { totalClient: true },
      _count: { id: true },
      orderBy: { _sum: { totalClient: 'desc' } },
      take: 5
    });

    // Get client details for top clients
    const topClientsWithDetails = await Promise.all(
      topClients.map(async (client) => {
        const clientDetails = await prisma.company.findUnique({
          where: { id: client.clientId },
          select: { companyName: true, entity: true }
        });
        return {
          ...client,
          client: clientDetails,
          totalRevenue: parseFloat(client._sum.totalClient?.toString() || '0'),
          billCount: client._count.id
        };
      })
    );

    // Get top providers by bills count
    const topProviders = await prisma.bill.groupBy({
      by: ['providerId'],
      where: dateFilter,
      _sum: { totalProvider: true },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    // Get provider details for top providers
    const topProvidersWithDetails = await Promise.all(
      topProviders.map(async (provider) => {
        const providerDetails = await prisma.serviceProvider.findUnique({
          where: { id: provider.providerId },
          include: { 
            application: { 
              select: { firstName: true, lastName: true } 
            } 
          }
        });
        return {
          ...provider,
          provider: providerDetails,
          totalEarnings: parseFloat(provider._sum.totalProvider?.toString() || '0'),
          billCount: provider._count.id
        };
      })
    );

    const reports = {
      summary: {
        totalBills,
        paidBills,
        pendingBills,
        overdueBills,
        totalRevenue: revenue,
        totalProviderPayments: providerPayments,
        profit,
        profitMargin: parseFloat(profitMargin),
        averageBillValue: totalBills > 0 ? (revenue / totalBills).toFixed(2) : '0'
      },
      topClients: topClientsWithDetails,
      topProviders: topProvidersWithDetails,
      recentBills: recentBills.map(bill => ({
        id: bill.id,
        billNumber: bill.billNumber,
        service: bill.service,
        totalClient: parseFloat(bill.totalClient.toString()),
        status: bill.status,
        createdAt: bill.createdAt,
        clientName: bill.client.companyName,
        providerName: `${bill.provider.application.firstName} ${bill.provider.application.lastName}`
      }))
    };

    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

// Generate bill PDF (placeholder for now)
export const generateBillPDF = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if bill exists
    const bill = await prisma.bill.findUnique({
      where: { id }
    });

    if (!bill) {
      throw createError('Bill not found', 404);
    }

    // Generate PDF using the PDF service
    const pdfBuffer = await generatePDF(id);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="bill-${bill.billNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send the PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    next(error);
  }
};