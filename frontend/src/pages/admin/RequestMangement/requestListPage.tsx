import { useEffect, useState } from "react"
import useGetAllRequest from "../../../hooks/requests/useGetRequest"
import styles from "./RequestList.module.css"
import { Check, List, X } from "lucide-react";
import { requestService } from "../../../services/requestService";
import type { RequestDTO } from "../../../types/requestType";
import RequestDetailModal from "./modal/RequestDetailModal";

// ─── Helper: Request Type Badge ────────────────────────────
function RequestTypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    CHANGE_ACCOUNT_TYPE: { label: "Change Account Type", cls: styles.typeChangeAccountType },
    CHANGE_ACCOUNT_STATUS: { label: "Change Account Status", cls: styles.typeChangeAccountStatus },
    OPEN_ACCOUNT: { label: "Open Account", cls: styles.typeOpenAccount },
  }
  const entry = map[type] ?? { label: type, cls: styles.typeDefault }
  return <span className={`${styles.badge} ${entry.cls}`}>{entry.label}</span>
}

// ─── Helper: Status Badge ──────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: styles.statusPending,
    APPROVED: styles.statusApproved,
    REJECTED: styles.statusRejected,
  }
  const cls = map[status?.toUpperCase()] ?? styles.statusDefault
  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : "-"
  return <span className={`${styles.badge} ${cls}`}>{label}</span>
}

// ─── Helper: format date ───────────────────────────────────
function formatDate(value?: string | null) {
  if (!value) return "-"
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// ─── Main Component ────────────────────────────────────────
export default function RequestListPage() {
  const {
    requestList,
    loading,
    error,
    totalPages,
    totalElements,
    currentPage,
    fetchAllRequest,
  } = useGetAllRequest()

  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    fetchAllRequest(0, itemsPerPage)
  }, [itemsPerPage])

  const handlePrev = () => {
    if (currentPage > 0) fetchAllRequest(currentPage - 1, itemsPerPage)
  }

  const handleNext = () => {
    if (currentPage < totalPages - 1) fetchAllRequest(currentPage + 1, itemsPerPage)
  }

  const from = totalElements === 0 ? 0 : currentPage * itemsPerPage + 1
  const to = Math.min((currentPage + 1) * itemsPerPage, totalElements ?? 0)


  const handleApprove = async (reqId: string) => {
    await requestService.approveRequest(reqId, true)
    fetchAllRequest(currentPage, itemsPerPage)
  }

  const handleReject = async (reqId: string) => {
    await requestService.approveRequest(reqId, false)
    fetchAllRequest(currentPage, itemsPerPage)
  }

  const [selected, setSelected] = useState<RequestDTO>()


  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Request Management</h1>

      {loading && <p className={styles.loading}>Loading…</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      {!loading && !error && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Type</th>
                <th>Details</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Approval At</th>
                <th>Approval By</th>
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
                    parsedData = { raw: request.data };
                  }

                  return (
                  <tr key={request.id}>
                    {/* Account Number */}
                    <td className={styles.mono}>
                      {request.account?.accountNumber ?? "-"}
                    </td>

                    {/* Request Type */}
                    <td>
                      <RequestTypeBadge type={request.requestType ?? ""} />
                    </td>

                    {/* Details*/}
                    <td>
                      {request.requestType === "CHANGE_ACCOUNT_TYPE" && (
                        <div className={styles.detailBlock}>
                          <span className={styles.detailItem}>
                            From: <span>{request.account?.accountType}</span>
                          </span>
                          <span className={styles.detailItem}>
                            To: <span>{parsedData?.accountType || request.data}</span>
                          </span>
                        </div>
                      )}

                      {request.requestType === "CHANGE_ACCOUNT_STATUS" && (
                        <div className={styles.detailBlock}>
                          <span className={styles.detailItem}>
                            From: <span>{request.account?.status}</span>
                          </span>
                          <span className={styles.detailItem}>
                            To: <span>{parsedData?.status || request.data}</span>
                          </span>
                        </div>
                      )}

                      {request.requestType === "OPEN_ACCOUNT" && (
                        <div className={styles.detailBlock}>
                          <span className={styles.detailItem}>
                            Type: <span>{parsedData?.accountType || request.account?.accountType}</span>
                          </span>
                          <span className={styles.detailItem}>
                            Balance: <span>{(parsedData?.initialDeposit ?? request.account?.balance)?.toLocaleString()}</span>
                          </span>
                        </div>
                      )}

                      {!["CHANGE_ACCOUNT_TYPE", "CHANGE_ACCOUNT_STATUS", "OPEN_ACCOUNT"].includes(
                        request.requestType ?? ""
                      ) && <span className={styles.mono}>-</span>}
                    </td>

                    {/* Request Status */}
                    <td>
                      <StatusBadge status={request.status ?? ""} />
                    </td>

                    {/* Dates */}
                    <td className={styles.mono}>{formatDate(request.createdAt)}</td>
                    <td className={styles.mono}>{formatDate(request.approvedAt)}</td>
                    <td className={styles.mono}>{request.approveBy?.fullName ?? "-"}</td>
                    <td className={`${styles.mono} ${styles.action}`}>
                      {request.status === "PENDING" && (
                        <>
                          <Check className={styles.check} onClick={() => request.id && handleApprove(request.id)} />
                          <X className={styles.close} onClick={() => request.id && handleReject(request.id)} />
                        </>

                      )}
                      <List onClick={() => setSelected(request)} style={{ cursor: "pointer" }} />
                    </td>
                  </tr>
                );
              })
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.empty}>No requests found.</div>
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
                <strong>{totalPages ?? 1}</strong>
              </span>
              <button
                className={styles.pageBtn}
                onClick={handleNext}
                disabled={currentPage >= (totalPages ?? 1) - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}


      {selected && (
        <RequestDetailModal
          request={selected}
          onClose={() => setSelected(undefined)}
          onApprove={(r) => {
            if (r.id) handleApprove(String(r.id));
            setSelected(undefined);
          }}
          onReject={(r) => {
            if (r.id) handleReject(String(r.id));
            setSelected(undefined);
          }}
        />
      )}
    </div>
  )
}