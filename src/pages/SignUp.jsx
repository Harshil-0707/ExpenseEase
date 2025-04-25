import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { MainButton } from "../components/ui/MainButton";
import LoginArt from "../assets/LoginArt.png";
import { Snackbar } from "@mui/material"; // Import Snackbar

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message for snackbar

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { name: "", email: "", password: "" };

    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email address must be valid";
    }
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.values(newErrors).some((error) => error !== "")) {
      setErrors(newErrors);
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/registration`,
          formData
        );
        console.log("Registration successful:", response.data);
        setSnackbarMessage("Registration successful!");
        setOpenSnackbar(true); // Open the snackbar

        // Navigate to the dashboard after 2 seconds
        setTimeout(() => {
          navigate("/dashboard"); // Replace with your actual dashboard route
        }, 2000);
      } catch (error) {
        console.error("Error during registration:", error);
        setSnackbarMessage("Registration failed. Please try again.");
        setOpenSnackbar(true); // Open the snackbar for error
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close the snackbar
  };

  return (
    <div className="h-screen">
      <div className="hidden md:flex h-full">
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-[388px] space-y-8">
            <div>
              <h1 className="text-3xl text-primary-text tracking-tight">
                Create Account <span>✨</span>
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                inputType="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p>{errors.name}</p>}

              <Input
                label="Email"
                placeholder="Example@email.com"
                inputType="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p>{errors.email}</p>}

              <Input
                label="Password"
                placeholder="At least 8 characters"
                inputType="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p>{errors.password}</p>}

              <MainButton text="Create Account" type="desktop" />
            </form>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-primary-text">Or</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-[#313957]">
                Already have an account?{" "}
                <NavLink to="/login" className="text-link hover:underline">
                  Log in
                </NavLink>
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-[#959cb5]">
                ©️ 2025 ALL RIGHTS RESERVED
              </p>
            </div>
          </div>
        </div>

        <div className="w-1/2 h-full">
          <img
            className="w-full h-full object-cover"
            alt="Login art"
            src={LoginArt}
          />
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden flex-col p-6 gap-6">
        <img
          className="w-full h-44 object-cover rounded-xl"
          src={LoginArt}
          alt="Login art"
        />

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-primary-text text-center">
            Create Account ✨
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your name"
              inputType="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p>{errors.name}</p>}

            <Input
              label="Email"
              placeholder="Example@email.com"
              inputType="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p>{errors.email}</p>}

            <Input
              label="Password"
              placeholder="At least 8 characters"
              inputType="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p>{errors.password}</p>}

            <MainButton text="Create Account" type="mobile" />
          </form>

          <div className="text-center">
            <p className="text-sm text-[#313957]">
              Already have an account?{" "}
              <NavLink to="/login" className="text-link hover:underline">
                Log in
              </NavLink>
            </p>
            <p className="text-sm text-[#959cb5] mt-2">
              ©️ 2025 ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </div>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
}

export default SignUp;
