export const dynamic = 'force-dynamic';
import getOrders from '@/actions/getOrders';
import ManageOrdersClient from './ManagerOrdersClient';
import { getCurrentUser } from '@/actions/getCurrentUser';
import NullData from '@/app/components/NullData';
import Container from '@/app/components/Container';

const ManageOrders = async () => {
  try {
    const [orders, currentUser] = await Promise.all([
      getOrders(),
      getCurrentUser(),
    ]);

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return <NullData title="Oops! Access denied" />;
    }

    return (
      <div className="pt-8">
        <Container>
          <ManageOrdersClient orders={orders} />
        </Container>
      </div>
    );
  } catch (error) {
    console.error('Failed to load admin data:', error);
    return (
      <NullData title="Failed to load data. Please try again." />
    );
  }
};

export default ManageOrders;
