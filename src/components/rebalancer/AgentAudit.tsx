import React from 'react';
import { motion } from 'motion/react';
import { 
  Camera, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck,
  Image as ImageIcon,
  ChevronLeft,
  Save
} from 'lucide-react';

interface AgentAuditProps {
  onAction: (message: string) => void;
}

const AgentAudit: React.FC<AgentAuditProps> = ({ onAction }) => {
  const agent = {
    name: 'Chanda Mobile Money',
    id: 'AGT-001',
    location: 'Cairo Road, Lusaka',
    lastAudit: '2026-03-25',
    compliance: 85,
  };

  const auditItems = [
    { label: 'Branding Visibility', status: 'Compliant', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Tariff Poster Display', status: 'Missing', icon: XCircle, color: 'text-red-600' },
    { label: 'Float Adequacy', status: 'Warning', icon: AlertTriangle, color: 'text-orange-600' },
    { label: 'KYC Logbook Maintenance', status: 'Compliant', icon: CheckCircle, color: 'text-green-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onAction('Returning to agent list...')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{agent.name}</h2>
          <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {agent.location} | ID: {agent.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Execution Checklist</h3>
            <div className="space-y-4">
              {auditItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-50 bg-gray-50/30">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white shadow-sm ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onAction(`Marking ${item.label} as compliant...`)}
                      className="px-3 py-1 bg-white border border-gray-200 text-xs font-bold rounded hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all"
                    >
                      PASS
                    </button>
                    <button 
                      onClick={() => onAction(`Marking ${item.label} as non-compliant...`)}
                      className="px-3 py-1 bg-white border border-gray-200 text-xs font-bold rounded hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                    >
                      FAIL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Evidence Capture</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <button 
                onClick={() => onAction('Opening camera for branding photo...')}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-100 transition-colors">
                  <Camera className="w-6 h-6 text-gray-500 group-hover:text-blue-600" />
                </div>
                <span className="text-xs font-bold text-gray-500 group-hover:text-blue-600">Take Photo</span>
              </button>
              <div className="aspect-square rounded-xl bg-gray-100 relative overflow-hidden group">
                <img 
                  src="https://picsum.photos/seed/branding/400/400" 
                  alt="Branding evidence" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="p-2 bg-white rounded-full text-gray-800"><ImageIcon className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Audit Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-gray-500">Compliance Score</span>
                  <span className="text-blue-600">85%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Audit</span>
                  <span className="font-semibold text-gray-800">{agent.lastAudit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Auditor</span>
                  <span className="font-semibold text-gray-800">John Doe</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onAction('Submitting audit report...')}
            className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Save className="w-5 h-5" />
            Submit Audit
          </button>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-orange-800">Action Required</p>
              <p className="text-xs text-orange-700 mt-1">
                Tariff poster is missing. Agent must be issued a warning and a new poster provided.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAudit;
