"use client" 
import { useState } from 'react';  
import { useRouter } from 'next/navigation';  
import Link from 'next/link';  
  
const Login = () => {  
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');  
  const router = useRouter();  
  
  const handleSubmit = async (e:any) => {  
    e.preventDefault();  
    // Here you would typically send a request to your backend API  
    // For demonstration, we'll just log the data and redirect  
    console.log('Login attempt:', { email, password });  
    router.push('/dashboard'); // Redirect to dashboard after successful login  
  };  
  
  return (  
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">  
      <div className="max-w-md w-full space-y-8">  
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">  
          Sign in to your account  
        </h2>  
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>  
          <input type="hidden" name="remember" defaultValue="true" />  
          <div className="rounded-md shadow-sm -space-y-px">  
            <div>  
              <label htmlFor="email-address" className="sr-only">  
                Email address  
              </label>  
              <input  
                id="email-address"  
                name="email"  
                type="email"  
                autoComplete="email"  
                required  
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"  
                placeholder="Email address"  
                value={email}  
                onChange={(e) => setEmail(e.target.value)}  
              />  
            </div>  
            <div>  
              <label htmlFor="password" className="sr-only">  
                Password  
              </label>  
              <input  
                id="password"  
                name="password"  
                type="password"  
                autoComplete="current-password"  
                required  
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"  
                placeholder="Password"  
                value={password}  
                onChange={(e) => setPassword(e.target.value)}  
              />  
            </div>  
          </div>  
  
          <div>  
            <button  
              type="submit"  
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"  
            >  
              Sign in  
            </button>  
          </div>  
        </form>  
        <div className="text-center">  
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">  
            Don't have an account? Register  
          </Link>  
        </div>  
      </div>  
    </div>  
  );  
} 
 
export default Login;