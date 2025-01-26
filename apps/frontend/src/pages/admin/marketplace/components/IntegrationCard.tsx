import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import type { Integration } from "../types";
import { IntegrationModal } from "./IntegrationModal";

interface IntegrationCardProps {
  integration: Integration;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleInstall = () => {
    // Map of integration login/registration URLs
    const integrationUrls = {
      weave: "https://app.getweave.com/login",
      "dental-intelligence": "https://app.dentalintel.com/signup",
      birdeye: "https://login.birdeye.com",
      hubspot: "https://app.hubspot.com/signup",
      solutionreach: "https://login.solutionreach.com",
      carecredit: "https://merchant.carecredit.com",
      sunbit: "https://business.sunbit.com/signup",
      "lending-club": "https://www.lendingclub.com/provider-center",
      "wells-fargo": "https://retailservices.wellsfargo.com/hcpp/enroll",
      cherry: "https://app.cherry.com/signup",
      citihealth: "https://www.citibank.com/healthcard/provider",
      quickbooks: "https://quickbooks.intuit.com/signup",
    };

    const url = integrationUrls[integration.id];
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              {integration.icon ? (
                <img
                  src={integration.icon}
                  alt={integration.name}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <Icons.Box className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {integration.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(integration.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({integration.reviews} reviews)
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{integration.description}</p>

          <div className="space-y-3 mb-6">
            {integration.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Icons.Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">{integration.pricing}</span>
            {integration.status === "installed" && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Installed
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {integration.status === "installed" ? (
              <>
                <Button variant="outline" className="flex-1">
                  Configure
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  Uninstall
                </Button>
              </>
            ) : (
              <>
                <Button className="flex-1" onClick={handleInstall}>
                  Install Now
                </Button>
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                  Learn More
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
      <IntegrationModal
        integration={integration}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
