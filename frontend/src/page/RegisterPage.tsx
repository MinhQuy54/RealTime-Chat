import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { registerApi } from "../api/auth";
import productPreview from "../assets/webApiMain3x.png";

export default function RegisterPage() {
    const navigate = useNavigate()

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Mật khẩu phải có ít nhất 8 ký tự.");
            notification.warning({
                message: "Thông tin chưa hợp lệ",
                description: "Mật khẩu phải có ít nhất 8 ký tự.",
                placement: "topRight",
                duration: 3,
            });
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            notification.warning({
                message: "Thông tin chưa hợp lệ",
                description: "Mật khẩu xác nhận không trùng khớp.",
                placement: "topRight",
                duration: 3,
            });
            return;
        }
        setLoading(true);

        try {
            await registerApi({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                userName: userName.trim(),
                email: email.trim().toLowerCase(),
                password,
                confirmPassword
            });

            notification.success({
                message: "Đăng ký thành công",
                description: "Vui lòng đăng nhập để tiếp tục.",
                placement: "topRight",
                duration: 3,
            });

            navigate("/login", { replace: true });
        } catch (err: unknown) {
            const errObj = err as {
                response?: { data?: { message?: string | string[] } };
                message?: string;
            };
            const rawMessage = errObj?.response?.data?.message ?? errObj?.message;
            let displayMessage = "Đăng ký thất bại, vui lòng thử lại.";

            if (Array.isArray(rawMessage)) {
                displayMessage = rawMessage.join(", ");
            } else if (typeof rawMessage === "string") {
                switch (rawMessage) {
                    case "PASSWORD_NO_MATCH":
                        displayMessage = "Mật khẩu xác nhận không trùng khớp.";
                        break;
                    case "USERNAME_ALREADY_EXISTS":
                        displayMessage = "Tên tài khoản (Username) đã tồn tại. ";
                        break;
                    case "EMAIL_ALREADY_EXISTS":
                        displayMessage = "Email này đã được sử dụng cho tài khoản khác.";
                        break;
                    default:
                        displayMessage = rawMessage
                }
            }
            setError(displayMessage);
            notification.error({
                message: "Đăng ký thất bại",
                description: displayMessage,
                placement: "topRight",
                duration: 3,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid login-page p-0">
            <div className="row g-0 min-vh-100">
                <div className="col-12 col-lg-5 col-xl-4 login-form-panel d-flex flex-column">
                    <div className="login-form-wrap w-100 my-auto">
                        <h2 className="login-brand mb-4">RealTimeChat</h2>
                        <h3 className="login-heading mb-2">Create Account</h3>
                        <p className="login-subtext mb-3">
                            Đã có tài khoản?{" "}
                            <Link
                                to="/login"
                                className="text-dark fw-semibold text-decoration-underline"
                            >
                                Đăng nhập ngay
                            </Link>
                        </p>

                        {error ? (
                            <div className="alert alert-danger py-2" role="alert">
                                {error}
                            </div>
                        ) : null}
                        <form onSubmit={handleSubmit}>
                            <div className="row g-2 mb-3">
                                <div className="col-6">
                                    <input
                                        type="text"
                                        className="form-control login-input"
                                        placeholder="Họ"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-6">
                                    <input
                                        type="text"
                                        className="form-control login-input"
                                        placeholder="Tên"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            {/* Username */}
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control login-input"
                                    placeholder="Tên tài khoản (Username)"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    autoComplete="username"
                                    required
                                />
                            </div>
                            {/* Email */}
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control login-input"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            {/* Password */}
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control login-input"
                                    placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />
                            </div>
                            {/* Confirm Password */}
                            <div className="mb-4">
                                <input
                                    type="password"
                                    className="form-control login-input"
                                    placeholder="Xác nhận mật khẩu"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-login w-100 mb-3"
                                disabled={loading}
                            >
                                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                            </button>
                        </form>
                    </div>
                    <p className="login-form-copy mb-0">
                        © {new Date().getFullYear()} RealTimeChat. All rights reserved.
                    </p>
                </div>
                {/* Cột phải: Ảnh Preview */}
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