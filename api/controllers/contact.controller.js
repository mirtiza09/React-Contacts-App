const db = require("../models");
const Contacts = db.contacts;
const Phones = db.phones;
const Op = db.Sequelize.Op;


// Create contact
exports.create = (req, res) => {
    const contact = {
        name: req.body.name
    };

    Contacts.create(contact)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({
            message: err.message || "Error creating contact"
        }));
};

// Get all contacts
exports.findAll = (req, res) => {
    Contacts.findAll()
        .then(data => res.send(data))
        .catch(err => res.status(500).send({
            message: err.message || "Error retrieving contacts"
        }));
};

// Get one contact by id
exports.findOne = (req, res) => {
    const id = req.params.contactId;

    Contacts.findByPk(id)
        .then(data => {
            if (data) res.send(data);
            else res.status(404).send({ message: "Contact not found" });
        })
        .catch(err => res.status(500).send({
            message: "Error retrieving contact with id=" + id
        }));
};

// Update one contact by id
exports.update = (req, res) => {
    const id = req.params.contactId;

    Contacts.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: "Contact was updated successfully." });
            else res.send({ message: `Cannot update contact with id=${id}. Maybe contact was not found or req.body is empty!` });
        })
        .catch(err => res.status(500).send({ message: "Error updating contact with id=" + id }));
};

// Delete one contact by id
exports.delete = (req, res) => {
    const id = req.params.contactId;

    Contacts.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: "Contact was deleted successfully!" });
            else res.send({ message: `Cannot delete contact with id=${id}. Maybe contact was not found!` });
        })
        .catch(err => res.status(500).send({ message: "Could not delete contact with id=" + id }));
};
