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
        <div>
            <h1>Contactor</h1>
            
            <div className="contact-input-section">
                <input type="text" placeholder="Enter a contact name" />
                <button onClick={() => addContact(document.querySelector('input').value)}>Create Contact</button>
            </div>
            
            <div className="contacts-list">
                {contacts.map(contact => (
                    <div key={contact.id} className="contact-item">
                        <div className="contact-header">
                            <span onClick={() => toggleViewContact(contact.id)} style={{ cursor: 'pointer' }}>
                                {contact.name}
                            </span>
                            <button onClick={() => deleteContact(contact.id)}>Delete</button>
                        </div>
                        
                        {currentContact === contact.id && (
                            <div className="contact-detail">
                                <div className="phone-input-section">
                                    <input type="text" placeholder="Phone Number" id={`phone-input-${contact.id}`} />
                                    <select id={`phone-type-${contact.id}`}>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Work">Work</option>
                                        <option value="Home">Home</option>
                                        <option value="Main">Main</option>
                                        <option value="Work fax">Work fax</option>
                                        <option value="Home fax">Home fax</option>
                                        <option value="Pager">Pager</option>
                                        <option value="Other">Other</option>
                                        <option value="MVPN">MVPN</option>
                                        <option value="Custom">Custom</option>
                                    </select>
                                    <button onClick={() => {
                                        const number = document.querySelector(`#phone-input-${contact.id}`).value;
                                        const type = document.querySelector(`#phone-type-${contact.id}`).value;
                                        addPhoneNumber(contact.id, type, number);
                                    }}>Add</button>
                                </div>
                                <div className="phone-list">
                                    {phoneNumbers.map(phone => (
                                        <div key={phone.id} className="phone-item">
                                            {phone.type}: {phone.number}
                                            <button onClick={() => deletePhoneNumber(contact.id, phone.id)}>Delete</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="stats-section">
                <button onClick={() => {
                    fetchStats(); // Fetch stats when clicked.
                    setShowStats(!showStats); // Toggle visibility.
                }}>
                    {showStats ? "Hide Stats" : "Show Stats"}
                </button>
        
                {showStats && stats && (
                    <div className="stats-container">
                        <h2>Statistics</h2>
                        <ul>
                            <li>Number of Contacts: {stats.contactsCount}</li>
                            <li>Number of Phones: {stats.phonesCount}</li>
                            <li>Newest Contact Timestamp: {stats.newestContactTimestamp}</li>
                            <li>Oldest Contact Timestamp: {stats.oldestContactTimestamp}</li>
                        </ul>
                        <button onClick={fetchStats}>Refresh</button>
                    </div>
                )}
            </div>
        </div>
    );
    
                }
    export default App;
    