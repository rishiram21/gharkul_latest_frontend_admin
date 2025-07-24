import { useDashboard } from '../context/DashboardContext';
import { Home, FileText, Settings, Package, Users, UserCheck, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { dashboardData } = useDashboard();

  const dashboardItems = [
    {
      title: 'Property',
      icon: Home,
      count: dashboardData.propertyCount.toString(),
      description: 'Total Properties',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Requirements',
      icon: FileText,
      count: dashboardData.requirementCount.toString(),
      description: 'Active Requirements',
      gradient: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Amenities',
      icon: Settings,
      count: dashboardData.amenityCount.toString(),
      description: 'Available Amenities',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      title: 'Packages',
      icon: Package,
      count: dashboardData.packageCount.toString(),
      description: 'Service Packages',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      title: 'Subscribers',
      icon: Users,
      count: dashboardData.subscriberCount.toString(),
      description: 'Total Subscribers',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Customers',
      icon: UserCheck,
      count: dashboardData.customerCount.toString(),
      description: 'Active Customers',
      gradient: 'from-pink-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-purple-600 text-lg">Here's what's happening with your business today.</p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-200 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                      <div className="text-sm text-purple-600 font-medium">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-green-500 text-sm font-medium">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +12%
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-2">
                      <div className={`h-2 rounded-full bg-gradient-to-r ${item.gradient}`} style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-300 transition-all duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
