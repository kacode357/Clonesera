import React, { useState } from 'react';
import RequestPaid from '../../components/Admin/PayoutManagement/RequestPaid';
import Completed from '../../components/Admin/PayoutManagement/Completed';
import Rejected from '../../components/Admin/PayoutManagement/Rejected';

const tabs = [
    { name: 'Request_Paid', key: 'request_paid' },
    { name: 'Completed', key: 'completed' },
    { name: 'Rejected', key: 'rejected' },
];

const PayoutManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('request_paid');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'request_paid':
                return <RequestPaid />;
            case 'completed':
                return <Completed />;
            case 'rejected':
                return <Rejected />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6">
            <nav className="space-x-4 border-b mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`py-2 px-4 text-sm font-medium ${activeTab === tab.key
                            ? 'text-green-500 border-b-2 border-green-500'
                            : 'text-gray-500'
                            }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </nav>
            {renderTabContent()}
        </div>
    );
};

export default PayoutManagement;
