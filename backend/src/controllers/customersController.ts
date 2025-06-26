import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, PaginatedResponse } from '../types';

export const getAllCustomers = async (
  req: Request,
  res: Response<PaginatedResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { active, search, page = 1, limit = 10 } = req.query;
    
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause for filtering
    const where: any = {
      type: 'customer' // Only get companies marked as customers
    };
    
    if (active !== undefined) {
      where.active = active === 'true';
    }
    
    if (search) {
      where.OR = [
        { companyName: { contains: search as string, mode: 'insensitive' } },
        { street: { contains: search as string, mode: 'insensitive' } },
        { city: { contains: search as string, mode: 'insensitive' } },
        { assignedTo: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Get customers
    const customers = await prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limitNumber,
    });

    // Get total count for pagination
    const total = await prisma.customer.count({ where });

    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      success: true,
      message: 'Customers retrieved successfully',
      data: customers,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        hasNext: pageNumber < totalPages,
        hasPrev: pageNumber > 1,
      },
    } as any);
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { 
        id: parseInt(id),
        type: 'customer' // Ensure we only get customers
      },
      include: {
        bills: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) {
      throw createError('Customer not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Customer retrieved successfully',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      companyName,
      entity,
      street,
      suite,
      city,
      state,
      zipCode,
      country = 'USA',
      wcClass,
      markupType,
      markupValue,
      commission,
      assignedTo,
      internalNotes
    } = req.body;

    // Validate required fields
    if (!companyName || !entity || !street || !city || !state || !zipCode) {
      throw createError('Company name, entity, street, city, state, and zip code are required', 400);
    }

    // Validate entity type
    const validEntities = ['Corporation', 'LLC', 'Partnership'];
    if (!validEntities.includes(entity)) {
      throw createError('Entity must be Corporation, LLC, or Partnership', 400);
    }

    // Validate markup type if provided
    if (markupType && !['Percent', 'Dollar'].includes(markupType)) {
      throw createError('Markup type must be Percent or Dollar', 400);
    }

    // Create the customer
    const customer = await prisma.customer.create({
      data: {
        companyName,
        entity,
        type: 'customer',
        street,
        suite,
        city,
        state,
        zipCode,
        country,
        wcClass,
        markupType: markupType || null,
        markupValue: markupValue ? parseFloat(markupValue) : null,
        commission: commission ? parseFloat(commission) : null,
        assignedTo,
        internalNotes,
        active: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      companyName,
      entity,
      street,
      suite,
      city,
      state,
      zipCode,
      country,
      wcClass,
      markupType,
      markupValue,
      commission,
      assignedTo,
      internalNotes,
      active
    } = req.body;

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { 
        id: parseInt(id),
        type: 'customer'
      }
    });

    if (!existingCustomer) {
      throw createError('Customer not found', 404);
    }

    // Validate entity type if provided
    if (entity && !['Corporation', 'LLC', 'Partnership'].includes(entity)) {
      throw createError('Entity must be Corporation, LLC, or Partnership', 400);
    }

    // Validate markup type if provided
    if (markupType && !['Percent', 'Dollar'].includes(markupType)) {
      throw createError('Markup type must be Percent or Dollar', 400);
    }

    // Prepare update data
    const updateData: any = {};
    
    if (companyName !== undefined) updateData.companyName = companyName;
    if (entity !== undefined) updateData.entity = entity;
    if (street !== undefined) updateData.street = street;
    if (suite !== undefined) updateData.suite = suite;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (country !== undefined) updateData.country = country;
    if (wcClass !== undefined) updateData.wcClass = wcClass;
    if (markupType !== undefined) updateData.markupType = markupType;
    if (markupValue !== undefined) updateData.markupValue = markupValue ? parseFloat(markupValue) : null;
    if (commission !== undefined) updateData.commission = commission ? parseFloat(commission) : null;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
    if (active !== undefined) updateData.active = Boolean(active);

    // Update the customer
    const customer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { 
        id: parseInt(id),
        type: 'customer'
      }
    });

    if (!existingCustomer) {
      throw createError('Customer not found', 404);
    }

    // Check if customer has any bills
    const billCount = await prisma.bill.count({
      where: { customerId: parseInt(id) }
    });

    if (billCount > 0) {
      // Soft delete - set active to false
      await prisma.customer.update({
        where: { id: parseInt(id) },
        data: { active: false }
      });

      res.status(200).json({
        success: true,
        message: 'Customer deactivated successfully (has existing bills)',
      });
    } else {
      // Hard delete if no bills exist
      await prisma.customer.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};