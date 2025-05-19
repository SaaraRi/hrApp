import { Link } from 'react-router';
import './PersonCard.css';

const PersonCard = ({
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
    ...rest
}) => {

    const startedJob = new Date(startDate);
    const currentTime = new Date();
    const yearsOfEmployment = currentTime.getFullYear() - startedJob.getFullYear();
   

    return (
        <div className="card" >
            <p>{name}</p>
            <p>{title}</p>
            <p>{department}, {location}</p>
            <p>Start date: {startDate} ({yearsOfEmployment} years of employment)</p>

            <div>
            {yearsOfEmployment % 5 === 0 && yearsOfEmployment > 0? (
                <p>Schedule recognition meeting</p>
            ) : yearsOfEmployment < 0.5 ? (
                <p>Schedule probation review</p>
            ) : null}
            </div>    
            <p>Salary: {salary}</p>
            <p>Skills: {skills[0]}, {skills[1]}, {skills[2]}</p>
            <p>Contact:</p>
            <p>Phone: {phone}</p>
            <p>Email: {email}</p>
            <Link to={`/list/${id}`}>
          See more</Link>
            
        </div>
    );
};

    export default PersonCard;
