"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, Package, Mail } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ForgotSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const router = useRouter();

  // Auto redirect to login after success
  useEffect(() => {
    if (sent) {
      const timer = setTimeout(() => {
        router.replace("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sent, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-2">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center mb-4">
          <div className="h-14 w-14 sm:h-12 sm:w-12 rounded-lg bg-blue-600 flex items-center justify-center mb-2">
            <Package className="h-8 w-8 sm:h-7 sm:w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-blue-700">Forgot Password</h1>
          <p className="text-gray-500 text-sm text-center">Enter your email and we&apos;ll send you a link to reset your password.</p>
        </div>
        {sent ? (
          <div className="text-center text-green-600 font-semibold py-8">
            If an account exists for that email, a reset link has been sent.
            <div className="mt-4 text-sm text-gray-500">
              Redirecting to login in 3 seconds...
            </div>
            <div className="mt-4">
              <Link href="/login" className="text-blue-600 hover:underline font-medium">Back to Login</Link>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={{ email: "" }}
            validationSchema={ForgotSchema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              setTimeout(() => {
                setSent(true);
                setSubmitting(false);
              }, 1200);
            }}
          >
            {({ isSubmitting, isValid, touched }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      placeholder="you@email.com"
                      className="pl-10"
                      autoFocus
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-xs text-red-500 mt-1" />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3 font-semibold"
                  disabled={isSubmitting || !isValid || !touched.email}
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Send Reset Link"}
                </Button>
                <div className="text-center text-sm text-gray-600">
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">Back to Login</Link>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
} 