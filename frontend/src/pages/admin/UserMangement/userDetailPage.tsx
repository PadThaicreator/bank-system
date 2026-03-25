import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { UserDTO } from "../../../types/userType";
import useGetAllUser from "../../../hooks/users/useGetAllUser";
import useEditUser from "../../../hooks/users/useEditUser";
import styles from "./style.module.css";

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { users, loading, error, getAllUser } = useGetAllUser();
  const { editUser, loading: editLoading, error: editError } = useEditUser();
  const [formData, setFormData] = useState<UserDTO | null>(location.state?.user || null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch users if we don't have them in state
  useEffect(() => {
    if (!formData) {
       // Request a large size as a fallback to try to find the user
       getAllUser(0, 1000);
    }
  }, [getAllUser, formData]);

  // Find the specific user from the fetched list if we fetched them
  useEffect(() => {
    if (!formData && users && users.length > 0 && userId) {
      const foundUser = users.find((u) => u.id === userId);
      if (foundUser) {
        setFormData(foundUser);
      }
    }
  }, [users, userId, formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? {
      ...prev,
      [name]: value,
    } : null);
    if (successMessage) setSuccessMessage(null); // Clear success message on edit
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setSuccessMessage(null);
    try {
      await editUser(formData);
      setSuccessMessage("Update Data Success");
    } catch (err: any) {
      // Error is handled by the hook and displayed in UI
      console.error("Failed to edit user", err);
    }
  };

  const handleCancel = () => {
    navigate("/admin/userList");
  };

  if (loading) return <div className={styles.loading}>Loading user data...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!formData && !loading) return <div className={styles.empty}>User not found.</div>;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.tableContainer} style={{ padding: '2rem' }}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit User Profile</h2>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData?.fullName || ""}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <input
              type="email"
              name="email"
              value={formData?.email || ""}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData?.phone || ""}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Birth Date</label>
            <input
              type="date"
              name="birthDay"
              value={(formData as any)?.birthDay || ""}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Gender</label>
            <select
              name="gender"
              value={(formData as any)?.gender || ""}
              onChange={handleChange}
              className={styles.formInput}
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Role</label>
            <select
              name="role"
              value={formData?.role || "CUSTOMER"}
              onChange={handleChange}
              className={styles.formInput}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Status</label>
            <select
              name="status"
              value={formData?.status || "ACTIVE"}
              onChange={handleChange}
              className={styles.formInput}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.formLabel}>User ID (Read-only)</label>
            <input
              type="text"
              value={formData?.id || ""}
              className={styles.formInput}
              disabled
            />
          </div>
        </div>

        <div className={styles.modalFooter} style={{ marginTop: '2rem', backgroundColor: 'transparent', padding: '1rem 0 0 0', flexWrap: 'wrap' }}>
          {editError && (
            <div style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem 1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '0.5rem', border: '1px solid #f87171', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>{editError}</span>
            </div>
          )}
          {successMessage && (
            <div style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem 1rem', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '0.5rem', border: '1px solid #86efac', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span>{successMessage}</span>
            </div>
          )}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className={styles.cancelButton} onClick={handleCancel} disabled={editLoading}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton} disabled={editLoading}>
              {editLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
