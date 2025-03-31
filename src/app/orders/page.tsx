export const revalidate = 0;
import { getCurrentUser } from '@/actions/getCurrentUser';
import NullData from '../components/NullData';
import Container from '../components/Container';
import OrdersPage from './OrdersPage';

const Orders = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <NullData title="Oops! Access Denied" />;
  }

  return (
    <div className="pt-8">
      <Container>
        <OrdersPage currentUser={currentUser} />
      </Container>
    </div>
  );
};

export default Orders;
