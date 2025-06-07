"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:3001";

// Common headers for all API requests
const API_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Origin: "http://localhost:3000",
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginResponse {
  isNewUser: boolean;
}

interface VerifyResponse {
  token: string;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const validatePhoneNumber = (number: string): boolean => {
    // Indian format: 6-9 followed by 9 digits
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePhoneNumber(phoneNumber)) {
      setError(
        "Please enter a valid Indian mobile number (6-9 followed by 9 digits)"
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: API_HEADERS,
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify({
          mobileNumber: phoneNumber,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login API Error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });

        if (response.status === 429) {
          throw new Error("Too many attempts. Please try again later.");
        }
        throw new Error("Failed to send OTP. Please try again.");
      }

      const data: LoginResponse = await response.json();
      setIsNewUser(data.isNewUser);
      setShowOtpInput(true);
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof Error && err.message.includes("Failed to fetch")) {
        setError(
          "Unable to connect to the server. Please check if the API server is running."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "POST",
        headers: API_HEADERS,
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify({
          mobileNumber: phoneNumber,
          otp: otp,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Verify API Error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });

        if (response.status === 401) {
          throw new Error("Invalid OTP. Please try again.");
        }
        if (response.status === 429) {
          throw new Error("Too many attempts. Please try again later.");
        }
        throw new Error("Verification failed. Please try again.");
      }

      const data: VerifyResponse = await response.json();
      login(data.token);

      // Check if we have a stored restaurantId
      const lastRestaurantId = sessionStorage.getItem("lastRestaurantId");
      if (lastRestaurantId) {
        sessionStorage.removeItem("lastRestaurantId"); // Clean up
        router.push(`/restaurant/menu/${lastRestaurantId}`);
      }

      onClose();
    } catch (err) {
      console.error("Verification error:", err);
      if (err instanceof Error && err.message.includes("Failed to fetch")) {
        setError(
          "Unable to connect to the server. Please check if the API server is running."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--copy-primary)" }}
          >
            Login with Mobile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {!showOtpInput ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--copy-primary)" }}
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--copy-primary)",
                  borderColor: "var(--card-shadow)",
                }}
                required
                pattern="[6-9]\d{9}"
                title="Please enter a valid Indian mobile number (6-9 followed by 9 digits)"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Format: 6-9 followed by 9 digits
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--copy-primary)" }}
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--copy-primary)",
                  borderColor: "var(--card-shadow)",
                }}
                required
                pattern="\d{6}"
                title="Please enter the 6-digit OTP"
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowOtpInput(false);
                setOtp("");
                setError(null);
              }}
              className="w-full py-2 px-4 text-blue-600 hover:text-blue-700 focus:outline-none"
              style={{ color: "var(--accent-primary)" }}
            >
              Change Mobile Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
