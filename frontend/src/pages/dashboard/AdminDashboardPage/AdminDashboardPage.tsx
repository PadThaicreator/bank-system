import React, { useState } from 'react';
import { Users, CreditCard, Activity, AlertTriangle, Search, Eye, Ban, ChevronDown, ChevronRight } from 'lucide-react';
import styles from './AdminDashboardPage.module.css';
import { useUsersTree } from '../../../hooks/admin/useUsersTree';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../components/common/ConfirmModal';
import useEditUser from '../../../hooks/users/useEditUser';
import { useAdminDashboardStats } from '../../../hooks/admin/useAdminDashboardStats';

// Admin Dashboard Component


export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const userSize = 10;
  
  const { 
    data: usersData, 
    loading: userLoading, 
    error: userError, 
    searchTerm, 
    setSearchTerm, 
    page: userPage, 
    setPage: setUserPage, 
    refetch: refetchUsersTree 
  } = useUsersTree('', 0, userSize);
  const { loading: editLoading, editUser } = useEditUser();
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminDashboardStats();
  
  const isLoading = userLoading || editLoading || statsLoading;
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: string | null;
  }>({ isOpen: false, userId: null });

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Use an arrow function for refetch so it doesn't execute immediately on every render
  const errors = [
    { error: userError, refetch: () => refetchUsersTree() },
    { error: statsError, refetch: () => refetchStats() }
  ].filter(x => x.error);

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
      const targetUser = usersData?.content.find(u => u.id === confirmModal.userId);
      
      if (targetUser) {
        // ก๊อปปี้ข้อมูลเดิมทั้งหมด และเจาะจงเปลี่ยนแค่สถานะเป็น 'SUSPENDED'
        const payload = {
          ...targetUser,
          id: targetUser.id as any,
          role: targetUser.role as any,
          status: 'SUSPENDED' as "SUSPENDED"
        };

        editUser(payload).then(() => {
          // สั่งปิด Modal 
          setConfirmModal({ isOpen: false, userId: null });
          // ดึงข้อมูลใหม่เพื่อสะท้อนผลลัพธ์
          refetchUsersTree();
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <p className={styles.statSub}>{formatNumber(stats.totalUsers - stats.suspendedUsers)} active</p>
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

          {/* Suspended Users */}
          {/* <div className={styles.statCardAlert}>
            <div className={styles.alertDeco}></div>
            <div className={`${styles.statIconWrapper} ${styles.bgRed}`}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className={styles.statLabelAlert}>Suspended Users</p>
              <h3 className={styles.statValueAlert}>{formatNumber(stats.suspendedUsers)}</h3>
              <p className={styles.statSubAlert}>Requires review</p>
            </div>
          </div> */}

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
                {usersData?.content.map(u => (
                  <React.Fragment key={u.id}>
                    <tr className={styles.tr}>
                      <td className={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button onClick={() => toggleRow(u.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#64748b' }}>
                            {expandedRows[u.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                          <div className={styles.userCell}>
                            <span className={styles.userNameCell}>{u.fullName}</span>
                            <span className={styles.userEmailCell}>{u.email}</span>
                          </div>
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
                          <button className={`${styles.actionBtn} ${styles.actionBtnView}`} title="View Details" onClick={() => navigate(`/admin/userDetail/${u.id}`)}>
                            <Eye size={16} />
                          </button>
                          <button className={`${styles.actionBtn} ${styles.actionBtnSuspend}`} title="Suspend User" onClick={() => handleSuspendClick(u.id)}>
                            <Ban size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row for Nested Accounts */}
                    {expandedRows[u.id] && (
                      <tr>
                        <td colSpan={5} style={{ padding: 0 }}>
                          <div style={{ padding: '1.25rem 2.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '0.875rem', fontWeight: 600 }}>Registered Accounts</h4>
                            {u.accounts && u.accounts.length > 0 ? (
                               <table className={styles.table} style={{ background: 'white', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                 <thead style={{ background: '#f1f5f9' }}>
                                   <tr>
                                     <th className={styles.th} style={{ borderBottom: '1px solid #e2e8f0' }}>Account No.</th>
                                     <th className={styles.th} style={{ borderBottom: '1px solid #e2e8f0' }}>Type</th>
                                     <th className={styles.th} style={{ borderBottom: '1px solid #e2e8f0' }}>Balance</th>
                                     <th className={styles.th} style={{ borderBottom: '1px solid #e2e8f0' }}>Status</th>
                                   </tr>
                                 </thead>
                                 <tbody>
                                   {u.accounts.map(acc => (
                                     <tr key={acc.id} className={styles.tr}>
                                       <td className={styles.td} style={{ fontFamily: 'monospace' }}>{acc.accountNumber}</td>
                                       <td className={styles.td}>
                                         <span className={styles.roleBadge}>{acc.accountType}</span>
                                         <span className={styles.roleBadge} style={{marginLeft: '0.5rem'}}>{acc.accountCategory}</span>
                                       </td>
                                       <td className={styles.td} style={{ fontWeight: 500 }}>{formatCurrency(acc.balance)}</td>
                                       <td className={styles.td}>
                                          <span className={`${styles.statusBadge} ${
                                            acc.status === 'ACTIVE' ? styles.statusActive : styles.statusSuspended
                                          }`}>
                                            {acc.status}
                                          </span>
                                       </td>
                                     </tr>
                                   ))}
                                 </tbody>
                               </table>
                            ) : (
                               <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0, padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>No accounts found for this user.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {usersData && usersData.totalPages > 0 && (
              <div className={styles.paginationWrapper}>
                <div className={styles.paginationInfo}>
                  Showing page {usersData.number + 1} of {usersData.totalPages}
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
                    disabled={userPage >= usersData.totalPages - 1} 
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
