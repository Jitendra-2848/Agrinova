import React from "react";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiHeart,
} from "react-icons/fi";
import { Leaf } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/product" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/about" },
  ];

  const supportLinks = [
    { name: "Help Center", path: "/About" },
    // { name: "Track Order", path: "/track" },
    { name: "FAQs", path: "/About" },
    // { name: "Returns", path: "/returns" },
  ];

  const legalLinks = [
    // { name: "Privacy Policy", path: "/privacy" },
    // { name: "Terms of Service", path: "/terms" },
  ];

  const socialLinks = [
    { icon: FiFacebook,href: "",color:"blue" },
    { icon: FiTwitter, href: "",color:"red" },
   { icon: FiInstagram,href: "",color:"pink" },
    { icon: FiLinkedin,href: "",color:"blue" },
  ];

  return (
    <footer className="w-full bg-white border-t border-gray-100 ">
      {/* Main Footer */}
      <div className="w-full px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Agri<span className="text-emerald-600">Nova</span>
              </span>
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              Connecting farmers directly with buyers. Fresh produce, fair prices.
            </p>
            
            {/* Social */}
            <div className="flex gap-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className={`w-9 h-9 text-gray-500 hover:bg-${social.color}-600 hover:text-white rounded-lg flex items-center justify-center transition-all`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-emerald-600 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-emerald-600 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:prajapatijitendra2848@gmail.com" className="flex text-xs items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                  <FiMail className="w-4 h-4 text-normal" />
                  prajapatijitendra2848@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+917575066951" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 text-sm transition-colors">
                  <FiPhone className="w-4 h-4" />
                  +91 75750 66951
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-600 text-sm">
                <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Ahmedabad, Gujarat, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-emerald-600 px-6 lg:px-12 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/90 text-sm mx-auto">
            © {currentYear} AgriNova. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            {legalLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className="text-white/80 hover:text-white text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;