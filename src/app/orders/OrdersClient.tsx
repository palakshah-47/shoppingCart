'use client';
import { Order, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { formatPrice } from '../utils/formatPrice';
import moment from 'moment';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  MdAccessTimeFilled,
  MdDeliveryDining,
  MdDone,
  MdRemoveRedEye,
} from 'react-icons/md';
import Status from '../components/Status';
import ActionBtn from '../components/ActionBtn';
import Heading from '../components/Heading';

interface OrdersClientProps {
  orders: ExtendedOrder[];
}
type ExtendedOrder = Order & {
  user: User;
};

const OrdersClient: React.FC<OrdersClientProps> = ({
  orders,
}) => {
  const router = useRouter();
  let rows: any = [];
  rows = orders.map((order: ExtendedOrder) => {
    return {
      id: order.id,
      customer: order.user.name,
      amount: formatPrice(order.amount / 100),
      paymentStatus: order.status,
      date: moment(order.createdAt).fromNow(),
      deliveryStatus: order.deliveryStatus,
    };
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 220 },
    {
      field: 'customer',
      headerName: 'Customer Name',
      width: 130,
    },
    {
      field: 'amount',
      headerName: 'Amount(USD)',
      width: 130,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">
            {params.row.amount}
          </div>
        );
      },
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      width: 130,
      renderCell: (params) => {
        return params.row.paymentStatus === 'pending' ? (
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
        );
      },
    },
    {
      field: 'deliveryStatus',
      headerName: 'Delivery Status',
      width: 130,
      renderCell: (params) => {
        return params.row.deliveryStatus === 'pending' ? (
          <Status
            text="pending"
            icon={MdAccessTimeFilled}
            bg="bg-slate-200"
            color="text-slate-700"
          />
        ) : params.row.deliveryStatus === 'dispatched' ? (
          <Status
            text="dispatched"
            icon={MdDeliveryDining}
            bg="bg-purple-200"
            color="text-purple-700"
          />
        ) : params.row.deliveryStatus === 'delivered' ? (
          <Status
            text="delivered"
            icon={MdDone}
            bg="bg-green-400"
            color="text-green-700"
          />
        ) : (
          <></>
        );
      },
    },

    {
      field: 'date',
      headerName: 'Date',
      width: 130,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full pt-2">
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => {
                router.push(`order/${params.row.id}`);
              }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8 ">
        <Heading title="Orders" center />
      </div>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 9 },
            },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default OrdersClient;
