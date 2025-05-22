import React, { useState, useEffect, useRef, useCallback } from "react";
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
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone?: string;
  homePhone?: string;
  mobile?: string;
  fax?: string;
  linkedin?: string;
  isPrimary: boolean;
  notes?: string;
  // Información de dirección
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  // Opción para usar la misma dirección que la compañía
  sameAsCompanyAddress?: boolean;
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
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface OrganizationContactsProps {
  organization: Organization;
  hideActionButtons?: boolean;
  showAddContactForm?: boolean;
  onFormDisplay?: () => void;
}

// Define un tipo para la ventana con el componente expuesto
interface WindowWithComponent extends Window {
  __ORGANIZATION_CONTACTS_COMPONENT?: {
    handleAddContact: () => void;
  };
}

const OrganizationContacts: React.FC<OrganizationContactsProps> = ({
  organization,
  hideActionButtons = false,
  showAddContactForm = false,
  onFormDisplay,
}) => {
  // Create sample contacts based on the organization's primary contact
  const initialContacts: Contact[] = organization.contactName
    ? [
        {
          id: "contact1",
          firstName: organization.contactName?.split(" ")[0] || "",
          lastName:
            organization.contactName
              ?.split(" ")
              .slice(1)
              .join(" ") || "",
          position: "Chief Executive Officer",
          email: organization.contactEmail || "",
          phone: "+1 234 567 890",
          mobile: "+1 234 567 891",
          homePhone: "",
          fax: "",
          linkedin: "https://www.linkedin.com/in/primary-contact",
          isPrimary: true,
          notes: "Primary organization contact",
          street: organization.address || "",
          city: organization.city || "",
          state: organization.state || "",
          postalCode: organization.zipCode || "",
          country: organization.country || "",
          sameAsCompanyAddress: true,
        },
        {
          id: "contact2",
          firstName: "Alex",
          lastName: "Rodriguez",
          position: "Chief Financial Officer",
          email: "alex.rodriguez@example.com",
          phone: "+1 234 567 891",
          linkedin: "https://www.linkedin.com/in/alex-rodriguez",
          isPrimary: false,
          notes: "Responsible for billing and payments",
        },
        {
          id: "contact3",
          firstName: "Laura",
          lastName: "Gomez",
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
    firstName: "",
    lastName: "",
    position: "",
    email: "",
    phone: "",
    homePhone: "",
    mobile: "",
    fax: "",
    linkedin: "",
    isPrimary: false,
    notes: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    sameAsCompanyAddress: false,
  });

  // Añadir estado para el modal de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  // Referencia al componente para detectar eventos
  const componentRef = useRef<HTMLDivElement>(null);

  // Handle adding contact - Definimos la función antes de usarla en cualquier useEffect
  const handleAddContact = useCallback(() => {
    console.log(
      "handleAddContact llamado - actualizando estado para mostrar formulario"
    );
    setIsAddingContact(true);
    setSelectedContact(null);
    setIsEditingContact(false);
    setNewContact({
      firstName: "",
      lastName: "",
      position: "",
      email: "",
      phone: "",
      homePhone: "",
      mobile: "",
      fax: "",
      linkedin: "",
      isPrimary: false,
      notes: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      sameAsCompanyAddress: false,
    });
    console.log("Estado actualizado, isAddingContact:", true);
  }, []);

  // Exponer el componente para permitir el acceso directo
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as WindowWithComponent).__ORGANIZATION_CONTACTS_COMPONENT = {
        handleAddContact: handleAddContact,
      };
    }

    return () => {
      if (typeof window !== "undefined") {
        // Usar el mismo tipo
        delete (window as WindowWithComponent)
          .__ORGANIZATION_CONTACTS_COMPONENT;
      }
    };
  }, [handleAddContact]);

  // Efecto para mostrar el formulario cuando showAddContactForm cambia a true
  useEffect(() => {
    if (showAddContactForm && !isAddingContact) {
      console.log("showAddContactForm es true, mostrando formulario");
      handleAddContact();
      if (onFormDisplay) {
        onFormDisplay();
      }
    }
  }, [showAddContactForm, onFormDisplay, isAddingContact, handleAddContact]);

  // Efecto para escuchar el evento personalizado de agregar contacto
  useEffect(() => {
    const componentElement = componentRef.current;

    if (componentElement) {
      const handleAddContactEvent = () => {
        console.log("Evento 'add-contact' recibido!");
        handleAddContact();
      };

      // Eliminar el evento anterior por si acaso
      componentElement.removeEventListener(
        "add-contact",
        handleAddContactEvent
      );
      // Agregar el nuevo listener de evento
      componentElement.addEventListener("add-contact", handleAddContactEvent);

      console.log(
        "Listener para 'add-contact' configurado en:",
        componentElement
      );

      return () => {
        componentElement.removeEventListener(
          "add-contact",
          handleAddContactEvent
        );
      };
    }
  }, [handleAddContact]);

  // Handle contact selection
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditingContact(false);
  };

  // Handle saving new contact with updated fields
  const handleSaveNewContact = () => {
    if (newContact.firstName && newContact.email) {
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

      // If sameAsCompanyAddress is true, copy the organization's address
      if (newContact.sameAsCompanyAddress) {
        contact.street = organization.address || "";
        contact.city = organization.city || "";
        contact.state = organization.state || "";
        contact.postalCode = organization.zipCode || "";
        contact.country = organization.country || "";
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
    setContactToDelete(contactId);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación del contacto
  const confirmDeleteContact = () => {
    if (contactToDelete) {
      const updatedContacts = contacts.filter((c) => c.id !== contactToDelete);
      setContacts(updatedContacts);

      // Si el contacto eliminado era el seleccionado, seleccionar el primero
      if (selectedContact && selectedContact.id === contactToDelete) {
        setSelectedContact(
          updatedContacts.length > 0 ? updatedContacts[0] : null
        );
        setIsEditingContact(false);
      }

      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  // Cancelar eliminación del contacto
  const cancelDeleteContact = () => {
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg" ref={componentRef}>
      {!hideActionButtons && (
        <div className="flex justify-end items-center p-4">
          <button
            onClick={handleAddContact}
            data-action="add-contact"
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
                          {contact.firstName} {contact.lastName}
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
                <h4 className="font-medium text-violet-800 pb-2 border-b border-violet-200">
                  Contact Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="new-first-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="new-first-name"
                      value={newContact.firstName}
                      onChange={(e) =>
                        handleNewContactChange("firstName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="new-last-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="new-last-name"
                      value={newContact.lastName}
                      onChange={(e) =>
                        handleNewContactChange("lastName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    />
                  </div>

                  {/* Position/Title */}
                  <div>
                    <label
                      htmlFor="new-position"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="new-position"
                      value={newContact.position}
                      onChange={(e) =>
                        handleNewContactChange("position", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    />
                  </div>

                  {/* Home Phone */}
                  <div>
                    <label
                      htmlFor="new-home-phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Home Phone
                    </label>
                    <input
                      type="tel"
                      id="new-home-phone"
                      value={newContact.homePhone || ""}
                      onChange={(e) =>
                        handleNewContactChange("homePhone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label
                      htmlFor="new-mobile"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mobile
                    </label>
                    <input
                      type="tel"
                      id="new-mobile"
                      value={newContact.mobile || ""}
                      onChange={(e) =>
                        handleNewContactChange("mobile", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    />
                  </div>

                  {/* Fax */}
                  <div>
                    <label
                      htmlFor="new-fax"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Fax
                    </label>
                    <input
                      type="tel"
                      id="new-fax"
                      value={newContact.fax || ""}
                      onChange={(e) =>
                        handleNewContactChange("fax", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="md:col-span-2">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mt-6 space-y-4 bg-gradient-to-b from-blue-50 to-white p-4 rounded-lg shadow-sm border border-blue-100">
                <h4 className="font-medium text-blue-800 pb-2 border-b border-blue-200">
                  Address Information
                </h4>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="new-same-address"
                    checked={newContact.sameAsCompanyAddress}
                    onChange={(e) =>
                      handleNewContactChange(
                        "sameAsCompanyAddress",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="new-same-address"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Same as company address
                  </label>
                </div>

                {!newContact.sameAsCompanyAddress && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Street */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="new-street"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Street
                      </label>
                      <textarea
                        id="new-street"
                        value={newContact.street || ""}
                        onChange={(e) =>
                          handleNewContactChange("street", e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label
                        htmlFor="new-city"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="new-city"
                        value={newContact.city || ""}
                        onChange={(e) =>
                          handleNewContactChange("city", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label
                        htmlFor="new-state"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        id="new-state"
                        value={newContact.state || ""}
                        onChange={(e) =>
                          handleNewContactChange("state", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                      />
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label
                        htmlFor="new-postal-code"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="new-postal-code"
                        value={newContact.postalCode || ""}
                        onChange={(e) =>
                          handleNewContactChange("postalCode", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label
                        htmlFor="new-country"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Country
                      </label>
                      <input
                        type="text"
                        id="new-country"
                        value={newContact.country || ""}
                        onChange={(e) =>
                          handleNewContactChange("country", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="mt-6 space-y-4 bg-gradient-to-b from-amber-50 to-white p-4 rounded-lg shadow-sm border border-amber-100">
                <h4 className="font-medium text-amber-800 pb-2 border-b border-amber-200">
                  Additional Information
                </h4>

                {/* Primary Contact */}
                <div className="flex items-center h-full">
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

                {/* Notes */}
                <div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    placeholder="Additional notes about this contact..."
                  />
                </div>
              </div>
            </div>
          ) : selectedContact ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center">
                  <FaUser className="mr-2 text-violet-600" />
                  {`${selectedContact.firstName} ${selectedContact.lastName}`}
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
                      <div className="flex flex-col space-y-2">
                        <input
                          type="text"
                          value={selectedContact.firstName}
                          onChange={(e) =>
                            handleSelectedContactChange(
                              "firstName",
                              e.target.value
                            )
                          }
                          placeholder="First Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                        />
                        <input
                          type="text"
                          value={selectedContact.lastName}
                          onChange={(e) =>
                            handleSelectedContactChange(
                              "lastName",
                              e.target.value
                            )
                          }
                          placeholder="Last Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <p className="text-gray-800">{`${selectedContact.firstName} ${selectedContact.lastName}`}</p>
                        {selectedContact.isPrimary ? (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Primary
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              // Establecer como contacto principal
                              const updatedContact = {
                                ...selectedContact,
                                isPrimary: true,
                              };
                              setSelectedContact(updatedContact);

                              // Actualizar el contacto en la lista
                              const updatedContacts = contacts.map((c) => ({
                                ...c,
                                isPrimary: c.id === selectedContact.id,
                              }));
                              setContacts(updatedContacts);

                              // Llamar al método para guardar los cambios
                              handleSaveEditedContact();
                            }}
                            className="ml-2 text-xs bg-violet-50 hover:bg-violet-100 text-violet-700 font-medium py-1 px-2 rounded border border-violet-200 inline-flex items-center"
                          >
                            <FaStar className="h-3 w-3 mr-1" />
                            Make Primary
                          </button>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {selectedContact.position}
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
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

                {/* Notes (solo cuando no se está editando) */}
                {!isEditingContact && selectedContact.notes && (
                  <div className="space-y-4 bg-gradient-to-b from-amber-50 to-white p-4 rounded-lg shadow-sm border border-amber-100 mt-4 col-span-2">
                    <h4 className="font-medium text-amber-800 pb-2 border-b border-amber-200">
                      Notes
                    </h4>
                    <div className="p-3 bg-white rounded border border-amber-100 text-gray-700">
                      {selectedContact.notes}
                    </div>
                  </div>
                )}
              </div>

              {/* En la sección de edición añadir el checkbox de contacto principal */}
              {isEditingContact && (
                <div className="space-y-4 bg-gradient-to-b from-amber-50 to-white p-4 rounded-lg shadow-sm border border-amber-100 mt-4">
                  <h4 className="font-medium text-amber-800 pb-2 border-b border-amber-200">
                    Contact Settings
                  </h4>
                  <div className="flex items-center">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      rows={3}
                      value={selectedContact.notes || ""}
                      onChange={(e) =>
                        handleSelectedContactChange("notes", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
              )}
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

      {/* Modal de confirmación para eliminación */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 overflow-auto bg-black/30 backdrop-blur-sm flex justify-center items-center transition-all duration-300"
          onClick={cancelDeleteContact}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full mx-4 shadow-2xl transform transition-all"
            style={{ animation: "fadeInUp 0.3s ease-out forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="mb-4 flex items-center">
                <div className="bg-red-500 p-2 rounded-full mr-3">
                  <FaTrash className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Confirmar eliminación
                </h3>
              </div>

              <div className="border-b border-gray-200 mt-2 mb-5"></div>

              <p className="text-gray-600 mb-6 text-sm">
                ¿Estás seguro que deseas eliminar este contacto?
                <br />
                <span className="text-red-500 font-medium">
                  Esta acción no se puede deshacer.
                </span>
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDeleteContact}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <FaTimes className="h-3.5 w-3.5 mr-2" />
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteContact}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center shadow-sm"
                >
                  <FaTrash className="h-3.5 w-3.5 mr-2" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para las animaciones */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OrganizationContacts;
