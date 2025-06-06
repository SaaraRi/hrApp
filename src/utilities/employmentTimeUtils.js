export const getEmploymentTime = (startDate) => {
  const startedWorkDate = new Date(startDate);
  const currentDate = new Date();
  const timeDifference = currentDate - startedWorkDate;
  const daysOfEmployment = timeDifference / (1000 * 3600 * 24);
  const yearsOfEmployment = (daysOfEmployment / 365).toFixed(1);
  const fullYearsOfEmployment =
    currentDate.getFullYear() - startedWorkDate.getFullYear();

  const scheduleProbationReview = yearsOfEmployment < 0.5;
  const scheduleRecognitionMeeting =
    fullYearsOfEmployment % 5 === 0 && fullYearsOfEmployment > 0;

  return {
    yearsOfEmployment,
    fullYearsOfEmployment,
    scheduleProbationReview,
    scheduleRecognitionMeeting,
  };
};
