const db = require("../models");
const Phones = db.phones;
const Contacts = db.contacts;
const Op = db.Sequelize.Op;

// Calculate stats
exports.calculate = async (req, res) => {
    try {
        // Get total number of contacts
        const totalContacts = await Contacts.count();

        // Get total number of phones
        const totalPhones = await Phones.count();

        // Get the newest contact timestamp
        const newestContact = await Contacts.findOne({
            order: [['createdAt', 'DESC']]
        });

        // Get the oldest contact timestamp
        const oldestContact = await Contacts.findOne({
            order: [['createdAt', 'ASC']]
        });

        res.send({
            numberOfContacts: totalContacts,
            numberOfPhones: totalPhones,
            newestContactTimestamp: newestContact ? newestContact.createdAt : null,
            oldestContactTimestamp: oldestContact ? oldestContact.createdAt : null
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the statistics."
        });
    }
};
