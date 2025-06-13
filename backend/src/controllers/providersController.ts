import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, PaginatedResponse, ProviderFilters } from '../types';

export const getAllProviders = async (
  req: Request,
  res: Response<PaginatedResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { active, services, search, page = 1, limit = 10 } = req.query;
    
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause for filtering
    const where: any = {};
    
    if (active !== undefined) {
      where.active = active === 'true';
    }
    
    if (services) {
      const serviceArray = Array.isArray(services) ? services : [services];
      where.services = {
        hasSome: serviceArray
      };
    }

    // If search is provided, search in related application data
    if (search) {
      where.application = {
        OR: [
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string, mode: 'insensitive' } }
        ]
      };
    }

    // Get providers with related application data
    const providers = await prisma.serviceProvider.findMany({
      where,
      include: {
        application: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            englishLevel: true,
            hasDriversLicense: true,
            licenseFileUrl: true,
            licenseFileOriginalName: true,
            address1: true,
            suite: true,
            city: true,
            state: true,
            zipCode: true,
            emergencyContactName: true,
            emergencyContactPhone: true,
            emergencyContactRelation: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limitNumber,
    });

    // Get total count for pagination
    const total = await prisma.serviceProvider.count({ where });

    // Transform data to match frontend expectations
    const transformedProviders = providers.map(provider => ({
      id: provider.id,
      applicationId: provider.applicationId,
      name: `${provider.application.firstName} ${provider.application.lastName}`,
      firstName: provider.application.firstName,
      lastName: provider.application.lastName,
      email: provider.application.email,
      phone: provider.application.phone,
      services: provider.services,
      hourlyRate: provider.hourlyRate,
      englishLevel: provider.application.englishLevel,
      hasLicense: provider.application.hasDriversLicense,
      assignedTo: provider.assignedTo,
      active: provider.active,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    }));

    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      success: true,
      message: 'Service providers retrieved successfully',
      data: transformedProviders,
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

export const getProviderById = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const provider = await prisma.serviceProvider.findUnique({
      where: { id },
      include: {
        application: true
      }
    });

    if (!provider) {
      throw createError('Service provider not found', 404);
    }

    // Transform data
    const transformedProvider = {
      id: provider.id,
      applicationId: provider.applicationId,
      name: `${provider.application.firstName} ${provider.application.lastName}`,
      firstName: provider.application.firstName,
      lastName: provider.application.lastName,
      email: provider.application.email,
      phone: provider.application.phone,
      services: provider.services,
      hourlyRate: provider.hourlyRate,
      englishLevel: provider.application.englishLevel,
      hasLicense: provider.application.hasDriversLicense,
      assignedTo: provider.assignedTo,
      active: provider.active,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
      application: provider.application,
    };

    res.status(200).json({
      success: true,
      message: 'Service provider retrieved successfully',
      data: transformedProvider,
    });
  } catch (error) {
    next(error);
  }
};

export const createProvider = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { applicationId, services, hourlyRate, assignedTo } = req.body;

    // Validate required fields
    if (!applicationId || !services || !hourlyRate || !assignedTo) {
      throw createError('Application ID, services, hourly rate, and assigned to are required', 400);
    }

    // Check if application exists and is approved
    const application = await prisma.application.findUnique({
      where: { id: applicationId }
    });

    if (!application) {
      throw createError('Application not found', 404);
    }

    if (application.status !== 'approved') {
      throw createError('Application must be approved to create service provider', 400);
    }

    // Check if provider already exists for this application
    const existingProvider = await prisma.serviceProvider.findUnique({
      where: { applicationId }
    });

    if (existingProvider) {
      throw createError('Service provider already exists for this application', 409);
    }

    // Create the service provider
    const provider = await prisma.serviceProvider.create({
      data: {
        applicationId,
        services: Array.isArray(services) ? services : [services],
        hourlyRate: parseFloat(hourlyRate),
        assignedTo,
        active: true,
      },
      include: {
        application: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            englishLevel: true,
            hasDriversLicense: true,
          }
        }
      }
    });

    // Transform response
    const transformedProvider = {
      id: provider.id,
      applicationId: provider.applicationId,
      name: `${provider.application.firstName} ${provider.application.lastName}`,
      firstName: provider.application.firstName,
      lastName: provider.application.lastName,
      email: provider.application.email,
      phone: provider.application.phone,
      services: provider.services,
      hourlyRate: provider.hourlyRate,
      englishLevel: provider.application.englishLevel,
      hasLicense: provider.application.hasDriversLicense,
      assignedTo: provider.assignedTo,
      active: provider.active,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: 'Service provider created successfully',
      data: transformedProvider,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProvider = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { services, hourlyRate, assignedTo, active } = req.body;

    // Check if provider exists
    const existingProvider = await prisma.serviceProvider.findUnique({
      where: { id }
    });

    if (!existingProvider) {
      throw createError('Service provider not found', 404);
    }

    // Prepare update data
    const updateData: any = {};
    
    if (services !== undefined) {
      updateData.services = Array.isArray(services) ? services : [services];
    }
    
    if (hourlyRate !== undefined) {
      updateData.hourlyRate = parseFloat(hourlyRate);
    }
    
    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo;
    }
    
    if (active !== undefined) {
      updateData.active = Boolean(active);
    }

    // Update the provider
    const provider = await prisma.serviceProvider.update({
      where: { id },
      data: updateData,
      include: {
        application: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            englishLevel: true,
            hasDriversLicense: true,
          }
        }
      }
    });

    // Transform response
    const transformedProvider = {
      id: provider.id,
      applicationId: provider.applicationId,
      name: `${provider.application.firstName} ${provider.application.lastName}`,
      firstName: provider.application.firstName,
      lastName: provider.application.lastName,
      email: provider.application.email,
      phone: provider.application.phone,
      services: provider.services,
      hourlyRate: provider.hourlyRate,
      englishLevel: provider.application.englishLevel,
      hasLicense: provider.application.hasDriversLicense,
      assignedTo: provider.assignedTo,
      active: provider.active,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: 'Service provider updated successfully',
      data: transformedProvider,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProvider = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if provider exists
    const existingProvider = await prisma.serviceProvider.findUnique({
      where: { id }
    });

    if (!existingProvider) {
      throw createError('Service provider not found', 404);
    }

    // Instead of hard delete, we'll set active to false (soft delete)
    await prisma.serviceProvider.update({
      where: { id },
      data: { active: false }
    });

    res.status(200).json({
      success: true,
      message: 'Service provider deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};