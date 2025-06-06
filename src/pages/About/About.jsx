import styles from "./About.module.css";

const About = () => {
  return (
    <>
      <div className={styles.aboutContainer}>
        <h1>HR Manager Application</h1>
        <h2>
          This is an HR Application made for managing and displaying employee
          data and built using React.
        </h2>
        <h2>The page structure and main features include:</h2>
        <ol>
          <li>
            Employees dashboard/employees list (index page)
            <ul className={styles.nestedList}>
              <li>
                The dashboard shows a gallery of employee profile cards, fetched
                from a local JSON server acting as database.
              </li>
              <li>
                The page has a search function with several parameters (text
                input, department select, checkboxes for location and
                scheduling) to search and filter employee cards.
              </li>
              <li>
                Each card shows an employee's title/status/skills/contact and
                other key information.
              </li>
              <li>
                The profile cards have a banner that is color-coded according to
                job department, and a fetched placeholder image of the employee.
              </li>
              <li>
                The cards also display a possible reminder to schedule a
                probation review/recognition meeting, or an awarded "Employee of
                the Month" -badge.
              </li>
              <li>
                Each card has “View profile”- and “Edit profile”-buttons, which
                navigate to an extended individual profile page of the employee.
              </li>
            </ul>
          </li>
          <li>
            Individual employee profile pages
            <ul className={styles.nestedList}>
              <li>
                View mode shows a more extensive version of the profile, with
                sections for management/personal information.
              </li>
              <li>
                Edit-button opens editable fields on the profile page. If edited
                input is saved, the new data is submitted to the employee
                database and displayed on both the individual profile page and
                employees dashboard.
              </li>
              <li>
                Toggle-button for awarding/removing "Employee of the Month"
                -status and badge.
              </li>
              <li>
                Delete-button for removing the employee profile from the
                database and employees dashboard.
              </li>
            </ul>
          </li>
          <li>
            Add employee -page
            <ul className={styles.nestedList}>
              <li>
                A form to input data and submit a new employee profile into the
                database, the profile card then displayed in the employees
                dashboard.
              </li>
            </ul>
          </li>
          <li>
            Header for navigation
            <ul className={styles.nestedList}>
              <li>
                A fixed header component and back-to-top -button for easier
                navigation between pages and scrolling the employee gallery.
              </li>
            </ul>
          </li>
        </ol>
        <br />
        <h2>Technologies Used</h2>
        <ul>
          <li>React (with Hooks, state management)</li>
          <li>
            React Router for page navigation, dynamic routing for individual
            profile pages
          </li>
          <li>Axios for API calls (with custom Hook useAxios)</li>
          <li>JSON Server as local backend for employee database</li>
          <li>CSS modules for styling</li>
        </ul>
      </div>
    </>
  );
};

export default About;
