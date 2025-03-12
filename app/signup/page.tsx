'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"; // Import useState for managing state
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "@/components/assets/logo.png"
import AlertBox from "@/components/alertbox"
import Company from "@/components/ui/company";
import {supabase} from "@/app/supabase";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password input
  const [emailError, setEmailError] = useState(''); // State for email error message
  const [passwordError, setPasswordError] = useState(''); // State for password error message
  const [confirmPasswordError, setConfirmPasswordError] = useState(''); // State for confirm password error message
  const [showAlert, setShowAlert] = useState(false); // State for alert visibility
  const [alertMessage, setAlertMessage] = useState(''); // State for alert message

  const redirectToAdminLogin = () => {
    router.push('/admin-login');
  };

  const validateEmail = (email: string) => {
    // Simple regex for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!validateEmail(value)) {
      setEmailError('Please enter a valid email address.'); // Set error message
    } else {
      setEmailError(''); // Clear error message
    }
    setEmail(value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters long.'); // Set error message
    } else {
      setPasswordError(''); // Clear error message
    }
    setPassword(value);
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value !== password) {
      setConfirmPasswordError('Passwords do not match.'); // Set error message
    } else {
      setConfirmPasswordError(''); // Clear error message
    }
    setConfirmPassword(value);
  }

  const handleSignUp = () => {
    setShowAlert(true);
    if (emailError || passwordError || confirmPasswordError) {
      setAlertMessage('Please correct the highlighted errors before signing up.');
    }
    else {
      supabase.auth.signUp({
        email: email,
        password: password,
      }).then(response => {
        const { data, error } = response;
        if (error) {
          setAlertMessage(error.message);
        } else {
          setAlertMessage('Sign up successful!');
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      <header className="p-4">
        <Company />
      </header>
      {showAlert && <AlertBox message={alertMessage} onClose={() => setShowAlert(false)} />}
      <main className="flex-grow flex flex-col md:flex-row justify-center p-4 pt-10">
        <div className="w-full max-w-md space-y-8 md:pr-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold">Create your account</h2>
            <p className="text-gray-600">Input your credentials to create your account</p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className="mt-1" 
                value={email} // Bind email state
                onChange={handleEmailChange} // Handle email change
              />
               {emailError && (
                <div className="text-red-500 text-sm">{emailError}</div>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                className="mt-1" 
                value={password} // Bind password state
                onChange={handlePasswordChange} // Handle password change
              />
              {passwordError && (
                <div className="text-red-500 text-sm">{passwordError}</div>
              )}
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="Confirm your password" 
                className="mt-1" 
                value={confirmPassword} // Bind confirm password state
                onChange={handleConfirmPasswordChange} // Handle confirm password change
              />
              {confirmPasswordError && (
                <div className="text-red-500 text-sm">{confirmPasswordError}</div>
              )}
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSignUp} // Handle sign-up click
            >
              Sign Up
            </Button>
          </div>
          <div className="text-center">
            <span className="px-2 bg-white text-sm text-gray-500">OR</span>
          </div>
          <Button variant="outline" 
          className="w-full border-gray-100 text-gray-600 hover:bg-gray-300 bg-gray-100"
          onClick={redirectToAdminLogin}>
            Cancel
          </Button>
        </div>
        <div className="flex justify-center mt-4 ml-10"> {/* New div for logo */}
          <img src={Logo.src} className="w-64 h-fit" />
        </div>
      </main>
    </div>
  )
}