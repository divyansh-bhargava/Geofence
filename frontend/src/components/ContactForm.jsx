import React, { useState } from "react";
import "../styles/ContactForm.css";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Contact:", { name, email, phone });
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <div className="contact-form-card">
      <h3>Add New Contact</h3>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Enter phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Add Contact</button>
      </form>
    </div>
  );
}

export default ContactForm;
