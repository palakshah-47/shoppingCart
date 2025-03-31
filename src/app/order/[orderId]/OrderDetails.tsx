'use client';

import { Order } from '@prisma/client';
import React from 'react';
import Heading from '@/app/components/Heading';
import { formatPrice } from '@/app/utils/formatPrice';
import {
  MdAccessTimeFilled,
  MdDeliveryDining,
  MdDone,
} from 'react-icons/md';
import Status from '@/app/components/Status';
import moment from 'moment';
import OrderItem from './OrderItem';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
}) => {
  return (
    <div className="max-w-[1150px] m-auto flex flex-col gap-2">
      <div className="mt-8">
        <Heading title="Order Details"></Heading>
      </div>
      <div>Order Id: {order.id}</div>
      <div>
        Total Amount:{' '}
        <span className="font-bold">
          {formatPrice(order.amount / 100)}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <div>Payment Status:</div>
        <div>
          {order.status === 'pending' ? (
            <Status
              text="pending"
              icon={MdAccessTimeFilled}
              bg="bg-slate-200"
              color="text-slate-700"></Status>
          ) : order.status === 'complete' ? (
            <Status
              text="completed"
              icon={MdDone}
              bg="bg-green-200"
              color="text-green-700"></Status>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div>Delivery Status:</div>
        <div>
          {order.deliveryStatus === 'pending' ? (
            <Status
              text="pending"
              icon={MdAccessTimeFilled}
              bg="bg-slate-200"
              color="text-slate-700"></Status>
          ) : order.status === 'dispatched' ? (
            <Status
              text="dispatched"
              icon={MdDeliveryDining}
              bg="bg-purple-200"
              color="text-purple-700"></Status>
          ) : order.deliveryStatus === 'delivered' ? (
            <Status
              text="delivered"
              icon={MdDone}
              bg="bg-green-200"
              color="text-green-700"></Status>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div>Date: {moment(order.createdAt).fromNow()}</div>
      <div>
        <h2 className="font-semibold mt-4 mb-2">
          Products ordered
        </h2>
        <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center">
          <div className="col-span-2 justify-self-start">
            PRODUCT
          </div>
          <div className="justify-self-start">PRICE</div>
          <div className="justify-self-start">QTY</div>
          <div className="justify-self-start">TOTAL</div>
        </div>
        {order.products &&
          order.products.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
      </div>
    </div>
  );
};

export default OrderDetails;
