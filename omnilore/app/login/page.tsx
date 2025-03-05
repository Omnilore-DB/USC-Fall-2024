'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import Logo from "@/components/assets/logo.png"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AlertBox from "@/components/alertbox";
import {supabase} from "@/app/supabase";
import Company from "@/components/ui/company";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL
  const DEFAULT_GENERAL_EMAIL = "member@omnilore.org";
  const DEFAULT_GENERAL_PASSWORD = "CBIWbvMQNUStFCGhnXwV";

  useEffect(() => {
    if (token) {
      handleTokenLogin(token);
    }
  }, [token]);
    
  const handleTokenLogin = async (token: string) => {
    console.log("Token received:", token);
    
    // Allow multiple test tokens for debugging
    const validTokens = ["demo_token_12345", "fake_jwt_token_123"];
    
    if (validTokens.includes(token)) {
      await supabase.auth.signInWithPassword({
        email: "member@omnilore.org",
        password: token, // Using token as a password for testing
      });
        router.push("/search"); // Redirect to dashboard after successful login
      } else {
        alert("Invalid token. Please log in manually.");
    }
  };
    

  const redirectToAdminLogin = () => {
    router.push('/admin-login');
  };

  const redirectToGeneralMemberLogin = async () => {
    router.push('/general-login');
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email: DEFAULT_GENERAL_EMAIL,
    //   password: DEFAULT_GENERAL_PASSWORD,
    // });
    //   if (error) {
    //       setAlertMessage(error.message);
    //   } else {
    //       setAlertMessage('Successfully logged in!');
    //       router.push('/search');
    //   }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4">
        <Company />
      </header>
      {showAlert && <AlertBox message={alertMessage} onClose={() => setShowAlert(false)} />}
      <main className="flex-grow flex flex-col md:flex-row justify-center p-4 pb-20 items-center">
        <div className="w-full max-w-md space-y-8 md:pr-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold">Welcome back Member!</h2>
          </div>
          <div className="space-y-4">        
            <Button 
              className="h-30 w-full bg-blue-600 hover:bg-blue-700 text-white text-lg" 
              onClick={redirectToGeneralMemberLogin}>
              General Member Log In
            </Button>
          </div>
          <div className="text-center">
            <span className="px-2 bg-white text-sm text-gray-500">OR</span>
          </div>
          <Button variant="outline"
            className="h-30 w-full border-blue-600 text-blue-600 hover:bg-blue-50 text-lg"
            onClick={redirectToAdminLogin}>
            Admin Member Log In
          </Button>
        </div>
        <div className="flex justify-center mt-4 ml-10"> {/* New div for logo */}
          <img src={Logo.src} className="w-64 h-fit" />
        </div>
      </main>
    </div>
  )
}
// **********************
// 'use client'

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useRouter } from "next/navigation";
// // import Image from "next/image";
// import Logo from "@/components/assets/logo.png"
// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import AlertBox from "@/components/alertbox";
// import {supabase} from "@/app/supabase";
// import Company from "@/components/ui/company";

// export default function LoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token"); // Get token from URL
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');

//   useEffect(() => {
//     if (token) {
//       handleTokenLogin(token);
//     }
//   }, [token]);

//   const handleTokenLogin = async (token: string) => {
//     console.log("Token received:", token);

//     // Allow multiple test tokens for debugging
//     const validTokens = ["demo_token_12345", "fake_jwt_token_123"];

//     if (validTokens.includes(token)) {
//         await supabase.auth.signInWithPassword({
//             email: "member@omnilore.org",
//             password: token, // Using token as a password for testing
//         });

//         router.push("/search"); // Redirect to dashboard after successful login
//     } else {
//         alert("Invalid token. Please log in manually.");
//     }
// };


//   // const redirectToSignUp = () => {
//   //   router.push('/signup');
//   // };

//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     if (!validateEmail(value)) {
//       setEmailError('Please enter a valid email address.'); // Set error message
//     } else {
//       setEmailError(''); // Clear error message
//     }
//     setEmail(value);
//   }

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword(e.target.value);
//   }

//   const handleLogin = async () => {
//     setShowAlert(true);
//     if (emailError) {
//       setAlertMessage('Please correct the highlighted errors before logging in.');
//     }
//     else {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: email,
//         password: password,
//       });
//         if (error) {
//             setAlertMessage(error.message);
//         } else {
//             setAlertMessage('Successfully logged in!');
//             router.push('/search');
//         }
//     }
//   }

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       <header className="p-4">
//         <Company />
//       </header>
//       {showAlert && <AlertBox message={alertMessage} onClose={() => setShowAlert(false)} />}
//       <main className="flex-grow flex flex-col md:flex-row justify-center p-4 pt-10">
//         <div className="w-full max-w-md space-y-8 md:pr-8">
//           <div className="text-center space-y-2">
//             <h2 className="text-3xl font-semibold">Welcome back Member!</h2>
//             <p className="text-gray-600">If you are an admin, enter your credentials to access your account.
//             If you are a member, please log in through{" "}
//             <a href="https://omnilore.org" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
//               omnilore.org
//             </a>
//             !
//             </p>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email address
//               </label>
//               <Input id="email" type="email" placeholder="Enter your email" className="mt-1" onChange={handleEmailChange} value={email} />
//               {emailError && (
//                 <div className="text-red-500 text-sm">{emailError}</div>
//               )}
//             </div>
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <Input id="password" type="password" placeholder="Enter your password" className="mt-1" onChange={handlePasswordChange} value={password} />
//             </div>
//             <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleLogin}>Log In</Button>
//           </div>
//           {/* <div className="text-center">
//             <span className="px-2 bg-white text-sm text-gray-500">OR</span>
//           </div>
//           <Button variant="outline"
//             className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
//             onClick={redirectToSignUp}>
//             Sign Up
//           </Button> */}
//         </div>
//         <div className="flex justify-center mt-4 ml-10"> {/* New div for logo */}
//           <img src={Logo.src} className="w-64 h-fit" />        
//         </div>
//       </main>
//     </div>
//   )
// }