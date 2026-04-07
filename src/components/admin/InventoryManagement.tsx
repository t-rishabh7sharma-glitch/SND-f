import React from 'react';
import { Server } from 'lucide-react';

const InventoryManagement: React.FC = () => {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-primary mb-1">Inventory Management</h1>
        <p className="text-on-surface-variant text-sm">System inventory placeholder (future reference)</p>
      </div>

      <div className="card-base p-16 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center">
          <Server size={32} className="text-on-surface-variant" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Module Not Active</h2>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto mt-2">
            This module has been added to the navigation structure for future phase implementation. Active inventory management is currently handled in the legacy system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
