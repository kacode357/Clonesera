import React, { useState, useEffect } from 'react';
import AccountSetting from '../pages/AccountSetting';
import ChangePassword from '../pages/ChangePassword';

const SettingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Account');
    const [isGoogleUser, setIsGoogleUser] = useState(false);

    useEffect(() => {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            console.log('Google user', userData.google_id);
            if (userData.google_id) {
               
                setIsGoogleUser(true);
            }
        }
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Account':
                return <AccountSetting />;
            case 'Change Password':
                return !isGoogleUser ? <ChangePassword /> : null;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">Settings</h1>
            <div className="border-b border-gray-200">
                <ul className="flex flex-wrap -mb-px">
                    <li className="mr-2">
                        <button
                            className={`inline-block p-4 border-b-2 ${
                                activeTab === 'Account' 
                                ? 'text-green-500 border-b-2 border-green-500' 
                                : 'text-gray-500 border-transparent'
                            }`}
                            onClick={() => setActiveTab('Account')}
                        >
                            Account
                        </button>
                    </li>
                    {!isGoogleUser && (
                        <li className="mr-2">
                            <button
                                className={`inline-block p-4 border-b-2 ${
                                    activeTab === 'Change Password' 
                                    ? 'text-green-500 border-b-2 border-green-500' 
                                    : 'text-gray-500 border-transparent'
                                }`}
                                onClick={() => setActiveTab('Change Password')}
                            >
                                Change Password
                            </button>
                        </li>
                    )}
                </ul>
            </div>
            <div className="mt-4">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default SettingPage;
