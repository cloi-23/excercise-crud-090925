import React, { useState } from "react";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const countries = ["Afghanistan", "Albania", "Algeria", "USA ", "Philippines"];
const accountTypes = ["Admin", "Manager", "Staff", "Intern", "Contractor"];
const AddEmployeeModal = ({ isOpen, onClose, onSubmit, initialData }: any) => {
  const [form, setForm] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    username: initialData?.username || "",
    email: initialData?.email || "",
    country: initialData?.country || "",
    accountType: initialData?.accountType || "",
    contactNumber: initialData?.contactNumber || "",
    photo: null,
  });
  const [preview, setPreview] = useState<string | null>(
    initialData?.photo
      ? `${backendUrl}/employees/${initialData._id}/photo`
      : null
  );
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, photo: file } as any));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as any);
    });

    onSubmit(formData);
    setForm({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      country: "",
      accountType: "",
      contactNumber: "",
      photo: null,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed text-black inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Add Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-2">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="border p-2 rounded w-1/2"
              required
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="border p-2 rounded w-1/2"
              required
            />
          </div>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="border p-2 rounded w-full"
            required
          />
          <div className="flex space-x-2">
            <div>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <select
              name="accountType"
              value={form.accountType}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select type</option>
              {accountTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <input
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            className="border p-2 rounded w-full"
          />
          <div className="mb-2">
            <label>Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
