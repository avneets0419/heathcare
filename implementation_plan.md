# Hospital Management System - Implementation Plan & Structure

## 📑 Page-by-Page Structure by Role

### 1. Authentication & Common Pages
- `/login`: Unified login page for all users (Patient, Doctor, Admin).
- `/register`: Registration page for new patients.
- `/unauthorized`: Error page for access denied based on role permissions.

### 2. Patient Portal
- `/patient/dashboard`: Overview of upcoming appointments, recent prescriptions, and general health metrics.
- `/patient/doctors`: Browse and search for available doctors by specialization.
- `/patient/appointments/book`: Flow to select a doctor, view available slots, and book an appointment.
- `/patient/appointments`: List of all upcoming and past appointments with options to cancel.
- `/patient/medical-history`: View past prescriptions and medical records.
- `/patient/profile`: Manage personal details and settings.

### 3. Doctor Portal
- `/doctor/dashboard`: Overview of today's schedule, total patients, and pending requests.
- `/doctor/appointments`: Manage appointments (view details, cancel, complete).
- `/doctor/schedule`: Interface to set weekly availability and time slots.
- `/doctor/patients`: View list of assigned patients and their medical history.
- `/doctor/prescriptions/new`: Interface to write and issue a prescription post-appointment.
- `/doctor/profile`: Manage professional details, specialization, and settings.

### 4. Admin Portal
- `/admin/dashboard`: System-wide analytics (total doctors, patients, active appointments, revenue if applicable).
- `/admin/users/doctors`: CRUD operations for doctor profiles (onboard new doctors).
- `/admin/users/patients`: View and manage patient accounts.
- `/admin/appointments`: System-wide view of all appointments for monitoring.
- `/admin/settings`: System configurations and logs.

---

## 🚀 Course of Action Plan

### **Step 1: Project Setup & Foundation**
- Initialize the **Next.js** application with **TypeScript** and **Tailwind CSS**.
- Configure the core folder structure (`/app`, `/components`, `/lib`, `/hooks`, `/types`).
- Install and initialize **Shadcn UI** along with base utility classes for the "premium, modern dashboard" aesthetic (glassmorphism, soft shadows, specified color palette).
- Setup **Axios** instance with interceptors for API calls.

### **Step 2: Core Layouts & Theme**
- Develop the main application shell based on the provided reference image (Sidebar Navigation, Top Header with Search/Notifications).
- Create generic Layout components for Patient, Doctor, and Admin to handle role-specific sidebar links.
- Define global CSS tokens (colors, typography) to match the provided premium UI design.

### **Step 3: Authentication & Routing**
- Build the Login and Registration screens.
- Implement role-based route protection using Next.js Middleware or Higher-Order Components.
- Define TypeScript interfaces for User, Patient, Doctor, Admin based on the Class Diagram.

### **Step 4: Developing the 'Patient' Views**
- Build the Patient Dashboard UI.
- Implement the Doctor Search and Listing interface.
- Create the multi-step Appointment Booking flow (Select Doctor -> Pick Slot -> Confirm).

### **Step 5: Developing the 'Doctor' Views**
- Build the Doctor Dashboard UI.
- Implement the Schedule/Availability calendar interface.
- Create the prescription writing interface.

### **Step 6: Developing the 'Admin' Views**
- Build the Admin Dashboard with charts and statistics (resembling the reference image).
- Implement data tables for managing Doctors and Patients.

### **Step 7: API Integration & State Management**
- Connect UI components to backend API endpoints using Axios.
- Handle loading states, error handling, and toast notifications.
- Polish animations (micro-interactions) and ensure full responsiveness.
