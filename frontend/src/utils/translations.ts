// Simple translation system without complex hooks
export const translations = {
  en: {
    homepage: {
      login: "Login",
      nowHiring: "Now Hiring", 
      heroTitle: "Join Our Network of",
      heroSubtitle: "Elite Professionals",
      heroDescription: "Connect with top-tier companies across the United States. We specialize in placing skilled professionals in construction, manufacturing, logistics, and technical services.",
      applyNow: "Apply Now"
    },
    application: {
      title: "Apply Now", 
      subtitle: "Join our network of skilled professionals",
      steps: {
        personalInfo: "Personal Information",
        professionalExperience: "Professional Experience", 
        additionalInfo: "Additional Information",
        reviewSubmit: "Review & Submit"
      },
      personalInfo: {
        firstName: "First Name",
        lastName: "Last Name", 
        email: "Email Address",
        phone: "Phone Number",
        dateOfBirth: "Date of Birth",
        ssn: "Social Security Number",
        gender: "Gender",
        male: "Male",
        female: "Female",
        other: "Other"
      },
      navigation: {
        next: "Next",
        back: "Back"
      },
      review: {
        submitApplication: "Submit Application",
        submitting: "Submitting...",
        successTitle: "Application Submitted!",
        successMessage: "Thank you for your application. We will review it and get back to you soon.",
        errorTitle: "Submission Error", 
        errorMessage: "There was an error submitting your application. Please try again."
      },
      validation: {
        required: "This field is required"
      }
    }
  },
  es: {
    homepage: {
      login: "Iniciar Sesión",
      nowHiring: "Contratando Ahora",
      heroTitle: "Únete a Nuestra Red de", 
      heroSubtitle: "Profesionales Elite",
      heroDescription: "Conéctate con empresas de primer nivel en todo Estados Unidos. Nos especializamos en colocar profesionales calificados en construcción, manufactura, logística y servicios técnicos.",
      applyNow: "Aplicar Ahora"
    },
    application: {
      title: "Aplicar Ahora",
      subtitle: "Únete a nuestra red de profesionales calificados", 
      steps: {
        personalInfo: "Información Personal",
        professionalExperience: "Experiencia Profesional",
        additionalInfo: "Información Adicional", 
        reviewSubmit: "Revisar y Enviar"
      },
      personalInfo: {
        firstName: "Nombre",
        lastName: "Apellido",
        email: "Correo Electrónico", 
        phone: "Número de Teléfono",
        dateOfBirth: "Fecha de Nacimiento",
        ssn: "Número de Seguro Social",
        gender: "Género",
        male: "Masculino",
        female: "Femenino", 
        other: "Otro"
      },
      navigation: {
        next: "Siguiente",
        back: "Atrás"
      },
      review: {
        submitApplication: "Enviar Aplicación",
        submitting: "Enviando...",
        successTitle: "¡Aplicación Enviada!",
        successMessage: "Gracias por tu aplicación. La revisaremos y te contactaremos pronto.",
        errorTitle: "Error de Envío",
        errorMessage: "Hubo un error al enviar tu aplicación. Por favor intenta de nuevo."
      },
      validation: {
        required: "Este campo es requerido"
      }
    }
  }
};

export const getCurrentLanguage = (): 'en' | 'es' => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('i18nextLng') as 'en' | 'es') || 'en';
  }
  return 'en';
};

export const t = (key: string): string => {
  const lang = getCurrentLanguage();
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};