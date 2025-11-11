// frontend/src/pages/AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaMoneyBillWave, 
  FaCalendarCheck, 
  FaChartLine,
  FaArrowUp, 
  FaArrowDown, 
  FaMinus,
  FaDownload,
  FaStar
} from 'react-icons/fa';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import Breadcrumbs from '../components/BreadCrumbs';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface KPI {
  label: string;
  value: number | string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  format?: 'currency' | 'number' | 'percentage';
  icon: React.ReactNode;
}

interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
  averageOrder: number;
}

interface TherapistPerformance {
  id: string;
  name: string;
  sessions: number;
  revenue: number;
  rating: number;
  completionRate: number;
}

interface ServicePerformance {
  service: string;
  bookings: number;
  revenue: number;
  averageRating: number;
}

interface GeographicPerformance {
  area: string;
  bookings: number;
  revenue: number;
  growth: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [therapistPerformance, setTherapistPerformance] = useState<TherapistPerformance[]>([]);
  const [servicePerformance, setServicePerformance] = useState<ServicePerformance[]>([]);
  const [geographicPerformance, setGeographicPerformance] = useState<GeographicPerformance[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'therapists' | 'services' | 'geography'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = () => {
    // Mock KPIs data with React Icons
    const mockKpis: KPI[] = [
      {
        label: 'Total Users',
        value: 1250,
        change: 12.5,
        changeType: 'positive',
        format: 'number',
        icon: <FaUsers className="w-5 h-5" />
      },
      {
        label: 'Total Revenue',
        value: 125000,
        change: 8.3,
        changeType: 'positive',
        format: 'currency',
        icon: <FaMoneyBillWave className="w-5 h-5" />
      },
      {
        label: 'Appointments',
        value: 345,
        change: -2.1,
        changeType: 'negative',
        format: 'number',
        icon: <FaCalendarCheck className="w-5 h-5" />
      },
      {
        label: 'Growth Rate',
        value: 15.7,
        change: 3.2,
        changeType: 'positive',
        format: 'percentage',
        icon: <FaChartLine className="w-5 h-5" />
      }
    ];

    const mockRevenueData: RevenueData[] = [
      { date: 'Jan 1', revenue: 8450, bookings: 28, averageOrder: 302 },
      { date: 'Jan 2', revenue: 9120, bookings: 31, averageOrder: 294 },
      { date: 'Jan 3', revenue: 7880, bookings: 26, averageOrder: 303 },
      { date: 'Jan 4', revenue: 10560, bookings: 35, averageOrder: 302 },
      { date: 'Jan 5', revenue: 9670, bookings: 32, averageOrder: 302 },
      { date: 'Jan 6', revenue: 11240, bookings: 38, averageOrder: 296 },
      { date: 'Jan 7', revenue: 12450, bookings: 42, averageOrder: 296 }
    ];

    const mockTherapistPerformance: TherapistPerformance[] = [
      { id: '1', name: 'Sarah Wilson', sessions: 45, revenue: 18900, rating: 4.9, completionRate: 98 },
      { id: '2', name: 'Mike Johnson', sessions: 38, revenue: 15960, rating: 4.7, completionRate: 96 },
      { id: '3', name: 'Emily Chen', sessions: 42, revenue: 17640, rating: 4.8, completionRate: 100 },
      { id: '4', name: 'David Brown', sessions: 35, revenue: 14700, rating: 4.6, completionRate: 94 },
      { id: '5', name: 'Lisa Wang', sessions: 31, revenue: 13020, rating: 4.9, completionRate: 97 }
    ];

    const mockServicePerformance: ServicePerformance[] = [
      { service: 'Deep Tissue Massage', bookings: 125, revenue: 56250, averageRating: 4.8 },
      { service: 'Swedish Massage', bookings: 98, revenue: 39200, averageRating: 4.7 },
      { service: 'Sports Massage', bookings: 67, revenue: 33500, averageRating: 4.9 },
      { service: 'Prenatal Massage', bookings: 45, revenue: 15750, averageRating: 4.6 },
      { service: 'Hot Stone Massage', bookings: 32, revenue: 14400, averageRating: 4.8 }
    ];

    const mockGeographicPerformance: GeographicPerformance[] = [
      { area: 'Johannesburg - North', bookings: 156, revenue: 65520, growth: 15.2 },
      { area: 'Cape Town - City Bowl', bookings: 134, revenue: 56280, growth: 12.8 },
      { area: 'Pretoria - East', bookings: 89, revenue: 37380, growth: 8.4 },
      { area: 'Durban - Beachfront', bookings: 76, revenue: 31920, growth: 6.7 },
      { area: 'Sandton', bookings: 65, revenue: 27300, growth: 18.3 }
    ];

    setKpis(mockKpis);
    setRevenueData(mockRevenueData);
    setTherapistPerformance(mockTherapistPerformance);
    setServicePerformance(mockServicePerformance);
    setGeographicPerformance(mockGeographicPerformance);
  };

  const formatValue = (value: number | string, format?: string) => {
    if (format === 'currency') {
      return `R${typeof value === 'number' ? value.toLocaleString() : value}`;
    }
    if (format === 'percentage') {
      return `${value}%`;
    }
    return value.toLocaleString();
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive': return <FaArrowUp className="inline w-3 h-3 mr-1" />;
      case 'negative': return <FaArrowDown className="inline w-3 h-3 mr-1" />;
      default: return <FaMinus className="inline w-3 h-3 mr-1" />;
    }
  };

  const chartColors = {
    primary: '#10B981', // Green-500
    secondary: '#0B1F3D', // Dark blue
    accent: '#3B82F6', // Blue-500
    success: '#10B981', // Green-500
    warning: '#F59E0B', // Amber-500
    danger: '#EF4444', // Red-500
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
            <Breadcrumbs />
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1> */}
            <p className="text-gray-600">
              {timeRange === '7d' && 'Last 7 Days'}
              {timeRange === '30d' && 'Last 30 Days'}
              {timeRange === '90d' && 'Last 90 Days'}
              {timeRange === '1y' && 'Last 12 Months'}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <FaDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

     {/* KPI Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  {kpis.map((kpi, index) => (
    <div key={index} className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
      <h3 className="text-lg font-semibold text-indigo-800">{kpi.label}</h3>
      <p className="text-2xl font-bold text-indigo-700">{formatValue(kpi.value, kpi.format)}</p>
      <div className="flex items-center mt-2">
        <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
        <p className="text-xs text-indigo-600">Performance metric</p>
      </div>
    </div>
  ))}
</div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6">
          <div className="flex space-x-1">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'revenue', name: 'Revenue' },
              { id: 'therapists', name: 'Therapists' },
              { id: 'services', name: 'Services' },
              { id: 'geography', name: 'Geography' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Revenue Chart */}
          {(activeTab === 'overview' || activeTab === 'revenue') && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-bold text-green-600">R{revenueData.reduce((sum, day) => sum + day.revenue, 0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-80">
                  <Bar
                    data={{
                      labels: revenueData.map(day => day.date),
                      datasets: [
                        {
                          label: 'Daily Revenue',
                          data: revenueData.map(day => day.revenue),
                          backgroundColor: chartColors.primary,
                          borderColor: chartColors.primary,
                          borderWidth: 1,
                          borderRadius: 6,
                          borderSkipped: false,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          grid: {
                            display: false
                          }
                        },
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: '#F3F4F6'
                          },
                          ticks: {
                            callback: function(value) {
                              return 'R' + value.toLocaleString();
                            }
                          }
                        },
                      },
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              return `Revenue: R${context.parsed.y.toLocaleString()}`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Performance Snapshot */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Snapshot</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Peak Revenue Day', value: 'R12,450', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Most Booked Service', value: 'Deep Tissue', color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Top Therapist', value: 'Sarah Wilson', color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Busiest Area', value: 'Johannesburg', color: 'text-orange-600', bg: 'bg-orange-50' }
                  ].map((item, index) => (
                    <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${item.bg}`}>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Therapist Performance */}
          {(activeTab === 'overview' || activeTab === 'therapists') && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Therapists</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Therapist</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Sessions</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Revenue</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rating</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Completion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {therapistPerformance.map((therapist) => (
                      <tr key={therapist.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{therapist.name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-900">{therapist.sessions}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-green-600">R{therapist.revenue.toLocaleString()}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="font-medium text-gray-900">{therapist.rating}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${therapist.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{therapist.completionRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Service Performance */}
          {(activeTab === 'overview' || activeTab === 'services') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Performance</h3>
                <div className="space-y-4">
                  {servicePerformance.map((service, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900">{service.service}</div>
                        <div className="text-sm text-gray-600 mt-1">{service.bookings} bookings</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">R{service.revenue.toLocaleString()}</div>
                        <div className="flex items-center justify-end text-sm text-yellow-600 mt-1">
                          <FaStar className="w-3 h-3 mr-1" />
                          {service.averageRating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Distribution</h3>
                <div className="space-y-4">
                  {servicePerformance.map((service, index) => {
                    const totalRevenue = servicePerformance.reduce((sum, s) => sum + s.revenue, 0);
                    const percentage = (service.revenue / totalRevenue) * 100;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">{service.service}</span>
                          <span className="text-gray-600">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Geographic Performance */}
          {(activeTab === 'overview' || activeTab === 'geography') && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Performance</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex justify-center">
                  <div className="w-full max-w-md h-80">
                    <Doughnut
                      data={{
                        labels: geographicPerformance.map(area => area.area.split(' - ')[0]),
                        datasets: [
                          {
                            data: geographicPerformance.map(area => area.revenue),
                            backgroundColor: [
                              chartColors.primary,
                              chartColors.accent,
                              chartColors.warning,
                              '#8B5CF6',
                              '#EC4899'
                            ],
                            borderColor: '#ffffff',
                            borderWidth: 2,
                            hoverOffset: 8,
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              padding: 20,
                              usePointStyle: true,
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {geographicPerformance.map((area, index) => {
                    const totalRevenue = geographicPerformance.reduce((sum, a) => sum + a.revenue, 0);
                    const percentage = ((area.revenue / totalRevenue) * 100).toFixed(1);
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-medium text-gray-900">{area.area}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            area.growth >= 10 ? 'bg-green-100 text-green-800' :
                            area.growth >= 5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {area.growth > 0 ? '+' : ''}{area.growth}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Revenue</span>
                            <span className="font-medium text-green-600">R{area.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Bookings</span>
                            <span className="font-medium text-gray-900">{area.bookings}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="h-2 rounded-full bg-green-600 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;