import { useState, useEffect } from 'react';
import { Users, CreditCard, Activity, AlertTriangle, Search, Eye, Ban } from 'lucide-react';
import styles from './AdminDashboardPage.module.css';
import useGetAllUser from '../../../hooks/users/useGetAllUser';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../components/common/ConfirmModal';
import useEditUser from '../../../hooks/users/useEditUser';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalAccounts: number;
  todayTransactionCount: number;
  todayTransactionValue: number;
  suspendedAccounts: number;
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


export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const userSize = 10;
  const [userPage, setUserPage] = useState(0);
  const { users, loading: userLoading, error: userError, pageInfo, getAllUser } = useGetAllUser();
  const { loading: editLoading, editUser } = useEditUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const isLoading = userLoading || editLoading;
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: string | null;
  }>({ isOpen: false, userId: null });

  // Use an arrow function for refetch so it doesn't execute immediately on every render
  const errors = [
    { error: userError, refetch: () => getAllUser(userPage, userSize) }
  ].filter(x => x.error);

  useEffect(() => {
    // Simulate API call
    if (!stats) {
      setTimeout(() => {
        setStats(mockStats);
      }, 800);
    }
  }, [stats]);

  useEffect(() => {
    getAllUser(userPage, userSize);
  }, [getAllUser, userPage, userSize]);

  if (errors.length > 0) {
    return (
      <div className={styles.errorContainer} style={{ padding: '2rem', textAlign: 'center' }}>
        {errors.map((err, index) => (
          <div key={index}>
            <h1>Error</h1>
            <p>{err.error}</p>
            <button onClick={err.refetch} style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>Retry</button>
          </div>
        ))}
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

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

  const handleSuspendClick = (userId: string) => {
    setConfirmModal({ isOpen: true, userId });
  }

  const handleSuspendConfirm = () => {
    if (confirmModal.userId) {
      // ค้นหา User คนนี้จาก Array ที่มีอยู่แล้วเพื่อดึงฟิลด์เก่าทั้งหมด
      const targetUser = users.find(u => u.id === confirmModal.userId);
      
      if (targetUser) {
        // ก๊อปปี้ข้อมูลเดิมทั้งหมด และเจาะจงเปลี่ยนแค่สถานะเป็น 'SUSPENDED'
        const payload = {
          ...targetUser,
          status: 'SUSPENDED' as "SUSPENDED"
        };

        editUser(payload).then(() => {
          // สั่งปิด Modal 
          setConfirmModal({ isOpen: false, userId: null });
          // ดึงข้อมูลใหม่เพื่อสะท้อนผลลัพธ์
          getAllUser(userPage, userSize);
        }).catch((err) => {
          console.error("Failed to suspend user:", err);
          alert("Failed to suspend user.");
        });
      }
    }
  }

  return (
    <div className={styles.container}>

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
            <button className={styles.linkBtn} onClick={() => navigate('/admin/userList')}>View All Users</button>
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
                      <span className={styles.dateText}>{formatDate(u.createdAt!)}</span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <button className={`${styles.actionBtn} ${styles.actionBtnView}`} title="View Details" onClick={() => navigate(`/admin/userDetail/${u.id}`)}>
                          <Eye size={16} />
                        </button>
                        <button className={`${styles.actionBtn} ${styles.actionBtnSuspend}`} title="Suspend User" onClick={() => handleSuspendClick(u.id!)}>
                          <Ban size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {pageInfo && pageInfo.totalPages > 0 && (
              <div className={styles.paginationWrapper}>
                <div className={styles.paginationInfo}>
                  Showing page {pageInfo.currentPage + 1} of {pageInfo.totalPages}
                </div>
                <div className={styles.paginationControls}>
                  <button 
                    className={styles.pageBtn} 
                    disabled={userPage === 0} 
                    onClick={() => setUserPage(p => Math.max(0, p - 1))}
                  >
                    Previous
                  </button>
                  <button 
                    className={styles.pageBtn} 
                    disabled={userPage >= pageInfo.totalPages - 1} 
                    onClick={() => setUserPage(p => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            <ConfirmModal
              isOpen={confirmModal.isOpen}
              title="Suspend User"
              message="Are you sure you want to suspend this user?"
              onConfirm={handleSuspendConfirm}
              onCancel={() => setConfirmModal({ isOpen: false, userId: null })}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
