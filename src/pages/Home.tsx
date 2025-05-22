// src/pages/Home.tsx
import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Modal from "../components/Modal"

export default function Home() {
  const navigate = useNavigate()
  const [isHowToOpen, setIsHowToOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with popup trigger */}
      <Sidebar onHowToClick={() => setIsHowToOpen(true)} />

      {/* Main content */}
      <main className="flex-1 space-y-24 py-16 px-4 md:px-8 lg:px-16">
        {/* HERO */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Save money. Compare grocery prices from your favourite Czech supermarkets.
          </h1>
          <p className="text-gray-600">
            Kolik helps you find the cheapest basket across Billa, Tesco and Albert.
          </p>
          <button
            onClick={() => navigate("/search")}
            className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Start Comparing
          </button>
        </section>

        {/* LOGOS */}
        <section className="flex flex-wrap justify-center items-center gap-8 pt-6">
          <div className="h-20 w-40 flex items-center justify-center bg-white p-2 rounded">
            <img
              src="/logos/billalogo.png"
              alt="Billa"
              className="h-full object-contain scale-[1.4]"
            />
          </div>
          <div className="h-20 w-40 flex items-center justify-center bg-white p-2 rounded">
            <img
              src="/logos/tesco logo.jpeg"
              alt="Tesco"
              className="h-full object-contain scale-[1.6]"
            />
          </div>
          <div className="h-20 w-40 flex items-center justify-center bg-white p-2 rounded">
            <img
              src="/logos/Albert_Logo.png"
              alt="Albert"
              className="h-full object-contain scale-[0.9]"
            />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">How it works:</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Search for a product 🔍</li>
              <li>Compare across shops 🛒</li>
              <li>Save and shop smarter! 💸</li>
            </ol>
          </div>
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
            {/* TODO: embed video here */}
            <span className="text-gray-400">[Instructional video here]</span>
          </div>
        </section>

        {/* ABOUT */}
        <section className="bg-gray-50 py-12 px-6 rounded-lg text-center max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">About Kolik</h2>
          <p className="text-gray-600">
            We are a student-built, privacy-focused tool to help Czech shoppers make smart choices
            without tracking or ads.
          </p>
        </section>
      </main>

      {/* Modal for “How to Create Your Account” */}
      <Modal isOpen={isHowToOpen} onClose={() => setIsHowToOpen(false)}>
        <div className="p-6 max-w-xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">How to Create Your Account</h1>

          {/* Step 1 */}
          <div>
            <h2 className="font-semibold">Step 1: Register ✅</h2>
            <ul className="list-decimal list-inside ml-4 space-y-1">
             <li>
               Go to the{" "}
               <Link
                 to="/register"
                 className="text-blue-600 underline hover:text-blue-700"
               >
                 registration
               </Link>{" "}
               page.
             </li>
              <li>Fill in your name, email address, and password.</li>
              <li>Agree to the Terms and Privacy Policy.</li>
              <li>Click “Register.”</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div>
            <h2 className="font-semibold">Step 2: Verify Your Email</h2>
            <ul className="list-decimal list-inside ml-4 space-y-1">
              <li>Check your email inbox.</li>
              <li>Open the message from Kolik and click “Verify Email.”</li>
              <li>This confirms your email address is real.</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div>
            <h2 className="font-semibold">Step 3: Login to Your Account ✅</h2>
            <ul className="list-decimal list-inside ml-4 space-y-1">
              <li>After verifying, go to the Login page.</li>
              <li>Enter your email and password.</li>
            </ul>
          </div>

          {/* Step 4 */}
          <div>
            <h2 className="font-semibold">Step 4: Set Up Two-Factor Authentication (MFA) ✅</h2>
            <ul className="list-decimal list-inside ml-4 space-y-1">
              <li>Upon first login, you’ll see a QR code.</li>
              <li>Scan it with Google/Microsoft Authenticator or another TOTP app.</li>
              <li>Enter the 6-digit code from your app to confirm.</li>
              <li className="italic text-sm text-gray-500">
                Tip: If you don’t have an authenticator app, download one free from your app store.
              </li>
            </ul>
          </div>

          {/* Step 5 */}
          <div>
            <h2 className="font-semibold">Step 5: Login with MFA ✅</h2>
            <ul className="list-decimal list-inside ml-4 space-y-1">
              <li>On future logins, enter your email & password.</li>
              <li>Then enter the 6-digit code from your authenticator app.</li>
            </ul>
          </div>

          <p className="mt-4 font-semibold">
            Done! You now have a fully secured Kolik account. ✅
          </p>
        </div>
      </Modal>
    </div>
  )
}
