
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

// Import enhanced components
import PremiumDashboard from "@/components/premium/PremiumDashboard";
import EnhancedPremiumHero from "@/components/premium/EnhancedPremiumHero";
import FeatureComparisonTable from "@/components/premium/FeatureComparisonTable";
import PremiumBenefitsShowcase from "@/components/premium/PremiumBenefitsShowcase";
import PremiumTestimonials from "@/components/premium/PremiumTestimonials";
import PremiumPricingSection from "@/components/premium/PremiumPricingSection";
import PremiumFAQSection from "@/components/premium/PremiumFAQSection";

const PremiumPage = () => {
  const navigate = useNavigate();
  const { isPremium, setIsPremium, user } = useAuth();
  const isMobile = useIsMobile();

  const handleUpgradeSuccess = () => {
    localStorage.setItem('isPremium', 'true');
    setIsPremium(true);
    toast.success("Selamat! Anda sekarang memiliki akses Premium");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      {isPremium ? (
        <PremiumDashboard />
      ) : (
        <div className="space-y-16">
          {/* Enhanced Hero Section */}
          <EnhancedPremiumHero onUpgradeSuccess={handleUpgradeSuccess} />
          
          {/* Feature Comparison Table */}
          <FeatureComparisonTable />
          
          {/* Premium Benefits Showcase */}
          <PremiumBenefitsShowcase />
          
          {/* Pricing Section */}
          <PremiumPricingSection onUpgradeSuccess={handleUpgradeSuccess} />
          
          {/* Testimonials */}
          <PremiumTestimonials />
          
          {/* FAQ Section */}
          <PremiumFAQSection />
        </div>
      )}
    </div>
  );
};

export default PremiumPage;
