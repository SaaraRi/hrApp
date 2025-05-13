import './PersonCard.css';

const PersonCard = (props) => {

    const startDate = new Date(props.startDate);
    const currentTime = new Date();
    const yearsOfEmployment = currentTime.getFullYear() - startDate.getFullYear();
   

    return (
        <div className="card">
            <p>{props.name}</p>
            <p>{props.title}</p>
            <p>{props.department}, {props.location}</p>
            <p>Start date: {props.startDate} ({yearsOfEmployment} years of employment)</p>

            <div>
            {yearsOfEmployment % 5 === 0 && yearsOfEmployment > 0? (
                <p>Schedule recognition meeting</p>
            ) : yearsOfEmployment < 0.5 ? (
                <p>Schedule probation review</p>
            ) : null}
            </div>    
            <p>Salary: {props.salary}</p>
            <p>Skills: {props.skills[0]}, {props.skills[1]}, {props.skills[2]}</p>
            <p>Contact:</p>
            <p>Phone: {props.phone}</p>
            <p>Email: {props.email}</p>
            <p>{props.animal}</p>
        </div>
    );
};

    export default PersonCard;
