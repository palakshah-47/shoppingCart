import Container from '@/app/components/Container';
import React from 'react';
import OrderDetails from './OrderDetails';
import { getOrderById } from '@/actions/getOrderById';
import NullData from '@/app/components/NullData';

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}
const Order = async ({ params }: OrderPageProps) => {
  const { orderId } = await params;
  const order = await getOrderById(orderId);
  if (!order) {
    return <div>Order not found</div>;
  }
  return (
    <div className="p-8">
      <Container>
        <OrderDetails order={order} />
      </Container>
    </div>
  );
};

export default Order;
