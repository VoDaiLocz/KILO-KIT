---
name: testing-strategy
description: >-
  Comprehensive testing skill covering unit, integration, and e2e testing with TDD.
  Use when writing tests, improving coverage, or setting up testing infrastructure.
  Keywords: test, TDD, unit test, integration, e2e, coverage, mock, jest, vitest
version: 1.0.0
behaviors: [generate_with_validation, run_command, review_and_suggest]
dependencies: []
token_estimate:
  min: 1500
  typical: 3500
  max: 8000
---

# 🧪 Testing Strategy Skill

> **Philosophy:** If it's not tested, it's broken. You just don't know it yet.

## When to Use

Use this skill when:
- Writing new code (TDD approach)
- Adding tests to existing code
- Improving test coverage
- Fixing flaky tests
- Setting up testing infrastructure
- Debugging test failures

**Do NOT use this skill when:**
- Just running existing tests
- Quick syntax check

---

## The Testing Pyramid

```
                 ╱╲
                ╱  ╲
               ╱ E2E╲           Few, slow, expensive
              ╱──────╲          Full system tests
             ╱        ╲
            ╱Integration╲       Medium amount
           ╱────────────╲       Component interaction
          ╱              ╲
         ╱   Unit Tests   ╲     Many, fast, cheap
        ╱──────────────────╲    Single unit isolation
```

---

## TDD Workflow: RED → GREEN → REFACTOR

### Step 1: RED (Write Failing Test)

```typescript
// Write the test BEFORE the implementation
describe('calculateDiscount', () => {
  it('should apply 10% discount for orders over $100', () => {
    // This test will FAIL because function doesn't exist yet
    const result = calculateDiscount(150);
    expect(result).toBe(135);
  });
});
```

**Run test → Should FAIL (RED)**

### Step 2: GREEN (Minimal Implementation)

```typescript
// Write the MINIMUM code to pass the test
function calculateDiscount(amount: number): number {
  if (amount > 100) {
    return amount * 0.9;
  }
  return amount;
}
```

**Run test → Should PASS (GREEN)**

### Step 3: REFACTOR (Improve)

```typescript
// Improve code while keeping tests green
const DISCOUNT_THRESHOLD = 100;
const DISCOUNT_RATE = 0.1;

function calculateDiscount(amount: number): number {
  if (amount > DISCOUNT_THRESHOLD) {
    return amount * (1 - DISCOUNT_RATE);
  }
  return amount;
}
```

**Run test → Should still PASS**

---

## Unit Testing Patterns

### Basic Structure (AAA Pattern)

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = { email: 'test@example.com', name: 'Test' };
      const mockRepo = { create: jest.fn().mockResolvedValue({ id: '1', ...userData }) };
      const service = new UserService(mockRepo);
      
      // Act
      const result = await service.createUser(userData);
      
      // Assert
      expect(result.id).toBe('1');
      expect(result.email).toBe(userData.email);
      expect(mockRepo.create).toHaveBeenCalledWith(userData);
    });
  });
});
```

### Testing Error Cases

```typescript
describe('createUser', () => {
  it('should throw on duplicate email', async () => {
    // Arrange
    const mockRepo = {
      findByEmail: jest.fn().mockResolvedValue({ id: 'existing' }),
    };
    const service = new UserService(mockRepo);
    
    // Act & Assert
    await expect(
      service.createUser({ email: 'exists@example.com' })
    ).rejects.toThrow('Email already registered');
  });
});
```

### Testing Async Code

```typescript
describe('fetchUserData', () => {
  it('should fetch and transform user data', async () => {
    // Arrange
    const mockApi = {
      get: jest.fn().mockResolvedValue({ data: { name: 'John' } }),
    };
    
    // Act
    const result = await fetchUserData(mockApi, 'user-id');
    
    // Assert
    expect(result).toEqual({ name: 'John' });
    expect(mockApi.get).toHaveBeenCalledWith('/users/user-id');
  });
  
  it('should handle API errors gracefully', async () => {
    const mockApi = {
      get: jest.fn().mockRejectedValue(new Error('Network error')),
    };
    
    await expect(fetchUserData(mockApi, 'user-id'))
      .rejects.toThrow('Failed to fetch user');
  });
});
```

---

## Mocking Strategies

### Mock Functions

```typescript
// Create mock function
const mockFn = jest.fn();

// Define return value
mockFn.mockReturnValue('static value');
mockFn.mockResolvedValue('async value');
mockFn.mockRejectedValue(new Error('error'));

// Implementation
mockFn.mockImplementation((x) => x * 2);

// Verify calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(3);
```

### Mock Modules

```typescript
// Mock entire module
jest.mock('./database', () => ({
  connect: jest.fn(),
  query: jest.fn(),
}));

// Mock with factory
jest.mock('./config', () => ({
  get: (key: string) => {
    const config = { API_URL: 'http://test-api.com' };
    return config[key];
  },
}));
```

### Spying

```typescript
// Spy on existing method
const spy = jest.spyOn(userService, 'sendEmail');

// Call the code
await userService.createUser({ email: 'test@example.com' });

// Verify the spy
expect(spy).toHaveBeenCalled();

// Restore original
spy.mockRestore();
```

---

## Integration Testing

### API Integration Tests

```typescript
describe('POST /users', () => {
  let app: Express;
  let db: Database;
  
  beforeAll(async () => {
    db = await Database.connect(TEST_DB_URL);
    app = createApp(db);
  });
  
  afterAll(async () => {
    await db.disconnect();
  });
  
  beforeEach(async () => {
    await db.clear('users');
  });
  
  it('should create user and return 201', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'Password123!' })
      .expect(201);
    
    expect(response.body.email).toBe('test@example.com');
    expect(response.body.password).toBeUndefined();
    
    // Verify in database
    const user = await db.users.findOne({ email: 'test@example.com' });
    expect(user).toBeDefined();
  });
  
  it('should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'invalid', password: 'Password123!' })
      .expect(400);
    
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({ field: 'email' })
    );
  });
});
```

### Database Integration Tests

```typescript
describe('UserRepository', () => {
  let db: Database;
  let repo: UserRepository;
  
  beforeAll(async () => {
    db = await Database.connect(TEST_DB_URL);
    repo = new UserRepository(db);
  });
  
  beforeEach(async () => {
    await db.clear('users');
    await db.seed('users', testUsers);
  });
  
  it('should find user by email', async () => {
    const user = await repo.findByEmail('john@example.com');
    expect(user?.name).toBe('John Doe');
  });
  
  it('should return null for non-existent email', async () => {
    const user = await repo.findByEmail('nobody@example.com');
    expect(user).toBeNull();
  });
});
```

---

## E2E Testing

### Playwright Example

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test('should complete registration flow', async ({ page }) => {
    // Navigate to registration
    await page.goto('/register');
    
    // Fill form
    await page.fill('[data-testid="email"]', 'newuser@example.com');
    await page.fill('[data-testid="password"]', 'SecurePassword123!');
    await page.fill('[data-testid="name"]', 'New User');
    
    // Submit
    await page.click('[data-testid="submit"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]'))
      .toContainText('Welcome, New User');
  });
  
  test('should show validation errors', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('[data-testid="email"]', 'invalid-email');
    await page.click('[data-testid="submit"]');
    
    await expect(page.locator('[data-testid="email-error"]'))
      .toBeVisible();
  });
});
```

---

## Test Coverage

### Coverage Targets

```yaml
coverage_targets:
  statements: 80%
  branches: 80%
  functions: 80%
  lines: 80%

priority_areas:
  critical: 95%+  # Auth, payments, core business logic
  high: 85%+      # API endpoints, services
  medium: 70%+    # Utilities, helpers
  low: 50%+       # UI components, config
```

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/test/**/*',
  ],
};
```

---

## Fixing Flaky Tests

### Common Causes & Solutions

| Cause | Symptom | Solution |
|-------|---------|----------|
| Race conditions | Fails randomly | Add proper waits, use async/await correctly |
| Shared state | Fails when run together | Isolate test data, proper cleanup |
| Time-dependent | Fails at certain times | Mock Date/time |
| External dependencies | Fails intermittently | Mock external services |
| Order dependency | Fails when run in different order | Make tests independent |

### Debugging Flaky Tests

```typescript
// Add retries for known flaky tests (use sparingly!)
test('flaky network test', { retry: 2 }, async () => {
  // ...
});

// Log more info on failure
afterEach(function() {
  if (this.currentTest?.state === 'failed') {
    console.log('Test state:', JSON.stringify(testState, null, 2));
  }
});

// Increase timeout if needed
test('slow test', async () => {
  // ...
}, 30000); // 30 second timeout
```

---

## Test Organization

### File Structure

```
src/
├── users/
│   ├── users.service.ts
│   ├── users.service.spec.ts      # Unit tests
│   └── users.controller.ts
│
tests/
├── unit/                          # Additional unit tests
├── integration/
│   ├── api/
│   │   └── users.api.spec.ts
│   └── db/
│       └── users.repo.spec.ts
├── e2e/
│   └── user-registration.spec.ts
├── fixtures/
│   └── users.fixture.ts
└── helpers/
    ├── database.helper.ts
    └── auth.helper.ts
```

### Test Naming Conventions

```typescript
// Use descriptive names
describe('UserService')
describe('createUser method')

// "should" format
it('should create user with valid data')
it('should throw when email is duplicate')
it('should hash password before saving')

// Given-When-Then for complex scenarios
it('given authenticated admin, when deleting user, should succeed')
```

---

## Guidelines

### DO ✅
- Write tests before code (TDD)
- Test behavior, not implementation
- Keep tests independent
- Use descriptive test names
- Test edge cases and errors
- Clean up after tests

### DON'T ❌
- Test private methods directly
- Share state between tests
- Test framework/library code
- Write tests that always pass
- Ignore flaky tests
- Mock everything

---

## Test Quality Checklist

```yaml
test_quality:
  - Tests run independently in any order
  - Tests don't depend on external services
  - Tests are deterministic (not flaky)
  - Tests are fast (<100ms for unit tests)
  - Tests have meaningful assertions
  - Tests cover happy path AND error cases
  - Tests are readable and maintainable
  - Tests use realistic data
```

---

## Success Criteria

Before considering testing complete:

- [ ] All new code has tests
- [ ] Coverage meets targets
- [ ] All tests pass consistently
- [ ] No flaky tests
- [ ] Edge cases covered
- [ ] Error conditions tested
- [ ] Tests run in CI pipeline
- [ ] Tests are maintainable

---

## Related Skills

- `skills/kilo-kit/quality/code-review/` - For reviewing test quality
- `skills/kilo-kit/debugging/verification/` - For verifying fixes
- `skills/kilo-kit/development/backend/` - For testing APIs

---

*Testing Strategy Skill v1.0.0 — Test it or regret it*
