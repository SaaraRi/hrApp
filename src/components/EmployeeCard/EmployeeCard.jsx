import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router';
import './EmployeeCard.css';

const EmployeeCard = ({
    name,
    title,
    department,
    location,
    startDate,
    salary,
    skills,
    email,
    phone,
    id, 
    onEditData,
    ...rest
}) => {

  const originalData = useMemo(() => ({
    name, title, department, location, startDate, salary, skills, email, phone,
  }), [name, title, department, location, startDate, salary, skills, email, phone]);

  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState(originalData);

  useEffect(() => {
    setNewData(originalData);
  }, [originalData]);

  const handleSave = () => {
    onEditData(id, newData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewData(originalData);
    setIsEditing(false);
  };
  const handleDetails = () => {};

  const isSaveDisabled =
    newData === "" || JSON.stringify(newData) === JSON.stringify(originalData);

    const startedJob = new Date(startDate);
    const currentDate = new Date();
    const timeDifference = currentDate - startedJob;
    const daysOfEmployment = timeDifference / (1000 * 3600 * 24);
    const yearsOfEmployment = (daysOfEmployment / 365).toFixed(1);
    const fullYearsOfEmployment = currentDate.getFullYear() - startedJob.getFullYear();
    
  return (
    <>
      <div className='card'>
          {isEditing ? (
            <>
              <input
                type="text"
                value={newData.name}
                onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                placeholder="Name"
              />
              <input
                type="text"
                value={newData.title}
                onChange={(e) => setNewData({ ...newData, title: e.target.value })}
                placeholder="Title"
              />
              <input
                type="text"
                value={newData.department}
                onChange={(e) => setNewData({ ...newData, department: e.target.value })}
                placeholder="Department"
              />
              <input
                type="text"
                value={newData.location}
                onChange={(e) => setNewData({ ...newData, location: e.target.value })}
                placeholder="Location"
              />
              <input
                type="date"
                value={newData.startDate}
                onChange={(e) => setNewData({ ...newData, startDate: e.target.value })}
              />
              <input
                type="number"
                value={newData.salary}
                onChange={(e) => setNewData({ ...newData, salary: e.target.value })}
                placeholder="Salary"
              />
              <input
                type="text"
                value={newData.email}
                onChange={(e) => setNewData({ ...newData, email: e.target.value })}
                placeholder="Email"
              />
              <input
                type="text"
                value={newData.phone}
                onChange={(e) => setNewData({ ...newData, phone: e.target.value })}
                placeholder="Phone"
              />
              <input
                type="text"
                value={newData.skills.join(', ')}
                onChange={(e) => setNewData({ ...newData, skills: e.target.value.split(',').map(skills => skills.trim()) })}
                placeholder="Skills"
              />
            </>
          ) : (
            <>
              <p>{name}</p>
              <p>{title}</p>
              <p>{department}, {location}</p>
              <p>Start date: {startDate} ({yearsOfEmployment} years of employment)</p>

              <div>
              {fullYearsOfEmployment % 5 === 0 && fullYearsOfEmployment > 0? (
                  <p>Schedule recognition meeting</p>
              ) : yearsOfEmployment < 0.5 ? (
                  <p>Schedule probation review</p>
              ) : null}
              </div>    
              <p>Salary: {salary}</p>
              <p>{skills.map(skill => skill.trim()).join(', ')}</p>
              <p>Contact:</p>
              <p>Phone: {phone}</p>
              <p>Email: {email}</p>
            </>
          )}
          <div>
            <Link to={`/employees/${id}`}>
              See more
            </Link>
            {isEditing ? (
              <>
                <button onClick={handleSave} disabled={isSaveDisabled}>
                  Save
                </button>
                <button onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)}>
                Edit
              </button>
            )}
          </div>
      </div>
    </>
  );
};

export default EmployeeCard;
