import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../components/ui/button";
import MembershipOverview from "./membership/analytics/MembershipOverview";
import type { MembershipTier } from "../../types/membership";
import { CreatePlanModal } from "./membership/components/CreatePlanModal";
import { useNavigate } from "react-router-dom";

const MembershipPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = React.useState<MembershipTier[]>([
    {
      id: "1",
      name: "Basic Care",
      price: { monthly: 29.99, annual: 299.99 },
      benefits: [
        "2 Cleanings per year",
        "15% off all treatments",
        "Free emergency exam",
        "1x points multiplier",
      ],
      pointsMultiplier: 1,
    },
    {
      id: "2",
      name: "Premium Care",
      price: { monthly: 49.99, annual: 499.99 },
      benefits: [
        "2 Cleanings per year",
        "25% off all treatments",
        "Free emergency exam",
        "Free whitening",
        "2x points multiplier",
      ],
      pointsMultiplier: 2,
    },
    {
      id: "3",
      name: "Elite Care",
      price: { monthly: 79.99, annual: 799.99 },
      benefits: [
        "4 Cleanings per year",
        "35% off all treatments",
        "Free emergency exam",
        "Free whitening",
        "Free electric toothbrush",
        "3x points multiplier",
      ],
      pointsMultiplier: 3,
    },
  ]);

  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState<
    string | null
  >(null);
  const [showEditModal, setShowEditModal] = React.useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const handleSavePlan = (newPlan: MembershipTier) => {
    const planWithId = {
      ...newPlan,
      id: (plans.length + 1).toString(),
    };
    setPlans([...plans, planWithId]);
  };

  const handleEditPlan = (planId: string) => {
    setShowEditModal(planId);
  };

  const handleDeletePlan = (planId: string) => {
    setShowDeleteConfirm(planId);
  };

  const confirmDelete = (planId: string) => {
    setPlans(plans.filter((plan) => plan.id !== planId));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-8">
      {/* Analytics Overview */}
      <MembershipOverview />

      {/* Membership Plans */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Membership Plans
          </h2>
          <Button
            className="bg-gradient-to-r from-navy to-purple text-white"
            onClick={() => setShowCreateModal(true)}
          >
            <Icons.Plus className="w-4 h-4 mr-2" />
            Create New Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="text-primary text-2xl font-bold mt-2">
                    ${plan.price.monthly}
                    <span className="text-sm text-gray-500 font-normal">
                      /month
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    or ${plan.price.annual}/year (save{" "}
                    {Math.round(
                      (1 - plan.price.annual / (plan.price.monthly * 12)) * 100,
                    )}
                    %)
                  </p>
                </div>
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Icons.Crown className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Icons.Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="space-x-2">
                <Button
                  variant="outline"
                  className="w-full mb-2"
                  onClick={() => handleEditPlan(plan.id)}
                >
                  Edit Plan
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-red-600 hover:text-red-700"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  Delete Plan
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this membership plan? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  showDeleteConfirm && confirmDelete(showDeleteConfirm)
                }
              >
                Delete Plan
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Edit Membership Plan</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditModal(null)}
              >
                <Icons.X className="w-5 h-5" />
              </Button>
            </div>

            {/* Add form fields here */}
            <div className="space-y-4">{/* Form implementation */}</div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowEditModal(null)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Plan Modal */}
      <CreatePlanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSavePlan}
      />
    </div>
  );
};

export default MembershipPlans;
