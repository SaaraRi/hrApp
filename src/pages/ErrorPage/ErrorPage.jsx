/*const ErrorPage = () => {
  return <div>Customised Page Not Found</div>;
};

export default ErrorPage;*/

import { useNavigate } from "react-router";
//import Button from "../../components/Button/Button";
//import styles from "./ErrorPage.module.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.ErrorPage}>
      <h2>Oops! Something went wrong.</h2>
      <p>
        We couldn't find the page you were looking for. It might have been moved
        or no longer exists.
      </p>
      <div className="error-actions">
        <Button
          onClick={() => navigate("/")}
          text="Go back Home"
          role="primary"
        />
        <Button
          onClick={() => window.location.reload()}
          text="Retry"
          role="primary-light"
        />
      </div>
    </div>
  );
};

export default ErrorPage;
