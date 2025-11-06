import React from "react";
import Sidebar from "../components/Sidebar";
import ContactForm from "../components/ContactForm";
import ContactTable from "../components/ContactTable.jsx";
import "../styles/Contacts.css";

function Contacts() {
  return (
    <div className="contacts-container">
      <Sidebar />
      <main className="contacts-main">
        <h2 className="page-title">Manage Contacts</h2>
        <ContactForm />
        <ContactTable />
      </main>
    </div>
  );
}

export default Contacts;
