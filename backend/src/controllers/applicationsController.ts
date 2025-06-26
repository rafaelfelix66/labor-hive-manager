import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, PaginatedResponse, ApplicationFilters } from '../types';

export const getAllApplications = async (
  req: Request,
  res: Response<PaginatedResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause for filtering
    const where: any = {};
    
    if (status) {
      where.status = status;
    }

    // If search is provided, search in applicant data
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Get applications with related reviewer data
    const applications = await prisma.application.findMany({
      where,
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // pending first
        { submittedAt: 'desc' }
      ],
      skip: offset,
      take: limitNumber,
    });

    // Get total count
    const total = await prisma.application.count({ where });

    res.json({
      success: true,
      message: 'Applications retrieved successfully',
      data: applications,
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

export const getApplicationById = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id: parseInt(id) },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
    });

    if (!application) {
      throw createError('Application not found', 404);
    }

    res.json({
      success: true,
      message: 'Application retrieved successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const applicationData = req.body;

    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 
      'ssn', 'gender', 'englishLevel', 'jobs', 
      'address1', 'city', 'state', 'zipCode', 
      'emergencyContactName', 'emergencyContactPhone', 
      'emergencyContactRelation', 'howDidYouHear'
    ];

    for (const field of requiredFields) {
      if (field === 'jobs') {
        if (!applicationData[field] || !Array.isArray(applicationData[field]) || applicationData[field].length === 0) {
          throw createError(`${field} is required and must have at least one job`, 400);
        }
      } else if (!applicationData[field]) {
        throw createError(`${field} is required`, 400);
      }
    }

    // Check if email already exists
    const existingApplication = await prisma.application.findFirst({
      where: { email: applicationData.email }
    });

    if (existingApplication) {
      throw createError('An application with this email already exists', 400);
    }

    const application = await prisma.application.create({
      data: {
        ...applicationData,
        dateOfBirth: new Date(applicationData.dateOfBirth),
        status: 'pending'
      },
    });

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reviewedBy, jobs, hourlyRate, assignedTo, ...updateData } = req.body;

    // Check if application exists
    const existingApplication = await prisma.application.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingApplication) {
      throw createError('Application not found', 404);
    }

    // Start a transaction for approval process
    const result = await prisma.$transaction(async (tx) => {
      // Update application status and reviewer
      const updatedApplication = await tx.application.update({
        where: { id: parseInt(id) },
        data: {
          ...updateData,
          ...(status && { status }),
          ...(status && { reviewedAt: new Date() }),
          ...(reviewedBy && { reviewedBy }),
        },
        include: {
          reviewer: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      // Check for existing employee
      const existingEmployee = await tx.employee.findFirst({
        where: { applicationId: parseInt(id) }
      });

      // If application is approved and no employee exists, create one
      if (status === 'approved' && !existingEmployee) {
        // Use jobs and hourlyRate from the update data or from the existing application
        const finalJobs = jobs || (existingApplication as any).jobs;
        const finalHourlyRate = hourlyRate || (existingApplication as any).hourlyRate;

        if (!finalJobs || finalJobs.length === 0 || !finalHourlyRate) {
          throw createError('Jobs and hourly rate are required for approval', 400);
        }

        const employee = await tx.employee.create({
          data: {
            // Personal Information from application
            firstName: updatedApplication.firstName,
            lastName: updatedApplication.lastName,
            email: updatedApplication.email,
            phone: updatedApplication.phone,
            dateOfBirth: updatedApplication.dateOfBirth,
            ssn: updatedApplication.ssn,
            gender: updatedApplication.gender,
            hasDriversLicense: updatedApplication.hasDriversLicense,
            licenseFileUrl: updatedApplication.licenseFileUrl,
            licenseFileOriginalName: updatedApplication.licenseFileOriginalName,
            
            // Address Information
            address1: updatedApplication.address1,
            suite: updatedApplication.suite,
            city: updatedApplication.city,
            state: updatedApplication.state,
            zipCode: updatedApplication.zipCode,
            
            // Emergency Contact
            emergencyContactName: updatedApplication.emergencyContactName,
            emergencyContactPhone: updatedApplication.emergencyContactPhone,
            emergencyContactRelation: updatedApplication.emergencyContactRelation,
            
            // Work Information
            jobs: Array.isArray(finalJobs) ? finalJobs : [finalJobs],
            hourlyRate: parseFloat(finalHourlyRate.toString()),
            assignedTo: assignedTo || 'Manager A',
            workExperience: updatedApplication.workExperience,
            additionalExperience: updatedApplication.additionalExperience,
            previousCompanyName: updatedApplication.previousCompanyName,
            previousCompanyPhone: updatedApplication.previousCompanyPhone,
            previousCompanyEmail: updatedApplication.previousCompanyEmail,
            
            // System fields
            applicationId: parseInt(id),
            active: true
          }
        });

        return {
          ...updatedApplication,
          employee
        };
      }

      // If application is approved and employee exists, update it
      if (status === 'approved' && existingEmployee) {
        // Use jobs and hourlyRate from the update data or from the existing application
        const finalJobs = jobs || (existingApplication as any).jobs;
        const finalHourlyRate = hourlyRate || (existingApplication as any).hourlyRate;

        const employee = await tx.employee.update({
          where: { id: existingEmployee.id },
          data: {
            jobs: Array.isArray(finalJobs) ? finalJobs : [finalJobs],
            hourlyRate: parseFloat(finalHourlyRate.toString()),
            ...(assignedTo && { assignedTo }),
            active: true
          }
        });

        return {
          ...updatedApplication,
          employee
        };
      }

      // If application is rejected, deactivate employee if exists
      if (status === 'rejected' && existingEmployee) {
        await tx.employee.update({
          where: { id: existingEmployee.id },
          data: { active: false }
        });
      }

      return updatedApplication;
    });

    res.json({
      success: true,
      data: result,
      message: status === 'approved' 
        ? 'Application approved and employee created successfully'
        : status === 'rejected'
        ? 'Application rejected'
        : 'Application updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if application exists
    const existingApplication = await prisma.application.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingApplication) {
      throw createError('Application not found', 404);
    }

    // Delete in transaction (employee will be deleted by cascade)
    await prisma.application.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      data: null,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get application statistics
export const getApplicationStats = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await prisma.application.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    const formattedStats = {
      pending: stats.find(s => s.status === 'pending')?._count?.status || 0,
      approved: stats.find(s => s.status === 'approved')?._count?.status || 0,
      rejected: stats.find(s => s.status === 'rejected')?._count?.status || 0,
      total: stats.reduce((acc, curr) => acc + (curr._count?.status || 0), 0)
    };

    res.json({
      success: true,
      message: 'Application statistics retrieved successfully',
      data: formattedStats,
    });
  } catch (error) {
    next(error);
  }
};