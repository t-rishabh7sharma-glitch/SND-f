import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, CheckCircle2, XCircle, Camera, Clock, AlertTriangle, ChevronRight, Save, Send, TrendingUp } from 'lucide-react';
import { Outlet, VisitData } from '../../types';

interface VisitModuleProps {
  outlet: Outlet;
  onClose: () => void;
  onSubmit: (data: VisitData) => void;
}

const VisitModule: React.FC<VisitModuleProps> = ({ outlet, onClose, onSubmit }) => {
  const [step, setStep] = useState<'check-in' | 'form' | 'compliance' | 'missed'>('check-in');
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [geoStatus, setGeoStatus] = useState<'Passed' | 'Failed' | 'Checking'>('Checking');
  const [distance, setDistance] = useState<string>('48m');
  const [formData, setFormData] = useState<Partial<VisitData>>({
    outletId: outlet.id,
    purpose: [],
    simsRegistered: 0,
    floatAmount: 0,
    cashAdequate: true,
    brandingCompliant: 'Yes',
    pricingCompliant: true,
    competitors: [],
    riskFlags: [],
    notes: '',
    competitorOffers: '',
    serviceIssues: '',
    customerFeedback: '',
    // FR23 Prospecting
    customerType: 'Individual',
    productPitched: '',
    interestLevel: 'Medium',
    followUpDate: '',
    contactDetails: '',
    // FR18, FR8
    photoCaptured: false,
    manualLocation: false,
  });

  useEffect(() => {
    if (step === 'check-in') {
      const timer = setTimeout(() => {
        setGeoStatus('Passed');
        setCheckInTime(new Date().toLocaleTimeString());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handlePurposeChange = (purpose: string) => {
    const current = formData.purpose || [];
    if (current.includes(purpose)) {
      setFormData({ ...formData, purpose: current.filter(p => p !== purpose) });
    } else {
      setFormData({ ...formData, purpose: [...current, purpose] });
    }
  };

  const validateStep = (currentStep: typeof step) => {
    if (currentStep === 'form') {
      const purposes = formData.purpose || [];
      if (purposes.length === 0) {
        alert('Please select at least one visit purpose.');
        return false;
      }
      if (purposes.includes('Float & cash check')) {
        if (formData.floatAmount === undefined || formData.floatAmount < 0) {
          alert('Float amount is mandatory for float checks.');
          return false;
        }
      }
      if (purposes.includes('SIM registrations')) {
        if (formData.simsRegistered === undefined || formData.simsRegistered < 0) {
          alert('SIM registration count is mandatory.');
          return false;
        }
      }
      if (purposes.includes('Prospecting')) {
        if (!formData.productPitched || !formData.contactDetails) {
          alert('Product Pitched and Contact Details are mandatory for Prospecting visits.');
          return false;
        }
      }
    }
    if (currentStep === 'compliance') {
      if (!formData.photoCaptured) {
        alert('Proof of Visit (Photo) is mandatory. Please capture a photo to proceed.');
        return false;
      }
      if (!formData.notes || formData.notes.length < 5) {
        alert('Please provide detailed notes (min 5 characters).');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = (next: typeof step) => {
    if (validateStep(step)) {
      setStep(next);
    }
  };

  const handleSubmit = () => {
    if (validateStep('compliance')) {
      onSubmit(formData as VisitData);
    }
  };

  const handleMissedSubmit = () => {
    if (!formData.reasonForMissedVisit) {
      alert('Reason for missed visit is mandatory.');
      return;
    }
    onSubmit(formData as VisitData);
  };

  const handleCompetitorChange = (comp: string) => {
    const current = formData.competitors || [];
    if (current.includes(comp)) {
      setFormData({ ...formData, competitors: current.filter(c => c !== comp) });
    } else {
      setFormData({ ...formData, competitors: [...current, comp] });
    }
  };

  const handleRiskFlagChange = (flag: string) => {
    const current = formData.riskFlags || [];
    if (current.includes(flag)) {
      setFormData({ ...formData, riskFlags: current.filter(f => f !== flag) });
    } else {
      setFormData({ ...formData, riskFlags: [...current, flag] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-surface w-full h-full lg:h-auto lg:max-w-4xl lg:max-h-[90vh] rounded-none lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-primary text-white flex justify-between items-center">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Field Session</div>
            <h2 className="text-lg lg:text-xl font-display font-black truncate max-w-[200px] sm:max-w-none">{outlet.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <XCircle size={20} />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="flex border-b border-black/5 bg-white">
          {[
            { id: 'check-in', label: '1. Arrival' },
            { id: 'form', label: '2. Metrics' },
            { id: 'compliance', label: '3. Verification' },
            { id: 'missed', label: 'Missed' }
          ].filter(s => step === 'missed' ? s.id === 'missed' : s.id !== 'missed').map((s, i) => (
            <div 
              key={s.id}
              className={`flex-1 py-3 text-center text-[9px] font-black uppercase tracking-widest transition-all relative ${
                step === s.id ? 'text-primary' : 'text-on-surface-variant/30'
              }`}
            >
              {s.label}
              {step === s.id && <motion.div layoutId="visit-progress" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            {step === 'check-in' && (
              <motion.div 
                key="check-in"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 lg:space-y-8 max-w-lg mx-auto py-4 lg:py-8"
              >
                <div className="text-center space-y-4">
                  <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all ${
                    geoStatus === 'Passed' ? 'bg-rag-green-bg text-rag-green' : 
                    geoStatus === 'Failed' ? 'bg-rag-red-bg text-rag-red' : 'bg-surface-container text-primary animate-pulse'
                  }`}>
                    {geoStatus === 'Passed' ? <CheckCircle2 size={40} /> : 
                     geoStatus === 'Failed' ? <AlertTriangle size={40} /> : <Navigation size={40} />}
                  </div>
                  <h3 className="text-xl font-bold">Route Validation</h3>
                  <p className="text-sm text-on-surface-variant">System is auto-verifying your location against the outlet geo-fence.</p>
                </div>

                <div className="card-base p-6 space-y-4 bg-surface-container-low">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-on-surface-variant">Your Location</span>
                    <span className={`text-xs font-bold ${geoStatus === 'Passed' ? 'text-rag-green' : 'text-rag-red'}`}>
                      {geoStatus === 'Passed' ? 'In Territory' : geoStatus === 'Failed' ? 'Out of Bounds' : 'Verifying...'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-on-surface-variant">Distance to Outlet</span>
                    <span className="text-xs font-bold">{distance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-on-surface-variant">Geo-fence Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      geoStatus === 'Passed' ? 'bg-rag-green text-white' : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      {geoStatus === 'Passed' ? 'PASSED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-black/5">
                    <span className="text-xs font-bold text-on-surface-variant">Check-in Time</span>
                    <span className="text-xs font-bold font-mono">{checkInTime || '--:--:--'}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="manualLoc"
                      checked={formData.manualLocation}
                      onChange={(e) => setFormData({ ...formData, manualLocation: e.target.checked })}
                      className="w-4 h-4 rounded border-black/10 text-rag-amber focus:ring-rag-amber"
                    />
                    <label htmlFor="manualLoc" className="text-[10px] font-bold text-rag-amber uppercase tracking-wider">
                      Use Offline Manual Location (FR8)
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    disabled={geoStatus !== 'Passed' && !formData.manualLocation}
                    onClick={() => handleNextStep('form')}
                    className="btn btn-primary w-full py-4 shadow-xl disabled:opacity-50 disabled:grayscale transition-all"
                  >
                    {formData.manualLocation ? 'Override: Start Visit' : 'Confirm Check-In & Start Visit'}
                  </button>
                  <button 
                    onClick={() => setStep('missed')}
                    className="btn btn-ghost w-full py-3 text-rag-red hover:bg-rag-red-bg"
                  >
                    Mark as Missed Visit
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'missed' && (
              <motion.div 
                key="missed"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 max-w-lg mx-auto py-8"
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-rag-red-bg text-rag-red rounded-full mx-auto flex items-center justify-center border-4 border-rag-red">
                    <XCircle size={40} />
                  </div>
                  <h3 className="text-xl font-bold">Missed Visit Justification</h3>
                  <p className="text-sm text-on-surface-variant font-medium">Missed visits require an explicit justification for upper management review.</p>
                </div>

                <div className="space-y-5 bg-surface-container-low p-6 rounded-2xl border border-black/5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Mandatory Reason</label>
                    <select 
                      required
                      value={formData.reasonForMissedVisit || ''}
                      onChange={(e) => setFormData({ ...formData, reasonForMissedVisit: e.target.value })}
                      className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-sm font-semibold"
                    >
                      <option value="">-- Select Reason --</option>
                      <option value="Outlet Closed / Shutters Down">Outlet Closed / Shutters Down</option>
                      <option value="Agent Unavailable / Out of Station">Agent Unavailable / Out of Station</option>
                      <option value="Security Risk / Violence">Security Risk / Violence</option>
                      <option value="Medical Emergency">Medical Emergency</option>
                      <option value="Vehicle Breakdown">Vehicle Breakdown</option>
                      <option value="Route Impassable (Weather/Roads)">Route Impassable (Weather/Roads)</option>
                      <option value="Incorrect Geo-tag / GPS Error">Incorrect Geo-tag / GPS Error</option>
                      <option value="Other">Other (Please specify below)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Detailed Justification (Mandatory)</label>
                    <textarea 
                      required
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Provide specific details about why the visit was missed. This will be reviewed by your Team Leader and TDR."
                      className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none min-h-[120px] resize-none text-sm font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-rag-amber-bg/30 rounded-xl border border-rag-amber/20">
                    <AlertTriangle size={14} className="text-rag-amber shrink-0" />
                    <span className="text-[9px] font-bold text-rag-amber uppercase leading-tight">
                      Submission will be logged with your current GPS coordinates.
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep('check-in')}
                    className="flex-1 btn btn-ghost py-4 text-xs font-bold uppercase tracking-widest"
                  >
                    Back
                  </button>
                  <button 
                    disabled={!formData.reasonForMissedVisit || !formData.notes || formData.notes.length < 10}
                    onClick={handleMissedSubmit}
                    className="flex-[2] btn btn-primary py-4 shadow-xl bg-rag-red hover:bg-red-800 disabled:opacity-50 transition-all font-bold uppercase tracking-widest text-xs"
                  >
                    Submit Justification
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Clock size={20} className="text-primary" /> Visit Purpose
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {['Float & cash check', 'SIM registrations', 'Agent recruitment', 'Prospecting', 'Stock management'].map(p => (
                        <div key={p}>
                          <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer hover:border-primary/30 transition-all ${formData.purpose?.includes(p) ? 'bg-primary/5 border-primary/20' : 'bg-surface-container-low border-black/5'}`}>
                            <input 
                              type="checkbox" 
                              checked={formData.purpose?.includes(p)}
                              onChange={() => handlePurposeChange(p)}
                              className="w-5 h-5 rounded border-black/10 text-primary focus:ring-primary"
                            />
                            <span className="text-sm font-semibold">{p}</span>
                          </label>

                          {/* ── Conditional fields per purpose ── */}
                          {p === 'Agent recruitment' && formData.purpose?.includes(p) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 ml-4 pl-4 border-l-2 border-primary/20 space-y-3"
                            >
                              <div>
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Agent Name *</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Chanda Mwila"
                                  value={formData.agentName || ''}
                                  onChange={e => setFormData({ ...formData, agentName: e.target.value })}
                                  className="w-full p-3 rounded-xl border border-black/10 bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Phone Number</label>
                                <input
                                  type="tel"
                                  placeholder="e.g. 0977 XXX XXX"
                                  value={formData.agentPhone || ''}
                                  onChange={e => setFormData({ ...formData, agentPhone: e.target.value })}
                                  className="w-full p-3 rounded-xl border border-black/10 bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Location / Area</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Cairo Road, Lusaka"
                                  value={formData.agentLocation || ''}
                                  onChange={e => setFormData({ ...formData, agentLocation: e.target.value })}
                                  className="w-full p-3 rounded-xl border border-black/10 bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                />
                              </div>
                            </motion.div>
                          )}

                          {p === 'Prospecting' && formData.purpose?.includes(p) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 ml-4 pl-4 border-l-2 border-primary/20 space-y-3"
                            >
                              <div>
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">New Prospects Found</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={formData.newProspects ?? 0}
                                  onChange={e => setFormData({ ...formData, newProspects: parseInt(e.target.value) || 0 })}
                                  className="w-full p-3 rounded-xl border border-black/10 bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Contact Details</label>
                                <input
                                  type="text"
                                  placeholder="Phone or name of key prospect"
                                  value={formData.contactDetails || ''}
                                  onChange={e => setFormData({ ...formData, contactDetails: e.target.value })}
                                  className="w-full p-3 rounded-xl border border-black/10 bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                />
                              </div>
                            </motion.div>
                          )}

                          {p === 'Stock management' && formData.purpose?.includes(p) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 ml-4 pl-4 border-l-2 border-primary/20 space-y-3"
                            >
                              <div>
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Stock Level</label>
                                <select
                                  value={formData.stockLevel || 'Adequate'}
                                  onChange={e => setFormData({ ...formData, stockLevel: e.target.value as any })}
                                  className="w-full p-3 rounded-xl border border-black/10 bg-white text-sm focus:border-primary outline-none"
                                >
                                  <option>Adequate</option>
                                  <option>Low</option>
                                  <option>Out of Stock</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Stock Notes</label>
                                <textarea
                                  rows={2}
                                  placeholder="SIM cards, float receipts, branding materials..."
                                  value={formData.stockNotes || ''}
                                  onChange={e => setFormData({ ...formData, stockNotes: e.target.value })}
                                  className="w-full p-3 rounded-xl border border-black/10 bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                                />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <TrendingUp size={20} className="text-primary" /> Sales & Liquidity
                    </h3>
                    <div className="card-base p-4 sm:p-5 space-y-5 rounded-2xl bg-white border border-black/5">
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">SIMs Sold / Registered</label>
                          <span className="text-[10px] font-black text-primary uppercase">Current: {formData.simsRegistered || 0} of 10</span>
                        </div>
                        <input 
                          type="number" 
                          value={formData.simsRegistered === 0 ? '' : formData.simsRegistered}
                          placeholder="0"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === '') { setFormData({ ...formData, simsRegistered: 0 }); return; }
                            const val = parseInt(raw, 10);
                            if (!isNaN(val)) setFormData({ ...formData, simsRegistered: val });
                          }}
                          className="w-full bg-surface-container-low border border-black/5 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                        <div className="flex justify-between items-center px-1">
                          <span className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-widest italic">Target: 10 units</span>
                          <span className="text-[9px] font-black text-rag-green uppercase">Balance: {Math.max(0, 10 - (formData.simsRegistered || 0))} REMAINING</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Float Check Allocation (ZMW)</label>
                          <span className="text-[10px] font-black text-primary uppercase">Current: {formData.floatAmount || 0} of 5,000</span>
                        </div>
                        <input 
                          type="number" 
                          value={formData.floatAmount === 0 ? '' : formData.floatAmount}
                          placeholder="0"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === '') { setFormData({ ...formData, floatAmount: 0 }); return; }
                            const val = parseInt(raw, 10);
                            if (!isNaN(val)) setFormData({ ...formData, floatAmount: val });
                          }}
                          className="w-full bg-surface-container-low border border-black/5 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                        <div className="flex justify-between items-center px-1">
                          <span className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-widest italic">Target: K5,000</span>
                          <span className="text-[9px] font-black text-rag-green uppercase">Balance: K{Math.max(0, 5000 - (formData.floatAmount || 0)).toLocaleString()} REMAINING</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Pricing Compliance</label>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setFormData({ ...formData, pricingCompliant: true })}
                            className={`px-4 py-2 rounded-xl text-xs font-bold ${formData.pricingCompliant ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}
                          >
                            Compliant
                          </button>
                          <button 
                            onClick={() => setFormData({ ...formData, pricingCompliant: false })}
                            className={`px-4 py-2 rounded-xl text-xs font-bold ${!formData.pricingCompliant ? 'bg-rag-red text-white' : 'bg-surface-container text-on-surface-variant'}`}
                          >
                            Non-Compliant
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Risk / Fraud Flags</label>
                        <div className="flex flex-wrap gap-2">
                          {['Suspicious Activity', 'ID Mismatch', 'Unusual Volume', 'Multiple Denials'].map(f => (
                            <button 
                              key={f}
                              onClick={() => handleRiskFlagChange(f)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                                formData.riskFlags?.includes(f) ? 'bg-rag-amber text-white' : 'bg-surface-container text-on-surface-variant'
                              }`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <button 
                    onClick={() => handleNextStep('compliance')}
                    className="btn btn-primary py-4 px-12 shadow-xl flex items-center gap-2"
                  >
                    Save & Continue <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'compliance' && (
              <motion.div 
                key="compliance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Camera size={20} className="text-primary" /> Proof of Visit
                    </h3>
                    <div 
                      onClick={() => setFormData({ ...formData, photoCaptured: true })}
                      className={`aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 group transition-all cursor-pointer ${
                        formData.photoCaptured ? 'border-rag-green bg-rag-green-bg/50' : 'border-black/10 bg-surface-container-low hover:border-primary/30'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform ${
                        formData.photoCaptured ? 'bg-rag-green text-white' : 'bg-primary/10 text-primary group-hover:scale-110'
                      }`}>
                        {formData.photoCaptured ? <CheckCircle2 size={32} /> : <Camera size={32} />}
                      </div>
                      <div className="text-center px-4">
                        <div className="text-sm font-bold">{formData.photoCaptured ? 'Photo Captured Successfully' : 'Capture Geo-tagged Photo'}</div>
                        <div className="text-[10px] text-on-surface-variant font-semibold mt-1">
                          {formData.photoCaptured ? 'Image verified & time-stamped' : 'Mandatory for visit submission'}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 p-3 rounded-xl bg-rag-green-bg text-rag-green text-[10px] font-bold flex items-center gap-2">
                        <CheckCircle2 size={14} /> GPS tag auto-attached
                      </div>
                      <div className="flex-1 p-3 rounded-xl bg-rag-green-bg text-rag-green text-[10px] font-bold flex items-center gap-2">
                        <CheckCircle2 size={14} /> Outlet match within 50m
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <AlertTriangle size={20} className="text-primary" /> Market Intelligence
                    </h3>
                    <div className="card-base p-6 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Branding Availability</label>
                        <select 
                          value={formData.brandingCompliant}
                          onChange={(e) => setFormData({ ...formData, brandingCompliant: e.target.value as any })}
                          className="w-full bg-surface-container border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                        >
                          <option value="Yes">Yes - Fully Branded</option>
                          <option value="Partial">Partial - Needs Update</option>
                          <option value="No">No - Branding Missing</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Competitor Presence</label>
                        <div className="flex flex-wrap gap-2">
                          {['MTN', 'Airtel', 'Liquid', 'MTN MoMo'].map(c => (
                            <button 
                              key={c}
                              onClick={() => handleCompetitorChange(c)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                formData.competitors?.includes(c) ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Competitor Offers & Activity</label>
                        <select
                          value={formData.competitorOffers || ''}
                          onChange={(e) => setFormData({ ...formData, competitorOffers: e.target.value })}
                          className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                        >
                          <option value="">-- Select --</option>
                          <option value="Price discount on SIMs">Price discount on SIMs</option>
                          <option value="Free airtime promotions">Free airtime promotions</option>
                          <option value="Data bundle offers">Data bundle offers</option>
                          <option value="Agent commission increase">Agent commission increase</option>
                          <option value="MoMo cashback campaign">MoMo cashback campaign</option>
                          <option value="New outlet branding">New outlet branding</option>
                          <option value="No competitor activity">No competitor activity</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Service Issues</label>
                        <select
                          value={formData.serviceIssues || ''}
                          onChange={(e) => setFormData({ ...formData, serviceIssues: e.target.value })}
                          className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                        >
                          <option value="">-- Select --</option>
                          <option value="Network outage">Network outage</option>
                          <option value="Slow network / connectivity">Slow network / connectivity</option>
                          <option value="SIM activation failure">SIM activation failure</option>
                          <option value="MoMo transaction errors">MoMo transaction errors</option>
                          <option value="Float top-up delay">Float top-up delay</option>
                          <option value="App / system crash">App / system crash</option>
                          <option value="No issues reported">No issues reported</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Customer Feedback</label>
                        <select
                          value={formData.customerFeedback || ''}
                          onChange={(e) => setFormData({ ...formData, customerFeedback: e.target.value })}
                          className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                        >
                          <option value="">-- Select --</option>
                          <option value="Satisfied with service">Satisfied with service</option>
                          <option value="Needs more float / stock">Needs more float / stock</option>
                          <option value="Requesting better network">Requesting better network</option>
                          <option value="Wants new products">Wants new products</option>
                          <option value="Complaints about pricing">Complaints about pricing</option>
                          <option value="Agent requesting support">Agent requesting support</option>
                          <option value="No feedback">No feedback</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">General Notes</label>
                        <select
                          value={formData.notes || ''}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                        >
                          <option value="">-- Select --</option>
                          <option value="Visit went smoothly">Visit went smoothly</option>
                          <option value="Agent needs training">Agent needs training</option>
                          <option value="Outlet relocation needed">Outlet relocation needed</option>
                          <option value="High potential area">High potential area</option>
                          <option value="Follow-up required">Follow-up required</option>
                          <option value="Escalation needed">Escalation needed</option>
                          <option value="Nothing to report">Nothing to report</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <button 
                    onClick={handleSubmit}
                    className="btn btn-primary py-4 px-12 shadow-xl flex items-center gap-2 bg-rag-green hover:bg-green-800"
                  >
                    Submit Visit <Send size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default VisitModule;
