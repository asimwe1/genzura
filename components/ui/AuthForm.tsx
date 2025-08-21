import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

/**
 * AuthForm is a reusable authentication form for login and signup.
 *
 * Props:
 * - mode: "login" | "signup"
 * - onSubmit: (fields) => void
 * - loading: boolean
 * - error?: string
 * - success?: string
 * - fields: Array<{
 *     name: string;
 *     label: string;
 *     type: string;
 *     placeholder?: string;
 *     required?: boolean;
 *     value: string;
 *     onChange: (e) => void;
 *     icon?: React.ReactNode;
 *     inputClassName?: string;
 *   }>
 * - children: React.ReactNode (for extra fields or actions)
 */
export default function AuthForm({
  mode = "login",
  onSubmit,
  loading = false,
  error,
  success,
  fields = [],
  children,
  submitLabel,
  extraAction,
}: {
  mode: "login" | "signup";
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  error?: string;
  success?: string;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
    inputClassName?: string;
  }>;
  children?: React.ReactNode;
  submitLabel?: string;
  extraAction?: React.ReactNode;
}) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Authentication Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Success!</p>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        </div>
      )}

      {fields.map((field) => (
        <div className="space-y-3" key={field.name}>
          <Label className="block text-base font-medium text-gray-700">{field.label}</Label>
          <div className="relative">
            {field.icon && (
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 flex items-center">{field.icon}</span>
            )}
            <Input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              className={
                (field.icon ? "pl-12 " : "") +
                (field.inputClassName || "py-4 text-base bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 transition-colors")
              }
              value={field.value}
              onChange={field.onChange}
              required={field.required}
              disabled={loading}
            />
          </div>
        </div>
      ))}
      
      {children}
      
      <Button
        type="submit"
        className="w-full mt-6 py-5 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white transition-all duration-200 rounded-lg shadow-lg relative overflow-hidden"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            {mode === "login" ? "Signing in..." : "Creating account..."}
          </>
        ) : (
          submitLabel || (mode === "login" ? "Sign In" : "Create Account")
        )}
      </Button>
      
      {extraAction && <div className="mt-6">{extraAction}</div>}
    </form>
  );
} 