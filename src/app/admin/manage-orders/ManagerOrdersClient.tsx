'use client';
import ActionBtn from '@/app/components/ActionBtn';
import Status from '@/app/components/Status';
import { formatPrice } from '@/app/utils/formatPrice';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Order, User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  MdAccessTimeFilled,
  MdDeliveryDining,
  MdDone,
  MdRemoveRedEye,
} from 'react-icons/md';

interface ManageOrdersClientProps {
  orders: ExtendedOrder[];
}

type ExtendedOrder = Order & {
  user: User;
};
const ManageOrdersClient: React.FC<
  ManageOrdersClientProps
> = ({ orders }) => {
  const router = useRouter();
  let rows: any = [];
  if (orders) {
    rows = orders.map((order) => {
      return {
        id: order.id,
        customer: order.user.name,
        amount: formatPrice(order.amount / 100),
        paymentStatus: order.status,
        date: order.createdAt.toLocaleDateString(),
        deliveryStatus: order.deliveryStatus,
      };
    });
  }
  const handleDispatch = useCallback(
    async (id: string) => {
      try {
        const filteredOrders = orders.filter(
          (order) => order.id === id,
        );
        if (filteredOrders.length === 0) {
          toast.error('Order not found');
          return;
        }
        if (filteredOrders[0].status === 'pending') {
          toast.error('Order is still pending');
          return;
        }
        const res = await axios.put('/api/order', {
          id,
          deliveryStatus: 'dispatched',
        });
        res.status === 200 &&
          toast.success('Order dispatched');
        router.refresh();
      } catch (err) {
        toast.error('Something went wrong');
        console.log(err);
      }
    },
    [orders, router],
  );

  const handleDeliver = useCallback(async (id: string) => {
    try {
      const filteredOrders = orders.filter(
        (order) => order.id === id,
      );
      if (filteredOrders.length === 0) {
        toast.error('Order not found');
        return;
      }
      if (filteredOrders[0].status === 'pending') {
        toast.error('Order is still pending');
        return;
      }
      const res = await axios.put('/api/order', {
        id,
        deliveryStatus: 'delivered',
      });
      res.status === 200 &&
        toast.success('Order delivered');
      router.refresh();
    } catch (err) {
      toast.error('Something went wrong');
      console.log(err);
    }
  }, []);
  const colmns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 220 },
    {
      field: 'customer',
      headerName: 'CustomerName',
      width: 130,
    },
    {
      field: 'amount',
      headerName: 'Amount(USD)',
      width: 130,
      renderCell: (params) => (
        <div className="font-bold text-slate-800">
          {params.row.amount}
        </div>
      ),
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      width: 130,
      renderCell: (params) => {
        return (
          <div>
            {params.row.paymentStatus === 'pending' ? (
              <Status
                text="pending"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.paymentStatus === 'complete' ? (
              <Status
                text="completed"
                icon={MdDone}
                bg="bg-green-200"
                color="text-green-700"
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      field: 'deliveryStatus',
      headerName: 'Delivery Status',
      width: 130,
      renderCell: (params) => {
        return (
          <div>
            {params.row.deliveryStatus === 'pending' ? (
              <Status
                text="pending"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.deliveryStatus ===
              'dispatched' ? (
              <Status
                text="dispatched"
                icon={MdDeliveryDining}
                bg="bg-purple-200"
                color="text-purple-700"
              />
            ) : params.row.deliveryStatus ===
              'delivered' ? (
              <Status
                text="delivered"
                icon={MdDone}
                bg="bg-green-200"
                color="text-green-700"
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    { field: 'date', headerName: 'Date', width: 150 },
    {
      field: 'action',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionBtn
              icon={MdDeliveryDining}
              onClick={() => handleDispatch(params.row.id)}
            />
            <ActionBtn
              icon={MdDone}
              onClick={() => handleDeliver(params.row.id)}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() =>
                router.push(`/order/${params.row.id}`)
              }
            />
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <DataGrid
        rows={rows}
        columns={colmns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
};

export default ManageOrdersClient;
