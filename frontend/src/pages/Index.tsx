
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { t } from '@/utils/translations';
import SimpleLanguageSwitcher from "@/components/SimpleLanguageSwitcher";
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Star, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Briefcase,
  Shield,
  TrendingUp
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#18407c] shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <img src="https://mldbeha2onjy.i.optimole.com/w:auto/h:auto/q:mauto/ig:avif/https://eomstaffing.com/wp-content/uploads/2024/02/eom-logo-white-orange-light.png" alt="EOM Staffing" className="h-20 w-auto" />
            </div>
            <div className="flex items-center space-x-4">
              <SimpleLanguageSwitcher />
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-white hover:text-[#e74a3e] hover:bg-white/10 transition-colors duration-300">
                  {t('homepage.login')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#18407c] via-[#086abd] to-[#18407c] text-white py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <div className="w-full h-full bg-gradient-to-l from-white/20 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-6">
                <span className="inline-block bg-[#e74a3e] text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
                  {t('homepage.nowHiring')}
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                {t('homepage.heroTitle')}
                <span className="text-[#e74a3e] block bg-gradient-to-r from-[#e74a3e] to-orange-400 bg-clip-text text-transparent">
                  {t('homepage.heroSubtitle')}
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
                {t('homepage.heroDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/apply">
                  <Button size="lg" className="bg-[#e74a3e] hover:bg-red-600 text-white font-bold px-10 py-5 text-lg rounded-xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                    {t('homepage.applyNow')}
                  </Button>
                </Link>
                <div className="flex items-center text-blue-100 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                  <CheckCircle className="h-6 w-6 mr-3 text-[#e74a3e]" />
                  <span className="font-medium">Free to join • Quick approval</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Professional workers" 
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18407c]/80 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Why Choose EOM Staffing?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-[#e74a3e]" />
                      <span className="text-sm font-medium">300+ Companies</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-[#e74a3e]" />
                      <span className="text-sm font-medium">Fast Placement</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-[#e74a3e]" />
                      <span className="text-sm font-medium">Top Rates</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-[#e74a3e]" />
                      <span className="text-sm font-medium">Flexible Hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-gradient-to-r from-[#e74a3e] to-red-600 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            <div className="text-white mb-6 sm:mb-0">
              <h3 className="text-3xl font-bold mb-2">Ready to Start Working?</h3>
              <p className="text-red-100 text-lg">Join thousands of professionals earning competitive wages</p>
              <div className="flex items-center justify-center sm:justify-start mt-4 space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">300+</div>
                  <div className="text-sm text-red-100">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24h</div>
                  <div className="text-sm text-red-100">Avg Placement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">$25+</div>
                  <div className="text-sm text-red-100">Hourly Rate</div>
                </div>
              </div>
            </div>
            <Link to="/apply">
              <Button size="lg" className="bg-white text-[#e74a3e] hover:bg-gray-100 font-bold px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Complete Your Application
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services We Offer */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block bg-[#18407c] text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-6">
              Career Opportunities
            </div>
            <h2 className="text-4xl font-bold text-[#181818] mb-6">
              Service Opportunities Available
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We connect skilled professionals with companies needing reliable services across multiple industries
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg rounded-2xl overflow-hidden bg-white hover:scale-105">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="General Labor" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18407c]/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <Briefcase className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardHeader className="p-8">
                <CardTitle className="text-2xl text-[#18407c] mb-3">General Labor</CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Construction, warehouse, landscaping, and general maintenance work. Build your career with hands-on experience.
                </CardDescription>
                <div className="mt-4 text-[#e74a3e] font-semibold">
                  $18-25/hour
                </div>
              </CardHeader>
            </Card>
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg rounded-2xl overflow-hidden bg-white hover:scale-105">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Skilled Trades" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18407c]/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <Users className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardHeader className="p-8">
                <CardTitle className="text-2xl text-[#18407c] mb-3">Skilled Trades</CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Electrical, plumbing, HVAC, carpentry, and specialized technical work. Use your expertise to earn top rates.
                </CardDescription>
                <div className="mt-4 text-[#e74a3e] font-semibold">
                  $25-45/hour
                </div>
              </CardHeader>
            </Card>
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg rounded-2xl overflow-hidden bg-white hover:scale-105">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Professional Services" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18407c]/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <Star className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardHeader className="p-8">
                <CardTitle className="text-2xl text-[#18407c] mb-3">Professional Services</CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Administrative, customer service, and specialized professional roles. Advance your corporate career.
                </CardDescription>
                <div className="mt-4 text-[#e74a3e] font-semibold">
                  $20-35/hour
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#18407c]/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block bg-[#e74a3e] text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-6">
              Why Choose Us
            </div>
            <h2 className="text-4xl font-bold text-[#18407c] mb-6">
              Your Success is Our Priority
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join a network that values your skills and supports your career growth with industry-leading benefits and opportunities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="bg-gradient-to-br from-[#18407c] to-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#18407c] mb-4 group-hover:text-[#e74a3e] transition-colors duration-300">Fast Placement</h3>
              <p className="text-gray-600 leading-relaxed">Get matched with jobs quickly through our efficient placement system. Average placement time: 24 hours</p>
            </div>
            <div className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="bg-gradient-to-br from-[#e74a3e] to-red-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#18407c] mb-4 group-hover:text-[#e74a3e] transition-colors duration-300">Top Pay Rates</h3>
              <p className="text-gray-600 leading-relaxed">Earn competitive hourly rates starting at $25/hour with opportunities for bonuses and career growth</p>
            </div>
            <div className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="bg-gradient-to-br from-[#18407c] to-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#18407c] mb-4 group-hover:text-[#e74a3e] transition-colors duration-300">Reliable Work</h3>
              <p className="text-gray-600 leading-relaxed">Consistent opportunities with 300+ established, trusted companies across NY, NJ, CT, and PA</p>
            </div>
            <div className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="bg-gradient-to-br from-[#e74a3e] to-red-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#18407c] mb-4 group-hover:text-[#e74a3e] transition-colors duration-300">Career Growth</h3>
              <p className="text-gray-600 leading-relaxed">Build your reputation and advance in your chosen field with professional development support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#18407c] via-[#086abd] to-[#18407c] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Professional background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-6">
                <span className="inline-block bg-[#e74a3e] text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
                  Contact Us
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Have questions about joining our network? Our team is here to help you get started and find the perfect opportunities for your skills.
              </p>
              <div className="space-y-6">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="bg-[#e74a3e] rounded-full p-3 mr-4">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Service Areas</div>
                    <div className="text-blue-100">NY, NJ, CT, PA</div>
                  </div>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="bg-[#e74a3e] rounded-full p-3 mr-4">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Call Us</div>
                    <div className="text-blue-100">(555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="bg-[#e74a3e] rounded-full p-3 mr-4">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Email Us</div>
                    <div className="text-blue-100">careers@eomstaffing.com</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 shadow-2xl border border-white/20">
              <h3 className="text-3xl font-bold mb-6 text-center">Start Your Journey Today</h3>
              <p className="text-blue-100 mb-8 text-center text-lg leading-relaxed">
                Complete your application today and start your journey with EOM Staffing. Join thousands of professionals earning competitive wages.
              </p>
              <div className="space-y-6">
                <Link to="/apply">
                  <Button size="lg" className="bg-[#e74a3e] hover:bg-red-600 w-full font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Start Your Application Now
                  </Button>
                </Link>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-bold text-xl">300+</div>
                    <div className="text-xs text-blue-100">Companies</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-bold text-xl">24h</div>
                    <div className="text-xs text-blue-100">Avg Placement</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-bold text-xl">$25+</div>
                    <div className="text-xs text-blue-100">Starting Rate</div>
                  </div>
                </div>
                <p className="text-sm text-blue-200 text-center">
                  ✓ Free to join • ✓ No hidden fees • ✓ Quick approval process
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <img src="/eom staffing.png" alt="EOM Staffing" className="h-16 w-auto mb-4" />
              <p className="text-gray-400 max-w-md">
                Connecting skilled professionals with trusted companies across NY, NJ, CT, and PA since 2020.
              </p>
            </div>
            <div className="text-center md:text-right">
              <div className="mb-4">
                <div className="text-[#e74a3e] font-semibold text-lg">Ready to Start?</div>
                <div className="text-gray-400">Join our network today</div>
              </div>
              <Link to="/apply">
                <Button className="bg-[#18407c] hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2025 EOM Staffing. All rights reserved. Connecting skilled professionals with trusted companies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
