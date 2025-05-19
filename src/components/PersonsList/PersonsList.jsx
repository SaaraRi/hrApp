import PersonCard from "../PersonCard/PersonCard";
import './PersonsList.css';

const PersonsList = ( {personsData} ) => {
    return (
        <>
        <h1>Employees Dashboard</h1>
        <div className="personslist">
            {personsData.map((person) => (
                <PersonCard
                key={person.id}
                name={person.name}
                title={person.title}
                department={person.department}
                location={person.location}
                startDate={person.startDate}
                salary={person.salary}
                skills={person.skills}
                phone={person.phone}
                email={person.email}
                />
            ))}
        </div>
        </>
    )};

export default PersonsList;