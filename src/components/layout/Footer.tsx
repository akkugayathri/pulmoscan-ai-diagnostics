import { Activity, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="medical-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight">
                  PulmoScan
                </span>
                <span className="text-xs font-medium text-primary">AI Diagnostics</span>
              </div>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              AI-powered pulmonary disease detection using advanced deep learning and CT scan analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-background/70 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-background/70 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-background/70 hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/patient-details" className="text-sm text-background/70 hover:text-primary transition-colors">
                  Start Diagnosis
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="w-4 h-4 text-primary" />
                support@pulmoscan.ai
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="w-4 h-4 text-primary" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <MapPin className="w-4 h-4 text-primary" />
                San Francisco, CA
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-display font-semibold mb-4">Medical Disclaimer</h4>
            <p className="text-xs text-background/60 leading-relaxed">
              PulmoScan AI is an AI-assisted diagnostic support tool and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical decisions.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-background/50">
              © {new Date().getFullYear()} PulmoScan AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-xs text-background/50 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-background/50 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}