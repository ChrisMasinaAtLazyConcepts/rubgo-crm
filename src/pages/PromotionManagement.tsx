// frontend/src/pages/PromotionManagement.tsx
import React, { useState, useEffect } from 'react';

interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'free_session' | 'referral';
  code: string;
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  applicableServices: string[];
  customerSegments: string[];
  isActive: boolean;
  createdAt: string;
}

interface LoyaltyProgram {
  id: string;
  name: string;
  type: 'points' | 'tiers' | 'referral';
  rules: {
    pointsPerDollar: number;
    signupBonus: number;
    referralBonus: number;
    freeMassageAfterPoints: number;
    tierRequirements: Array<{
      tier: string;
      minPoints: number;
      benefits: string[];
    }>;
  };
  isActive: boolean;
  totalMembers: number;
  totalPointsIssued: number;
}

const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgram[]>([]);
  const [activeTab, setActiveTab] = useState<'promotions' | 'loyalty' | 'analytics'>('promotions');
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    loadPromotions();
    loadLoyaltyPrograms();
  }, []);

  const loadPromotions = () => {
    // Mock data - replace with API call
    const mockPromotions: Promotion[] = [
      {
        id: '1',
        name: 'Welcome Discount',
        type: 'percentage',
        code: 'WELCOME20',
        value: 20,
        minOrderAmount: 300,
        maxUses: 1000,
        usedCount: 342,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        applicableServices: ['all'],
        customerSegments: ['new'],
        isActive: true,
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        name: 'Summer Special',
        type: 'fixed',
        code: 'SUMMER50',
        value: 50,
        minOrderAmount: 400,
        maxUses: 500,
        usedCount: 189,
        validFrom: '2024-01-15',
        validUntil: '2024-02-15',
        applicableServices: ['Deep Tissue Massage', 'Swedish Massage'],
        customerSegments: ['all'],
        isActive: true,
        createdAt: '2024-01-15'
      },
      {
        id: '3',
        name: 'Free Session Loyalty',
        type: 'free_session',
        code: 'FREESESSION',
        value: 1,
        minOrderAmount: 0,
        usedCount: 56,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        applicableServices: ['all'],
        customerSegments: ['returning', 'vip'],
        isActive: true,
        createdAt: '2024-01-01'
      },
      {
        id: '4',
        name: 'Refer a Friend',
        type: 'referral',
        code: 'REFER100',
        value: 100,
        minOrderAmount: 0,
        usedCount: 234,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        applicableServices: ['all'],
        customerSegments: ['all'],
        isActive: true,
        createdAt: '2024-01-01'
      },
      {
        id: '5',
        name: 'Expired Promotion',
        type: 'percentage',
        code: 'OLD20',
        value: 20,
        usedCount: 890,
        validFrom: '2023-12-01',
        validUntil: '2023-12-31',
        applicableServices: ['all'],
        customerSegments: ['all'],
        isActive: false,
        createdAt: '2023-12-01'
      }
    ];

    setPromotions(mockPromotions);
  };

  const loadLoyaltyPrograms = () => {
    // Mock data - replace with API call
    const mockLoyaltyPrograms: LoyaltyProgram[] = [
      {
        id: '1',
        name: 'RubGo Rewards',
        type: 'points',
        rules: {
          pointsPerDollar: 10,
          signupBonus: 500,
          referralBonus: 1000,
          freeMassageAfterPoints: 5000,
          tierRequirements: [
            {
              tier: 'Silver',
              minPoints: 1000,
              benefits: ['Priority booking', '5% discount on all services']
            },
            {
              tier: 'Gold',
              minPoints: 5000,
              benefits: ['Free massage after 5000 points', '10% discount', 'Priority support']
            },
            {
              tier: 'Platinum',
              minPoints: 10000,
              benefits: ['Free monthly massage', '15% discount', 'Dedicated support']
            }
          ]
        },
        isActive: true,
        totalMembers: 1250,
        totalPointsIssued: 3450000
      },
      {
        id: '2',
        name: 'Referral Program',
        type: 'referral',
        rules: {
          pointsPerDollar: 0,
          signupBonus: 0,
          referralBonus: 100,
          freeMassageAfterPoints: 0,
          tierRequirements: []
        },
        isActive: true,
        totalMembers: 890,
        totalPointsIssued: 89000
      }
    ];

    setLoyaltyPrograms(mockLoyaltyPrograms);
  };

  const togglePromotionStatus = async (promotionId: string) => {
    const updatedPromotions = promotions.map(promotion =>
      promotion.id === promotionId ? { ...promotion, isActive: !promotion.isActive } : promotion
    );
    setPromotions(updatedPromotions);
  };

  const createPromotion = async (newPromotion: Omit<Promotion, 'id' | 'createdAt' | 'usedCount'>) => {
    const promotion: Promotion = {
      ...newPromotion,
      id: Date.now().toString(),
      usedCount: 0,
      createdAt: new Date().toISOString()
    };
    setPromotions(prev => [...prev, promotion]);
    setShowPromotionModal(false);
  };

  const updatePromotion = async (updatedPromotion: Promotion) => {
    const updatedPromotions = promotions.map(promotion =>
      promotion.id === updatedPromotion.id ? updatedPromotion : promotion
    );
    setPromotions(updatedPromotions);
    setShowPromotionModal(false);
    setSelectedPromotion(null);
  };

  const getPromotionTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'bg-blue-100 text-blue-800';
      case 'fixed': return 'bg-green-100 text-green-800';
      case 'free_session': return 'bg-purple-100 text-purple-800';
      case 'referral': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPromotionValue = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage': return `${promotion.value}% off`;
      case 'fixed': return `R${promotion.value} off`;
      case 'free_session': return `${promotion.value} free session${promotion.value > 1 ? 's' : ''}`;
      case 'referral': return `R${promotion.value} credit`;
      default: return promotion.value.toString();
    }
  };

  const getUsagePercentage = (promotion: Promotion) => {
    if (!promotion.maxUses) return 0;
    return (promotion.usedCount / promotion.maxUses) * 100;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Promotion & Loyalty Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowLoyaltyModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Manage Loyalty
          </button>
          <button
            onClick={() => {
              setSelectedPromotion(null);
              setShowPromotionModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Promotion
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex space-x-8 border-b">
          {[
            { id: 'promotions', name: 'Promotions', count: promotions.length },
            { id: 'loyalty', name: 'Loyalty Programs', count: loyaltyPrograms.length },
            { id: 'analytics', name: 'Analytics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name} {tab.count !== undefined && `(${tab.count})`}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'promotions' && (
        <>
          {/* Promotion Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{promotions.length}</div>
              <div className="text-sm text-gray-600">Total Promotions</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {promotions.filter(p => p.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active Promotions</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {promotions.reduce((total, p) => total + p.usedCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Uses</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                R{promotions.reduce((total, p) => total + (p.usedCount * p.value), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Discount Value</div>
            </div>
          </div>

          {/* Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map(promotion => (
              <div key={promotion.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{promotion.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPromotionTypeColor(promotion.type)}`}>
                        {promotion.type.replace('_', ' ')}
                      </span>
                    </div>
                    <button
                      onClick={() => togglePromotionStatus(promotion.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        promotion.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {promotion.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Code:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-bold">
                        {promotion.code}
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Value:</span>
                      <span className="font-bold text-green-600">
                        {formatPromotionValue(promotion)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Period:</span>
                      <span className="text-sm">
                        {new Date(promotion.validFrom).toLocaleDateString()} - {new Date(promotion.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                    {promotion.minOrderAmount && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Min Order:</span>
                        <span className="text-sm">R{promotion.minOrderAmount}</span>
                      </div>
                    )}
                  </div>

                  {/* Usage Progress */}
                  {promotion.maxUses && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Usage: {promotion.usedCount}/{promotion.maxUses}</span>
                        <span>{getUsagePercentage(promotion).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            getUsagePercentage(promotion) > 80 ? 'bg-red-500' :
                            getUsagePercentage(promotion) > 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(getUsagePercentage(promotion), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4 border-t">
                    <button
                      onClick={() => {
                        setSelectedPromotion(promotion);
                        setShowPromotionModal(true);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button className="flex-1 bg-gray-600 text-white py-2 rounded-lg text-sm hover:bg-gray-700">
                      Copy Code
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {promotions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎁</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Promotions Yet</h3>
              <p className="text-gray-500">Create your first promotion to attract more customers.</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'loyalty' && (
        <div className="space-y-6">
          {loyaltyPrograms.map(program => (
            <div key={program.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{program.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    program.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {program.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{program.totalMembers}</div>
                  <div className="text-sm text-gray-600">Active Members</div>
                </div>
              </div>

              {program.type === 'points' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Program Rules</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Points per Rand:</span>
                        <span className="font-medium">{program.rules.pointsPerDollar} pts/R1</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Signup Bonus:</span>
                        <span className="font-medium">{program.rules.signupBonus} points</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Referral Bonus:</span>
                        <span className="font-medium">{program.rules.referralBonus} points</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Free Massage at:</span>
                        <span className="font-medium">{program.rules.freeMassageAfterPoints} points</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Tier Benefits</h4>
                    <div className="space-y-3">
                      {program.rules.tierRequirements.map((tier, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{tier.tier}</span>
                            <span className="text-sm text-gray-600">{tier.minPoints} points</span>
                          </div>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {tier.benefits.map((benefit, idx) => (
                              <li key={idx}>• {benefit}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {program.type === 'referral' && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Referral Program</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Customers earn R{program.rules.referralBonus} credit for each successful referral.
                  </p>
                  <div className="text-sm">
                    <strong>Total Referrals:</strong> {program.totalMembers} • 
                    <strong> Total Credits Issued:</strong> R{program.totalPointsIssued}
                  </div>
                </div>
              )}

              <div className="flex space-x-3 mt-6 pt-4 border-t">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  View Members
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Export Data
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Program Analytics
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Promotion Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">24.5%</div>
              <div className="text-sm text-gray-600">Average Redemption Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">R45,670</div>
              <div className="text-sm text-gray-600">Total Discount Value</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">1,234</div>
              <div className="text-sm text-gray-600">New Customers via Promos</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">18.3%</div>
              <div className="text-sm text-gray-600">Increase in Repeat Business</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">R12.50</div>
              <div className="text-sm text-gray-600">Average Cost per Acquisition</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">3.2x</div>
              <div className="text-sm text-gray-600">ROI on Marketing Spend</div>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Modal */}
      {showPromotionModal && (
        <PromotionModal
          promotion={selectedPromotion}
          onClose={() => {
            setShowPromotionModal(false);
            setSelectedPromotion(null);
          }}
          onSave={selectedPromotion ? updatePromotion : createPromotion}
        />
      )}

      {/* Loyalty Program Modal */}
      {showLoyaltyModal && (
        <LoyaltyProgramModal
          onClose={() => setShowLoyaltyModal(false)}
          onSave={(program) => {
            setLoyaltyPrograms(prev => [...prev, { ...program, id: Date.now().toString(), totalMembers: 0, totalPointsIssued: 0 }]);
            setShowLoyaltyModal(false);
          }}
        />
      )}
    </div>
  );
};

// Promotion Modal Component
interface PromotionModalProps {
  promotion: Promotion | null;
  onClose: () => void;
  onSave: (promotion: Promotion) => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ promotion, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: promotion?.name || '',
    type: promotion?.type || 'percentage',
    code: promotion?.code || '',
    value: promotion?.value || 0,
    minOrderAmount: promotion?.minOrderAmount || 0,
    maxUses: promotion?.maxUses || 0,
    validFrom: promotion?.validFrom || new Date().toISOString().split('T')[0],
    validUntil: promotion?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    applicableServices: promotion?.applicableServices || ['all'],
    customerSegments: promotion?.customerSegments || ['all'],
    isActive: promotion?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const promotionData: Promotion = {
      id: promotion?.id || Date.now().toString(),
      ...formData,
      usedCount: promotion?.usedCount || 0,
      createdAt: promotion?.createdAt || new Date().toISOString()
    };
    onSave(promotionData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">
          {promotion ? 'Edit Promotion' : 'Create New Promotion'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Amount</option>
                <option value="free_session">Free Session</option>
                <option value="referral">Referral Credit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., WELCOME20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'percentage' ? 'Discount Percentage' :
                 formData.type === 'fixed' ? 'Discount Amount (R)' :
                 formData.type === 'free_session' ? 'Number of Free Sessions' :
                 'Credit Amount (R)'}
              </label>
              <input
                type="number"
                required
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: parseInt(e.target.value)})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount (R)</label>
              <input
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({...formData, minOrderAmount: parseInt(e.target.value)})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Uses</label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({...formData, maxUses: parseInt(e.target.value)})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0 for unlimited"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
              <input
                type="date"
                required
                value={formData.validFrom}
                onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
              <input
                type="date"
                required
                value={formData.validUntil}
                onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Segments</label>
            <div className="flex flex-wrap gap-2">
              {['all', 'new', 'returning', 'vip', 'inactive'].map(segment => (
                <label key={segment} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.customerSegments.includes(segment)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          customerSegments: [...formData.customerSegments, segment]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          customerSegments: formData.customerSegments.filter(s => s !== segment)
                        });
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm capitalize">{segment}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Promotion is active and available for use
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {promotion ? 'Update Promotion' : 'Create Promotion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Loyalty Program Modal Component
interface LoyaltyProgramModalProps {
  onClose: () => void;
  onSave: (program: Omit<LoyaltyProgram, 'id' | 'totalMembers' | 'totalPointsIssued'>) => void;
}

const LoyaltyProgramModal: React.FC<LoyaltyProgramModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'points' as 'points' | 'referral',
    rules: {
      pointsPerDollar: 10,
      signupBonus: 500,
      referralBonus: 1000,
      freeMassageAfterPoints: 5000,
      tierRequirements: [] as Array<{
        tier: string;
        minPoints: number;
        benefits: string[];
      }>
    },
    isActive: true
  });

  const [newTier, setNewTier] = useState({
    tier: '',
    minPoints: 0,
    benefits: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addTier = () => {
    if (newTier.tier.trim() && newTier.minPoints > 0) {
      setFormData({
        ...formData,
        rules: {
          ...formData.rules,
          tierRequirements: [
            ...formData.rules.tierRequirements,
            {
              tier: newTier.tier,
              minPoints: newTier.minPoints,
              benefits: newTier.benefits.filter(b => b.trim())
            }
          ]
        }
      });
      setNewTier({ tier: '', minPoints: 0, benefits: [''] });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">Create Loyalty Program</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="points">Points-based Program</option>
                <option value="referral">Referral Program</option>
              </select>
            </div>
          </div>

          {formData.type === 'points' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points per Rand</label>
                  <input
                    type="number"
                    value={formData.rules.pointsPerDollar}
                    onChange={(e) => setFormData({
                      ...formData,
                      rules: {...formData.rules, pointsPerDollar: parseInt(e.target.value)}
                    })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Signup Bonus Points</label>
                  <input
                    type="number"
                    value={formData.rules.signupBonus}
                    onChange={(e) => setFormData({
                      ...formData,
                      rules: {...formData.rules, signupBonus: parseInt(e.target.value)}
                    })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referral Bonus Points</label>
                  <input
                    type="number"
                    value={formData.rules.referralBonus}
                    onChange={(e) => setFormData({
                      ...formData,
                      rules: {...formData.rules, referralBonus: parseInt(e.target.value)}
                    })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Free Massage Points Threshold</label>
                  <input
                    type="number"
                    value={formData.rules.freeMassageAfterPoints}
                    onChange={(e) => setFormData({
                      ...formData,
                      rules: {...formData.rules, freeMassageAfterPoints: parseInt(e.target.value)}
                    })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Tier Management */}
              <div>
                <h4 className="font-semibold mb-3">Tier Requirements</h4>
                <div className="space-y-3 mb-4">
                  {formData.rules.tierRequirements.map((tier, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{tier.tier}</span>
                        <span className="text-sm text-gray-600">{tier.minPoints} points</span>
                      </div>
                      <ul className="text-sm text-gray-600">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium mb-3">Add New Tier</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Tier Name"
                      value={newTier.tier}
                      onChange={(e) => setNewTier({...newTier, tier: e.target.value})}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Minimum Points"
                      value={newTier.minPoints}
                      onChange={(e) => setNewTier({...newTier, minPoints: parseInt(e.target.value)})}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                    {newTier.benefits.map((benefit, index) => (
                      <div key={index} className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          placeholder="Benefit description"
                          value={benefit}
                          onChange={(e) => {
                            const newBenefits = [...newTier.benefits];
                            newBenefits[index] = e.target.value;
                            setNewTier({...newTier, benefits: newBenefits});
                          }}
                          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {newTier.benefits.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newBenefits = newTier.benefits.filter((_, i) => i !== index);
                              setNewTier({...newTier, benefits: newBenefits});
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setNewTier({...newTier, benefits: [...newTier.benefits, '']})}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Benefit
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={addTier}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Add Tier
                  </button>
                </div>
              </div>
            </>
          )}

          {formData.type === 'referral' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Referral Credit Amount (R)</label>
              <input
                type="number"
                value={formData.rules.referralBonus}
                onChange={(e) => setFormData({
                  ...formData,
                  rules: {...formData.rules, referralBonus: parseInt(e.target.value)}
                })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Program is active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionManagement;