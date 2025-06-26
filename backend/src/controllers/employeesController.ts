import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, PaginatedResponse, EmployeeFilters } from '../types';

export const getAllEmployees = async (
  req: Request,
  res: Response<PaginatedResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { active, jobs, search, page = 1, limit = 10 } = req.query;
    
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause for filtering
    const where: any = {};
    
    if (active !== undefined) {
      where.active = active === 'true';
    }
    
    if (jobs) {
      const serviceArray = Array.isArray(jobs) ? jobs : [jobs];
      where.jobs = {
        hasSome: serviceArray
      };
    }

    // If search is provided, search in employee data directly
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Get employees (data is now directly in employee)
    const employees = await prisma.employee.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limitNumber,
    });

    // Get total count for pagination
    const total = await prisma.employee.count({ where });

    // Transform data to match frontend expectations
    const transformedEmployees = employees.map(employee => ({
      id: employee.id,
      applicationId: employee.applicationId,
      name: `${employee.firstName} ${employee.lastName}`,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      jobs: employee.jobs,
      hourlyRate: employee.hourlyRate,
      hasLicense: employee.hasDriversLicense,
      licenseFileUrl: employee.licenseFileUrl,
      licenseFileOriginalName: employee.licenseFileOriginalName,
      assignedTo: employee.assignedTo,
      active: employee.active,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    }));

    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      data: transformedEmployees,
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

export const getEmployeeById = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) }
    });

    if (!employee) {
      throw createError('Employee not found', 404);
    }

    // Transform data - using employee data directly
    const transformedEmployee = {
      id: employee.id,
      applicationId: employee.applicationId,
      name: `${employee.firstName} ${employee.lastName}`,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      dateOfBirth: employee.dateOfBirth,
      ssn: employee.ssn,
      gender: employee.gender,
      jobs: employee.jobs,
      hourlyRate: employee.hourlyRate,
      hasLicense: employee.hasDriversLicense,
      licenseFileUrl: employee.licenseFileUrl,
      licenseFileOriginalName: employee.licenseFileOriginalName,
      address1: employee.address1,
      suite: employee.suite,
      city: employee.city,
      state: employee.state,
      zipCode: employee.zipCode,
      emergencyContactName: employee.emergencyContactName,
      emergencyContactPhone: employee.emergencyContactPhone,
      emergencyContactRelation: employee.emergencyContactRelation,
      workExperience: employee.workExperience,
      additionalExperience: employee.additionalExperience,
      previousCompanyName: employee.previousCompanyName,
      previousCompanyPhone: employee.previousCompanyPhone,
      previousCompanyEmail: employee.previousCompanyEmail,
      assignedTo: employee.assignedTo,
      active: employee.active,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: transformedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { applicationId, jobs, hourlyRate, assignedTo } = req.body;

    // Validate required fields
    if (!applicationId || !jobs || !hourlyRate || !assignedTo) {
      throw createError('Application ID, jobs, hourly rate, and assigned to are required', 400);
    }

    // Check if application exists and is approved
    const application = await prisma.application.findUnique({
      where: { id: applicationId }
    });

    if (!application) {
      throw createError('Application not found', 404);
    }

    if (application.status !== 'approved') {
      throw createError('Application must be approved to create employee', 400);
    }

    // Check if employee already exists for this application
    const existingEmployee = await prisma.employee.findFirst({
      where: { applicationId }
    });

    if (existingEmployee) {
      throw createError('Employee already exists for this application', 409);
    }

    // Create the employee with all data from application
    const employee = await prisma.employee.create({
      data: {
        // Personal Information from application
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        dateOfBirth: application.dateOfBirth,
        ssn: application.ssn,
        gender: application.gender,
        hasDriversLicense: application.hasDriversLicense,
        licenseFileUrl: application.licenseFileUrl,
        licenseFileOriginalName: application.licenseFileOriginalName,
        
        // Address Information
        address1: application.address1,
        suite: application.suite,
        city: application.city,
        state: application.state,
        zipCode: application.zipCode,
        
        // Emergency Contact
        emergencyContactName: application.emergencyContactName,
        emergencyContactPhone: application.emergencyContactPhone,
        emergencyContactRelation: application.emergencyContactRelation,
        
        // Work Information
        jobs: Array.isArray(jobs) ? jobs : [jobs],
        hourlyRate: parseFloat(hourlyRate),
        assignedTo,
        workExperience: application.workExperience,
        additionalExperience: application.additionalExperience,
        previousCompanyName: application.previousCompanyName,
        previousCompanyPhone: application.previousCompanyPhone,
        previousCompanyEmail: application.previousCompanyEmail,
        
        // System fields
        applicationId,
        active: true,
      }
    });

    // Transform response - using employee data directly
    const transformedEmployee = {
      id: employee.id,
      applicationId: employee.applicationId,
      name: `${employee.firstName} ${employee.lastName}`,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      jobs: employee.jobs,
      hourlyRate: employee.hourlyRate,
      hasLicense: employee.hasDriversLicense,
      licenseFileUrl: employee.licenseFileUrl,
      licenseFileOriginalName: employee.licenseFileOriginalName,
      assignedTo: employee.assignedTo,
      active: employee.active,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: transformedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { jobs, hourlyRate, assignedTo, active } = req.body;

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingEmployee) {
      throw createError('Employee not found', 404);
    }

    // Prepare update data
    const updateData: any = {};
    
    if (jobs !== undefined) {
      updateData.jobs = Array.isArray(jobs) ? jobs : [jobs];
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

    // Update the employee
    const employee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Transform response
    const transformedEmployee = {
      id: employee.id,
      applicationId: employee.applicationId,
      name: `${employee.firstName} ${employee.lastName}`,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      jobs: employee.jobs,
      hourlyRate: employee.hourlyRate,
      hasLicense: employee.hasDriversLicense,
      assignedTo: employee.assignedTo,
      active: employee.active,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: transformedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingEmployee) {
      throw createError('Employee not found', 404);
    }

    // Instead of hard delete, we'll set active to false (soft delete)
    await prisma.employee.update({
      where: { id: parseInt(id) },
      data: { active: false }
    });

    res.status(200).json({
      success: true,
      message: 'Employee deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};