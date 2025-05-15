import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaUser,
  FaUserPlus,
  FaStar,
} from "react-icons/fa";

// Define Contact interface
interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone?: string;
  linkedin?: string;
  isPrimary: boolean;
  notes?: string;
}

// Organization interface for props
interface Organization {
  id: string;
  name: string;
  type: string;
  country: string;
  isHolding: boolean;
  holdingName?: string;
  legalName: string;
  contactName?: string;
  contactEmail?: string;
  status: "Active" | "Inactive";
}

interface OrganizationContactsProps {
  organization: Organization;
  hideActionButtons?: boolean;
}

const OrganizationContacts: React.FC<OrganizationContactsProps> = ({
  organization,
  hideActionButtons = false,
}) => {
  // Create sample contacts based on the organization's primary contact
  const initialContacts: Contact[] = organization.contactName
    ? [
        {
          id: "contact1",
          name: organization.contactName || "",
          position: "Chief Executive Officer",
          email: organization.contactEmail || "",
          phone: "+1 234 567 890",
          linkedin: "https://www.linkedin.com/in/primary-contact",
          isPrimary: true,
          notes: "Primary organization contact",
        },
        {
          id: "contact2",
          name: "Alex Rodriguez",
          position: "Chief Financial Officer",
          email: "alex.rodriguez@example.com",
          phone: "+1 234 567 891",
          linkedin: "https://www.linkedin.com/in/alex-rodriguez",
          isPrimary: false,
          notes: "Responsible for billing and payments",
        },
        {
          id: "contact3",
          name: "Laura Gomez",
          position: "Marketing Manager",
          email: "laura.gomez@example.com",
          phone: "+1 234 567 892",
          linkedin: "https://www.linkedin.com/in/laura-gomez",
          isPrimary: false,
          notes: "Contact for campaigns and promotions",
        },
      ]
    : [];

  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, "id">>({
    name: "",
    position: "",
    email: "",
    phone: "",
    linkedin: "",
    isPrimary: false,
    notes: "",
  });

  // Handle contact selection
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditingContact(false);
  };

  // Handle adding contact
  const handleAddContact = () => {
    setIsAddingContact(true);
    setSelectedContact(null);
    setIsEditingContact(false);
    setNewContact({
      name: "",
      position: "",
      email: "",
      phone: "",
      linkedin: "",
      isPrimary: false,
      notes: "",
    });
  };

  // Handle saving new contact
  const handleSaveNewContact = () => {
    if (newContact.name && newContact.email) {
      const contact: Contact = {
        id: `contact${Date.now()}`,
        ...newContact,
      };

      // If the new contact is primary, update the others
      let updatedContacts = [...contacts];
      if (newContact.isPrimary) {
        updatedContacts = updatedContacts.map((c) => ({
          ...c,
          isPrimary: false,
        }));
      }

      setContacts([...updatedContacts, contact]);
      setIsAddingContact(false);
      setSelectedContact(contact);
    }
  };

  // Handle cancel adding contact
  const handleCancelAddContact = () => {
    setIsAddingContact(false);
    if (contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  };

  // Handle changes in new contact
  const handleNewContactChange = (
    field: keyof Omit<Contact, "id">,
    value: string | boolean
  ) => {
    setNewContact({
      ...newContact,
      [field]: value,
    });
  };

  // Handle edit contact
  const handleEditContact = () => {
    if (selectedContact) {
      setIsEditingContact(true);
    }
  };

  // Handle save edited contact
  const handleSaveEditedContact = () => {
    if (selectedContact) {
      // If the edited contact is primary, update the others
      let updatedContacts = [...contacts];
      if (selectedContact.isPrimary) {
        updatedContacts = updatedContacts.map((c) => ({
          ...c,
          isPrimary: c.id === selectedContact.id ? true : false,
        }));
      }

      setContacts(
        updatedContacts.map((contact) =>
          contact.id === selectedContact.id ? selectedContact : contact
        )
      );
      setIsEditingContact(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditingContact(false);
    // Restore the original contact from the list
    if (selectedContact) {
      const originalContact = contacts.find((c) => c.id === selectedContact.id);
      if (originalContact) {
        setSelectedContact(originalContact);
      }
    }
  };

  // Handle changes in selected contact
  const handleSelectedContactChange = (
    field: keyof Contact,
    value: string | boolean
  ) => {
    if (selectedContact) {
      setSelectedContact({
        ...selectedContact,
        [field]: value,
      });
    }
  };

  // Handle delete contact
  const handleDeleteContact = (contactId: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      const updatedContacts = contacts.filter((c) => c.id !== contactId);
      setContacts(updatedContacts);

      // If the deleted contact was selected, select the first one
      if (selectedContact && selectedContact.id === contactId) {
        setSelectedContact(
          updatedContacts.length > 0 ? updatedContacts[0] : null
        );
        setIsEditingContact(false);
      }
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      {!hideActionButtons && (
        <div className="flex justify-end items-center p-4">
          <button
            onClick={handleAddContact}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <FaUserPlus className="h-4 w-4" />
            Add Contact
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Contact list */}
        <div className="w-full md:w-1/3 border-r border-gray-200 bg-violet-50 bg-opacity-50">
          <div className="p-4">
            {contacts.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>No contacts added yet.</p>
                <button
                  onClick={handleAddContact}
                  className="mt-2 px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1"
                >
                  <FaUserPlus className="h-3.5 w-3.5" />
                  Add your first contact
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => handleSelectContact(contact)}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedContact && selectedContact.id === contact.id
                        ? "bg-violet-100 border border-violet-200 shadow-sm"
                        : "hover:bg-violet-50 border border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900 flex items-center">
                          <FaUser className="h-3.5 w-3.5 mr-1.5 text-violet-600" />
                          {contact.name}
                          {contact.isPrimary && (
                            <FaStar className="ml-1.5 h-3 w-3 text-amber-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.position}
                        </div>
                        <div className="text-xs text-violet-600 mt-1 flex items-center">
                          <FaEnvelope className="h-3 w-3 mr-1" />
                          {contact.email}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContact(contact.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact details */}
        <div className="w-full md:w-2/3 p-6">
          {isAddingContact ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Add New Contact
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNewContact}
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <FaSave className="h-3.5 w-3.5" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelAddContact}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <FaTimes className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                </div>
              </div>

              <div className="space-y-4 bg-gradient-to-b from-violet-50 to-white p-4 rounded-lg shadow-sm border border-violet-100">
                {/* Name */}
                <div>
                  <label
                    htmlFor="new-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="new-name"
                    value={newContact.name}
                    onChange={(e) =>
                      handleNewContactChange("name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Position */}
                <div>
                  <label
                    htmlFor="new-position"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Position *
                  </label>
                  <input
                    type="text"
                    id="new-position"
                    value={newContact.position}
                    onChange={(e) =>
                      handleNewContactChange("position", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="new-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="new-email"
                    value={newContact.email}
                    onChange={(e) =>
                      handleNewContactChange("email", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="new-phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="new-phone"
                    value={newContact.phone || ""}
                    onChange={(e) =>
                      handleNewContactChange("phone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label
                    htmlFor="new-linkedin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    id="new-linkedin"
                    value={newContact.linkedin || ""}
                    onChange={(e) =>
                      handleNewContactChange("linkedin", e.target.value)
                    }
                    placeholder="https://www.linkedin.com/in/username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Primary Contact */}
                <div className="flex items-center h-full pt-6">
                  <input
                    type="checkbox"
                    id="new-isPrimary"
                    checked={newContact.isPrimary}
                    onChange={(e) =>
                      handleNewContactChange("isPrimary", e.target.checked)
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="new-isPrimary"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Primary contact
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label
                  htmlFor="new-notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Notes
                </label>
                <textarea
                  id="new-notes"
                  rows={3}
                  value={newContact.notes || ""}
                  onChange={(e) =>
                    handleNewContactChange("notes", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          ) : selectedContact ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center">
                  <FaUser className="mr-2 text-violet-600" />
                  {selectedContact.name}
                  {selectedContact.isPrimary && (
                    <span className="ml-2 flex items-center text-sm text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      <FaStar className="h-3 w-3 mr-1" />
                      Primary Contact
                    </span>
                  )}
                </h3>
                <div className="flex gap-2">
                  {isEditingContact ? (
                    <>
                      <button
                        onClick={handleSaveEditedContact}
                        className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <FaSave className="h-3.5 w-3.5" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <FaTimes className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditContact}
                      className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <FaEdit className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-gradient-to-b from-violet-50 to-white p-4 rounded-lg shadow-sm border border-violet-100">
                  <h4 className="font-medium text-violet-800 pb-2 border-b border-violet-200">
                    Contact Information
                  </h4>
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    {isEditingContact ? (
                      <input
                        type="text"
                        value={selectedContact.name}
                        onChange={(e) =>
                          handleSelectedContactChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <div className="flex items-center">
                        <p className="text-gray-800">{selectedContact.name}</p>
                        {selectedContact.isPrimary && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Primary
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    {isEditingContact ? (
                      <input
                        type="text"
                        value={selectedContact.position}
                        onChange={(e) =>
                          handleSelectedContactChange(
                            "position",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {selectedContact.position}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    {isEditingContact ? (
                      <input
                        type="email"
                        value={selectedContact.email}
                        onChange={(e) =>
                          handleSelectedContactChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-800 flex items-center">
                        <FaEnvelope className="text-indigo-600 mr-2" />
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {selectedContact.email}
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    {isEditingContact ? (
                      <input
                        type="tel"
                        value={selectedContact.phone || ""}
                        onChange={(e) =>
                          handleSelectedContactChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-800 flex items-center">
                        {selectedContact.phone ? (
                          <>
                            <FaPhone className="text-indigo-600 mr-2" />
                            <a
                              href={`tel:${selectedContact.phone}`}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              {selectedContact.phone}
                            </a>
                          </>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    {isEditingContact ? (
                      <input
                        type="url"
                        value={selectedContact.linkedin || ""}
                        onChange={(e) =>
                          handleSelectedContactChange(
                            "linkedin",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-800 flex items-center">
                        {selectedContact.linkedin ? (
                          <>
                            <FaLinkedin className="text-indigo-600 mr-2" />
                            <a
                              href={selectedContact.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              View Profile
                            </a>
                          </>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    )}
                  </div>

                  {/* Primary Contact */}
                  {isEditingContact && (
                    <div className="flex items-center h-full pt-6">
                      <input
                        type="checkbox"
                        id="isPrimary"
                        checked={selectedContact.isPrimary}
                        onChange={(e) =>
                          handleSelectedContactChange(
                            "isPrimary",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isPrimary"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Primary contact
                      </label>
                    </div>
                  )}
                </div>

                <div className="space-y-4 bg-gradient-to-b from-blue-50 to-white p-4 rounded-lg shadow-sm border border-blue-100">
                  <h4 className="font-medium text-blue-800 pb-2 border-b border-blue-200">
                    Communication Details
                  </h4>
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    {isEditingContact ? (
                      <input
                        type="email"
                        value={selectedContact.email}
                        onChange={(e) =>
                          handleSelectedContactChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-800 flex items-center">
                        <FaEnvelope className="text-indigo-600 mr-2" />
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {selectedContact.email}
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    {isEditingContact ? (
                      <input
                        type="tel"
                        value={selectedContact.phone || ""}
                        onChange={(e) =>
                          handleSelectedContactChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-800 flex items-center">
                        {selectedContact.phone ? (
                          <>
                            <FaPhone className="text-indigo-600 mr-2" />
                            <a
                              href={`tel:${selectedContact.phone}`}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              {selectedContact.phone}
                            </a>
                          </>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
              <div>
                <FaUser className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>Select a contact to view details</p>
                <p className="text-sm">or</p>
                <button
                  onClick={handleAddContact}
                  className="mt-2 px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1"
                >
                  <FaUserPlus className="h-3.5 w-3.5" />
                  Add a new contact
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationContacts;
