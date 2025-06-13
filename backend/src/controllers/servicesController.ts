import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, PaginatedResponse } from '../types';

export const getAllServices = async (
  req: Request,
  res: Response<PaginatedResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { active = 'true', page = 1, limit = 50 } = req.query;
    
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause for filtering
    const where: any = {};
    
    if (active !== 'all') {
      where.active = active === 'true';
    }

    // Get services
    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { name: 'asc' }
      ],
      skip: offset,
      take: limitNumber,
    });

    // Get total count
    const total = await prisma.service.count({ where });

    res.json({
      success: true,
      message: 'Services retrieved successfully',
      data: services,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw createError('Service not found', 404);
    }

    res.json({
      success: true,
      message: 'Service retrieved successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, averageHourlyRate } = req.body;

    // Validate required fields
    if (!name || !averageHourlyRate) {
      throw createError('Name and average hourly rate are required', 400);
    }

    // Check if service already exists
    const existingService = await prisma.service.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });

    if (existingService) {
      throw createError('A service with this name already exists', 400);
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        averageHourlyRate: parseFloat(averageHourlyRate),
        active: true
      },
    });

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, averageHourlyRate, active } = req.body;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      throw createError('Service not found', 404);
    }

    // Check if name is being changed and if it conflicts
    if (name && name !== existingService.name) {
      const nameConflict = await prisma.service.findFirst({
        where: { 
          name: { equals: name, mode: 'insensitive' },
          id: { not: id }
        }
      });

      if (nameConflict) {
        throw createError('A service with this name already exists', 400);
      }
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(averageHourlyRate && { averageHourlyRate: parseFloat(averageHourlyRate) }),
        ...(active !== undefined && { active }),
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: updatedService,
      message: 'Service updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      throw createError('Service not found', 404);
    }

    // Soft delete by setting active to false
    await prisma.service.update({
      where: { id },
      data: { active: false, updatedAt: new Date() }
    });

    res.json({
      success: true,
      data: null,
      message: 'Service deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};