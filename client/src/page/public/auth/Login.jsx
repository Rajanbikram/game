import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { userLoginSchema, adminLoginSchema } from "../schema/loginSchema";
import { useAuth } from "../../../hooks/auth/useAuth";
import "../../../css/auth.css";

export default function Login() {
  const [role, setRole] = useState("user");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(role === "user" ? userLoginSchema : adminLoginSchema),
  });

 const onSubmit = async (data) => {
  try {
    const res = await login({ ...data, role });
    if (res.user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/home");  // ← /dashboard hoina /home
    }
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
          <div className="admin-badge">🛡️ Admin Portal</div>
        )}
        <h2 className="auth-title">
          {role === "admin" ? (
            <><span className="admin-accent">Admin</span> Access.</>
          ) : (
            <>Welcome <span className="user-accent">Back.</span></>
          )}
        </h2>
        <p className="auth-sub">
          {role === "admin"
            ? "Restricted to authorized personnel only"
            : "Sign in to your ShopNova account"}
        </p>

        {/* Server Error */}
        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>

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
              placeholder="Your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="auth-error-msg">{errors.password.message}</p>
            )}
          </div>

          {/* Admin PIN */}
          {role === "admin" && (
            <div className="mb-3">
              <label className="auth-label">Admin PIN</label>
              <input
                type="password"
                className={`auth-input admin-focus ${errors.adminPin ? "is-invalid" : ""}`}
                placeholder="5-digit PIN"
                maxLength={5}
                {...register("adminPin")}
              />
              {errors.adminPin && (
                <p className="auth-error-msg">{errors.adminPin.message}</p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={`btn-auth ${role === "admin" ? "btn-admin" : "btn-user"}`}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" />
            ) : role === "admin" ? "Access Dashboard" : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">or</div>
        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register" className={role === "admin" ? "link-admin" : "link-user"}>
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}