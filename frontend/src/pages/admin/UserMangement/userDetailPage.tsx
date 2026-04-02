import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { UserDTO } from "../../../types/userType";
import useGetAllUser from "../../../hooks/users/useGetAllUser";
import styles from "./style.module.css";

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { users, loading, error, getAllUser } = useGetAllUser();
  const [formData, setFormData] = useState<UserDTO | null>(null);

  // Fetch users if we don't have them
  useEffect(() => {
    getAllUser();
  }, [getAllUser]);

  // Find the specific user from the fetched list
  useEffect(() => {
    if (users && users.length > 0 && userId) {
      const foundUser = users.find((u) => u.id === userId);
      if (foundUser) {
        setFormData(foundUser);
      }
    }
  }, [users, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? {
      ...prev,
      [name]: value,
    } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect this to actual API when the endpoint is ready
    alert("ข้อมูลถูกบันทึก (Mock)");
    navigate("/admin/userList");
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

        <div className={styles.modalFooter} style={{ marginTop: '2rem', backgroundColor: 'transparent', padding: '1rem 0 0 0' }}>
          <button type="button" className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
