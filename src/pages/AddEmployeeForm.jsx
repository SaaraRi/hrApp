import { useState } from 'react';
import { useNavigate } from 'react-router'

const AddEmployee = ({ onAddEmployee }) => {

    const [formData, setFormData] = useState({
      name: "",
      title: "",
      department: "",
      location: "",
      startDate: "",
      salary: "",
      skills: [],
      email: "",
      phone: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        const newEmployee = {
          ...formData,
          skills: formData.skills.split(",").map(skill => skill.trim()),
        };
      
        onAddEmployee(newEmployee, () => navigate("/employees"));
      };
      
  return (
    <>
      <div className="container">
        <h1>Add New Employee</h1>
        <form onSubmit={handleSubmit}>
          <div className="add-input">
                <label htmlFor="name" className="white-font">Full name:</label>
                <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                />
            </div>
            <div className="add-input">
                <label htmlFor="title" className="white-font">Title:</label>
                <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange}
                />
            </div>
            <div className="add-input">
                <label htmlFor="department" className="white-font">Department:</label>
                <input 
                    type="text" 
                    name="department" 
                    value={formData.department} 
                    onChange={handleChange}
                />
            </div>
            <div className="add-input">
                <label htmlFor="location" className="white-font">Location:</label>
                <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange}
                />
            </div>
            <div className="add-input">
                <label htmlFor="startDate" className="white-font">Start date:</label>
                <input 
                    type="date" 
                    name="startDate" 
                    value={formData.startDate} 
                    onChange={handleChange}
                />
            </div>
            <div className="add-input">
                <label htmlFor="salary" className="white-font">Salary:</label>
                <input 
                    type="number" 
                    name="salary" 
                    value={formData.salary} 
                    onChange={handleChange}
                />
            </div>
            <div className="add-input">
                <label htmlFor="skills" className="white-font">Skills:</label>
                <input 
                    type="text" 
                    name="skills" 
                    value={formData.skills} 
                    onChange={handleChange}
                />
            </div>
            <div className="add-input">
                <label htmlFor="email" className="white-font">Email:</label>
                <input 
                    type="text" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                />
            </div>
            <div className="add-input">
                <label htmlFor="phone" className="white-font">Phone:</label>
                <input 
                    type="text" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange}
                />
            </div>
            <button type="submit" className="add-btn">Add employee</button>
        </form>
      </div>     
    </>
    );
};

export default AddEmployee;