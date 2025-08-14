import React from "react";

export default function BackendDocs() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 font-serif text-gray-800">
      <h1 className="text-5xl font-extrabold mb-8 tracking-tight text-gray-900">
        Genzura Backend API Documentation
      </h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-10">
        This page provides an overview of the <strong>Genzura backend API</strong> endpoints,
        authentication methods, and usage examples.
        You can use the{" "}
        <a
          href="https://marketplace.visualstudio.com/items?itemName=humao.rest-client"
          className="text-blue-700 font-semibold hover:underline"
        >
          VS Code REST Client
        </a>{" "}
        to test these endpoints.
      </p>

      {/* Base URL & Auth */}
      <section className="mb-14">
        <h2 className="text-3xl font-bold mb-4 border-b-2 border-gray-300 pb-1 tracking-wide">
          ⎯⎯⎯ Base URL & Variables ⎯⎯⎯
        </h2>
        <pre className="bg-gray-900 text-white p-5 rounded-xl overflow-auto text-sm shadow-lg">
{`Base URL: https://genzura.aphezis.com
Content-Type: application/json

Variables:
@platformToken = YOUR_PLATFORM_TOKEN_HERE
@orgToken      = YOUR_ORG_TOKEN_HERE
@orgId         = 1
@branchId      = 1
@employeeId    = 1`}
        </pre>
      </section>

      {/* Authentication */}
      <section className="mb-14">
        <h2 className="text-3xl font-bold mb-4 border-b-2 border-gray-300 pb-1 tracking-wide">
          ⎯⎯⎯ Authentication ⎯⎯⎯
        </h2>
        <p className="mb-3">Login to obtain tokens for API requests:</p>
        <h3 className="text-xl font-bold mt-5">Platform Admin Login</h3>
        <pre className="bg-gray-900 text-white p-5 rounded-xl overflow-auto text-sm shadow-lg">
{`POST /auth/platform/login
Content-Type: application/json

{
  "email": "admin@genzura.com",
  "password": "admin123"
}`}
        </pre>

        <h3 className="text-xl font-bold mt-5">Organization User Login</h3>
        <pre className="bg-gray-900 text-white p-5 rounded-xl overflow-auto text-sm shadow-lg">
{`POST /auth/login
Content-Type: application/json

{
  "email": "john.doe@democompany.com",
  "password": "user123"
}`}
        </pre>
      </section>

      {/* Organization Management */}
      <section className="mb-14">
        <h2 className="text-3xl font-bold mb-4 border-b-2 border-gray-300 pb-1 tracking-wide">
          ⎯⎯⎯ Organization Management ⎯⎯⎯
        </h2>
        <p>Platform Admin endpoints for creating, updating, and deleting organizations.</p>

        <h3 className="text-xl font-bold mt-5">Create Organization</h3>
        <pre className="bg-gray-900 text-white p-5 rounded-xl overflow-auto text-sm shadow-lg">
{`POST /organizations
Authorization: Bearer {platformToken}
Content-Type: application/json

{
  "name": "New Test Company",
  "tier": "Pro",
  "subscription_start": "2025-01-01",
  "subscription_end": "2025-12-31"
}`}
        </pre>

        <h3 className="text-xl font-bold mt-5">List All Organizations</h3>
        <pre className="bg-gray-900 text-white p-5 rounded-xl overflow-auto text-sm shadow-lg">
{`GET /organizations
Authorization: Bearer {platformToken}`}
        </pre>
      </section>

      {/* Branch Management */}
      <section className="mb-14">
        <h2 className="text-3xl font-bold mb-4 border-b-2 border-gray-300 pb-1 tracking-wide">
          ⎯⎯⎯ Branches Management ⎯⎯⎯
        </h2>
        <p>Organization-level endpoints for managing branches.</p>

        <h3 className="text-xl font-bold mt-5">Create Branch</h3>
        <pre className="bg-gray-900 text-white p-5 rounded-xl overflow-auto text-sm shadow-lg">
{`POST /branches
Authorization: Bearer {orgToken}
Content-Type: application/json

{
  "name": "Technology Hub",
  "location": "Silicon Valley",
  "phone": "+1-555-0102",
  "email": "tech@democompany.com"
}`}
        </pre>

        <h3 className="text-xl font-bold mt-5">List Branches</h3>
        <pre className="bg-gray-900 text-white p-5 rounded-xl overflow-auto text-sm shadow-lg">
{`GET /branches
Authorization: Bearer {orgToken}`}
        </pre>
      </section>

      {/* Employees */}
      <section className="mb-14">
        <h2 className="text-3xl font-bold mb-4 border-b-2 border-gray-300 pb-1 tracking-wide">
          ⎯⎯⎯ Employees Management ⎯⎯⎯
        </h2>
        <p>Manage employees within branches of an organization.</p>

        <h3 className="text-xl font-bold mt-5">Create Employee</h3>
        <pre className="bg-gray-900 text-white p-5 rounded-xl overflow-auto text-sm shadow-lg">
{`POST /employees
Authorization: Bearer {orgToken}
Content-Type: application/json

{
  "first_name": "Alice",
  "last_name": "Johnson",
  "email": "alice.johnson@democompany.com",
  "phone": "+1-555-0123",
  "job_title": "Software Developer",
  "basic_salary": "75000.00",
  "hire_date": "2025-01-15"
}`}
        </pre>
      </section>

      {/* Testing & Errors */}
      <section className="mb-14">
        <h2 className="text-3xl font-bold mb-4 border-b-2 border-gray-300 pb-1 tracking-wide">
          ⎯⎯⎯ Testing & Error Cases ⎯⎯⎯
        </h2>
        <h3 className="text-xl font-bold mt-5">Invalid Login</h3>
        <pre className="bg-gray-900 text-white p-5 rounded-xl overflow-auto text-sm shadow-lg">
{`POST /auth/platform/login
Content-Type: application/json

{
  "email": "invalid@email.com",
  "password": "wrongpassword"
}`}
        </pre>
      </section>
    </div>
  );
}
