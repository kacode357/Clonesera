import React, { useState } from 'react';
import WaitingPaid from '../components/Order/WaitingPaid';
import Completed from '../components/Order/Completed';

const tabs = [
    { name: 'Waiting Paid', key: 'waitingPaid' },
    { name: 'Completed', key: 'completed' },
];

const ViewOrder: React.FC = () => {
    const [activeTab, setActiveTab] = useState('waitingPaid');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'waitingPaid':
                return <WaitingPaid />;
            case 'completed':
                return <Completed />;
            default:
                return null;
        }
    };

    return (
        <div className="pt-0">
            <nav className="space-x-4 border-b mb-2">
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

export default ViewOrder;
