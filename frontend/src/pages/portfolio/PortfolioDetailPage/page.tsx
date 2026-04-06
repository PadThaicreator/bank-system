import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import styles from "./PortfolioDetailPage.module.css";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import type { PortfolioDTO } from "../../../types/portfolioType";
import useStockPrice from "../../../hooks/stocks/useStockPrice";

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Try to get portfolio from navigation state
  const portfolio = location.state?.portfolio as PortfolioDTO | undefined;

  if (!portfolio) {
    return (
      <div className={styles.pageContainer}>
        <button className={styles.backButton} onClick={() => navigate("/portfolio/my")}>
          <ArrowLeft size={20} style={{ marginRight: "8px" }} /> Back to My Portfolios
        </button>
        <div className={styles.emptyState}>Portfolio data not found. Please navigate from your portfolio list.</div>
      </div>
    );
  }

  const displayId = portfolio.accountNumber ?? id;

  const getStatusBadge = (status?: string) => {
    if (status === "ACTIVE") return <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>;
    if (status === "PENDING") return <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>;
    if (status === "CLOSED" || status === "FROZEN") return <span className={`${styles.badge} ${styles.badgeClosed}`}>{status}</span>;
    return <span className={styles.badge}>{status || "Unknown"}</span>;
  };

  return (
    <div className={styles.pageContainer}>
      <button className={styles.backButton} onClick={() => navigate("/portfolio/my")}>
        <ArrowLeft size={20} style={{ marginRight: "8px" }} /> Back to My Portfolios
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>Portfolio {displayId}</h1>
        <div className={styles.statusWrapper}>
          {getStatusBadge(portfolio.status)}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.detailRow}>
          <span className={styles.label}>Created At:</span>
          <span className={styles.value}>{portfolio.createdAt ? new Date(portfolio.createdAt).toLocaleDateString() : "-"}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Account Number:</span>
          <span className={styles.value}>{portfolio.accountNumber || "N/A"}</span>
        </div>
        {portfolio.reason && (
           <div className={styles.detailRow}>
             <span className={styles.label}>Reason/Purpose:</span>
             <span className={styles.value}>{portfolio.reason}</span>
           </div>
        )}
      </div>

      <div className={styles.stockList}>
        <h2>Stock Holdings</h2>
        
        {(!portfolio.details || portfolio.details.length === 0) ? (
          <div className={styles.emptyState}>No stocks currently held in this portfolio.</div>
        ) : (
          <div className={styles.stockGrid}>
            {portfolio.details.map((detail, i) => (
              <PortfolioStockItem key={i} detail={detail} portfolioId={portfolio.portfolioId || ""} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PortfolioStockItem({ detail, portfolioId }: { detail: any, portfolioId: string }) {
  const { priceData, loading } = useStockPrice(detail.stock?.symbol || "");
  
  const currentPrice = priceData?.currentPrice || 0;
  const avgPrice = detail.avg_price || 0;
  const percentChange = avgPrice > 0 && currentPrice > 0 ? ((currentPrice - avgPrice) / avgPrice) * 100 : 0;
  const changeStr = percentChange.toFixed(2);
  const isPositive = percentChange >= 0;

  return (
    <div className={styles.stockItem}>
      <div>
        <div className={styles.stockSymbol}>{detail.stock?.symbol || "Unknown"}</div>
        <div className={styles.stockDetail}>
          Amount: <span style={{ fontWeight: 600 }}>{detail.amount} shares</span>
        </div>
        <div className={styles.stockDetail}>
          Avg Price: <span style={{ fontWeight: 600 }}>{avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</span>
        </div>
        <div className={styles.stockDetail}>
          Current Price: <span style={{ fontWeight: 600 }}>
            {loading ? "..." : `${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿`}
          </span>
        </div>
        {!loading && currentPrice > 0 && avgPrice > 0 && (
          <div className={styles.stockDetail} style={{ marginTop: '0.25rem' }}>
            Change Rate: <span className={isPositive ? styles.changePositive : styles.changeNegative} style={{ display: 'inline-flex', alignItems: 'center' }}>
              {isPositive ? <TrendingUp size={16} style={{ marginRight: '4px' }} /> : <TrendingDown size={16} style={{ marginRight: '4px' }} />}
              {isPositive ? "+" : ""}{changeStr}%
            </span>
          </div>
        )}
      </div>
      {detail.stock?.symbol && (
        <Link to={`/stocks/${detail.stock.symbol}`} state={{ portfolioId }} className={styles.tradeLinkBtn}>
          Trade / Sell
        </Link>
      )}
    </div>
  );
}
