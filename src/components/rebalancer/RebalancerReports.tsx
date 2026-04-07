import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';

interface RebalancerReportsProps {
  onAction: (message: string) => void;
}

const RebalancerReports: React.FC<RebalancerReportsProps> = ({ onAction }) => {
  const reports = [
    { id: '1', name: 'Daily Distribution Log', date: '2026-03-31', type: 'Operational', status: 'Generated' },
    { id: '2', name: 'Cash Collection Summary', date: '2026-03-30', type: 'Financial', status: 'Verified' },
    { id: '3', name: 'Agent Compliance Audit', date: '2026-03-30', type: 'Compliance', status: 'Pending Review' },
    { id: '4', name: 'Stockout Incident Report', date: '2026-03-29', type: 'Exception', status: 'Escalated' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Daily Logs & Reporting</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onAction('Opening report filter...')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Select Date
          </button>
          <button 
            onClick={() => onAction('Exporting all logs for today...')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Float Velocity</p>
          <p className="text-2xl font-bold text-gray-900">K 125,400</p>
          <p className="text-xs text-gray-400 mt-2">Total distributed this week</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">High</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Escalations</p>
          <p className="text-2xl font-bold text-gray-900">3 Pending</p>
          <p className="text-xs text-gray-400 mt-2">Requires ZBM intervention</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">100%</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Audit Completion</p>
          <p className="text-2xl font-bold text-gray-900">12/12 Agents</p>
          <p className="text-xs text-gray-400 mt-2">All scheduled visits completed</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity Logs</h3>
          <button 
            onClick={() => onAction('Opening advanced search...')}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div key={report.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    report.type === 'Operational' ? 'bg-blue-50 text-blue-600' : 
                    report.type === 'Financial' ? 'bg-green-50 text-green-600' : 
                    report.type === 'Compliance' ? 'bg-purple-50 text-purple-600' : 'bg-red-50 text-red-600'
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{report.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.date}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">|</span>
                      <span className="text-xs text-gray-600 font-semibold">{report.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                    report.status === 'Generated' ? 'bg-blue-100 text-blue-700' : 
                    report.status === 'Verified' ? 'bg-green-100 text-green-700' : 
                    report.status === 'Pending Review' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {report.status}
                  </span>
                  <button 
                    onClick={() => onAction(`Downloading ${report.name}...`)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-all"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Escalation Center */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Escalation Center</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-red-100 bg-red-50/30 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold">Urgent: Cash Limit Exceeded</span>
              </div>
              <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">2H AGO</span>
            </div>
            <p className="text-sm text-red-800">
              Agent "Zamtel Express" has exceeded the physical cash holding limit of K 50,000. Immediate collection required.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button 
                onClick={() => onAction('Escalating to ZBM...')}
                className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
              >
                Escalate to ZBM
              </button>
              <button 
                onClick={() => onAction('Opening chat with agent...')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                Message Agent
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/30 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 text-orange-700">
                <Clock className="w-5 h-5" />
                <span className="font-bold">Pending: Float Request</span>
              </div>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">4H AGO</span>
            </div>
            <p className="text-sm text-orange-800">
              Emergency float request of K 20,000 from "Phiri Telecom" is awaiting approval from the Treasury.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button 
                onClick={() => onAction('Sending reminder to Treasury...')}
                className="px-3 py-1.5 bg-orange-600 text-white text-xs font-bold rounded-lg hover:bg-orange-700 transition-colors"
              >
                Send Reminder
              </button>
              <button 
                onClick={() => onAction('Viewing request details...')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-orange-200 text-orange-700 text-xs font-bold rounded-lg hover:bg-orange-100 transition-colors"
              >
                <ArrowUpRight className="w-3 h-3" />
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RebalancerReports;
