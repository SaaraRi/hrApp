import styles from "./LoaderSpinner.module.css";

const LoaderSpinner = () => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loaderSpinner} />
    </div>
  );
};

export default LoaderSpinner;
