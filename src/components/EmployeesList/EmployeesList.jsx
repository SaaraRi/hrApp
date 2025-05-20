import EmployeeCard from "../EmployeeCard/EmployeeCard";
import './EmployeesList.css';

const EmployeesList = ({ employeesData, onEditData }) => {
    return (
        <>
        <h1>Employees Dashboard</h1>
        <div className="personslist">
            {employeesData.map((employee) => (
                <EmployeeCard
                key={employee.id}
                {...employee}
                onEditData={onEditData}
                />
            ))}
        </div>
        </>
    )};

export default EmployeesList;