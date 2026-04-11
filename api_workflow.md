# API Workflow Documentation: AlumniConnect

This document describes the flow of API requests in the AlumniConnect project, mapping how data moves from the user interface to the database.

## Architectural Layers

The project implements a multi-layered architecture distributed across the client and server.

| Layer | Responsibility | Location |
| :--- | :--- | :--- |
| **View (Frontend)** | React components that trigger user actions and display data. | `client/src/views/` |
| **Service (Frontend)** | Centralized API client using Axios to make HTTP requests. | `client/src/api.ts` |
| **Route (Backend)** | Defines endpoints and maps them to controllers. | `server/routes/api.php` |
| **Controller (Backend)** | Handles request validation and orchestrates logic. | `server/app/Http/Controllers/` |
| **Service (Backend)** | (Optional) Contains reusable business logic/integration code. | `server/app/Services/` |
| **Model (Backend)** | Eloquent models that interact with the MSSQL database. | `server/app/Models/` |

---

## Example 1: Standard API Flow (Jobs API)
This is the most common flow in the project, where the controller interacts directly with the Model.

### **API: GET /api/jobs**
1.  **View**: `Jobs.tsx` calls `api.getJobs()`.
    ```typescript
    // client/src/views/Jobs.tsx
    const data = await api.getJobs(typeParam);
    ```
2.  **Frontend Service**: `ApiClient` makes a GET request to the backend.
    ```typescript
    // client/src/api.ts
    async getJobs(type?: string) {
      const url = type ? `/api/jobs?type=${type}` : '/api/jobs';
      const response = await this.client.get(url);
      return response.data;
    }
    ```
3.  **Route**: Laravel router directs the request to the Controller.
    ```php
    // server/routes/api.php
    Route::get('/jobs', [JobPostingController::class, 'index']);
    ```
4.  **Controller**: `JobPostingController` executes the query.
    ```php
    // server/app/Http/Controllers/Api/JobPostingController.php
    public function index(Request $request) {
        $jobs = JobPosting::with('user')->where('is_active', true)->get();
        return response()->json(['success' => true, 'data' => $jobs]);
    }
    ```
5.  **Model**: `JobPosting` retrieves data from the database.

---

## Example 2: Service-Oriented Flow (Authentication)
This flow utilizes a dedicated backend service for specialized logic (JWT issuance).

### **API: POST /api/login**
1.  **View**: `Login.tsx` submits credentials to the API.
2.  **Frontend Service**: `api.ts` posts to `/api/login`.
3.  **Route**: Maps to `AuthenticatedSessionController@store`.
4.  **Controller**: Validates credentials and delegates token creation to a Service.
    ```php
    // server/app/Http/Controllers/Auth/AuthenticatedSessionController.php
    $token = JwtService::issue($user);
    ```
5.  **Backend Service**: `JwtService` handles payload encryption and encoding.
    ```php
    // server/app/Services/JwtService.php
    return JWT::encode($payload, $key, 'HS256');
    ```
6.  **Model**: `User` model is used for authentication check and token context.

---

## Workflow Compliance Audit

We analyzed all major API categories to determine if they consistently maintain the `Controller -> Service -> Model` flow.

### Compliance Summary
> [!WARNING]
> **Project-wide consistency is not 100%.** 
> Most CRUD operations (Jobs, Alumni Directory, Mentorship) skip the backend service layer for simplicity. The service layer is reserved for specific utility functions (JWT, Attendance Logic).

| Feature Area | Maintains Flow? | Service Used | Notes |
| :--- | :--- | :--- | :--- |
| **Authentication** | ✅ Yes | `JwtService` | Standard implementation. |
| **Jobs & Internships** | ❌ No | None | Controller direct-to-model. |
| **Mentorship** | ❌ No | None | Controller direct-to-model. |
| **Notifications** | ❌ No | None | Logic handled in various controllers. |
| **Attendance** | ⚠️ Partial | `AttendanceService` | **Issue**: `SessionController` is missing from the codebase. |

### Technical Discrepancy Found
> [!IMPORTANT]
> The **Attendance API** (`/api/attendance`) maintains the flow on the Backend Service side (`AttendanceService.php`), but the **Controller** (`SessionController.php`) is currently missing from `app/Http/Controllers/`. This results in a broken workflow for this specific API.
