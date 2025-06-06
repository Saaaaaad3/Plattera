# Restaurant Owner Authentication Flow Implementation

## Overview

Implement a secure authentication system for restaurant owners using the existing backend APIs, with phone number-based OTP verification and JWT token management.

## Backend API Endpoints

```typescript
// Authentication APIs
POST /auth/login
Body: {
  mobileNumber: string; // Indian format: 6-9 followed by 9 digits
  name: string;
}
Response: {
  isNewUser: boolean;
}

POST /auth/verify
Body: {
  mobileNumber: string;
  otp: string; // 6-digit OTP
}
Response: {
  token: string; // JWT token
}

// Protected Routes (require Authorization header)
GET /menu-items (with auth)
GET /menu/:restId (public)
```

## Authentication Flow

### 1. Login Process

- Phone Number Input Screen
  - Validate Indian mobile number format (6-9 followed by 9 digits)
  - Show validation error for invalid format
  - Collect user's name
  - Call `/auth/login` endpoint
  - Handle response to show if new user or existing user

### 2. OTP Verification

- OTP Input Screen
  - 6-digit OTP input
  - Call `/auth/verify` endpoint
  - Store JWT token securely
  - Redirect based on user role (RESTOWNER/CUSTOMER)

### 3. Token Management

- Store JWT token in secure storage
- Include token in Authorization header for protected routes:
  ```typescript
  headers: {
    'Authorization': `Bearer ${token}`
  }
  ```
- Handle 401 Unauthorized responses
- Implement token refresh if needed

### 4. Protected Routes

- Implement route guards for:
  - Restaurant owner dashboard
  - Menu management
  - Order management
- Check user role (RESTOWNER) for access control
- Redirect unauthorized access to login

### 5. Error Handling

- Network errors
- Invalid OTP (401 Unauthorized)
- Invalid phone number format
- Rate limiting (429 Too Many Requests)
- Server errors (500)

### 6. Security Considerations

- Secure token storage
- XSS prevention
- CSRF protection
- Rate limiting (backend already implements):
  - 200 requests/minute for authenticated users
  - 100 requests/minute for unauthenticated users
  - 30 requests/minute for sensitive operations

## User Experience

- Loading states during API calls
- Clear error messages
- Smooth transitions between screens
- Proper form validation
- Mobile-responsive design

## Technical Requirements

- Implement proper TypeScript types for API responses
- Handle session management
- Implement proper error boundaries
- Add loading indicators
- Implement proper logging
- Follow security best practices

## Success Criteria

- Secure authentication flow
- Proper error handling
- Smooth user experience
- Mobile responsiveness
- Proper token management
- Role-based access control
