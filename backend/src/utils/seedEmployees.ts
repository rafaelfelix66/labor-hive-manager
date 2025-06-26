import { prisma } from './database';

const createSampleApplications = async () => {
  const applications = [
    {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      dateOfBirth: new Date('1985-03-15'),
      ssn: "123-45-6789",
      gender: "Male" as const,
      englishLevel: 95,
      hasDriversLicense: true,
      workExperience: ["Plumbing", "Water Systems Installation"],
      address1: "123 Main Street",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
      emergencyContactName: "Mary Smith",
      emergencyContactPhone: "(555) 123-9876",
      emergencyContactRelation: "Wife",
      howDidYouHear: "Online Search",
      status: "approved" as const
    },
    {
      firstName: "Michael",
      lastName: "Johnson",
      email: "michael.johnson@email.com",
      phone: "(555) 234-5678",
      dateOfBirth: new Date('1980-07-22'),
      ssn: "987-65-4321",
      gender: "Male" as const,
      englishLevel: 90,
      hasDriversLicense: true,
      workExperience: ["Electrical Work", "Industrial Automation"],
      address1: "456 Oak Avenue",
      city: "Houston",
      state: "TX",
      zipCode: "77002",
      emergencyContactName: "Anna Johnson",
      emergencyContactPhone: "(555) 234-9876",
      emergencyContactRelation: "Sister",
      howDidYouHear: "Referral",
      status: "approved" as const
    },
    {
      firstName: "David",
      lastName: "Williams",
      email: "david.williams@email.com",
      phone: "(555) 345-6789",
      dateOfBirth: new Date('1992-11-08'),
      ssn: "456-78-9012",
      gender: "Male" as const,
      englishLevel: 100,
      hasDriversLicense: true,
      workExperience: ["Commercial Cleaning", "Facility Maintenance"],
      address1: "789 Pine Road",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      emergencyContactName: "Sarah Williams",
      emergencyContactPhone: "(555) 345-9876",
      emergencyContactRelation: "Mother",
      howDidYouHear: "Job Fair",
      status: "approved" as const
    },
    {
      firstName: "Jennifer",
      lastName: "Davis",
      email: "jennifer.davis@email.com",
      phone: "(555) 456-7890",
      dateOfBirth: new Date('1988-05-12'),
      ssn: "789-01-2345",
      gender: "Female" as const,
      englishLevel: 85,
      hasDriversLicense: true,
      workExperience: ["Landscaping", "Garden Design"],
      address1: "321 Elm Street",
      city: "San Antonio",
      state: "TX",
      zipCode: "78201",
      emergencyContactName: "Robert Davis",
      emergencyContactPhone: "(555) 456-9876",
      emergencyContactRelation: "Husband",
      howDidYouHear: "Website",
      status: "approved" as const
    },
    {
      firstName: "Christopher",
      lastName: "Brown",
      email: "christopher.brown@email.com",
      phone: "(555) 567-8901",
      dateOfBirth: new Date('1983-09-25'),
      ssn: "012-34-5678",
      gender: "Male" as const,
      englishLevel: 88,
      hasDriversLicense: true,
      workExperience: ["House Painting", "Interior Design"],
      address1: "654 Maple Drive",
      city: "Fort Worth",
      state: "TX",
      zipCode: "76102",
      emergencyContactName: "Lisa Brown",
      emergencyContactPhone: "(555) 567-9876",
      emergencyContactRelation: "Wife",
      howDidYouHear: "Social Media",
      status: "approved" as const
    }
  ];

  const createdApplications = [];
  for (const appData of applications) {
    try {
      const application = await prisma.application.create({
        data: appData
      });
      createdApplications.push(application);
      console.log(`✅ Application created: ${application.firstName} ${application.lastName}`);
    } catch (error) {
      console.error('❌ Error creating application:', error);
    }
  }
  
  return createdApplications;
};

const employeesData = [
  {
    jobs: ["Plumbing", "Water Systems"],
    hourlyRate: 35.00,
    assignedTo: "Team Alpha",
    active: true
  },
  {
    jobs: ["Electrical", "Automation"],
    hourlyRate: 42.00,
    assignedTo: "Team Beta",
    active: true
  },
  {
    jobs: ["Cleaning", "Maintenance"],
    hourlyRate: 28.00,
    assignedTo: "Team Gamma",
    active: true
  },
  {
    jobs: ["Landscaping", "Garden Design"],
    hourlyRate: 32.00,
    assignedTo: "Team Delta",
    active: true
  },
  {
    jobs: ["Painting", "Interior Design"],
    hourlyRate: 38.00,
    assignedTo: "Team Alpha",
    active: true
  }
];

export const seedEmployees = async () => {
  try {
    console.log('👷 Starting employee seeding...');
    
    // Check if employees already exist
    const existingEmployeesCount = await prisma.employee.count();
    
    if (existingEmployeesCount > 0) {
      console.log(`📊 ${existingEmployeesCount} employees already exist. Skipping seed...`);
      return;
    }
    
    // Create sample applications
    console.log('📝 Creating sample applications...');
    const applications = await createSampleApplications();
    
    // Insert sample employees based on approved applications
    for (let i = 0; i < applications.length; i++) {
      const application = applications[i];
      const employeeData = employeesData[i] || employeesData[0]; // Fallback to first employee data
      
      await prisma.employee.create({
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
          jobs: employeeData.jobs as string[],
          hourlyRate: employeeData.hourlyRate,
          assignedTo: employeeData.assignedTo,
          workExperience: application.workExperience,
          additionalExperience: application.additionalExperience,
          previousCompanyName: application.previousCompanyName,
          previousCompanyPhone: application.previousCompanyPhone,
          previousCompanyEmail: application.previousCompanyEmail,
          
          // System fields
          applicationId: application.id, // Reference to original application
          active: employeeData.active
        }
      });
      
      console.log(`✅ Employee created: ${application.firstName} ${application.lastName}`);
    }
    
    console.log('🎉 5 employees successfully created!');
    
  } catch (error) {
    console.error('❌ Error seeding employees:', error);
  }
};

export default seedEmployees;