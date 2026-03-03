# TODO: Role-based Admin Privileges Implementation

## Task Summary:
- Status updation → universityAdmin privilege
- Admin management & Registered users management → Main Admin privilege
- Organization → Read Admin (view only)

## Implementation Steps:

### 1. Server-side: Add Middleware & Routes
- [ ] server/routes.ts - Add `requireUniversityAdmin` middleware
- [ ] server/routes.ts - Update status update to use `requireUniversityAdmin` instead of `requireMainAdmin`
- [ ] server/routes.ts - Add admin management API endpoints (GET, POST, PUT, DELETE)
- [ ] server/storage.ts - Add getAdminById, updateAdmin, deleteAdmin methods

### 2. Shared Routes
- [ ] shared/routes.ts - Add admin management API route definitions

### 3. Client-side: Dashboard Updates
- [ ] client/src/pages/admin/Dashboard.tsx - Allow university_admin to update status
- [ ] client/src/pages/admin/Dashboard.tsx - organization_admin: read-only view

### 4. Client-side: Admin Management Page
- [ ] client/src/pages/admin/admin-management.tsx - Add proper API calls for CRUD
- [ ] client/src/App.tsx - Add route for admin management page

### 5. Admin Management Features (Main Admin only):
- View all admins
- Edit admin username and email
- Enable/disable admin accounts
