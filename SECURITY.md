# Security Policy

## Overview

DocTalk handles sensitive medical information and requires stringent security measures. This document outlines our security practices and guidelines.

## Implemented Security Measures

### Authentication & Authorization

✅ **Supabase Auth Integration**
- Secure email/password authentication
- Session management with JWT tokens
- Automatic token refresh
- Role-based access control (Doctor A vs Doctor B)

✅ **Row Level Security (RLS)**
All database tables have RLS policies:
- `profiles`: Users can only access their own profile
- `consultations`: Only participating doctors can view/modify
- `messages`: Only consultation participants can access
- `patients`: Doctor A can manage their patients; Doctor B can view referred patients
- `referrals`: Both referring and receiving doctors can access

### Data Protection

✅ **Input Validation**
- Client-side validation using Zod schemas
- File upload validation (type, size limits)
- SQL injection prevention through parameterized queries
- XSS protection through React's automatic escaping

✅ **Secure File Storage**
- Medical documents in private Supabase Storage bucket
- Profile pictures in public bucket with validation
- File type and size restrictions
- Virus scanning recommended for production

✅ **Encryption**
- HTTPS enforced in production
- Data encrypted in transit
- Database encryption at rest (Supabase)
- Secure WebSockets for real-time communication

### Code Security

✅ **Error Handling**
- Error boundaries prevent information leakage
- Sensitive data not logged in production
- Generic error messages to users
- Detailed logs only in development

✅ **Dependencies**
- Regular security updates
- Vulnerability scanning with `npm audit`
- Minimal dependency footprint

## Security Warnings & Recommendations

### ⚠️ Critical: Enable Leaked Password Protection

**Status**: Currently disabled in Supabase Auth settings

**Action Required**: Navigate to [Supabase Auth Settings](https://supabase.com/dashboard/project/hbdinpejzjweklkbyydz/auth/providers) and enable:
- Password strength requirements
- Leaked password protection (via HaveIBeenPwned API)

**Impact**: Prevents users from using commonly breached passwords

### ⚠️ Recommended: Implement Rate Limiting

**Current State**: Basic Supabase rate limiting only

**Recommendations**:
1. Add rate limiting to authentication endpoints
2. Limit consultation request frequency
3. Throttle file uploads
4. Monitor for abuse patterns

**Implementation**:
```typescript
// Example: Supabase Edge Function with rate limiting
const rateLimit = new Map();

export async function rateLimitCheck(userId: string, limit: number = 10) {
  const now = Date.now();
  const userRequests = rateLimit.get(userId) || [];
  const recentRequests = userRequests.filter(t => now - t < 60000);
  
  if (recentRequests.length >= limit) {
    throw new Error('Rate limit exceeded');
  }
  
  recentRequests.push(now);
  rateLimit.set(userId, recentRequests);
}
```

### ⚠️ Recommended: Add Two-Factor Authentication

**Current State**: Not implemented

**Recommendation**: Add 2FA for enhanced account security, especially for doctor accounts handling sensitive patient data.

### ⚠️ Recommended: Implement Audit Logging

**Current State**: Basic logging only

**Recommendation**: Add comprehensive audit logs for:
- User authentication attempts
- Patient data access
- Consultation initiation/completion
- File uploads/downloads
- Profile modifications

## Security Best Practices for Development

### 1. Never Commit Secrets
```bash
# Always check before committing
git diff --staged
```

### 2. Use Environment Variables
```typescript
// ❌ Bad
const apiKey = "sk_live_abc123";

// ✅ Good
const apiKey = import.meta.env.VITE_API_KEY;
```

### 3. Validate All Inputs
```typescript
// ✅ Always validate
const result = messageSchema.safeParse(input);
if (!result.success) {
  throw new Error("Invalid input");
}
```

### 4. Sanitize User Content
```typescript
// ✅ Sanitize before rendering
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
```

### 5. Secure File Uploads
```typescript
// ✅ Validate file uploads
const { valid, error } = validateFileUpload(file);
if (!valid) {
  throw new Error(error);
}
```

## Database Security Guidelines

### RLS Policy Examples

**Good Practice**: Explicit user checks
```sql
-- ✅ Explicit check
CREATE POLICY "Users can view their own data"
ON profiles FOR SELECT
USING (auth.uid() = id);
```

**Bad Practice**: Overly permissive
```sql
-- ❌ Too permissive
CREATE POLICY "Anyone can view"
ON sensitive_data FOR SELECT
USING (true);
```

### Database Functions Security

Always use `SECURITY DEFINER` carefully:
```sql
-- ✅ Secure function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1;
$$;
```

## WebRTC Security

### Current Implementation
- Peer-to-peer connections for privacy
- Supabase Realtime for signaling
- No media stored on servers

### Recommendations
1. **TURN Server Authentication**: Add authentication to TURN servers
2. **End-to-End Encryption**: Consider adding E2EE for video calls
3. **Recording Security**: If implementing call recording, ensure:
   - User consent
   - Encrypted storage
   - Access controls

## API Security

### Supabase Client Security
```typescript
// ✅ Client-side (uses anon key - safe to expose)
import { supabase } from '@/integrations/supabase/client';

// ❌ Never expose service role key in client code
// Service role key bypasses RLS - backend only!
```

### Protected Endpoints
All API calls automatically include user JWT token:
```typescript
// User context automatically included
const { data } = await supabase
  .from('consultations')
  .select('*');
// RLS policies enforce access control
```

## Incident Response Plan

### If Security Breach Detected

1. **Immediate Actions**
   - Identify scope of breach
   - Revoke compromised tokens
   - Lock affected accounts
   - Document incident

2. **Investigation**
   - Review access logs
   - Check for data exfiltration
   - Identify vulnerability
   - Assess damage

3. **Remediation**
   - Patch vulnerability
   - Reset affected credentials
   - Notify affected users
   - Update security measures

4. **Post-Incident**
   - Conduct security review
   - Update policies
   - Train team
   - Improve monitoring

## Compliance Considerations

### HIPAA Compliance
⚠️ **Note**: If deploying in production for U.S. healthcare:
- Sign Business Associate Agreement (BAA) with Supabase
- Implement additional audit logging
- Add data retention policies
- Ensure proper patient consent flows
- Regular security audits required

### GDPR Compliance
For European users:
- User consent management
- Right to erasure (delete account)
- Data portability
- Privacy policy
- Cookie consent

## Security Checklist for Production

- [ ] Enable HTTPS only
- [ ] Enable Leaked Password Protection
- [ ] Configure CSP headers
- [ ] Set up rate limiting
- [ ] Implement audit logging
- [ ] Regular dependency updates
- [ ] Security headers configured
- [ ] Backup strategy in place
- [ ] Incident response plan documented
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] User consent flows implemented
- [ ] Regular security audits scheduled

## Reporting Security Vulnerabilities

If you discover a security vulnerability:

1. **Do Not** create a public GitHub issue
2. **Do Not** disclose publicly before fix
3. **Do** email security@yourdomain.com
4. **Do** provide detailed description
5. **Do** include steps to reproduce

We will:
- Acknowledge receipt within 48 hours
- Provide estimated fix timeline
- Keep you updated on progress
- Credit you (if desired) once fixed

## Security Resources

### Internal Documentation
- [Authentication Context](src/contexts/AuthContext.tsx)
- [Validation Schemas](src/utils/validation.ts)
- [RLS Policies](supabase/migrations/)

### External Resources
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)

---

**Last Updated**: 2025-11-08
**Security Review Frequency**: Quarterly
**Next Review**: 2026-02-08
