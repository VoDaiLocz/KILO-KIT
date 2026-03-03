---
name: backend-api-development
description: >-
  Comprehensive backend API development skill for building robust, scalable APIs.
  Use when creating new endpoints, services, or backend functionality.
  Keywords: API, backend, endpoint, service, REST, GraphQL, server, controller, route
version: 1.0.0
behaviors: [generate_with_validation, investigate_codebase, document_code, test_change]
dependencies: []
token_estimate:
  min: 2000
  typical: 5000
  max: 12000
---

# 🔧 Backend API Development Skill

> **Philosophy:** APIs are contracts. Build them right the first time.

## When to Use

Use this skill when:
- Creating a new API endpoint
- Building a new service/module
- Refactoring existing API code
- Adding new functionality to backend
- Need to follow RESTful/GraphQL best practices

**Do NOT use this skill when:**
- Just fixing a small bug (use debugging skill)
- Only modifying frontend (use frontend skill)
- Database-only changes (use database skill)

---

## Prerequisites

Before starting:
- [ ] Requirements are clear (what the API should do)
- [ ] Understand the existing architecture
- [ ] Know the target stack (NestJS, Express, FastAPI, etc.)
- [ ] Database schema exists (or will be created)

---

## Process

### Phase 1: DESIGN 📐

**Goal:** Design the API before writing code.

**Steps:**

1. **Define the Resource**
   ```yaml
   resource:
     name: User
     description: Represents a platform user
     domain: authentication
   ```

2. **Design Endpoints (REST)**
   ```yaml
   endpoints:
     - method: GET
       path: /users
       description: List all users
       query_params: [page, limit, search]
       response: User[]
     
     - method: GET
       path: /users/:id
       description: Get single user
       response: User
     
     - method: POST
       path: /users
       description: Create new user
       body: CreateUserDto
       response: User
     
     - method: PUT
       path: /users/:id
       description: Update user
       body: UpdateUserDto
       response: User
     
     - method: DELETE
       path: /users/:id
       description: Delete user
       response: void
   ```

3. **Define DTOs (Data Transfer Objects)**
   ```typescript
   // CreateUserDto
   interface CreateUserDto {
     email: string;      // required, email format
     password: string;   // required, min 8 chars
     name: string;       // required, min 2 chars
     role?: UserRole;    // optional, default: 'user'
   }
   
   // UpdateUserDto
   type UpdateUserDto = Partial<CreateUserDto>;
   
   // UserResponseDto
   interface UserResponseDto {
     id: string;
     email: string;
     name: string;
     role: UserRole;
     createdAt: DateTime;
     updatedAt: DateTime;
     // Note: password NOT included
   }
   ```

4. **Plan Error Responses**
   ```yaml
   errors:
     - code: 400
       when: Invalid input
       response: { message, errors: [{field, message}] }
     
     - code: 401
       when: Not authenticated
       response: { message: "Unauthorized" }
     
     - code: 403
       when: Not authorized
       response: { message: "Forbidden" }
     
     - code: 404
       when: Resource not found
       response: { message: "User not found" }
     
     - code: 409
       when: Conflict (e.g., email exists)
       response: { message: "Email already registered" }
   ```

**Output:** Complete API design document.

---

### Phase 2: STRUCTURE 🏗️

**Goal:** Set up the file structure.

**NestJS Structure:**
```
src/
└── users/
    ├── users.module.ts       # Module definition
    ├── users.controller.ts   # HTTP layer
    ├── users.service.ts      # Business logic
    ├── users.repository.ts   # Data access (optional)
    ├── dto/
    │   ├── create-user.dto.ts
    │   ├── update-user.dto.ts
    │   └── user-response.dto.ts
    ├── entities/
    │   └── user.entity.ts
    ├── guards/
    │   └── user-owner.guard.ts
    └── users.controller.spec.ts
```

**FastAPI Structure:**
```
app/
└── users/
    ├── __init__.py
    ├── router.py          # Routes
    ├── service.py         # Business logic
    ├── repository.py      # Data access
    ├── schemas.py         # Pydantic models
    ├── models.py          # SQLAlchemy models
    └── dependencies.py    # Dependency injection
```

---

### Phase 3: IMPLEMENTATION 💻

**Goal:** Implement the API layer by layer.

**Order of Implementation:**

1. **Entity/Model First**
   ```typescript
   // user.entity.ts
   @Entity('users')
   export class User {
     @PrimaryGeneratedColumn('uuid')
     id: string;
     
     @Column({ unique: true })
     @IsEmail()
     email: string;
     
     @Column()
     @Exclude() // Never expose password
     password: string;
     
     @Column()
     name: string;
     
     @Column({ default: 'user' })
     role: UserRole;
     
     @CreateDateColumn()
     createdAt: Date;
     
     @UpdateDateColumn()
     updatedAt: Date;
   }
   ```

2. **DTOs with Validation**
   ```typescript
   // create-user.dto.ts
   export class CreateUserDto {
     @IsEmail()
     @Transform(({ value }) => value.toLowerCase().trim())
     email: string;
     
     @IsString()
     @MinLength(8)
     @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
       message: 'Password must contain letters and numbers'
     })
     password: string;
     
     @IsString()
     @MinLength(2)
     @MaxLength(50)
     name: string;
     
     @IsOptional()
     @IsEnum(UserRole)
     role?: UserRole;
   }
   ```

3. **Service Layer (Business Logic)**
   ```typescript
   // users.service.ts
   @Injectable()
   export class UsersService {
     constructor(
       @InjectRepository(User)
       private usersRepository: Repository<User>,
     ) {}
     
     async create(dto: CreateUserDto): Promise<User> {
       // Check for existing email
       const existing = await this.findByEmail(dto.email);
       if (existing) {
         throw new ConflictException('Email already registered');
       }
       
       // Hash password
       const hashedPassword = await bcrypt.hash(dto.password, 10);
       
       // Create and save
       const user = this.usersRepository.create({
         ...dto,
         password: hashedPassword,
       });
       
       return this.usersRepository.save(user);
     }
     
     async findAll(options: PaginationOptions): Promise<PaginatedResult<User>> {
       // Implementation with pagination
     }
     
     // ... other methods
   }
   ```

4. **Controller (HTTP Layer)**
   ```typescript
   // users.controller.ts
   @Controller('users')
   @UseInterceptors(ClassSerializerInterceptor)
   export class UsersController {
     constructor(private readonly usersService: UsersService) {}
     
     @Post()
     @HttpCode(HttpStatus.CREATED)
     async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
       const user = await this.usersService.create(dto);
       return plainToInstance(UserResponseDto, user);
     }
     
     @Get()
     @UseGuards(AuthGuard)
     async findAll(
       @Query() query: PaginationQueryDto
     ): Promise<PaginatedResult<UserResponseDto>> {
       return this.usersService.findAll(query);
     }
     
     @Get(':id')
     @UseGuards(AuthGuard)
     async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
       const user = await this.usersService.findOne(id);
       if (!user) {
         throw new NotFoundException('User not found');
       }
       return plainToInstance(UserResponseDto, user);
     }
     
     // ... other endpoints
   }
   ```

---

### Phase 4: SECURITY 🔒

**Goal:** Ensure API is secure.

**Security Checklist:**

1. **Input Validation**
   - [ ] All inputs validated with DTOs
   - [ ] Types enforced
   - [ ] Length limits set
   - [ ] Format validation (email, UUID, etc.)

2. **Authentication**
   - [ ] Protected routes require authentication
   - [ ] JWT or session validation
   - [ ] Token expiration handled

3. **Authorization**
   - [ ] Role-based access control
   - [ ] Resource ownership verified
   - [ ] Admin-only routes protected

4. **Data Protection**
   - [ ] Passwords hashed (bcrypt, argon2)
   - [ ] Sensitive data not logged
   - [ ] Passwords excluded from responses

5. **Rate Limiting**
   - [ ] Login attempts limited
   - [ ] API rate limiting in place

6. **SQL Injection Prevention**
   - [ ] Parameterized queries used
   - [ ] ORM used correctly
   - [ ] Raw queries avoided or sanitized

---

### Phase 5: TESTING 🧪

**Goal:** Write comprehensive tests.

**Test Types:**

1. **Unit Tests**
   ```typescript
   describe('UsersService', () => {
     describe('create', () => {
       it('should create a new user', async () => {
         const dto = { email: 'test@example.com', ... };
         const result = await service.create(dto);
         expect(result.email).toBe(dto.email);
       });
       
       it('should hash the password', async () => {
         const dto = { password: 'plaintext', ... };
         const result = await service.create(dto);
         expect(result.password).not.toBe(dto.password);
       });
       
       it('should throw on duplicate email', async () => {
         // Setup: create user first
         await service.create({ email: 'test@example.com', ... });
         
         // Act & Assert
         await expect(
           service.create({ email: 'test@example.com', ... })
         ).rejects.toThrow(ConflictException);
       });
     });
   });
   ```

2. **Integration Tests**
   ```typescript
   describe('Users API', () => {
     it('POST /users should create user', async () => {
       const response = await request(app.getHttpServer())
         .post('/users')
         .send({ email: 'test@example.com', password: 'Password1', name: 'Test' })
         .expect(201);
       
       expect(response.body.email).toBe('test@example.com');
       expect(response.body.password).toBeUndefined();
     });
     
     it('GET /users should require auth', async () => {
       await request(app.getHttpServer())
         .get('/users')
         .expect(401);
     });
   });
   ```

---

### Phase 6: DOCUMENTATION 📝

**Goal:** Document the API.

**OpenAPI/Swagger:**
```typescript
@ApiTags('users')
@Controller('users')
export class UsersController {
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    // ...
  }
}
```

**Response DTO Documentation:**
```typescript
export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;
  
  @ApiProperty({ example: 'user@example.com' })
  email: string;
  
  @ApiProperty({ example: 'John Doe' })
  name: string;
}
```

---

## Best Practices

### API Design

| Practice | Do | Don't |
|----------|----|----- |
| Naming | `GET /users/:id/orders` | `GET /getUserOrders` |
| Versioning | `/api/v1/users` | No versioning |
| Pluralization | `/users`, `/orders` | `/user`, `/order` |
| HTTP Methods | Use correctly (GET=read, POST=create) | POST for everything |
| Status Codes | 201 for created, 204 for no content | 200 for everything |

### Error Handling

```typescript
// Global exception filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal server error';
    
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## Guidelines

### DO ✅
- Design API before coding
- Use proper HTTP methods and status codes
- Validate all inputs
- Handle errors gracefully
- Write tests first (TDD)
- Document with OpenAPI

### DON'T ❌
- Expose internal IDs when UUIDs are better
- Return password or sensitive data
- Use GET for mutations
- Skip input validation
- Catch and swallow errors
- Use magic strings/numbers

---

## Success Criteria

Before considering API complete:

- [ ] All endpoints implemented per design
- [ ] Input validation on all endpoints
- [ ] Authentication/Authorization in place
- [ ] Error handling comprehensive
- [ ] Unit tests with >80% coverage
- [ ] Integration tests for main flows
- [ ] API documented (OpenAPI/Swagger)
- [ ] Security checklist passed

---

## Related Skills

- `skills/kilo-kit/development/database/` - For data layer
- `skills/kilo-kit/development/security/` - For security concerns
- `skills/kilo-kit/quality/testing/` - For test coverage
- `skills/kilo-kit/architecture/system-design/` - For architecture decisions

---

*Backend API Development Skill v1.0.0 — APIs built right*
