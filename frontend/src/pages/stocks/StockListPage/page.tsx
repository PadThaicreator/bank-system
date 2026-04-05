import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAllStock from "../../../hooks/stocks/useAllStock";
import styles from "./StockListPage.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StockListPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const { stocks, loading, error } = useAllStock(page, size);
  const navigate = useNavigate();

  const handleRowClick = (symbol: string) => {
    navigate(`/stocks/${symbol}`);
  };

  const handleNextPage = () => {
    if (stocks && !stocks.last) {
      setPage(p => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(p => p - 1);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Market Explorer</h1>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableContainer}>
        <table className={styles.stockTable}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Industry</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className={styles.loading}>Loading stocks...</td>
              </tr>
            ) : stocks?.content?.map((stock) => (
              <tr 
                key={stock.symbol} 
                className={styles.stockRow}
                onClick={() => handleRowClick(stock.symbol!)}
              >
                <td className={styles.symbol}>{stock.symbol}</td>
                <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {stock.logo && <img src={stock.logo} alt={`${stock.symbol} logo`} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />}
                        {stock.name}
                    </div>
                </td>
                <td>{stock.industry}</td>
                <td>{(stock.marketCap ?? 0).toLocaleString()}</td>
              </tr>
            ))}
            {!loading && stocks?.content?.length === 0 && (
                <tr>
                    <td colSpan={4} className={styles.loading}>No stocks found.</td>
                </tr>
            )}
          </tbody>
        </table>

        {stocks && (
          <div className={styles.pagination}>
            <div className={styles.pageInfo}>
              Page {stocks.currentPage !== undefined ? stocks.currentPage + 1 : page + 1} of {stocks.totalPages || 1}
            </div>
            <div className={styles.pageControls}>
              <button 
                onClick={handlePrevPage} 
                disabled={page === 0 || stocks.first}
              >
                <ChevronLeft size={16} style={{ verticalAlign: 'middle' }} /> Prev
              </button>
              <button 
                onClick={handleNextPage} 
                disabled={stocks.last}
              >
                Next <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
