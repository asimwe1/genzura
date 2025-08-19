# Genzura Rust Backend Integration

This document outlines the integration between the Next.js frontend and the Rust backend API for the Genzura platform.

## 🚀 Overview

The integration connects the Next.js frontend to the Rust backend API running at `https://genzura.aphezis.com`, providing:

- **Authentication & Authorization** - Platform admin and organization user management
- **Organization Management** - CRUD operations for organizations
- **Branch Management** - Multi-branch support for organizations
- **Employee Management** - Comprehensive employee data handling
- **Role-based Access Control** - Secure access management

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Next.js       │ ◄─────────────► │   Rust Backend  │
│   Frontend      │                 │   API           │
│                 │                 │                 │
│ • React         │                 │ • Actix-web     │
│ • TypeScript    │                 │ • SQLx          │
│ • Tailwind CSS  │                 │ • JWT Auth      │
└─────────────────┘                 └─────────────────┘
```

## 🔧 Backend API Endpoints

### Authentication
- `POST /auth/platform/login` - Platform admin login
- `POST /auth/login` - Organization user login

### Organizations
- `GET /organizations` - List organizations
- `POST /organizations` - Create organization
- `GET /organizations/:id` - Get organization by ID
- `PUT /organizations/:id` - Update organization
- `DELETE /organizations/:id` - Delete organization

### Branches
- `GET /branches` - List branches
- `POST /branches` - Create branch
- `GET /branches/:id` - Get branch by ID
- `PUT /branches/:id` - Update branch
- `DELETE /branches/:id` - Delete branch
- `GET /branches/:id/employees` - Get branch employees

### Employees
- `GET /employees` - List employees
- `POST /employees` - Create employee
- `GET /employees/:id` - Get employee by ID
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

## 📁 Frontend Integration Files

### Core API Client
- **`lib/api.ts`** - Main API client with TypeScript interfaces
- **`hooks/useApi.ts`** - React hooks for API state management

### Components
- **`components/OrganizationManager.tsx`** - Platform admin organization management
- **`app/platform/page.tsx`** - Platform administration page
- **`app/api-test/page.tsx`** - API integration testing page

### Updated Components
- **`app/login/page.tsx`** - Enhanced login with Rust backend
- **`components/AuthGuard.tsx`** - Updated authentication guard
- **`components/sidebar.tsx`** - Added platform admin navigation

## 🔐 Authentication Flow

### Platform Admin Login
1. User enters `admin@genzura.com` credentials
2. Frontend detects platform admin email
3. Calls `/auth/platform/login` endpoint
4. Receives JWT token and user role
5. Stores authentication data in localStorage
6. Redirects to platform admin dashboard

### Organization User Login
1. User enters organization credentials
2. Calls `/auth/login` endpoint
3. Receives JWT token, user role, and organization ID
4. Stores authentication data in localStorage
5. Redirects to appropriate portal (product/service)

## 🎯 Key Features

### 1. Role-based Access Control
- **Platform Admin**: Full access to all organizations
- **SuperAdmin**: Organization-level administration
- **BranchAdmin**: Branch-level management
- **User**: Basic access within organization

### 2. Multi-tenant Architecture
- Organizations are isolated from each other
- Users can only access their own organization's data
- Platform admins can manage all organizations

### 3. Real-time Data Sync
- Automatic data refresh after CRUD operations
- Optimistic UI updates
- Error handling and user feedback

### 4. Responsive Design
- Mobile-first approach
- Adaptive sidebars
- Touch-friendly interfaces

## 🧪 Testing the Integration

### 1. API Test Page
Visit `/api-test` to test the integration:
- Authentication testing
- API endpoint verification
- Data loading validation
- Connection status monitoring

### 2. Demo Credentials
```
Platform Admin:
- Email: admin@genzura.com
- Password: admin123

Organization User:
- Email: john.doe@democompany.com
- Password: user123
```

### 3. Testing Workflow
1. **Authenticate** with demo credentials
2. **Test API calls** to verify backend connectivity
3. **Check console** for detailed API responses
4. **Verify data** loads correctly in components

## 🚀 Getting Started

### Prerequisites
- Next.js development server running
- Rust backend accessible at `https://genzura.aphezis.com`
- Valid demo credentials

### Development Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/asimwe1/genzura.git
   cd genzura
   git checkout integration
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Test the integration**
   - Visit `/api-test` to verify backend connectivity
   - Use demo credentials to test authentication
   - Navigate to `/platform` as platform admin

## 🔧 Configuration

### Environment Variables
The integration uses the following configuration:

```typescript
// Default backend URL
const BACKEND_URL = 'https://genzura.aphezis.com'

// Authentication storage keys
const AUTH_TOKEN_KEY = 'authToken'
const USER_ROLE_KEY = 'userRole'
const ORGANIZATION_ID_KEY = 'organizationId'
```

### Customization
To use a different backend URL:

```typescript
// In lib/api.ts
export const apiClient = new ApiClient('https://your-backend-url.com');
```

## 📊 Data Models

### Organization
```typescript
interface Organization {
  id: number;
  name: string;
  tier: 'Basic' | 'Pro' | 'Enterprise';
  subscription_start: string;
  subscription_end: string;
  created_at: string;
  updated_at: string;
}
```

### Branch
```typescript
interface Branch {
  id: number;
  name: string;
  location: string;
  phone: string;
  email: string;
  manager_id?: number;
  organization_id: number;
  created_at: string;
  updated_at: string;
}
```

### Employee
```typescript
interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  job_title: string;
  basic_salary: string;
  hire_date: string;
  status: 'active' | 'inactive';
  branch_id?: number;
  organization_id: number;
  created_at: string;
  updated_at: string;
}
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Authentication Failed
- Verify backend is running and accessible
- Check demo credentials are correct
- Ensure CORS is properly configured on backend

#### 2. API Calls Failing
- Check network tab for HTTP errors
- Verify JWT token is valid and not expired
- Check backend logs for error details

#### 3. Data Not Loading
- Verify user has proper permissions
- Check organization ID is correctly set
- Ensure API endpoints are working

### Debug Mode
Enable detailed logging by checking browser console:
- API request/response details
- Authentication flow
- Error messages and stack traces

## 🔮 Future Enhancements

### Planned Features
- **Real-time Updates** - WebSocket integration for live data
- **Offline Support** - Service worker for offline functionality
- **Advanced Analytics** - Rust-powered data processing
- **File Upload** - Document and image management
- **Audit Logging** - Comprehensive activity tracking

### Performance Optimizations
- **Caching Strategy** - Redis integration for faster responses
- **Batch Operations** - Bulk data processing
- **Lazy Loading** - Progressive data loading
- **Compression** - Gzip/Brotli response compression

## 📚 Additional Resources

- [Rust Backend API Documentation](https://genzura.aphezis.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the troubleshooting section above

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Active Development
