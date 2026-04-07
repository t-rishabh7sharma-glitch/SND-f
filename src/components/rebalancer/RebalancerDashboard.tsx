import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  CheckCircle,
  Wallet,
  ArrowRightLeft,
  ShieldCheck
} from 'lucide-react';

interface RebalancerDashboardProps {
  onAction: (message: string) => void;
}

const RebalancerDashboard: React.FC<RebalancerDashboardProps> = ({ onAction }) => {
  const kpis = [
    { label: 'Total Float Distributed', value: 'K 45,200', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Cash Collected', value: 'K 38,150', icon: ArrowRightLeft, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Stockout Alerts', value: '4', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Route Efficiency', value: '92%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const upcomingVisits = [
    { id: '1', agent: 'Chanda Mobile Money', location: 'Cairo Road', status: 'Priority', time: '10:30 AM', type: 'Float Top-up' },
    { id: '2', agent: 'Mumba Retail', location: 'Freedom Way', status: 'Scheduled', time: '11:15 AM', type: 'Cash Collection' },
    { id: '3', agent: 'Zamtel Express', location: 'Levy Mall', status: 'Stockout Risk', time: '11:45 AM', type: 'Emergency Float' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Rebalancer Command Center</h2>
        <button 
          onClick={() => onAction('Optimizing route for current traffic...')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          Optimize Route
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className={`w-12 h-12 ${kpi.bg} rounded-lg flex items-center justify-center mb-4`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <p className="text-sm text-gray-500 font-medium">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Plan */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-bottom border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Today's Route Plan</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
              3 Remaining
            </span>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingVisits.map((visit, index) => (
                <div key={visit.id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      visit.status === 'Priority' ? 'bg-red-100 text-red-600' : 
                      visit.status === 'Stockout Risk' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    {index !== upcomingVisits.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-100 my-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{visit.agent}</h4>
                        <p className="text-sm text-gray-500">{visit.location}</p>
                      </div>
                      <span className="text-sm font-medium text-blue-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {visit.time}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                        visit.status === 'Priority' ? 'bg-red-100 text-red-700' : 
                        visit.status === 'Stockout Risk' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {visit.status}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">|</span>
                      <span className="text-xs text-gray-600 font-semibold">{visit.type}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onAction(`Starting navigation to ${visit.agent}...`)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-all"
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => onAction('Opening Emergency Float Request form...')}
                className="w-full flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors text-left"
              >
                <div className="p-2 bg-red-200/50 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Emergency Float</p>
                  <p className="text-xs opacity-80">Request immediate stock</p>
                </div>
              </button>
              <button 
                onClick={() => onAction('Opening Cash Deposit validation...')}
                className="w-full flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors text-left"
              >
                <div className="p-2 bg-green-200/50 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Validate Deposit</p>
                  <p className="text-xs opacity-80">Confirm bank drop-off</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="font-bold">Security Status</h3>
            </div>
            <p className="text-sm text-blue-100 mb-4">
              Biometric verification active. All high-value transfers require dual-factor authentication.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold bg-blue-500/30 p-2 rounded border border-blue-400/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              SECURE CONNECTION ESTABLISHED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RebalancerDashboard;
