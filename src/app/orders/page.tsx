export const revalidate = 0;
import { getCurrentUser } from '@/actions/getCurrentUser';
import NullData from '../components/NullData';
import getOrdersByUserId from '@/actions/getOrdersByUserId';
import Container from '../components/Container';
import OrdersClient from './OrdersClient';

const Orders = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <NullData title="Oops! Access Denied" />;
  }
  const orders = await getOrdersByUserId(currentUser.id);

  if (!orders || orders.length === 0) {
    return <NullData title="No orders yet" />;
  }

  return (
    <div className="pt-8">
      <Container>
        <OrdersClient orders={orders} />
      </Container>
    </div>
  );
};

export default Orders;
