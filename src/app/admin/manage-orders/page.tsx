export const dynamic = 'force-dynamic';
import getOrders from '@/actions/getOrders';
import ManageOrdersClient from './ManagerOrdersClient';
import { getCurrentUser } from '@/actions/getCurrentUser';
import NullData from '@/app/components/NullData';
import Container from '@/app/components/Container';

const ManageOrders = async () => {
  const orders = await getOrders();
  const currentUser = await getCurrentUser();

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
};

export default ManageOrders;
