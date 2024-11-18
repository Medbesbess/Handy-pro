import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import logoLight from "../../assets/handypro.svg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "admin@handypro.com",
      password: "h@ndyPro123",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      console.log("Form submitted with values:", values);
      fetch("http://localhost:3001/users/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email, password: values.password }),
      })
        .then(async(response) => {
          const data = await response.json();
          console.log(data);
          if (data.accessToken) {
            localStorage.setItem("token", data.accessToken);
            setSuccess(true);
          }
        })
        .then(() => {
          setTimeout(() => {
            navigate("/dashboard");
            window.location.reload();
          }, 500);
        })
        .catch((err) => {
          console.log(err);
        });
      setSubmitting(false);
    },
  });

  React.useEffect(() => {
    document.body.classList.add("bg-slate-50");
    return () => document.body.classList.remove("bg-slate-50");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[1200px] grid md:grid-cols-2 gap-8 items-center">
        {/* Left side content */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">
            Welcome to <span className="text-blue-600">HandyPro</span>
          </h1>
          <p className="text-slate-600">
            Access your admin dashboard and manage your business with powerful
            tools and insights.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Analytics Dashboard</h3>
              <p className="text-slate-500 text-sm">Real-time insights</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Secure Access</h3>
              <p className="text-slate-500 text-sm">Enhanced security</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Fast Performance</h3>
              <p className="text-slate-500 text-sm">Optimized speed</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Smart Management</h3>
              <p className="text-slate-500 text-sm">Efficient control</p>
            </div>
          </div>
        </div>

        {/* Right side login form */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto">
          {success && (
            <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50">
              <svg
                className="w-4 h-4 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="font-medium">Admin logged in successfully!</span>
            </div>
          )}

          <div className="text-center mb-8">
            <img
              src={logoLight}
              className="h-12 mx-auto mb-4"
              alt="HandyPro Logo"
            />
            <h2 className="text-2xl font-bold">Admin Login</h2>
            <p className="text-slate-600">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@handypro.com"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                {...formik.getFieldProps("password")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-2 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors"
            >
              {formik.isSubmitting ? "Signing in..." : "Sign in to Dashboard"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Need help?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;