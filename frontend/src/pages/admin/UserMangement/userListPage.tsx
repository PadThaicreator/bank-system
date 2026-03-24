
import { useEffect, useState } from "react";
import useGetAllUser from "../../../hooks/users/useGetAllUser";
import styles from "./style.module.css";
import type { UserDTO } from "../../../types/userType";
import { useNavigate } from "react-router-dom";

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { users, totalPages, totalElements, loading, error, getAllUser } = useGetAllUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Backend pagination is 0-indexed
    getAllUser(currentPage - 1, pageSize);

    console.log(users);
  }, [getAllUser, currentPage, pageSize]);

  if (loading && !users?.length) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  // Pagination logic (now handled by backend)
  const currentUsers = users || [];

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>;
      case "INACTIVE":
        return <span className={`${styles.badge} ${styles.badgeInactive}`}>Inactive</span>;
      case "SUSPENDED":
        return <span className={`${styles.badge} ${styles.badgeSuspended}`}>Suspended</span>;
      default:
        return <span className={`${styles.badge} ${styles.badgeInactive}`}>{status || "Unknown"}</span>;
    }
  };

  const getRoleBadge = (role?: string) => {
    if (role === "ADMIN") {
      return <span className={`${styles.badge} ${styles.roleAdmin}`}>Admin</span>;
    }
    return <span className={`${styles.badge} ${styles.roleCustomer}`}>Customer</span>;
  };

  

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>User Management</h1>
      </div>

      {!currentUsers.length ? (
        <div className={styles.empty}>No users found.</div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  {/* <th>Birth Date</th>
                  <th>Gender</th> */}
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user: UserDTO) => (
                  <tr 
                    key={user.id}
                    className={styles.clickableRow}
                    onClick={() => navigate(`/admin/userDetail/${user.id}`, { state: { user } })}
                  >
                    <td>
                      <div style={{ fontWeight: 500 }}>{user.fullName}</div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || "-"}</td>
                    {/* <td>{user.birthDay ? new Date(user.birthDay).toLocaleDateString() : "-"}</td>
                    <td style={{ textTransform: 'capitalize' }}>{user.gender ? user.gender.toLowerCase() : "-"}</td> */}
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
            <div style={{ fontSize: "0.875rem", color: "#666" }}>
              Showing {currentUsers.length} of {totalElements} users
              <span style={{ marginLeft: "1rem" }}>
                <label htmlFor="pageSize" style={{ marginRight: "0.5rem" }}>Items per page:</label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
                >
                  <option value={2}>2</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </span>
            </div>

            {totalPages > 0 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                  className={styles.pageButton}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
