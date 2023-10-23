import { useState, useEffect } from 'react';  // import useEffect
import './App.css';


function App() {
    const [contacts, setContacts] = useState([]);
    const [currentContact, setCurrentContact] = useState(null);
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [stats, setStats] = useState(null);
    const [showStats, setShowStats] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchContacts = () => {
        fetch("http://localhost/api/contacts/")
            .then(res => res.json())
            .then(data => {
                setContacts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching contacts:", error);
                setError(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const addContact = (name) => {
        fetch("http://localhost/api/contacts/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        })
        .then(res => res.json())
        .then(data => {
            setContacts(prevContacts => [...prevContacts, data]);
        })
        .catch(error => {
            console.error("Error adding contact:", error);
        });
    };

    const deleteContact = (contactId) => {
        fetch(`http://localhost/api/contacts/${contactId}`, {
            method: 'DELETE'
        })
        .then(() => {
            setContacts(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
        })
        .catch(error => {
            console.error("Error deleting contact:", error);
        });
    };

    const viewContact = (contactId) => {
        fetch(`http://localhost/api/contacts/${contactId}/phones`)
            .then(res => res.json())
            .then(data => {
                setCurrentContact(contactId);
                setPhoneNumbers(data);
            })
            .catch(error => {
                console.error("Error fetching phone numbers for contact:", error);
            });
    };

    const addPhoneNumber = (contactId, type, number) => {
        fetch(`http://localhost/api/contacts/${contactId}/phones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, number }),
        })
        .then(res => res.json())
        .then(data => {
            setPhoneNumbers(prevPhoneNumbers => [...prevPhoneNumbers, data]);
        })
        .catch(error => {
            console.error("Error adding phone number:", error);
        });
    };
    

    const deletePhoneNumber = async (contactId, phoneId) => {
            try {
                const response = await fetch(`http://localhost/api/contacts/${contactId}/phones/${phoneId}`, {
                    method: 'DELETE',
                });
    
            if (response.ok) {
                // If the API call was successful, update the local state
                setPhoneNumbers(prevPhoneNumbers => prevPhoneNumbers.filter(phone => phone.id !== phoneId));
            } else {
                // Handle any error responses from the API here
                console.error('Failed to delete phone number:', await response.text());
            }
        } catch (error) {
            console.error('Error deleting phone number:', error);
        }
    };
    

    const toggleViewContact = (contactId) => {
        if (currentContact === contactId) {
            setCurrentContact(null);
            setPhoneNumbers([]);
        } else {
            viewContact(contactId);
        }
    };

    const fetchStats = () => {
        fetch("http://localhost/api/stats")
            .then(res => res.json())
            .then(data => {
                setStats(data);
            })
            .catch(error => {
                console.error("Error fetching stats:", error);
            });
    };


 
    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center backdrop-blur-md">
            <div className="p-10 rounded-xl bg-white w-4/5 max-w-xl shadow-xl bg-opacity-90">
                <h1 className="text-3xl mb-5 text-center font-bold font-poppins">Contactor</h1>
                
                <div className="contact-input-section mb-5 flex justify-between font-poppins">
                    <input 
                        className="w-2/3 flex-grow mr-2 p-2 rounded border-3 border-gray-300" 
                        type="text" 
                        placeholder="Enter a Contact Name" 
                    />
                    <button 
                        className="w-1/3 p-2 rounded bg-gray-200 text-black hover:bg-gray-300 transition" 
                        onClick={() => addContact(document.querySelector('input').value)}
                    >
                        Create Contact
                    </button>
                </div>
                
                <div className="contacts-list font-poppins">
                    {contacts.map(contact => (
                        <div key={contact.id} className="contact-item mb-4 border-2 p-4 rounded shadow bg-gray-100 cursor-pointer" onClick={() => toggleViewContact(contact.id)}>
                            <div className="contact-header flex justify-between items-center">
                                <span className="font-medium">
                                    {contact.name}
                                </span>
                                <button 
                                    className="bg-red-400 text-white rounded p-2 hover:bg-red-500 transition" 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent the box click event
                                        deleteContact(contact.id);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                            
                            {currentContact === contact.id && (
                                <div className="contact-detail mt-4" onClick={(e) => e.stopPropagation()}>
                                    <div className="phone-input-section flex justify-between items-center mb-4">
                                        <input 
                                            className="flex-grow mr-2 p-2 rounded border-2" 
                                            type="text" 
                                            placeholder="Phone Number" 
                                            id={`phone-input-${contact.id}`} 
                                        />
                                        <select 
                                            className="w-1/3 mr-2 p-2 rounded border-2" 
                                            id={`phone-type-${contact.id}`}
                                        >
                                            
                                            {["Mobile", "Work", "Home", "Main", "Work fax", "Home fax", "Pager", "Other", "MVPN", "Custom"].map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        <button 
                                            className="w-1/4 bg-gray-200 text-black rounded p-2 hover:bg-gray-300 transition" 
                                            onClick={() => {
                                                const number = document.querySelector(`#phone-input-${contact.id}`).value;
                                                const type = document.querySelector(`#phone-type-${contact.id}`).value;
                                                addPhoneNumber(contact.id, type, number);
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="phone-list">
                                        {phoneNumbers.map(phone => (
                                            <div key={phone.id} className="phone-item mb-2 flex justify-between">
                                                <span>{phone.type}: {phone.number}</span>
                                                <button 
                                                    className="bg-red-400 text-white text-sm rounded p-1 hover:bg-red-500 transition" 
                                                    onClick={() => deletePhoneNumber(contact.id, phone.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
                
                <div className="stats-section mt-5 font-poppins">
                    <button 
                        className="p-2 rounded bg-gray-200 text-black hover:bg-gray-300 transition w-full" 
                        onClick={() => {
                            fetchStats();
                            setShowStats(!showStats);
                        }}
                    >
                        {showStats ? "Hide Statistics" : "Show Statistics"}
                    </button>
            
                    {showStats && stats && (
                        <div className="stats-container mb-4 border-2 p-4 rounded shadow bg-gray-100">
                            <h2 className="text-2xl mb-4 font-bold">Statistics</h2>
                            <ul>
                                <li>Number of Contacts: {stats.numberOfContacts}</li>
                                <li>Number of Phones: {stats.numberOfPhones}</li>
                                <li>Newest Contact Timestamp: {stats.newestContactTimestamp}</li>
                                <li>Oldest Contact Timestamp: {stats.oldestContactTimestamp}</li>
                            </ul>
                            <br />
                            <button 
                            className="p-2 rounded bg-gray-200 text-black hover:bg-gray-300 transition w-full" 
                            onClick={fetchStats}>Refresh</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;