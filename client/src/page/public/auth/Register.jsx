import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { userRegisterSchema, adminRegisterSchema } from "../schema/registerSchema";
import { useAuth } from "../../../hooks/auth/useAuth";
import "../../../css/auth.css";

export default function Register() {
  const [role, setRole] = useState("user");
  const { register: registerUser, loading, error } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(role === "user" ? userRegisterSchema : adminRegisterSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...rest } = data;
      await registerUser({ ...rest, role });
      navigate("/login");
    } catch {}
  };

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    reset();
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card fade-up">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🛍</div>
          Shop<em>Nova</em>
        </div>

        {/* Role Tabs */}
        <div className="role-tabs">
          <button
            className={`role-tab ${role === "user" ? "active-user" : ""}`}
            onClick={() => handleRoleSwitch("user")}
          >
            👤 User
          </button>
          <button
            className={`role-tab ${role === "admin" ? "active-admin" : ""}`}
            onClick={() => handleRoleSwitch("admin")}
          >
            🛡️ Admin
          </button>
        </div>

        {/* Title */}
        {role === "admin" && (
          <div className="admin-badge">🛡️ Admin Registration</div>
        )}
        <h2 className="auth-title">
          {role === "admin" ? (
            <><span className="admin-accent">Request</span> Access.</>
          ) : (
            <>Create <span className="user-accent">Account.</span></>
          )}
        </h2>
        <p className="auth-sub">
          {role === "admin"
            ? "Submit your request for admin privileges"
            : "Join thousands of happy shoppers"}
        </p>

        {/* Server Error */}
        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Name Row */}
          <div className="name-row mb-3">
            <div>
              <label className="auth-label">First Name</label>
              <input
                type="text"
                className={`auth-input ${role === "admin" ? "admin-focus" : ""} ${errors.firstName ? "is-invalid" : ""}`}
                placeholder="First"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="auth-error-msg">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="auth-label">Last Name</label>
              <input
                type="text"
                className={`auth-input ${role === "admin" ? "admin-focus" : ""}`}
                placeholder="Last"
                {...register("lastName")}
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              className={`auth-input ${role === "admin" ? "admin-focus" : ""} ${errors.email ? "is-invalid" : ""}`}
              placeholder="you@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="auth-error-msg">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className={`auth-input ${role === "admin" ? "admin-focus" : ""} ${errors.password ? "is-invalid" : ""}`}
              placeholder="Min. 8 characters"
              {...register("password")}
            />
            {errors.password && (
              <p className="auth-error-msg">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="auth-label">Confirm Password</label>
            <input
              type="password"
              className={`auth-input ${role === "admin" ? "admin-focus" : ""} ${errors.confirmPassword ? "is-invalid" : ""}`}
              placeholder="Re-enter password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="auth-error-msg">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`btn-auth ${role === "admin" ? "btn-admin" : "btn-user"}`}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" />
            ) : role === "admin" ? "Submit Request" : "Create Account"}
          </button>
        </form>

        <div className="auth-divider">or</div>
        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className={role === "admin" ? "link-admin" : "link-user"}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}