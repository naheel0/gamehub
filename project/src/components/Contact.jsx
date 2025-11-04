import React, { useState } from 'react'
import emailjs from 'emailjs-com'
import Footer from './Footer'

// Initialize EmailJS (use your actual public key)
emailjs.init("VLxM2t4JmL7HsMc4F")

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const sendEmail = (e) => {
    e.preventDefault()

    const serviceID = "service_6kxz2ig"
    const templateID = "template_qd8leoi"

    const templateParams = {
      from_name: formData.name,
      reply_to: formData.email,
      message: formData.message,
    }

    emailjs
      .send(serviceID, templateID, templateParams)
      .then((res) => {
        console.log("✅ Email sent:", res)
        alert("Your message has been sent successfully!")
        setFormData({ name: "", email: "", message: "" })
      })
      .catch((err) => {
        console.error("❌ Email failed:", err)
        alert("Failed to send message. Please try again.")
      })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>
      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={sendEmail} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              placeholder="Your Email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
              placeholder="Your Message"
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition w-full"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact