import { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useStockPrice from "../../../hooks/stocks/useStockPrice";
import useMyPortfolio from "../../../hooks/stocks/useMyPortfolio";
import useCreateOrder from "../../../hooks/stocks/useCreateOrder";
import useGetStockInPortfolio from "../../../hooks/stocks/useGetStockInPortfolio";
import styles from "./StockDetailPage.module.css";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import type { OrderDTO } from "../../../types/orderType";
import { accountService } from "../../../services/accountService";
import { useEffect } from "react";

export default function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { priceData, loading: priceLoading, error: priceError } = useStockPrice(symbol || "");
  const { portfolios, loading: portLoading } = useMyPortfolio();
  const { createOrder, loading: orderLoading } = useCreateOrder();
  const { stockDetail, fetchStockInPortfolio } = useGetStockInPortfolio();

  const [inputValue, setInputValue] = useState<string>("0");
  const [inputMode, setInputMode] = useState<"SHARES" | "BAHT">("SHARES");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>(location.state?.portfolioId || "");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);



  useEffect(() => {
    accountService.getUserAccount().then((res: any) => {
      const data = res.data || res;
      if (Array.isArray(data)) {
        setAccounts(data);
      } else if (data?.accountList && Array.isArray(data.accountList)) {
        setAccounts(data.accountList);
      } else if (data?.content && Array.isArray(data.content)) {
        setAccounts(data.content);
      }
    }).catch(err => console.error("Failed to load accounts", err));
  }, []);

  useEffect(() => {
    if (selectedPortfolioId && symbol) {
      fetchStockInPortfolio(symbol, selectedPortfolioId);
    }
  }, [selectedPortfolioId, symbol, fetchStockInPortfolio]);

  const isPositive = useMemo(() => (priceData?.change ?? 0) >= 0, [priceData]);

  const parsedValue = Number(inputValue) || 0;
  let estimatedShares = 0;
  let estimatedTotal = 0;

  if (priceData && priceData.currentPrice) {
    if (inputMode === "SHARES") {
      estimatedShares = parsedValue;
      estimatedTotal = parsedValue * priceData.currentPrice;
    } else {
      estimatedTotal = parsedValue;
      estimatedShares = Math.floor(parsedValue / priceData.currentPrice);
    }
  }

  const handleTrade = async (type: "BUY" | "SELL") => {
    setLocalError(null);
    setSuccessMsg(null);

    if (!selectedPortfolioId) {
      setLocalError("Please select a portfolio to trade.");
      return;
    }
    if (!selectedAccountId) {
      setLocalError("Please select a bank account.");
      return;
    }
    if (estimatedShares <= 0) {
      setLocalError("Amount must result in at least 1 share.");
      return;
    }
    if (!priceData?.currentPrice) {
      setLocalError("Price data unavailable.");
      return;
    }

    if (type === "BUY") {
      const selectedAccount = accounts.find(a => (a.id === selectedAccountId || a.accountNumber === selectedAccountId));
      if (selectedAccount && selectedAccount.balance < estimatedTotal) {
        setLocalError("Insufficient balance in the selected account.");
        return;
      }
    } else if (type === "SELL") {
      const ownedAmount = stockDetail?.amount || 0;
      if (estimatedShares > ownedAmount) {
        setLocalError(`You cannot sell more than you own in this portfolio. (Owned: ${ownedAmount} shares)`);
        return;
      }
    }

    const orderData: any = {
      amount: estimatedShares,
      price: priceData.currentPrice,
      type: type,
      portfolioId: selectedPortfolioId,
      symbol: symbol,
      accountId: selectedAccountId
    };

    try {
      await createOrder(orderData as OrderDTO);
      setSuccessMsg(`Successfully placed ${type} order for ${estimatedShares} shares of ${symbol}.`);
      setInputValue("");
    } catch (err: any) {
      setLocalError(err.response?.data?.error?.details || err.message || "Trade failed.");
    }
  };

  if (priceLoading) {
    return <div className={styles.loader}>Loading stock details...</div>;
  }

  if (priceError || !priceData) {
    return (
      <div className={styles.pageContainer}>
        <button className={styles.backButton} onClick={() => navigate("/stocks/list")}>
          <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Back to Markets
        </button>
        <div className={styles.message + " " + styles.error}>
          {priceError || "Could not load stock price."}
        </div>
      </div>
    );
  }

  // Active portfolios
  const activePortfolios = portfolios.filter(p => p.status === 'ACTIVE');

  return (
    <div className={styles.pageContainer}>
      <button className={styles.backButton} onClick={() => navigate("/stocks/list")}>
        <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Back to Markets
      </button>

      <div className={styles.header}>
        <div className={styles.stockInfo}>
          <div className={styles.titleContainer}>
            <h1>{symbol}</h1>
            <p>Real-time Market Data</p>
          </div>
        </div>

        <div className={styles.priceContainer}>
          <h2 className={styles.price}>
            {priceData.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿
          </h2>
          <div className={`${styles.change} ${isPositive ? styles.changePositive : styles.changeNegative}`}>
            {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            {isPositive ? "+" : ""}
            {priceData.change?.toLocaleString(undefined, { minimumFractionDigits: 2 })} (
            {priceData.percentChange?.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className={styles.tradeSection}>
        <h2>Trade {symbol}</h2>

        {localError && <div className={`${styles.message} ${styles.error}`}>{localError}</div>}
        {successMsg && <div className={`${styles.message} ${styles.success}`}>{successMsg}</div>}

        <div className={styles.formGroup}>
          <label>Select Portfolio</label>
          <select
            className={styles.select}
            value={selectedPortfolioId}
            onChange={(e) => setSelectedPortfolioId(e.target.value)}
            disabled={portLoading}
          >
            <option value="">-- Choose Portfolio --</option>
            {activePortfolios.map(port => {
              const actualPortId = port.portfolioId;
              return (
                <option key={actualPortId} value={actualPortId}>
                  Portfolio {port.accountNumber?.substring(0, 8)}...
                </option>
              )
            })}
          </select>
          {portfolios.length > 0 && activePortfolios.length === 0 && (
            <small style={{ color: 'red' }}>You don't have any ACTIVE portfolios.</small>
          )}
          {selectedPortfolioId && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
              Currently Owned: <strong>{stockDetail?.amount || 0} shares</strong>
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Select Bank Account</label>
          <select
            className={styles.select}
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
          >
            <option value="">-- Choose Account --</option>
            {accounts.map(acc => (
              <option key={acc.id || acc.accountNumber} value={acc.id || acc.accountNumber}>
                {acc.accountType || acc.accountCategory} - {acc.accountNumber} ({acc.balance?.toLocaleString()} ฿)
              </option>
            ))}
          </select>
          {accounts.length === 0 && (
            <small style={{ color: '#666' }}>Loading accounts or no accounts found.</small>
          )}
        </div>

        <div className={styles.formGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
            <label style={{ margin: 0 }}>Input Amount</label>
            {(stockDetail?.amount || 0) > 0 && (
              <button 
                type="button"
                style={{ background: 'none', border: 'none', color: '#007bff', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                onClick={() => {
                  setInputMode("SHARES");
                  setInputValue((stockDetail?.amount || 0).toString());
                }}
              >
                Sell All ({stockDetail?.amount || 0} Shares)
              </button>
            )}
          </div>
          <div className={styles.modeToggle}>
            <button
              className={`${styles.modeBtn} ${inputMode === "SHARES" ? styles.active : ""}`}
              onClick={() => setInputMode("SHARES")}
            >
              By Shares
            </button>
            <button
              className={`${styles.modeBtn} ${inputMode === "BAHT" ? styles.active : ""}`}
              onClick={() => setInputMode("BAHT")}
            >
              By Baht (฿)
            </button>
          </div>

          <input
            type="number"
            className={styles.input}
            min="1"
            value={inputValue === "0" ? "" : inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Enter ${inputMode === "SHARES" ? "number of shares" : "amount in THB"}`}
          />
        </div>

        <div className={styles.totalSummary}>
          <div className={styles.totalRow}>
            <span>Market Price</span>
            <span>{priceData.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</span>
          </div>
          <div className={styles.totalRow}>
            <span>Shares to Execute</span>
            <span>{estimatedShares} Shares</span>
          </div>
          <div className={`${styles.totalRow} ${styles.bold}`}>
            <span>Estimated Total Amount</span>
            <span>{estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</span>
          </div>
        </div>

        <div className={styles.tradeButtons}>
          <button
            className={styles.buyBtn}
            onClick={() => handleTrade("BUY")}
            disabled={orderLoading || estimatedShares <= 0 || !selectedPortfolioId || !selectedAccountId}
          >
            {orderLoading ? "Processing..." : "Buy"}
          </button>
          <button
            className={styles.sellBtn}
            onClick={() => handleTrade("SELL")}
            disabled={orderLoading || estimatedShares <= 0 || !selectedPortfolioId || !selectedAccountId}
          >
            {orderLoading ? "Processing..." : "Sell"}
          </button>
        </div>
      </div>
    </div>
  );
}
