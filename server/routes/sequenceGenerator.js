const Sequence = require('../models/sequence');

let maxDocumentId;
let maxMessageId;
let maxContactId;
let sequenceId = null;

class SequenceGenerator {
    constructor() {
        this.init();
    }

    async init() {
        try {
        const sequence = await Sequence.findOne();
        if (sequence) {
            sequenceId = sequence._id;
            maxDocumentId = sequence.maxDocumentId;
            maxMessageId = sequence.maxMessageId;
            maxContactId = sequence.maxContactId;
        } else {
            console.error('No sequence document found in the database.');
        }
        } catch (err) {
        console.error('SequenceGenerator error:', err);
        }
    }

    nextId(collectionType) {
        if (!sequenceId) {
        console.error('Sequence ID not initialized');
        return -1;
        }

        let updateObject = {};
        let nextId;

        switch (collectionType) {
        case 'documents':
            maxDocumentId++;
            updateObject = { maxDocumentId: maxDocumentId };
            nextId = maxDocumentId;
            break;
        case 'messages':
            maxMessageId++;
            updateObject = { maxMessageId: maxMessageId };
            nextId = maxMessageId;
            break;
        case 'contacts':
            maxContactId++;
            updateObject = { maxContactId: maxContactId };
            nextId = maxContactId;
            break;
        default:
            return -1;
        }

        Sequence.updateOne({ _id: sequenceId }, { $set: updateObject }).catch(err => {
        console.error('nextId error = ' + err);
        });

        return nextId;
    }
}

module.exports = new SequenceGenerator();

