// frontend/src/pages/AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaMoneyBillWave, 
  FaCalendarCheck, 
  FaChartLine,
  FaArrowUp, 
  FaArrowDown, 
  FaMinus 
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
        icon: <FaUsers className="w-6 h-6" />
      },
      {
        label: 'Total Revenue',
        value: 125000,
        change: 8.3,
        changeType: 'positive',
        format: 'currency',
        icon: <FaMoneyBillWave className="w-6 h-6" />
      },
      {
        label: 'Appointments',
        value: 345,
        change: -2.1,
        changeType: 'negative',
        format: 'number',
        icon: <FaCalendarCheck className="w-6 h-6" />
      },
      {
        label: 'Growth Rate',
        value: 15.7,
        change: 3.2,
        changeType: 'positive',
        format: 'percentage',
        icon: <FaChartLine className="w-6 h-6" />
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
    return value.toString();
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive': return 'bg-green-500/20 text-green-300';
      case 'negative': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive': return <FaArrowUp className="inline w-3 h-3" />;
      case 'negative': return <FaArrowDown className="inline w-3 h-3" />;
      default: return <FaMinus className="inline w-3 h-3" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Export Report
          </button>
        </div>
      </div>

      {/* Time Period Summary */}
      <div className="bg-[#2D5B7C] rounded-lg shadow-lg text-white p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Performance Overview</h2>
            <p className="text-blue-100">
              {timeRange === '7d' && 'Last 7 Days'}
              {timeRange === '30d' && 'Last 30 Days'}
              {timeRange === '90d' && 'Last 90 Days'}
              {timeRange === '1y' && 'Last 12 Months'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">R125,430</div>
            <div className="text-green-300">+12.5% from previous period</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex space-x-8 border-b">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'revenue', name: 'Revenue Analytics' },
            { id: 'therapists', name: 'Therapist Performance' },
            { id: 'services', name: 'Service Analysis' },
            { id: 'geography', name: 'Geographic Performance' }
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
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      {(activeTab === 'overview' || activeTab === 'revenue') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-[#2D5B7C] rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-blue-700/30 hover:border-blue-500/50">
              <div className="flex justify-between items-start mb-4">
                <div className="text-2xl text-white bg-blue-600/20 p-2 rounded-lg">
                  {kpi.icon}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeColor(kpi.changeType)}`}>
                  {getChangeIcon(kpi.changeType)} {kpi.change}%
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {formatValue(kpi.value, kpi.format)}
              </div>
              <div className="text-sm text-gray-300">{kpi.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        {(activeTab === 'overview' || activeTab === 'revenue') && (
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <div className="h-80">
              <Bar
                data={{
                  labels: revenueData.map(day => day.date),
                  datasets: [
                    {
                      label: 'Daily Revenue',
                      data: revenueData.map(day => day.revenue),
                      backgroundColor: '#10B981',
                      borderColor: '#047857',
                      borderWidth: 1,
                      borderRadius: 6,
                      borderSkipped: false,
                    },
                    {
                      label: 'Number of Bookings',
                      data: revenueData.map(day => day.bookings),
                      backgroundColor: '#0B1F3D',
                      borderColor: '#1D4ED8',
                      borderWidth: 1,
                      borderRadius: 6,
                      borderSkipped: false,
                      yAxisID: 'y1',
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index' as const,
                    intersect: false,
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      type: 'linear' as const,
                      display: true,
                      position: 'left' as const,
                      title: {
                        display: true,
                        text: 'Revenue (R)'
                      },
                      grid: {
                        color: '#F3F4F6'
                      }
                    },
                    y1: {
                      type: 'linear' as const,
                      display: true,
                      position: 'right' as const,
                      title: {
                        display: true,
                        text: 'Bookings'
                      },
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context: any) {
                          let label = context.dataset.label || '';
                          if (label) {
                            label += ': ';
                          }
                          if (context.datasetIndex === 0) {
                            label += `R${context.parsed.y.toLocaleString()}`;
                          } else {
                            label += `${context.parsed.y} bookings`;
                          }
                          return label;
                        },
                        afterLabel: function(context: any) {
                          if (context.datasetIndex === 0) {
                            const dayIndex = Number(context.dataIndex);
                            const day = revenueData[dayIndex];
                            return `Avg: R${day.averageOrder}`;
                          }
                          return '';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {(activeTab === 'overview' || activeTab === 'revenue') && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Snapshot</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-800 font-medium">Peak Revenue Day</span>
                <span className="text-blue-600 font-bold">R12,450</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-800 font-medium">Most Booked Service</span>
                <span className="text-green-600 font-bold">Deep Tissue</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-800 font-medium">Top Therapist</span>
                <span className="text-purple-600 font-bold">Sarah Wilson</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-800 font-medium">Busiest Area</span>
                <span className="text-orange-600 font-bold">Johannesburg</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Therapist Performance */}
      {(activeTab === 'overview' || activeTab === 'therapists') && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Therapists</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Therapist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {therapistPerformance.map((therapist) => (
                  <tr key={therapist.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{therapist.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{therapist.sessions}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">R{therapist.revenue.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-600 font-medium">{therapist.rating}</span>
                        <span className="text-yellow-500 ml-1">⭐</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{therapist.completionRate}%</div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Service Performance</h3>
            <div className="space-y-4">
              {servicePerformance.map((service, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{service.service}</div>
                    <div className="text-sm text-gray-600">{service.bookings} bookings</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">R{service.revenue.toLocaleString()}</div>
                    <div className="text-sm text-yellow-600">⭐ {service.averageRating}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Service Distribution</h3>
            <div className="space-y-3">
              {servicePerformance.map((service, index) => {
                const totalRevenue = servicePerformance.reduce((sum, s) => sum + s.revenue, 0);
                const percentage = (service.revenue / totalRevenue) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{service.service}</span>
                      <span className="text-gray-600">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Geographic Performance - Revenue Distribution</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md h-80">
                <Doughnut
                  data={{
                    labels: geographicPerformance.map(area => area.area),
                    datasets: [
                      {
                        data: geographicPerformance.map(area => area.revenue),
                        backgroundColor: [
                          '#3B82F6', // Blue
                          '#10B981', // Green
                          '#F59E0B', // Yellow
                          '#EF4444', // Red
                          '#8B5CF6', // Purple
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
                        position: 'right',
                        labels: {
                          boxWidth: 12,
                          padding: 15,
                          font: {
                            size: 11
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context: any) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: R${value.toLocaleString()} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Performance Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-3">Area Performance Details</h4>
              {geographicPerformance.map((area, index) => {
                const totalRevenue = geographicPerformance.reduce((sum, a) => sum + a.revenue, 0);
                const percentage = ((area.revenue / totalRevenue) * 100).toFixed(1);
                
                return (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
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
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Revenue Share:</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Revenue:</span>
                        <span className="text-sm font-medium text-green-600">R{area.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Bookings:</span>
                        <span className="text-sm font-medium">{area.bookings}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="h-2 rounded-full bg-blue-500"
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

      {/* Additional Metrics */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Insights</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">New vs Returning Customers</span>
                <span className="font-medium">65% / 35%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Average Customer Lifetime Value</span>
                <span className="font-medium text-green-600">R2,450</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Customer Acquisition Cost</span>
                <span className="font-medium text-blue-600">R185</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Operational Efficiency</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Average Response Time</span>
                <span className="font-medium">12 min</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Therapist On-time Rate</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Customer Satisfaction Score</span>
                <span className="font-medium text-yellow-600">4.7/5</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;