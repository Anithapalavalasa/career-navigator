# Career Navigator

A high-performance, enterprise-grade portal designed for the **Digital Monitoring Cell, JNTU-GV**. This platform centralizes career opportunity distribution, academic registrations, and comprehensive administrative oversight for the university ecosystem.

---

## 🏛️ Institutional Ownership & Compliance

This software is an official asset of **Jawaharlal Nehru Technological University - Gurajada, Vizianagaram (JNTU-GV)**. 

- **Supervision:** Digital Monitoring Cell, JNTU-GV.
- **Copyright:** © 2026 JNTU-GV. All Rights Reserved.
- **License:** Exclusive license issued to JNTU-GV.

---

## 💎 Core Capabilities

### 🎓 For Students
- **Smart Registration:** Intuitive onboarding with advanced field validation and duplicate detection logic.
- **Real-time Notifications:** Instant access to job postings, academic events, and circulars with secure PDF rendering.

### 🛡️ For Administrators
- **Granular RBAC:** Sophisticated Role-Based Access Control allowing differentiated permissions for **Main Admins**, **University Admins**, and **Organization Admins**.
- **Data Intelligence:** Seamless export of complex registration datasets to Excel format for advanced reporting and institutional analytics.
- **System Integrity:** Secure authentication protocols and encrypted password management.

---

## 🛠️ Technical Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS (Modern UX/UI), Framer Motion (Animations), Radix UI (Headless Components) |
| **Backend** | Node.js (Runtime), Express (RESTful API), TypeScript (Type Safety) |
| **Persistence** | PostgreSQL (Data Engine), Drizzle ORM (Type-safe SQL Generation) |
| **Tooling** | Drizzle Kit (Migrations), tsx (Live Execution), Multer (Secure File Handling) |

---

## ⚙️ Deployment & Installation

### Environment Configuration
Deploying this system requires an active PostgreSQL environment and an SMTP gateway. Create a `.env` file in the root directory:
```env
# Infrastructure Configuration
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[db_name]
PORT=3004

# Institutional Email Service (SMTP)
# Add SMTP configuration keys here
```

### Installation Workflow
1. **Dependency Resolution:**
   ```bash
   npm install
   ```
2. **Database Synchronization:**
   ```bash
   npm run db:push
   ```
3. **Institutional Seeding:**
   ```bash
   npm run db:seed
   ```
4. **Development Runtime:**
   ```bash
   npm run dev
   ```

---

## 🤝 Engineering & Development

The evolution of Career Navigator is the result of collaborative engineering between university leadership and dedicated developers.

### **Anil Sinthu** 
- **Designation:** Lead Developer | Programmer, JNTU Gurajada
- **Scope:** Orchestrated the complete system revamp, architectural enhancement, and enterprise-level feature implementation.

### **Anitha Palavalasa** 
- **Designation:** Student Developer | Repository Owner
- **Scope:** Concept scratch builder and original foundation developer.

---

## 📜 Legal Notice

Unauthorized reproduction, distribution, or reverse engineering of this portal or any of its constituent modules is strictly prohibited without explicit written consent from the **Digital Monitoring Cell, JNTU-GV**.
