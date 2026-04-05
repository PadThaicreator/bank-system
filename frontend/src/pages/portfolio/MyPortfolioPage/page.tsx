import { useState } from "react";
import useMyPortfolio from "../../../hooks/stocks/useMyPortfolio";
import usePostPortfolioRequest from "../../../hooks/requests/usePostPortfolioRequest";
import styles from "./MyPortfolio.module.css";
import type { PortfolioDTO } from "../../../types/portfolioType";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function MyPortfolioPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { portfolios, loading, error, fetchPortfolios } = useMyPortfolio();
  const { postPortfolioRequest, loading: submitting } = usePostPortfolioRequest();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [expandedPort, setExpandedPort] = useState<string | null>(null);

  const toggleAccordion = (portId: string) => {
    setExpandedPort(prev => prev === portId ? null : portId);
  };

  const handleRequestPort = async () => {
    setFormError(null);
    setSuccessMsg(null);
    if (!reason.trim()) {
      setFormError("Please provide a reason for the portfolio request.");
      return;
    }

    try {
      await postPortfolioRequest({ reason, userId: user?.userId || (user as any)?.id } as PortfolioDTO);
      setSuccessMsg("Portfolio request submitted successfully! Pending approval from admin.");
      setReason("");
      setIsModalOpen(false);
      // Wait a moment then refetch to show any immediate state changes
      setTimeout(fetchPortfolios, 1000);
    } catch (err: any) {
      setFormError(err.message || "Failed to submit request.");
    }
  };

  const getStatusBadge = (status?: string) => {
    if (status === "ACTIVE") return <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>;
    if (status === "PENDING") return <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>;
    if (status === "CLOSED" || status === "FROZEN") return <span className={`${styles.badge} ${styles.badgeClosed}`}>{status}</span>;
    return <span className={styles.badge}>{status || "Unknown"}</span>;
  };

  if (loading) {
    return <div className={styles.loader}>Loading your portfolios...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Portfolios</h1>
        <button className={styles.requestBtn} onClick={() => setIsModalOpen(true)}>
          + Request New Portfolio
        </button>
      </div>

      {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}
      {successMsg && <div className={`${styles.message} ${styles.success}`}>{successMsg}</div>}

      {portfolios.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You don't have any active portfolios yet.</p>
          <p>Click "Request New Portfolio" to get started.</p>
        </div>
      ) : (
        <div className={styles.portfolioList}>
          {portfolios.map((port, idx) => {
            const displayId = port.accountNumber ?? `#${idx + 1}`;
            const isExpanded = expandedPort === displayId;

            return (
            <div key={port.accountNumber || idx} className={styles.portfolioCard}>
              <div 
                className={`${styles.portHeader} ${styles.clickableHeader}`}
                onClick={() => toggleAccordion(displayId)}
              >
                <div className={styles.headerTitleRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h3 style={{ margin: 0, padding: 0 }}>Portfolio {displayId}</h3>
                    {getStatusBadge(port.status)}
                  </div>
                  <div>
                    {isExpanded ? <ChevronUp size={20} color="#555" /> : <ChevronDown size={20} color="#555" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <>
                  <div className={styles.portDetails}>
                    <div className={styles.detailRow}>
                      <span>Created At:</span>
                      <span>{port.createdAt ? new Date(port.createdAt).toLocaleDateString() : "-"}</span>
                    </div>
                  </div>

                  <div className={styles.stockList}>
                    <h4>Holdings</h4>
                    {(!port.details || port.details.length === 0) ? (
                      <div style={{ color: '#888', fontSize: '0.9rem' }}>No stocks currently held.</div>
                    ) : (
                      port.details.map((detail, i) => (
                        <div key={i} className={styles.stockItem}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span style={{ fontWeight: 600 }}>{detail.stock?.symbol || "Unknown"}</span>
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>
                              {detail.amount} shares @ {detail.avg_price?.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿
                            </span>
                          </div>
                          {detail.stock?.symbol && (
                            <Link to={`/stocks/${detail.stock.symbol}`} className={styles.tradeLinkBtn}>
                              Trade
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )})}
        </div>
      )}

      {/* Request Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Request Portfolio</h2>
            {formError && <div className={`${styles.message} ${styles.error}`}>{formError}</div>}
            
            <div className={styles.formGroup}>
              <label>Reason / Purpose</label>
              <textarea
                className={styles.textArea}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. For long term technology investments..."
              />
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn} 
                onClick={() => { setIsModalOpen(false); setFormError(null); }}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                className={styles.submitBtn} 
                onClick={handleRequestPort}
                disabled={submitting || !reason.trim()}
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
