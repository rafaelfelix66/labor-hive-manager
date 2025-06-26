import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, PaginatedResponse } from '../types';

export const getAllJobs = async (
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

    // Get jobs
    const jobs = await prisma.job.findMany({
      where,
      orderBy: [
        { name: 'asc' }
      ],
      skip: offset,
      take: limitNumber,
    });

    // Get total count
    const total = await prisma.job.count({ where });

    res.json({
      success: true,
      message: 'Jobs retrieved successfully',
      data: jobs,
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

export const getJobById = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!job) {
      throw createError('Job not found', 404);
    }

    res.json({
      success: true,
      message: 'Job retrieved successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (
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

    // Check if job already exists
    const existingJob = await prisma.job.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });

    if (existingJob) {
      throw createError('A job with this name already exists', 400);
    }

    const job = await prisma.job.create({
      data: {
        name,
        description,
        averageHourlyRate: parseFloat(averageHourlyRate),
        active: true
      },
    });

    res.status(201).json({
      success: true,
      data: job,
      message: 'Job created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, averageHourlyRate, active } = req.body;

    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingJob) {
      throw createError('Job not found', 404);
    }

    // Check if name is being changed and if it conflicts
    if (name && name !== existingJob.name) {
      const nameConflict = await prisma.job.findFirst({
        where: { 
          name: { equals: name, mode: 'insensitive' },
          id: { not: parseInt(id) }
        }
      });

      if (nameConflict) {
        throw createError('A job with this name already exists', 400);
      }
    }

    const updatedJob = await prisma.job.update({
      where: { id: parseInt(id) },
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
      data: updatedJob,
      message: 'Job updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingJob) {
      throw createError('Job not found', 404);
    }

    // Soft delete by setting active to false
    await prisma.job.update({
      where: { id: parseInt(id) },
      data: { active: false, updatedAt: new Date() }
    });

    res.json({
      success: true,
      data: null,
      message: 'Job deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};