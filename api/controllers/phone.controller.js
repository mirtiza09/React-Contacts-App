const db = require("../models");
const Phones = db.phones;
const Op = db.Sequelize.Op;

// Create phone
exports.create = (req, res) => {
    const phone = {
        type: req.body.type,
        number: req.body.number,
        contactId: req.body.contactId
    };
    
    Phones.create(phone)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Phone."
            });
        });
};

// Get all phones for a contact
exports.findAll = (req, res) => {
    const contactId = req.params.contactId;

    Phones.findAll({ where: { contactId: contactId } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving phones."
            });
        });
};

// Get one phone by id
exports.findOne = (req, res) => {
    const id = req.params.phoneId;

    Phones.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Phone with id=" + id
            });
        });
};

// Update one phone by id
exports.update = (req, res) => {
    const id = req.params.phoneId;

    Phones.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Phone was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Phone with id=${id}. Maybe Phone was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Phone with id=" + id
        });
    });
};

// Delete one phone by id
exports.delete = (req, res) => {
    const id = req.params.phoneId;

    Phones.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Phone was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Phone with id=${id}. Maybe Phone was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Phone with id=" + id
        });
    });
};
