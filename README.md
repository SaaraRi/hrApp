# HR Manager App

This is an HR Application made for managing and displaying employee data. The project is built using **React** for the frontend and **JSON Server** for a mock backend API.

link to frontend: https://hrmanager3.netlify.app/employees
link to backend: https://hrapp-backend5.onrender.com/employees

---

## Technologies Used

- React (with hooks, state management)
- React Router for page navigation, dynamic routing for individual profile pages
- Axios for API calls (with custom hook useAxios)
- JSON Server as local backend for employee database
- CSS Modules for styling

---

## Installing the Application Locally

```bash

# Clone the repository in your terminal

git clone https://github.com/SaaraRi/hrApp.git

# Navigate to the project folder

cd hrApp

# Install frontend dependencies

npm install

# Install JSON Server

nnpm install --save-dev json-server@latest


```

---

## Running the Application

```bash

# Start the frontend

npm run dev


# Start the JSON Server

json-server --watch db.json --port 3007


```

---

## Application Page Structure and Main Features

1. Employees dashboard/employees list (index page)

   - The dashboard shows a gallery of employee profile cards, fetched from a local JSON server acting as database.
   - The page has a search function with several parameters (text input, department select, checkboxes for location and scheduling) to search and filter employee cards.
   - Each card shows an employee's title/status/skills/contact and other key information.
   - The profile cards have a banner that is color-coded according to job department, and a fetched placeholder image of the employee.
   - The cards also display a possible reminder to schedule a probation review/recognition meeting, or an awarded "Employee of the Month" -badge.
   - Each card has “View profile”- and “Edit profile”-buttons, which navigate to an extended individual profile page of the employee.

2. Individual employee profile pages

   - View mode shows a more extensive version of the profile, with sections for management/personal information.
   - Edit-button opens editable fields on the profile page. If edited input is saved, the new data is submitted to the employee database and displayed on both the individual profile page and employees dashboard.
   - Toggle-button for awarding/removing "Employee of the Month" -status and badge.
   - Delete-button for removing the employee profile from the database and employees dashboard.

3. Add employee -page

   - A form to input data and submit a new employee profile into the database, the profile card then displayed in the employees dashboard.

4. Header for navigation
   - A fixed header component and back-to-top -button for easier navigation between pages and scrolling the employee gallery.
