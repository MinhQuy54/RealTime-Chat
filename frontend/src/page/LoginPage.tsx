import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginApi, saveAuthTokens } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import productPreview from "../assets/webApiMain3x.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await loginApi({
        username: username.trim(),
        password,
      });
      saveAuthTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      const state = location.state as { from?: string } | null;
      navigate(state?.from ?? "/", { replace: true });
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string | string[] } };
        message?: string;
      };
      const rawMessage = errorObj?.response?.data?.message ?? errorObj?.message;
      let displayMessage = "Tài khoản hoặc mật khẩu không chính xác.";

      if (Array.isArray(rawMessage)) {
        displayMessage = rawMessage.join(", ");
      } else if (typeof rawMessage === "string") {
        if (rawMessage === "INVALID_CREDENTIALS") {
          displayMessage = "Tài khoản hoặc mật khẩu không chính xác.";
        } else if (rawMessage !== "FETCH_FAILED") {
          displayMessage = rawMessage;
        }
      }

      setError(displayMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid login-page p-0">
      <div className="row g-0 min-vh-100">
        <div className="col-12 col-lg-5 col-xl-4 login-form-panel d-flex flex-column">
          <div className="login-form-wrap w-100 my-auto">
            <h2 className="login-brand mb-4">RealTime Chat</h2>

            <h3 className="login-heading mb-2">Welcome Back!</h3>
            <p className="login-subtext mb-3">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-dark fw-semibold text-decoration-underline"
              >
                Tạo tài khoản ngay
              </Link>
              , miễn phí! Chỉ mất chưa đến một phút.
            </p>

            {error ? (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control login-input"
                  placeholder="Username hoặc Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username email"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control login-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-login w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Login Now"}
              </button>

              <button
                type="button"
                className="btn btn-light btn-google w-100 d-flex align-items-center justify-content-center gap-2"
                disabled
                title="Sắp có"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt=""
                  width="18"
                  height="18"
                />
                Login with Google
              </button>
            </form>

            <p className="text-center text-secondary mt-4 mb-0 small">
              Quên mật khẩu?{" "}
              <a
                href="#"
                className="text-dark fw-semibold text-decoration-underline"
              >
                Click here
              </a>
            </p>
          </div>

          <p className="login-form-copy mb-0">
            © {new Date().getFullYear()} RealTimeChat. All rights reserved.
          </p>
        </div>

        <div className="col-12 col-lg-7 col-xl-8 login-visual d-none d-lg-block">
          <img
            src={productPreview}
            alt="Giao diện RealTimeChat"
            className="login-visual-img"
          />
        </div>
      </div>
    </div>
  );
}
