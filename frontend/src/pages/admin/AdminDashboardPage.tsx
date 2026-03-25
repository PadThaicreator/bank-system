import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Users, CreditCard, Activity, AlertTriangle, ShieldCheck, Search, Eye, Ban } from 'lucide-react';
import type { RootState } from '../../redux/store';
import styles from './AdminDashboardPage.module.css';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalAccounts: number;
  todayTransactionCount: number;
  todayTransactionValue: number;
  suspendedAccounts: number;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

// --- Mock Data ---
const mockStats: AdminStats = {
  totalUsers: 150,
  activeUsers: 142,
  totalAccounts: 230,
  todayTransactionCount: 45,
  todayTransactionValue: 250000.00,
  suspendedAccounts: 3
};

const mockRecentUsers: User[] = [
  {
    id: "uuid-u1",
    fullName: "สมชาย ใจดี",
    email: "somchai@example.com",
    role: "CUSTOMER",
    status: "ACTIVE",
    createdAt: "2024-01-15T10:30:00"
  },
  {
    id: "uuid-u2",
    fullName: "สมหญิง รักไทย",
    email: "somying@example.com",
    role: "CUSTOMER",
    status: "ACTIVE",
    createdAt: "2024-01-14T09:15:00"
  },
  {
    id: "uuid-u3",
    fullName: "แฮกเกอร์ ตัวแสบ",
    email: "hacker@example.com",
    role: "CUSTOMER",
    status: "SUSPENDED",
    createdAt: "2024-01-13T16:45:00"
  }
];

export default function AdminDashboardPage() {
  const adminUser = useSelector((state: RootState) => state.auth.user);
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setUsers(mockRecentUsers);
      setLoading(false);
    }, 800);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('th-TH').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  if (loading || !stats) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <ShieldCheck className={styles.brandIcon} />
          <span className={styles.brandText}>BANK ADMIN</span>
        </div>
        
        <nav className={styles.nav}>
          <a href="#" className={`${styles.navItem} ${styles.navItemActive}`}>
            <Activity className={styles.navIcon} /> Overview
          </a>
          <a href="#" className={styles.navItem}>
            <Users className={styles.navIcon} /> Users Management
          </a>
          <a href="#" className={styles.navItem}>
            <CreditCard className={styles.navIcon} /> Accounts
          </a>
        </nav>

        <div className={styles.userInfo}>
          <p className={styles.userName}>{adminUser?.fullName || "Administrator"}</p>
          <p className={styles.userEmail}>{adminUser?.email || "admin@example.com"}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>Dashboard Overview</h1>
            <p className={styles.headerSub}>System status and key metrics across the platform</p>
          </div>
          
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search users, accounts..." 
              className={styles.searchInput}
            />
          </div>
        </header>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {/* Total Users */}
          <div className={styles.statCard}>
            <div className={`${styles.statIconWrapper} ${styles.bgBlue}`}>
              <Users size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Total Users</p>
              <h3 className={styles.statValue}>{formatNumber(stats.totalUsers)}</h3>
              <p className={styles.statSub}>{formatNumber(stats.activeUsers)} active</p>
            </div>
          </div>

          {/* Total Accounts */}
          <div className={styles.statCard}>
            <div className={`${styles.statIconWrapper} ${styles.bgEmerald}`}>
              <CreditCard size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Total Accounts</p>
              <h3 className={styles.statValue}>{formatNumber(stats.totalAccounts)}</h3>
              <p className={styles.statSubGray}>across all types</p>
            </div>
          </div>

          {/* Today's Volume */}
          <div className={styles.statCard}>
            <div className={`${styles.statIconWrapper} ${styles.bgIndigo}`}>
              <Activity size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Today's Volume</p>
              <h3 className={styles.statValue}>{formatNumber(stats.todayTransactionCount)} <span>txns</span></h3>
              <p className={styles.statSubIndigo}>{formatCurrency(stats.todayTransactionValue)}</p>
            </div>
          </div>

          {/* Suspended Accounts */}
          <div className={styles.statCardAlert}>
            <div className={styles.alertDeco}></div>
            <div className={`${styles.statIconWrapper} ${styles.bgRed}`}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className={styles.statLabelAlert}>Suspended Accounts</p>
              <h3 className={styles.statValueAlert}>{formatNumber(stats.suspendedAccounts)}</h3>
              <p className={styles.statSubAlert}>Requires review</p>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Users</h3>
            <button className={styles.linkBtn}>View All Users</button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>User</th>
                  <th className={styles.th}>Role</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Joined Date</th>
                  <th style={{textAlign: 'right'}} className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.userCell}>
                        <span className={styles.userNameCell}>{u.fullName}</span>
                        <span className={styles.userEmailCell}>{u.email}</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.roleBadge}>{u.role}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.statusBadge} ${
                        u.status === 'ACTIVE' ? styles.statusActive : styles.statusSuspended
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.dateText}>{formatDate(u.createdAt)}</span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <button className={`${styles.actionBtn} ${styles.actionBtnView}`} title="View Details">
                          <Eye size={16} />
                        </button>
                        <button className={`${styles.actionBtn} ${styles.actionBtnSuspend}`} title="Suspend User">
                          <Ban size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
