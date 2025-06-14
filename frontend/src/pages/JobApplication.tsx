
import { useState } from "react";
import { ApplicationForm } from "@/components/ApplicationForm";
// Building2 import removed - now using EOM Staffing logo
import { Link } from "react-router-dom";
import { t } from '@/utils/translations';
import SimpleLanguageSwitcher from "@/components/SimpleLanguageSwitcher";

const JobApplication = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img src="/eom staffing.png" alt="EOM Staffing" className="h-17 w-auto" />
            </Link>
            <div className="flex items-center gap-4">
              <SimpleLanguageSwitcher />
              <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Application Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('application.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('application.subtitle')}
          </p>
        </div>
        
        <ApplicationForm />
      </div>
    </div>
  );
};

export default JobApplication;
