import React from 'react';
import { motion } from 'motion/react';
import { MapPin, CheckCircle2, XCircle, Camera, Clock, AlertTriangle, ShieldCheck, Info, Navigation } from 'lucide-react';
import { VisitData, Outlet } from '../../types';

interface VisitValidationProps {
  visit: VisitData & { aseName: string; outlet: Outlet };
  onApprove: () => void;
  onFlag: () => void;
}

const VisitValidation: React.FC<VisitValidationProps> = ({ visit, onApprove, onFlag }) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl mb-1 text-primary font-display font-extrabold">Visit Validation</h1>
          <p className="text-on-surface-variant text-sm">Deep-dive review of individual outlet visits</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={onFlag}
            className="flex-1 sm:flex-none btn btn-ghost px-6 py-3 border-rag-red/20 text-rag-red hover:bg-rag-red-bg flex items-center justify-center gap-2"
          >
            <AlertTriangle size={18} />
            <span className="text-sm font-bold">Flag</span>
          </button>
          <button 
            onClick={onApprove}
            className="flex-1 sm:flex-none btn btn-primary px-8 py-3 shadow-lg flex items-center justify-center gap-2 bg-rag-green hover:bg-green-800"
          >
            <CheckCircle2 size={18} />
            <span className="text-sm font-bold">Approve</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Visit Details & Evidence */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card-base p-6 lg:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Navigation size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{visit.outlet.name}</h2>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    {visit.aseName} • {visit.checkInTime}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-rag-green-bg text-rag-green text-[10px] font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} /> GPS MATCH: VALID
                </span>
                <span className="px-3 py-1 rounded-full bg-rag-green-bg text-rag-green text-[10px] font-bold flex items-center gap-1.5">
                  <Camera size={14} /> PHOTO GPS: MATCHED
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <MapPin size={18} className="text-primary" /> Proximity Map
                </h3>
                <div className="aspect-video rounded-3xl bg-[#FAF9F6] border border-black/5 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <svg viewBox="0 0 400 200" className="w-full h-full">
                      <path d="M0,50 Q100,100 200,50 T400,100" fill="none" stroke="#1B5E20" strokeWidth="4" />
                      <circle cx="200" cy="50" r="40" fill="#4CAF50" fillOpacity="0.2" />
                    </svg>
                  </div>
                  <Navigation size={48} className="text-[#81C784] z-10 drop-shadow-md" />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-xl shadow-lg border border-black/5 text-[9px] font-black uppercase tracking-widest text-[#1B5E20]">
                    Within 48m of outlet
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Camera size={18} className="text-primary" /> Proof of Visit
                </h3>
                <div className="aspect-video rounded-3xl bg-[#FAF9F6] border border-black/5 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 flex text-center justify-center items-center">
                  </div>
                  <Camera size={48} className="text-[#81C784] z-10 drop-shadow-md" />
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl shadow-lg border border-black/5 text-[9px] font-black uppercase tracking-widest text-[#1B5E20]">
                    Geo-tagged Photo
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-base p-6 lg:p-8 space-y-6">
            <h3 className="text-lg font-bold">Outcome Section</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'Float Checked', status: visit.floatAmount > 0 ? 'Done' : 'N/A', val: `ZMW ${visit.floatAmount}`, icon: <CheckCircle2 size={16} />, color: 'text-rag-green' },
                { label: 'SIMs Registered', status: visit.simsRegistered > 0 ? 'Done' : 'N/A', val: `${visit.simsRegistered} SIMs`, icon: <CheckCircle2 size={16} />, color: 'text-rag-green' },
                { label: 'Branding Check', status: visit.brandingCompliant === 'Yes' ? 'Passed' : 'Partial', val: visit.brandingCompliant, icon: <CheckCircle2 size={16} />, color: visit.brandingCompliant === 'Yes' ? 'text-rag-green' : 'text-rag-amber' },
                { label: 'Pricing Compliant', status: visit.pricingCompliant ? 'Passed' : 'Failed', val: visit.pricingCompliant ? 'Yes' : 'No', icon: visit.pricingCompliant ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />, color: visit.pricingCompliant ? 'text-rag-green' : 'text-rag-red' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-surface-container-low border border-black/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{item.label}</div>
                      <div className="text-sm font-bold">{item.val}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold ${item.color}`}>{item.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Actions & Notes */}
        <div className="space-y-8">
          <div className="card-base p-6 lg:p-8 space-y-6">
            <h3 className="text-lg font-bold">Review Actions</h3>
            <div className="space-y-4">
              <button 
                onClick={onApprove}
                className="btn btn-primary w-full py-4 shadow-xl flex items-center justify-center gap-2 bg-rag-green hover:bg-green-800"
              >
                <CheckCircle2 size={20} /> Approve Visit
              </button>
              <button 
                onClick={onFlag}
                className="btn btn-ghost w-full py-4 border-rag-red/20 text-rag-red hover:bg-rag-red-bg flex items-center justify-center gap-2"
              >
                <AlertTriangle size={20} /> Flag for Investigation
              </button>
            </div>
          </div>

          <div className="card-base p-6 lg:p-8 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Info size={20} className="text-primary" /> ASE Notes
            </h3>
            <div className="bg-surface-container-low p-4 rounded-2xl border border-black/5 min-h-[120px]">
              <p className="text-sm font-semibold leading-relaxed text-on-surface-variant italic">
                "{visit.notes || 'No notes provided for this visit.'}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitValidation;
