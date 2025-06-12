import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, PaginatedResponse } from '../types';

export const getAllSuppliers = async (
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
      type: 'supplier' // Only get companies marked as suppliers
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

    // Get suppliers
    const suppliers = await prisma.company.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limitNumber,
    });

    // Get total count for pagination
    const total = await prisma.company.count({ where });

    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      success: true,
      message: 'Suppliers retrieved successfully',
      data: suppliers,
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

export const getSupplierById = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const supplier = await prisma.company.findUnique({
      where: { 
        id,
        type: 'supplier' // Ensure we only get suppliers
      },
      include: {
        bills: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!supplier) {
      throw createError('Supplier not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Supplier retrieved successfully',
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

export const createSupplier = async (
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

    // Create the supplier
    const supplier = await prisma.company.create({
      data: {
        companyName,
        entity,
        type: 'supplier',
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
      message: 'Supplier created successfully',
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (
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

    // Check if supplier exists
    const existingSupplier = await prisma.company.findUnique({
      where: { 
        id,
        type: 'supplier'
      }
    });

    if (!existingSupplier) {
      throw createError('Supplier not found', 404);
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

    // Update the supplier
    const supplier = await prisma.company.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Supplier updated successfully',
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if supplier exists
    const existingSupplier = await prisma.company.findUnique({
      where: { 
        id,
        type: 'supplier'
      }
    });

    if (!existingSupplier) {
      throw createError('Supplier not found', 404);
    }

    // Check if supplier has any bills (suppliers are linked via clientId)
    const billCount = await prisma.bill.count({
      where: { 
        clientId: id
      }
    });

    if (billCount > 0) {
      // Soft delete - set active to false
      await prisma.company.update({
        where: { id },
        data: { active: false }
      });

      res.status(200).json({
        success: true,
        message: 'Supplier deactivated successfully (has existing relationships)',
      });
    } else {
      // Hard delete if no relationships exist
      await prisma.company.delete({
        where: { id }
      });

      res.status(200).json({
        success: true,
        message: 'Supplier deleted successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};