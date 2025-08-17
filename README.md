
# EventSphere - Backend

📁 Project Setup (Local)
------------------------

1. Clone the backend repo:
```bash
git clone https://github.com/zain085/Showcase360-backend.git
cd Showcase360-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend root with the following keys:
```env
PORT=3000
MONGODB_URI=<your-mongodb-uri>
SECRET_KEY=<your-secret-key>
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will run at `http://localhost:3000` (or your specified PORT).

---

📌 Project Structure
---------------------
- `/models` → Mongoose schemas for users, expos, booths, sessions, feedback, etc.  
- `/routes` → API routes for admin, exhibitor, attendee, auth.  
- `/controllers` → Functions handling business logic for routes.  
- `/middleware` → Role-based access control, authentication checks.  
- `/utils` → Helper functions (e.g., JWT generation, password hashing).  
- `server.js` → Entry point of the backend application.

---

📦 Project Dependencies
------------------------
- express
- mongoose
- dotenv
- cors
- bcryptjs
- jsonwebtoken
- body-parser
- nodemon (dev dependency)

---

✅ Features & Notes
--------------------
- **Role-based access system** with three user types:
  - Admin / Organizer  
  - Exhibitor  
  - Attendee

- **Authentication & Security:**
  - Secure registration and login for all roles.  
  - Passwords hashed before storage.  
  - Forgot Password & Reset Password endpoints implemented.  

- **Admin/Organizer Capabilities:**
  - Create, edit, delete expos and sessions.  
  - Assign/unassign booths to exhibitors.  
  - Manage exhibitors: approve, update, or reject.  
  - View analytics and attendee messages.  

- **Exhibitor Capabilities:**
  - Create/update profile with company info, logo, services, and documents.  
  - Manage assigned booths.  
  - Register for expos.  

- **Attendee Capabilities:**
  - View expos, sessions, exhibitors, and floor plans.  
  - Register/bookmark sessions.  
  - Submit feedback/messages to admin.

- **API Standards:**
  - Centralized responses follow consistent JSON format:
```json
{
  "message": "Your message",
  "success": true,
  "key": [...]
}
```

---

💡 Notes
---------
- Ensure `.env` file is **never committed** to GitHub.  
- Use Postman or your frontend to test API endpoints.  
- All endpoints are secured based on user roles and JWT authentication.
