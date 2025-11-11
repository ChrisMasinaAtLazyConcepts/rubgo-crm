// frontend/src/pages/LoyaltyManagement.js
import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/BreadCrumbs';

const LoyaltyManagement = () => {
  const [loyaltyPrograms, setLoyaltyPrograms] = useState([]);
  const [activeTab, setActiveTab] = useState('programs');

  const tabs = [
    { id: 'programs', name: 'Loyalty Programs' },
    { id: 'customers', name: 'Customer Points' },
    { id: 'rewards', name: 'Reward Redemptions' },
    { id: 'referrals', name: 'Referral Tracking' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
            <Breadcrumbs />
      {/* <h1 className="text-3xl font-bold text-green-700 mb-6">Loyalty & Incentives</h1> */}
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'programs' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Loyalty Programs</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
              Create New Program
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Points Program */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Points Program</h3>
              <p className="text-sm text-gray-600 mb-4">Earn points for every booking</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Points per Rand:</span>
                  <span>1 point per R10</span>
                </div>
                <div className="flex justify-between">
                  <span>Signup Bonus:</span>
                  <span>500 points</span>
                </div>
              </div>
            </div>

            {/* Referral Program */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Referral Program</h3>
              <p className="text-sm text-gray-600 mb-4">Refer friends and earn rewards</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Referrer Bonus:</span>
                  <span>R100 credit</span>
                </div>
                <div className="flex justify-between">
                  <span>Referee Bonus:</span>
                  <span>20% off first booking</span>
                </div>
              </div>
            </div>

            {/* Therapist Incentives */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Therapist Incentives</h3>
              <p className="text-sm text-gray-600 mb-4">Reward high-performing therapists</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Free Massages:</span>
                  <span>After 50 sessions</span>
                </div>
                <div className="flex justify-between">
                  <span>Bonus Payments:</span>
                  <span>5% for 5-star ratings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Loyalty Points</h2>
          {/* Customer points table */}
        </div>
      )}
    </div>
  );
};

export default LoyaltyManagement;