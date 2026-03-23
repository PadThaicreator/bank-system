
import { useEffect, useState } from "react";
import useGetAllUser from "../../../hooks/users/useGetAllUser";
import styles from "./style.module.css";
import type { UserDTO } from "../../../types/userType";

export default function UserManagementPage() {
  const { users, loading, error, getAllUser } = useGetAllUser();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getAllUser();
  }, [getAllUser]);

  if (loading && !users?.length) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  // Pagination logic
  const validUsers = users || [];
  const totalPages = Math.ceil(validUsers.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const currentUsers = validUsers.slice(startIndex, endIndex);

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

      {!validUsers.length ? (
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
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user: UserDTO) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{user.fullName}</div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || "-"}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
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
        </>
      )}
    </div>
  );
}
