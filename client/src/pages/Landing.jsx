import { Link } from "wouter";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <i className="fas fa-tasks text-blue-500 text-2xl mr-3"></i>
              <h1 className="text-xl font-bold text-slate-800">TaskFlow</h1>
            </div>
            <div className="flex space-x-4">
              {isAuthenticated ? (
                <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <i className="fas fa-clipboard-check text-6xl text-blue-500 mb-6"></i>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Organize Your Tasks,<br/>
              <span className="text-blue-500">Boost Your Productivity</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Simple, powerful task management that helps you stay focused and get things done. Track progress, set priorities, and achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={isAuthenticated ? "/dashboard" : "/register"} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                <i className="fas fa-rocket mr-2"></i>
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              </Link>
              {!isAuthenticated && (
                <Link href="/login" className="bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl text-lg font-semibold border border-slate-200 transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to stay organized</h2>
            <p className="text-xl text-slate-600">Powerful features designed for modern productivity</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-plus text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Quick Task Creation</h3>
              <p className="text-slate-600">Add tasks instantly with our streamlined interface. No complexity, just pure efficiency.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-emerald-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Progress Tracking</h3>
              <p className="text-slate-600">Mark tasks as complete and track your productivity over time with visual indicators.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-amber-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Secure & Private</h3>
              <p className="text-slate-600">Your tasks are protected with JWT authentication and encrypted storage.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
