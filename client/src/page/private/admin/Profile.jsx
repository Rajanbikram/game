import { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";

export default function Profile({ showToast }) {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    firstName: stored.firstName || "",
    lastName:  stored.lastName  || "",
    email:     stored.email     || "",
    phone:     "",
  });
  const [pw, setPw]         = useState({ current: "", newPw: "", confirm: "" });
  const [avatarUrl, setAvatar] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    try {
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      showToast("Error updating profile.", "error");
    }
  };

  const handleChangePassword = () => {
    if (!pw.current || !pw.newPw) { showToast("Fill in all password fields.", "error"); return; }
    if (pw.newPw !== pw.confirm)  { showToast("Passwords don't match.", "error"); return; }
    if (pw.newPw.length < 6)      { showToast("Password must be at least 6 characters.", "error"); return; }
    setPw({ current: "", newPw: "", confirm: "" });
    showToast("Password changed successfully!", "success");
  };

  return (
    <div className="space-y" style={{ maxWidth: 560 }}>
      <h1 className="page-title">Profile</h1>

      {/* Personal Info */}
      <div className="card">
        <div className="card-header"><div className="card-title">Personal Information</div></div>
        <div className="card-content">

          {/* Avatar Upload */}
          <div className="avatar-upload">
            <div className="avatar-preview">
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" />
                : (form.firstName?.[0] || "A").toUpperCase()}
            </div>
            <div>
              <button className="btn btn-outline" onClick={() => document.getElementById("avatar-input").click()}>
                Change Photo
              </button>
              <input type="file" id="avatar-input" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>JPG, PNG up to 2MB</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+977-98XXXXXXXX" />
          </div>
          <button className="btn btn-primary" onClick={handleSaveProfile}>Save Changes</button>
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="card-header"><div className="card-title">Change Password</div></div>
        <div className="card-content">
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" value={pw.newPw} onChange={e => setPw(p => ({ ...p, newPw: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} />
          </div>
          <button className="btn btn-primary" onClick={handleChangePassword}>Update Password</button>
        </div>
      </div>
    </div>
  );
}