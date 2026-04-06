import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import useOrderManagement from "../../../hooks/orders/useOrderManagement";
import styles from "./OrderManagementPage.module.css";
import type { OrderDTO } from "../../../types/orderType";

export default function OrderManagementPage() {
  const { orders, loading, error, currentPage, totalPages, fetchOrders, handleApproveOrder } = useOrderManagement();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);

  const onApprove = async (orderId: string) => {
    setSuccessMsg(null);
    if (!window.confirm("Are you sure you want to approve this order?")) return;
    const success = await handleApproveOrder(orderId, true);
    if (success) {
      setSuccessMsg(`Successfully approved order #${orderId.substring(0, 8)}`);
    }
  };

  const onReject = async (orderId: string) => {
    setSuccessMsg(null);
    if (!window.confirm("Are you sure you want to reject this order?")) return;
    const success = await handleApproveOrder(orderId, false);
    if (success) {
      setSuccessMsg(`Successfully rejected order #${orderId.substring(0, 8)}`);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) fetchOrders(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) fetchOrders(currentPage - 1);
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerTitleContainer}>
          <h1 className={styles.title}>Order Management</h1>
          <p className={styles.subtitle}>Review and approve stock trading orders.</p>
        </div>
      </header>

      {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}
      {successMsg && <div className={`${styles.message} ${styles.success}`}>{successMsg}</div>}

      <div className={styles.tableCard}>
        <div className={styles.tableHeaderSection}>
          <h2 className={styles.tableTitle}>Pending Orders</h2>
        </div>

        {loading ? (
          <div className={styles.loader}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>No orders found.</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Portfolio / Account</th>
                  <th>Symbol</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Total (฿)</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: OrderDTO) => (
                  <tr key={order.id} onClick={() => setSelectedOrder(order)} className={styles.clickableRow}>
                    <td>
                      <span className={styles.idBadge}>{order.id?.substring(0, 8)}...</span>
                    </td>
                    <td className={styles.dateCell}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</td>
                    <td>
                      <div>Port: <span className={styles.idBadge}>{order.portfolio?.accountNumber?.substring(0, 8) || order.portfolioId?.substring(0, 8)}</span></div>
                      <div style={{ marginTop: "4px" }}>Acc: <span className={styles.idBadge}>{order.accountId?.substring(0, 8)}</span></div>
                    </td>
                    <td><span className={styles.symbolBadge}>{order.symbol || order.stock?.symbol}</span></td>
                    <td>
                      <span className={`${styles.typeBadge} ${order.type === 'BUY' ? styles.typeBuy : styles.typeSell}`}>
                        {order.type}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${
                        ['APPROVED', 'OPEN', 'FILLED'].includes((order as any).status) ? styles.statusApproved : 
                        ['REJECTED', 'CANCELLED'].includes((order as any).status) ? styles.statusRejected : styles.statusPending
                      }`}>
                        {(order as any).status || "PENDING"}
                      </span>
                    </td>
                    <td>{order.amount} shares</td>
                    <td>{order.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className={styles.totalCell}>
                      {((order.amount || 0) * (order.price || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      {['OPEN', 'CANCELLED', 'APPROVED', 'REJECTED', 'FILLED'].includes((order as any).status) ? (
                        <div style={{ textAlign: 'right', color: '#888', fontSize: '0.85rem' }}>-</div>
                      ) : (
                        <div className={styles.actionButtons}>
                          <button
                            className={`${styles.iconBtn} ${styles.approveBtn}`}
                            title="Approve Order"
                            onClick={(e) => { e.stopPropagation(); onApprove(order.id || ""); }}
                          >
                            <CheckCircle size={18} /> Approve
                          </button>
                          <button
                            className={`${styles.iconBtn} ${styles.rejectBtn}`}
                            title="Reject Order"
                            onClick={(e) => { e.stopPropagation(); onReject(order.id || ""); }}
                          >
                            <XCircle size={18} /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className={styles.pageBtn}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className={styles.pageBtn}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Order Details</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Order ID</span>
                <span className={styles.detailValue}>{selectedOrder.id}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Date</span>
                <span className={styles.detailValue}>{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "-"}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Portfolio ID</span>
                <span className={styles.detailValue}>{selectedOrder.portfolio?.accountNumber || selectedOrder.portfolioId}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Account ID</span>
                <span className={styles.detailValue}>{selectedOrder.accountId}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Symbol</span>
                <span className={styles.detailValue} style={{ fontWeight: "bold", color: "#1a73e8" }}>{selectedOrder.symbol || selectedOrder.stock?.symbol}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Type</span>
                <span className={`${styles.typeBadge} ${selectedOrder.type === 'BUY' ? styles.typeBuy : styles.typeSell}`}>
                  {selectedOrder.type}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status</span>
                <span className={`${styles.statusBadge} ${
                  ['APPROVED', 'OPEN', 'FILLED'].includes((selectedOrder as any).status) ? styles.statusApproved : 
                  ['REJECTED', 'CANCELLED'].includes((selectedOrder as any).status) ? styles.statusRejected : styles.statusPending
                }`}>
                  {(selectedOrder as any).status || "PENDING"}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Amount</span>
                <span className={styles.detailValue}>{selectedOrder.amount} shares</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Price</span>
                <span className={styles.detailValue}>{selectedOrder.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Total (฿)</span>
                <span className={styles.detailValue} style={{ fontWeight: "bold" }}>
                  {((selectedOrder.amount || 0) * (selectedOrder.price || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿
                </span>
              </div>
            </div>
            <div className={styles.modalFooter}>
              {!['OPEN', 'CANCELLED', 'APPROVED', 'REJECTED', 'FILLED'].includes((selectedOrder as any).status) && (
                <>
                  <button
                    className={`${styles.iconBtn} ${styles.approveBtn}`}
                    onClick={() => { onApprove(selectedOrder.id || ""); setSelectedOrder(null); }}
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button
                    className={`${styles.iconBtn} ${styles.rejectBtn}`}
                    onClick={() => { onReject(selectedOrder.id || ""); setSelectedOrder(null); }}
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
