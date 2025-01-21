import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/button';
import type { PatientMembership, MembershipActivity } from '../../types/membership';

const Membership = () => {
  const [membership, setMembership] = React.useState<PatientMembership>({
    id: '1',
    patientId: '1',
    tierId: '2',
    startDate: '2024-01-01',
    renewalDate: '2025-01-01',
    paymentFrequency: 'monthly',
    status: 'active',
    totalPoints: 1250,
    pointsHistory: [
      {
        id: '1',
        type: 'visit',
        points: 200,
        description: 'Regular Checkup',
        date: '2024-03-01'
      },
      {
        id: '2',
        type: 'referral',
        points: 400,
        description: 'Referred John Smith',
        date: '2024-02-15'
      },
      {
        id: '3',
        type: 'review',
        points: 100,
        description: 'Left a 5-star review',
        date: '2024-02-01'
      }
    ]
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Membership</h1>
          <p className="text-gray-500">Premium Care Plan</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          Upgrade Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Icons.Crown className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Premium Member</h3>
              <p className="text-gray-500">Since Jan 1, 2024</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Next Payment</span>
              <span className="font-semibold">$49.99 on Apr 1, 2024</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Points Multiplier</span>
              <span className="font-semibold">2x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Renewal Date</span>
              <span className="font-semibold">Jan 1, 2025</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Icons.Award className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">My Points</h3>
              <p className="text-3xl font-bold text-primary">{membership.totalPoints}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full">View Rewards Catalog</Button>
            <Button variant="ghost" className="w-full">Points History</Button>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {membership.pointsHistory.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {activity.type === 'visit' && <Icons.CalendarCheck className="w-5 h-5 text-green-500" />}
                {activity.type === 'referral' && <Icons.UserPlus className="w-5 h-5 text-blue-500" />}
                {activity.type === 'review' && <Icons.Star className="w-5 h-5 text-yellow-500" />}
                <div>
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">+{activity.points}</span>
                <Icons.Award className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Membership;