Employee Payroll Management System 💼📊
This repository contains a complete Employee Payroll web application for adding, managing, validating, and displaying employee data.

🛠 Tech Stack
Frontend: HTML, CSS, JavaScript

Backend: JSON Server API

Database: JSON file 

Validation: Custom JS form validation

Version Control: Git & GitHub

Editor: VS Code

✨ Features
Employee registration form with real-time validation

Add/Update/Delete/Search employee records

JSON Server API integration for data persistence

Responsive data table with pagination

Reset form functionality

📋 Key Functionalities
🔹 Employee Form
text
- Complete employee details input
- Real-time validation (name, salary, etc.)
- Submit saves to JSON Server API
- Update mode for editing existing records
- Reset clears all fields
Validation Rules:

Name: Required, alphabetic only

Salary: Valid salary

Start Date: Valid date format

Department/Notes: Required fields

Phone/Email: Proper format

🔹 Data Table Dashboard
text
- Displays all employees from API
- Add New Employee button
- Search bar (filters by name/department)
- Delete individual records
- Edit/Update button per row
🔹 JSON Server API
text
- Mock REST API at http://localhost:3000/employees
- Automatic data persistence in db.json
- POST/PUT/GET/DELETE endpoints
- Started with: npx json-server --watch db.json --port 3000
📂 Project Structure
text
├── Layout
       ├── Form.html        # Main form 
├── script.js                # Form validation & API calls
     ├──DOM
        ├──DomForm.js
        ├──DomTable.js
     ├──jQuery
        ├──jQuery.js
        ├──jQueryT.js
├──index.html 
├── db.json            # Employee data storage
└── README.md          # This file
🚀 Quick Start
Install JSON Server: npm install -g json-server

Start API: npx json-server --watch db.json --port 3000

Open index.html in browser

Fill form → Submit → See in table!

🎯 Learning Outcomes
Full Add/Update/Edit/Delete/Search operations with REST API

Form validation & error handling

JSON Server for rapid prototyping

Responsive table implementation

Git workflow for web projects

👤 Author
Tanya Maheshwari
B.Tech
