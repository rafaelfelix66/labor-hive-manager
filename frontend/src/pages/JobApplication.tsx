
import { useState } from "react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const JobApplication = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LaborPro</span>
            </Link>
            <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Application Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Service Provider Application
          </h1>
          <p className="text-lg text-gray-600">
            Join our network of skilled professionals
          </p>
        </div>
        
        <ApplicationForm />
      </div>
    </div>
  );
};

export default JobApplication;
