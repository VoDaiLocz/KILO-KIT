---
name: security-best-practices
description: >-
  Security-focused development skill covering OWASP Top 10 and secure coding.
  Use when implementing authentication, handling user data, or security review.
  Keywords: security, auth, authentication, authorization, OWASP, XSS, SQL injection, CSRF, secure
version: 1.0.0
behaviors: [review_and_suggest, investigate_codebase, generate_with_validation]
dependencies: []
token_estimate:
  min: 1500
  typical: 3500
  max: 8000
---

# 🔐 Security Best Practices Skill

> **Philosophy:** Security is not optional. Build it in from the start.

## When to Use

Use this skill when:
- Implementing authentication/authorization
- Handling user input
- Working with sensitive data
- Doing security code review
- Building user-facing features
- Setting up deployment/infrastructure

**Do NOT use this skill when:**
- Just formatting code
- Pure UI/styling changes
- No user data involved

---

## Prerequisites

Before starting:
- [ ] Understand what data you're handling
- [ ] Know your threat model (who might attack)
- [ ] Have access to codebase
- [ ] Understand the tech stack

---

## OWASP Top 10 Quick Reference

### 1. Broken Access Control (A01:2021)

**What:** Users can access data/functions they shouldn't.

**Prevention:**
```typescript
// ❌ Bad: No authorization check
app.get('/users/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  res.json(user);
});

// ✅ Good: Check ownership
app.get('/users/:id', authorize(), async (req, res) => {
  const user = await db.users.findById(req.params.id);
  
  if (user.id !== req.user.id && req.user.role !== 'admin') {
    throw new ForbiddenException();
  }
  
  res.json(user);
});
```

**Checklist:**
- [ ] Default deny (require explicit permission)
- [ ] Verify ownership of resources
- [ ] Role-based access control implemented
- [ ] Admin functions protected
- [ ] CORS configured correctly

---

### 2. Cryptographic Failures (A02:2021)

**What:** Weak crypto, exposed sensitive data.

**Prevention:**
```typescript
// ❌ Bad: Weak hashing
const hash = crypto.createHash('md5').update(password).digest('hex');

// ✅ Good: Strong hashing with bcrypt
const hash = await bcrypt.hash(password, 12);

// ❌ Bad: Hardcoded secrets
const API_KEY = "sk_live_abc123";

// ✅ Good: Environment variables
const API_KEY = process.env.API_KEY;
```

**Checklist:**
- [ ] Passwords hashed with bcrypt/argon2 (cost factor ≥12)
- [ ] Sensitive data encrypted at rest
- [ ] TLS/HTTPS enforced
- [ ] No hardcoded secrets
- [ ] Secrets in environment variables
- [ ] Old/weak algorithms avoided (MD5, SHA1)

---

### 3. Injection (A03:2021)

**What:** Malicious data executed as code/query.

**Prevention:**
```typescript
// ❌ Bad: SQL Injection
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Good: Parameterized queries
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// ❌ Bad: Command injection
exec(`convert ${filename} output.png`);

// ✅ Good: Use library functions
await sharp(filename).toFile('output.png');
```

**Types to Prevent:**
- SQL Injection
- NoSQL Injection
- Command Injection
- LDAP Injection
- XPath Injection

**Checklist:**
- [ ] Use parameterized queries/ORM
- [ ] Validate and sanitize all input
- [ ] Escape output appropriately
- [ ] Avoid shell commands with user input
- [ ] Use allow-lists, not block-lists

---

### 4. Insecure Design (A04:2021)

**What:** Missing security in design phase.

**Prevention:**
```yaml
# Security design considerations
threat_modeling:
  assets:
    - User credentials
    - Payment information
    - Personal data
  
  threats:
    - Authentication bypass
    - Data theft
    - Privilege escalation
  
  mitigations:
    - MFA for sensitive operations
    - Encryption at rest
    - Audit logging
```

**Checklist:**
- [ ] Threat model created
- [ ] Security requirements documented
- [ ] Defense in depth applied
- [ ] Fail securely (safe defaults)
- [ ] Separation of duties

---

### 5. Security Misconfiguration (A05:2021)

**What:** Insecure settings, missing hardening.

**Prevention:**
```typescript
// ❌ Bad: Debugging enabled in production
app.use(express.errorHandler({ dumpExceptions: true }));

// ✅ Good: Production-safe error handling
if (process.env.NODE_ENV === 'production') {
  app.use((err, req, res, next) => {
    console.error(err);  // Log internally
    res.status(500).json({ message: 'Internal error' });  // Don't expose details
  });
}
```

**Checklist:**
- [ ] Remove default credentials
- [ ] Disable debugging in production
- [ ] Remove unnecessary features/endpoints
- [ ] Security headers configured
- [ ] Error messages don't leak info
- [ ] File permissions correct

**Security Headers:**
```typescript
app.use(helmet());
// Or manually:
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

---

### 6. Vulnerable Components (A06:2021)

**What:** Using libraries with known vulnerabilities.

**Prevention:**
```bash
# Check for vulnerabilities
npm audit
pip-audit
dotnet list package --vulnerable

# Fix vulnerabilities
npm audit fix
pip-audit --fix
```

**Checklist:**
- [ ] Dependencies up to date
- [ ] Security advisories monitored
- [ ] Automated vulnerability scanning
- [ ] Remove unused dependencies
- [ ] Only use trusted sources

---

### 7. Authentication Failures (A07:2021)

**What:** Broken login, session management.

**Prevention:**
```typescript
// Password requirements
const passwordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
  preventCommon: true,
};

// Rate limiting login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts'
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,       // HTTPS only
    httpOnly: true,     // No JS access
    sameSite: 'strict', // CSRF protection
    maxAge: 3600000     // 1 hour
  }
}));
```

**Checklist:**
- [ ] Strong password policy enforced
- [ ] Brute force protection (rate limiting)
- [ ] MFA available for sensitive accounts
- [ ] Secure password reset flow
- [ ] Sessions invalidated on logout
- [ ] Session timeout configured

---

### 8. Software Integrity Failures (A08:2021)

**What:** Insecure updates, CI/CD pipeline attacks.

**Prevention:**
```yaml
# Verify package integrity
package-lock.json  # Lock versions
npm ci             # Install exact versions

# CI/CD security
ci_security:
  - Verify source code integrity
  - Sign releases
  - Secure deployment pipeline
  - Review third-party actions
```

**Checklist:**
- [ ] Lock file used and committed
- [ ] Packages verified (checksums)
- [ ] CI/CD pipeline secured
- [ ] Code signing for releases

---

### 9. Logging Failures (A09:2021)

**What:** Insufficient logging for security events.

**Prevention:**
```typescript
// Security event logging
const securityLogger = {
  loginSuccess: (userId: string, ip: string) => {
    logger.info('LOGIN_SUCCESS', { userId, ip, timestamp: new Date() });
  },
  
  loginFailure: (email: string, ip: string, reason: string) => {
    logger.warn('LOGIN_FAILURE', { email, ip, reason, timestamp: new Date() });
  },
  
  accessDenied: (userId: string, resource: string, ip: string) => {
    logger.warn('ACCESS_DENIED', { userId, resource, ip, timestamp: new Date() });
  },
  
  suspiciousActivity: (details: object) => {
    logger.error('SUSPICIOUS_ACTIVITY', { ...details, timestamp: new Date() });
  }
};

// Log what to log
// ✅ Login attempts (success and failure)
// ✅ Access control failures
// ✅ Input validation failures
// ✅ Security configuration changes
// ✅ High-value transactions

// ❌ Don't log
// Passwords
// Session tokens
// Credit card numbers
// Personal data (unless necessary)
```

**Checklist:**
- [ ] Security events logged
- [ ] Log format is parseable
- [ ] Logs protected from tampering
- [ ] Sensitive data not logged
- [ ] Alerting on suspicious patterns

---

### 10. SSRF (A10:2021)

**What:** Server-Side Request Forgery.

**Prevention:**
```typescript
// ❌ Bad: User-controlled URL
const response = await fetch(req.body.url);

// ✅ Good: Validate and restrict
const ALLOWED_DOMAINS = ['api.example.com', 'cdn.example.com'];

async function fetchUrl(userUrl: string) {
  const parsed = new URL(userUrl);
  
  if (!ALLOWED_DOMAINS.includes(parsed.hostname)) {
    throw new Error('Domain not allowed');
  }
  
  if (parsed.protocol !== 'https:') {
    throw new Error('HTTPS required');
  }
  
  return fetch(userUrl);
}
```

**Checklist:**
- [ ] Validate user-supplied URLs
- [ ] Use allow-lists for domains
- [ ] Block internal/private IPs
- [ ] Disable HTTP redirects (or limit)

---

## Input Validation Patterns

### Universal Validation

```typescript
// Validation with Zod
const UserSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(12).max(128),
  name: z.string().min(2).max(50).regex(/^[a-zA-Z\s]+$/),
  age: z.number().int().min(13).max(120).optional(),
});

// Validation with class-validator
class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;
  
  @IsString()
  @MinLength(12)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  password: string;
  
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}
```

### XSS Prevention

```typescript
// ❌ Bad: Raw HTML output
element.innerHTML = userInput;

// ✅ Good: Text content only
element.textContent = userInput;

// ✅ Good: Sanitize if HTML needed
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

---

## Security Testing Checklist

```yaml
security_tests:
  authentication:
    - Test login with invalid credentials
    - Test brute force protection
    - Test session timeout
    - Test logout clears session
    - Test password reset flow
  
  authorization:
    - Test accessing other users' data
    - Test admin functions as normal user
    - Test direct object references
    - Test privilege escalation
  
  input_validation:
    - Test SQL injection payloads
    - Test XSS payloads
    - Test command injection
    - Test path traversal
    - Test file upload restrictions
  
  configuration:
    - Test HTTPS enforcement
    - Test security headers present
    - Test error messages sanitized
    - Test debugging disabled
```

---

## Guidelines

### DO ✅
- Validate all input
- Use parameterized queries
- Hash passwords with bcrypt/argon2
- Log security events
- Keep dependencies updated
- Apply principle of least privilege

### DON'T ❌
- Trust user input
- Store secrets in code
- Use weak cryptography
- Expose detailed errors
- Ignore security warnings
- Skip security testing

---

## Success Criteria

Before considering code secure:

- [ ] OWASP Top 10 addressed
- [ ] Input validation complete
- [ ] Authentication/authorization tested
- [ ] Secrets managed properly
- [ ] Security headers configured
- [ ] Dependencies audited
- [ ] Security logging in place
- [ ] Code reviewed for security

---

## Related Skills

- `skills/kilo-kit/development/backend/` - For API security
- `skills/kilo-kit/quality/code-review/` - For security review
- `skills/kilo-kit/debugging/root-cause/` - For security incident analysis

---

*Security Best Practices Skill v1.0.0 — Security is everyone's job*
