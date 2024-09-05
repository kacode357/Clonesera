import React, { useState } from 'react';
import { Tabs, Button, Modal } from 'antd';
import DisplayAccount from './DisplayAccount';
import AccountIsVerify from './AccountIsVerify';
import CreateAccount from '../CreateAccount/CreateAccount';
import DisplayAccountbloclk from './DisplayAccountBlock';

const { TabPane } = Tabs;

const ActiveTab: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <Tabs defaultActiveKey="1" style={{ flex: 1 }}>
          <TabPane tab="All accounts" key="1">
            <DisplayAccount status={true} isDeleted={false} />
          </TabPane>
          <TabPane tab="Blocked accounts" key="2">
            <DisplayAccountbloclk status={false} isDeleted={false} />
          </TabPane>
          <TabPane tab="Unverified accounts" key="3">
            <AccountIsVerify status={true} isDeleted={false} />
          </TabPane>
        </Tabs>
        <Button
          type="primary"
          onClick={showModal}
          className='custom-button'
          style={{ marginBottom: '16px' }}
        >
          Add User
        </Button>
      </div>
      <Modal
        title="Create New Account"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={800} 
      >
        <CreateAccount />
      </Modal>
    </div>
  );
};

export default ActiveTab;
