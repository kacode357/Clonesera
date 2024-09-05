import { React, useState } from '../../utils/commonImports';
import Subscribed from '../../components/Subscription/Subscribed';
import Subscriber from '../../components/Subscription/Subscriber';

const tabs = [
    { name: 'Subscribed', key: 'subscribed' },
    { name: 'Subscriber', key: 'subscriber' },
];

const ListSubscription: React.FC = () => {
    const [activeTab, setActiveTab] = useState('subscribed');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'subscribed':
                return <Subscribed />;
            case 'subscriber':
                return <Subscriber />;
            default:
                return null;
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <nav className="flex flex-wrap space-x-2 sm:space-x-4 border-b mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`py-2 px-3 sm:px-4 text-sm font-medium ${activeTab === tab.key
                            ? 'text-green-500 border-b-2 border-green-500'
                            : 'text-gray-500'
                            }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </nav>
            <div className="mt-4">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ListSubscription;
