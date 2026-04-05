import { useEffect, useState } from "react";
import useGetPortfolioRequests from "../../../hooks/requests/useGetPortfolioRequests";
import useApprovePortfolioReq from "../../../hooks/requests/useApprovePortfolioReq";
import styles from "./PortfolioReq.module.css";
import { Check, X } from "lucide-react";

// ─── Helper: Status Badge ──────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: styles.statusPending,
    APPROVED: styles.statusApproved,
    REJECTED: styles.statusRejected,
  };
  const cls = map[status?.toUpperCase()] ?? styles.statusDefault;
  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : "-";
  return <span className={`${styles.badge} ${cls}`}>{label}</span>;
}

// ─── Helper: format date ───────────────────────────────────
function formatDate(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PortfolioRequestManagementPage() {
  const {
    requestList,
    loading,
    error,
    totalPages,
    totalElements,
    currentPage,
    fetchAllRequest,
  } = useGetPortfolioRequests();

  const { approveRequest, loading: approving } = useApprovePortfolioReq();

  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchAllRequest(0, itemsPerPage);
  }, [itemsPerPage, fetchAllRequest]);

  const handlePrev = () => {
    if (currentPage > 0) fetchAllRequest(currentPage - 1, itemsPerPage);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) fetchAllRequest(currentPage + 1, itemsPerPage);
  };

  const from = totalElements === 0 ? 0 : currentPage * itemsPerPage + 1;
  const to = Math.min((currentPage + 1) * itemsPerPage, totalElements ?? 0);

  const handleApprove = async (reqId: string) => {
    if (approving) return;
    try {
      await approveRequest(reqId, true);
      // Reload current page
      fetchAllRequest(currentPage, itemsPerPage);
    } catch (e) {
      alert("Failed to approve request.");
    }
  };

  const handleReject = async (reqId: string) => {
    if (approving) return;
    if (!window.confirm("Are you sure you want to reject this portfolio request?")) return;
    try {
      await approveRequest(reqId, false);
      // Reload current page
      fetchAllRequest(currentPage, itemsPerPage);
    } catch (e) {
      alert("Failed to reject request.");
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Portfolio Requests</h1>

      {loading && !approving && <p className={styles.loading}>Loading requests…</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      {!loading && !error && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Req ID</th>
                <th>User / Account</th>
                <th>Type</th>
                <th>Reason Data</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {requestList && requestList.length > 0 ? (
                requestList.map((request) => {
                  let parsedData: any = {};
                  try {
                    parsedData = request.data ? JSON.parse(request.data) : {};
                  } catch (e) {
                    parsedData = { reason: request.data };
                  }

                  return (
                    <tr key={request.id}>
                      <td className={styles.mono}>
                        <small>{request.id?.substring(0, 8)}...</small>
                      </td>
                      <td>
                        <small className={styles.mono}>{request.account?.accountNumber || "-"}</small>
                      </td>
                      <td>
                        <span className={styles.badge} style={{ backgroundColor: '#e0e7ff', color: '#3730a3'}}>
                           {request.requestType || "OPEN_PORTFOLIO"}
                        </span>
                      </td>
                      <td>
                        {parsedData?.reason || "-"}
                      </td>
                      <td>
                        <StatusBadge status={request.status ?? ""} />
                      </td>
                      <td className={styles.mono}>{formatDate(request.createdAt)}</td>
                      <td className={`${styles.mono} ${styles.action}`}>
                        {request.status === "PENDING" ? (
                          <>
                            <Check 
                               className={styles.check} 
                               onClick={() => request.id && handleApprove(request.id)} 
                            />
                            <X 
                               className={styles.close} 
                               onClick={() => request.id && handleReject(request.id)} 
                            />
                          </>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#888' }}>
                            {request.approveBy?.fullName || "Processed"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className={styles.empty}>No portfolio requests found.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              <span>
                Showing {from}–{to} of {totalElements ?? 0} requests
              </span>
              <span>Items per page:</span>
              <select
                className={styles.itemsSelect}
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className={styles.paginationControls}>
              <button className={styles.pageBtn} onClick={handlePrev} disabled={currentPage === 0}>
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page <strong>{(currentPage ?? 0) + 1}</strong> of{" "}
                <strong>{totalPages > 0 ? totalPages : 1}</strong>
              </span>
              <button
                className={styles.pageBtn}
                onClick={handleNext}
                disabled={currentPage >= (totalPages > 0 ? totalPages - 1 : 0)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
