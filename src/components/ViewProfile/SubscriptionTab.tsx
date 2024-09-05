import React, { useEffect, useState } from 'react';
import { getSubscribeds, getUserData } from '../../utils/commonImports';
import { Card, Row, Col } from 'antd';

interface Subscription {
  _id: string;
  name: string;
  instructor_id: string;
}

interface UserData {
  _id: string;
  name: string;
  avatar: string;
  phone_number: string;
  email: string;
}

const SubscriptionTab: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [userDetails, setUserDetails] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const subscribedsResponse = await getSubscribeds({ keyword: '', is_delete: false }, 1, 10);
      setSubscriptions(subscribedsResponse.pageData);
      const userDetailsPromises = subscribedsResponse.pageData.map((subscription: Subscription) =>
        getUserData(subscription.instructor_id)
      );

      const userDetailsResponse = await Promise.all(userDetailsPromises);
      setUserDetails(userDetailsResponse);
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <Row gutter={[16, 16]}>
        {userDetails.map((user) => (
          <Col key={user._id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={<img alt="avatar" src={user.avatar} />}
            >
              <Card.Meta
                title={user.name}
                description={
                  <>
                    <p>Phone: {user.phone_number}</p>
                    <p>Email: {user.email}</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
      <ul className="mt-4 space-y-2">
        {subscriptions.map((subscription) => (
          <li key={subscription._id} className="bg-gray-100 p-2 rounded-md">{subscription.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionTab;
