import React, { useState } from "react";
import "../styles/ContactTable.css";

function ContactTable() {
  const [contacts, setContacts] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "+91 9876543210" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+91 9123456780" },
  ]);

  const deleteContact = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <div className="contact-table-card">
      <h3>Saved Contacts</h3>
      <table className="contact-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email || "-"}</td>
              <td>{c.phone || "-"}</td>
              <td>
                <button onClick={() => deleteContact(c.id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContactTable;
