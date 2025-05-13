{persons.map((person) => (
<Person 
            key={person.id}
            name={person.name}
            title={person.title}
            salary={person.salary}
            phone={person.phone}
            email={person.email}
            animal={person.animal}
          />
))}
