import { useEffect, useState } from "react";
import AddEmployeeModal from "../components/AddEmployeeModal";
import "../App.css";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  country: string;
  accountType: string;
  contactNumber: string;
  photo?: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${backendUrl}/employees`);
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddSubmit = async (formData: FormData) => {
    try {
      const res: any = await fetch(`${backendUrl}/employees`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        const message = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message;
        alert(message);
        return;
      }
      await fetchEmployees();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (id: string, formData: FormData) => {
    try {
      const res = await fetch(`${backendUrl}/employees/${id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update employee");
      setEditEmployee(null);
      await fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      const res = await fetch(`${backendUrl}/employees/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete employee");
      await fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Employees</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Add Record
        </button>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      {/* Edit Employee Modal */}
      {editEmployee && (
        <AddEmployeeModal
          isOpen={!!editEmployee}
          onClose={() => setEditEmployee(null)}
          initialData={editEmployee}
          onSubmit={(formData: any) =>
            handleEditSubmit(editEmployee._id, formData)
          }
        />
      )}

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-400">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Photo</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Username</th>
            <th className="border border-gray-300 px-4 py-2">Country</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {emp.photo ? (
                  <img
                    src={`${backendUrl}/employees/${emp._id}/photo`}
                    alt={emp.username}
                    className="w-12 h-12 rounded-full mx-auto"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 mx-auto" />
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {emp.firstName} {emp.lastName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {emp.username}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {emp.country}
              </td>
              <td className="border border-gray-300 px-4 py-2">{emp.email}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => setEditEmployee(emp)}
                  className="px-2 py-1 mr-2 bg-blue-800 text-white rounded hover:bg-blue-600"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="px-2 py-1 bg-red-800 text-white rounded hover:bg-red-600"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;
