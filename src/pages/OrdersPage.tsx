// /Users/azriel/Project/bissolf/src/pages/OrdersPage.tsx

import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ExcelJS from 'exceljs';
import { 
  Download, 
  ChevronRight, 
  AlertTriangle, 
  MapPin, 
  CreditCard, 
  Eye, 
  X, 
  Package, 
  User, 
  Phone 
} from 'lucide-react';
import type { OrderStatus, Order } from '../types';

export const OrdersPage = () => {
  const { orders, products, updateOrderStatus } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusStyle = (status: OrderStatus) => {
    switch(status) {
      case 'Packaging': return 'bg-orange-100 text-orange-700';
      case 'Ready to Send': return 'bg-blue-100 text-blue-700';
      case 'On Delivery': return 'bg-purple-100 text-purple-700';
      case 'Done': return 'bg-green-100 text-green-700';
      case 'Canceled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const nextStatus: Record<OrderStatus, OrderStatus | null> = {
    'Packaging': 'Ready to Send',
    'Ready to Send': 'On Delivery',
    'On Delivery': 'Done',
    'Done': null,
    'Canceled': null
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Orders');
    
    sheet.columns = [
      { header: 'Order ID', key: 'id', width: 20 },
      { header: 'Product', key: 'product_name', width: 30 },
      { header: 'Buyer', key: 'buyer_name', width: 20 },
      { header: 'Phone', key: 'buyer_phone', width: 15 },
      { header: 'Address', key: 'buyer_location', width: 40 },
      { header: 'Payment Method', key: 'payment_method', width: 15 },
      { header: 'Qty', key: 'quantity', width: 10 },
      { header: 'Total', key: 'total_price', width: 15 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Cancel Reason', key: 'cancel_reason', width: 30 },
    ];

    orders.forEach(order => {
      sheet.addRow({
        ...order,
        cancel_reason: order.cancel_reason || '-'
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bissolf_orders_report.xlsx';
    a.click();
  };

  // Helper untuk mendapatkan URL gambar berdasarkan ID Produk di order
  const getProductImage = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.image_url;
  };

  return (
    <div className="p-6 relative">
      
      {/* --- DETAIL ORDER MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">DETAIL PESANAN</h3>
                <p className="text-xs text-blue-600 font-mono font-bold mt-1">{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-2 bg-white hover:bg-red-50 hover:text-red-600 rounded-full border border-gray-100 transition shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Product Image Section */}
                <div className="w-full md:w-1/3 shrink-0">
                  <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center relative shadow-inner">
                    {getProductImage(selectedOrder.id_product) ? (
                      <img 
                        src={getProductImage(selectedOrder.id_product)} 
                        alt={selectedOrder.product_name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <Package size={48} className="mx-auto mb-2 opacity-50" />
                        <span className="text-[10px] uppercase font-black tracking-widest">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-md">
                      x{selectedOrder.quantity}
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <h4 className="font-bold text-gray-900 text-sm">{selectedOrder.product_name}</h4>
                    <p className="text-blue-600 font-black text-lg mt-1">
                      Rp {selectedOrder.total_price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Status Pesanan</span>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${getStatusStyle(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  {/* Buyer Info Grid */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0"><User size={16} /></div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Nama Pembeli</p>
                        <p className="font-bold text-gray-900 text-sm">{selectedOrder.buyer_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 text-green-600 rounded-lg shrink-0"><Phone size={16} /></div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Nomor Telepon</p>
                        <p className="font-bold text-gray-900 text-sm">{selectedOrder.buyer_phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg shrink-0"><MapPin size={16} /></div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Lokasi Pengiriman</p>
                        <p className="font-bold text-gray-900 text-sm leading-relaxed">{selectedOrder.buyer_location || "-"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-lg shrink-0"><CreditCard size={16} /></div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Metode Pembayaran</p>
                        <p className="font-bold text-gray-900 text-sm">{selectedOrder.payment_method}</p>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.status === 'Canceled' && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-3">
                      <AlertTriangle className="text-red-500 shrink-0" size={20} />
                      <div>
                        <p className="text-xs font-black text-red-600 uppercase">Dibatalkan Karena:</p>
                        <p className="text-sm text-red-700 mt-1">{selectedOrder.cancel_reason}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 text-[10px] text-gray-400 font-medium text-center">
                    Order Created: {new Date(selectedOrder.created_at).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PAGE HEADER --- */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">ORDER MANAGEMENT</h2>
        <button onClick={exportToExcel} className="bg-green-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-green-700 shadow-lg shadow-green-100 transition font-bold">
          <Download size={18} /> Export Excel
        </button>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-100">
              <th className="p-6">Order ID</th>
              <th className="p-6">Produk & Pembeli</th>
              <th className="p-6">Lokasi & Pembayaran</th>
              <th className="p-6">Total Tagihan</th>
              <th className="p-6">Status & Info</th>
              <th className="p-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition">
                <td className="p-6 font-mono text-xs text-blue-600 font-bold">{order.id}</td>
                <td className="p-6">
                  <div className="font-bold text-gray-900">{order.product_name}</div>
                  <div className="text-xs text-gray-400 font-medium">{order.buyer_name} • {order.buyer_phone}</div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-1.5">
                      <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-xs text-gray-600 font-bold line-clamp-2 w-48" title={order.buyer_location}>
                        {order.buyer_location || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CreditCard size={12} className="text-gray-400 shrink-0" />
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                        {order.payment_method}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-6 font-black text-gray-900">Rp {order.total_price.toLocaleString()}</td>
                <td className="p-6">
                  <div className="flex flex-col gap-2">
                    <span className={`w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                    {order.status === 'Canceled' && (
                      <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-bold italic">
                        <AlertTriangle size={12} /> Alasan: {order.cancel_reason}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* View Details Button */}
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 hover:text-gray-900 transition"
                      title="Lihat Detail"
                    >
                      <Eye size={16} />
                    </button>

                    {/* Action Button */}
                    {nextStatus[order.status] ? (
                      <button 
                        onClick={() => updateOrderStatus(order.id, nextStatus[order.status]!)}
                        className="text-xs font-black bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 flex items-center gap-2 transition shadow-md hover:shadow-blue-200"
                      >
                        Update: {nextStatus[order.status]} <ChevronRight size={14} />
                      </button>
                    ) : (
                      <span className={`text-xs font-black px-3 py-2 rounded-xl border ${order.status === 'Canceled' ? 'border-red-100 text-red-400 bg-red-50' : 'border-green-100 text-green-500 bg-green-50'}`}>
                        {order.status === 'Canceled' ? 'BATAL' : 'SELESAI'}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest">No Orders Yet.</div>}
      </div>
    </div>
  );
};