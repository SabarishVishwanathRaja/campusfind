# CampusFind REST API Specification

Comprehensive documentation for all endpoints provided by the CampusFind API.

All requests accept and return JSON (except multipart file upload endpoints). Authenticated endpoints require the HTTP header:
```http
Authorization: Bearer <jwt_token>
```

---

## Table of Contents
1. [Root & Health](#1-root--health)
2. [Authentication (`/api/auth`)](#2-authentication-apiauth)
3. [Users Management (`/api/users`)](#3-users-management-apiusers)
4. [Categories (`/api/categories`)](#4-categories-apicategories)
5. [Items (`/api/items`)](#5-items-apiitems)
6. [Claims (`/api/claims`)](#6-claims-apiclaims)

---

## 1. Root & Health

### `GET /`
- **Description**: Returns API name, version, and status.
- **Access**: Public
- **Response `200 OK`**:
```json
{
  "name": "CampusFind API",
  "version": "1.0.0",
  "status": "ok"
}
```

### `GET /api/health`
- **Description**: Verifies API process and checks live PostgreSQL connection via `SELECT 1`.
- **Access**: Public
- **Response `200 OK`**:
```json
{
  "status": "ok",
  "db": "connected"
}
```

---

## 2. Authentication (`/api/auth`)

### `POST /api/auth/register`
- **Description**: Register a new student account (always assigned `STUDENT` role).
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Rohan Sharma",
  "email": "rohan@student.edu",
  "password": "Student@123"
}
```
- **Response `201 Created`**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "name": "Rohan Sharma",
    "email": "rohan@student.edu",
    "role": "STUDENT",
    "created_at": "2026-09-07T12:00:00.000Z"
  }
}
```
- **Errors**: `400 Bad Request` (missing fields, short password, email already registered).

### `POST /api/auth/login`
- **Description**: Authenticate with email and password to receive a signed JWT token valid for 7 days.
- **Access**: Public
- **Request Body**:
```json
{
  "email": "admin@campusfind.edu",
  "password": "Admin@123"
}
```
- **Response `200 OK`**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Campus Admin",
    "email": "admin@campusfind.edu",
    "role": "ADMIN",
    "created_at": "2026-09-01T08:00:00.000Z"
  }
}
```
- **Errors**: `400 Bad Request` (missing credentials), `401 Unauthorized` (invalid email or password).

### `GET /api/auth/me`
- **Description**: Get currently authenticated user profile from token.
- **Access**: Authenticated (`authRequired`)
- **Response `200 OK`**:
```json
{
  "user": {
    "id": 2,
    "name": "Arjun Patel",
    "email": "arjun@student.edu",
    "role": "STUDENT",
    "created_at": "2026-09-01T09:30:00.000Z"
  }
}
```
- **Errors**: `401 Unauthorized` (missing/invalid token).

---

## 3. Users Management (`/api/users`)

Full CRUD operations for managing university users. Never returns `password_hash`.

### `GET /api/users`
- **Description**: List all registered users.
- **Access**: Admin only (`adminOnly`)
- **Response `200 OK`**:
```json
[
  {
    "id": 1,
    "name": "Campus Admin",
    "email": "admin@campusfind.edu",
    "role": "ADMIN",
    "created_at": "2026-09-01T08:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Arjun Patel",
    "email": "arjun@student.edu",
    "role": "STUDENT",
    "created_at": "2026-09-01T09:30:00.000Z"
  }
]
```
- **Errors**: `401 Unauthorized`, `403 Forbidden` (non-admin).

### `GET /api/users/:id`
- **Description**: Get single user by ID.
- **Access**: Self or Admin
- **Response `200 OK`**:
```json
{
  "id": 2,
  "name": "Arjun Patel",
  "email": "arjun@student.edu",
  "role": "STUDENT",
  "created_at": "2026-09-01T09:30:00.000Z"
}
```
- **Errors**: `403 Forbidden`, `404 Not Found`.

### `POST /api/users`
- **Description**: Create a user with specified role.
- **Access**: Admin only
- **Request Body**:
```json
{
  "name": "Staff Coordinator",
  "email": "coordinator@campusfind.edu",
  "password": "Staff@123",
  "role": "ADMIN"
}
```
- **Response `201 Created`**:
```json
{
  "id": 6,
  "name": "Staff Coordinator",
  "email": "coordinator@campusfind.edu",
  "role": "ADMIN",
  "created_at": "2026-09-07T12:00:00.000Z"
}
```
- **Errors**: `400 Bad Request`, `403 Forbidden`.

### `PUT /api/users/:id`
- **Description**: Update user details. Only Admins may modify the `role` field.
- **Access**: Self or Admin
- **Request Body**:
```json
{
  "name": "Arjun Patel Jr.",
  "role": "STUDENT"
}
```
- **Response `200 OK`**:
```json
{
  "id": 2,
  "name": "Arjun Patel Jr.",
  "email": "arjun@student.edu",
  "role": "STUDENT",
  "created_at": "2026-09-01T09:30:00.000Z"
}
```
- **Errors**: `400 Bad Request`, `403 Forbidden` (student trying to change role), `404 Not Found`.

### `DELETE /api/users/:id`
- **Description**: Delete user account (cascades to items and claims). Admins cannot delete their own active account.
- **Access**: Admin only
- **Response `200 OK`**:
```json
{
  "message": "User deleted successfully."
}
```
- **Errors**: `400 Bad Request` (deleting self), `403 Forbidden`, `404 Not Found`.

---

## 4. Categories (`/api/categories`)

### `GET /api/categories`
- **Description**: Retrieve all item categories in alphabetical order.
- **Access**: Public
- **Response `200 OK`**:
```json
[
  { "id": 4, "name": "Accessories" },
  { "id": 2, "name": "Books" },
  { "id": 5, "name": "Documents" },
  { "id": 1, "name": "Electronics" },
  { "id": 3, "name": "ID Cards" },
  { "id": 6, "name": "Other" }
]
```

### `GET /api/categories/:id`
- **Description**: Retrieve a single category by ID.
- **Access**: Public
- **Response `200 OK`**:
```json
{
  "id": 1,
  "name": "Electronics"
}
```

### `POST /api/categories`
- **Description**: Add a new category.
- **Access**: Admin only
- **Request Body**: `{ "name": "Sports Equipment" }`
- **Response `201 Created`**:
```json
{
  "id": 7,
  "name": "Sports Equipment"
}
```

### `PUT /api/categories/:id`
- **Description**: Update category name.
- **Access**: Admin only
- **Request Body**: `{ "name": "Athletics & Sports" }`
- **Response `200 OK`**:
```json
{
  "id": 7,
  "name": "Athletics & Sports"
}
```

### `DELETE /api/categories/:id`
- **Description**: Delete category. Returns `409 Conflict` if items still reference this category.
- **Access**: Admin only
- **Response `200 OK`**: `{ "message": "Category deleted successfully." }`
- **Errors**: `409 Conflict` if items reference category:
```json
{
  "error": "Cannot delete category: 3 item(s) are still referencing this category."
}
```

---

## 5. Items (`/api/items`)

### `GET /api/items`
- **Description**: Public search, filtering, and pagination of lost & found items.
- **Access**: Public
- **Query Parameters**:
  - `type`: `LOST` | `FOUND`
  - `status`: `OPEN` | `CLAIMED` | `RETURNED`
  - `category_id`: Integer category ID
  - `q`: Search keyword across `title`, `description`, and `location` (case-insensitive `ILIKE`)
  - `page`: Page number (default: `1`)
  - `limit`: Items per page (default: `12`)
- **Response `200 OK`**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Blue Dell Inspiron Laptop 15\"",
      "description": "Lost near Central Library 2nd floor silent reading zone. Has a NASA sticker on top cover.",
      "type": "LOST",
      "location": "Central Library, 2nd Floor",
      "item_date": "2026-09-01T00:00:00.000Z",
      "status": "OPEN",
      "image_url": "https://res.cloudinary.com/demo/image/upload/v1/campusfind/dell_laptop.jpg",
      "image_public_id": "campusfind/dell_laptop",
      "category_id": 1,
      "user_id": 2,
      "created_at": "2026-09-01T10:15:00.000Z",
      "category_name": "Electronics",
      "reporter_name": "Arjun Patel"
    }
  ],
  "page": 1,
  "limit": 12,
  "total": 1
}
```

### `GET /api/items/mine/list`
- **Description**: List all items reported by the authenticated user.
- **Access**: Authenticated (`authRequired`)
- **Response `200 OK`**: Array of items with joined `category_name` and `reporter_name`.

### `GET /api/items/:id`
- **Description**: Get full item details including reporter contact information.
- **Access**: Public
- **Response `200 OK`**:
```json
{
  "id": 2,
  "title": "Student ID Card - Priya Sharma",
  "description": "Found on cafeteria table near Counter 3 around lunch time. Clean condition.",
  "type": "FOUND",
  "location": "Student Cafeteria",
  "item_date": "2026-09-02T00:00:00.000Z",
  "status": "OPEN",
  "image_url": null,
  "image_public_id": null,
  "category_id": 3,
  "user_id": 4,
  "created_at": "2026-09-02T13:45:00.000Z",
  "category_name": "ID Cards",
  "reporter_name": "Rahul Verma",
  "reporter_email": "rahul@student.edu"
}
```
- **Errors**: `404 Not Found`.

### `POST /api/items`
- **Description**: Submit a new lost or found item report. Accepts `multipart/form-data`.
- **Access**: Authenticated (`authRequired`)
- **Form Fields**:
  - `title` (string, required)
  - `description` (string, optional)
  - `type` (`LOST` | `FOUND`, required)
  - `location` (string, required)
  - `item_date` (`YYYY-MM-DD`, required)
  - `category_id` (integer, required)
  - `image` (file, optional, max 5 MB, `image/jpeg`, `image/png`, `image/webp`)
- **Response `201 Created`**:
```json
{
  "id": 9,
  "title": "Black Casio G-Shock Watch",
  "description": "Found on gym locker bench",
  "type": "FOUND",
  "location": "Gymnasium Locker Room",
  "item_date": "2026-09-07",
  "status": "OPEN",
  "image_url": "https://res.cloudinary.com/cloud/image/upload/v1725720000/campusfind/sample.jpg",
  "image_public_id": "campusfind/sample",
  "category_id": 4,
  "user_id": 2,
  "category_name": "Accessories",
  "reporter_name": "Arjun Patel"
}
```
- **Errors**: `400 Bad Request` (missing required fields, invalid file type/size).

### `PUT /api/items/:id`
- **Description**: Update item details and optionally replace or remove the photo. Replaces old Cloudinary asset automatically.
- **Access**: Item Owner or Admin
- **Form Fields**: Same as `POST /api/items` plus optional `remove_image=true`.
- **Response `200 OK`**: Updated item object.
- **Errors**: `403 Forbidden` (if not owner or admin), `404 Not Found`.

### `PATCH /api/items/:id/status`
- **Description**: Directly update item status (`OPEN`, `CLAIMED`, or `RETURNED`).
- **Access**: Admin only
- **Request Body**: `{ "status": "RETURNED" }`
- **Response `200 OK`**: Updated item object.
- **Errors**: `400 Bad Request` (invalid status), `403 Forbidden`, `404 Not Found`.

### `DELETE /api/items/:id`
- **Description**: Permanently delete item. Automatically deletes the corresponding image asset from Cloudinary if present.
- **Access**: Item Owner or Admin
- **Response `200 OK`**: `{ "message": "Item deleted successfully." }`
- **Errors**: `403 Forbidden`, `404 Not Found`.

---

## 6. Claims (`/api/claims`)

### `GET /api/claims`
- **Description**: List all submitted claims joined with item title and claimant details.
- **Access**: Admin only
- **Query Parameters**: `?status=PENDING` | `APPROVED` | `REJECTED`
- **Response `200 OK`**:
```json
[
  {
    "id": 1,
    "item_id": 2,
    "user_id": 3,
    "message": "This is my college ID card! My roll number is 21CS042 and my photo is on it.",
    "status": "PENDING",
    "created_at": "2026-09-03T11:00:00.000Z",
    "item_title": "Student ID Card - Priya Sharma",
    "item_type": "FOUND",
    "item_status": "OPEN",
    "claimant_name": "Priya Sharma",
    "claimant_email": "priya@student.edu"
  }
]
```

### `GET /api/claims/mine/list`
- **Description**: List claims submitted by the current authenticated user.
- **Access**: Authenticated (`authRequired`)
- **Response `200 OK`**: Array of user claims joined with item details.

### `GET /api/claims/:id`
- **Description**: Get claim details.
- **Access**: Claim Owner or Admin
- **Response `200 OK`**: Single claim object.
- **Errors**: `403 Forbidden`, `404 Not Found`.

### `POST /api/claims`
- **Description**: Submit an ownership claim on an open item.
- **Access**: Authenticated (`authRequired`)
- **Rules**:
  - A user cannot claim an item they reported (`400 Bad Request`).
  - Item must have `OPEN` status (`409 Conflict`).
  - User cannot submit duplicate claims on the same item (`409 Conflict`).
- **Request Body**:
```json
{
  "item_id": 3,
  "message": "This is my textbook. My name is written on the front inside cover."
}
```
- **Response `201 Created`**:
```json
{
  "id": 4,
  "item_id": 3,
  "user_id": 2,
  "message": "This is my textbook. My name is written on the front inside cover.",
  "status": "PENDING",
  "created_at": "2026-09-07T12:00:00.000Z",
  "item_title": "Advanced Engineering Mathematics (10th Ed)",
  "item_type": "FOUND",
  "item_status": "OPEN",
  "claimant_name": "Arjun Patel"
}
```

### `PUT /api/claims/:id`
- **Description**: Edit claim message. Allowed only while claim is in `PENDING` status.
- **Access**: Claim Owner
- **Request Body**: `{ "message": "Updated proof details..." }`
- **Response `200 OK`**: Updated claim object.
- **Errors**: `400 Bad Request` (not in PENDING status), `403 Forbidden`, `404 Not Found`.

### `PATCH /api/claims/:id/status`
- **Description**: Approve or reject a claim. **Executes inside an ACID PostgreSQL transaction**.
- **Access**: Admin only
- **Transaction Behavior**:
  - When `APPROVED`:
    1. The target claim is updated to `APPROVED`.
    2. All other `PENDING` claims for that item are automatically marked `REJECTED`.
    3. The item status is updated to `CLAIMED`.
  - When `REJECTED`:
    1. Only the target claim is updated to `REJECTED`.
- **Request Body**:
```json
{
  "status": "APPROVED"
}
```
- **Response `200 OK`**:
```json
{
  "id": 1,
  "item_id": 2,
  "user_id": 3,
  "message": "This is my college ID card! My roll number is 21CS042 and my photo is on it.",
  "status": "APPROVED",
  "created_at": "2026-09-03T11:00:00.000Z",
  "item_title": "Student ID Card - Priya Sharma",
  "item_status": "CLAIMED",
  "claimant_name": "Priya Sharma",
  "claimant_email": "priya@student.edu"
}
```
- **Errors**: `400 Bad Request` (invalid status), `403 Forbidden`, `404 Not Found`.

### `DELETE /api/claims/:id`
- **Description**: Cancel or withdraw a submitted claim.
- **Access**: Claim Owner or Admin
- **Response `200 OK`**: `{ "message": "Claim deleted successfully." }`
- **Errors**: `403 Forbidden`, `404 Not Found`.
