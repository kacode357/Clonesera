import React, { useState } from 'react';
import RequestPayout from '../../components/Instructor/Payout/RequestPayout';
import CompletedPayout from '../../components/Instructor/Payout/CompletedPayout';

const tabs = [
    { name: 'Request Payout', key: 'request_payout' },
    { name: 'Completed Payout', key: 'completed_payout' },
];

const Payout: React.FC = () => {
    const [activeTab, setActiveTab] = useState('request_payout');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'request_payout':
                return <RequestPayout />;
            case 'completed_payout':
                return <CompletedPayout />;
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

export default Payout;
