const express = require('express');
const router = express.Router();

const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');

// GET: obtener todos los mensajes
router.get('/', (req, res, next) => {
    Message.find()
        .then(messages => {
        res.status(200).json(messages);
        })
        .catch(error => {
        res.status(500).json({
            message: 'An error occurred',
            error: error
        });
    });
});

// POST: agregar un nuevo mensaje
router.post('/', (req, res, next) => {
    const maxMessageId = sequenceGenerator.nextId("messages");

    const message = new Message({
        id: maxMessageId,
        subject: req.body.subject,
        msgText: req.body.msgText,
        sender: req.body.sender
    });

    message.save()
        .then(createdMessage => {
        res.status(201).json({
            message: 'Message added successfully',
            message: createdMessage
        });
        })
        .catch(error => {
        res.status(500).json({
            message: 'An error occurred',
            error: error
        });
    });
});

// PUT: actualizar un mensaje existente
router.put('/:id', (req, res, next) => {
    Message.findOne({ id: req.params.id })
        .then(message => {
        if (!message) {
            return res.status(404).json({ message: 'Message not found.' });
        }

        message.subject = req.body.subject;
        message.msgText = req.body.msgText;
        message.sender = req.body.sender;

        Message.updateOne({ id: req.params.id }, message)
            .then(() => {
            res.status(204).json({
                message: 'Message updated successfully'
            });
            })
            .catch(error => {
            res.status(500).json({
                message: 'An error occurred',
                error: error
            });
            });
        })
        .catch(error => {
        res.status(500).json({
            message: 'Message not found.',
            error: { message: 'Message not found' }
        });
    });
});

// DELETE: eliminar un mensaje
router.delete('/:id', (req, res, next) => {
    Message.findOne({ id: req.params.id })
        .then(message => {
        if (!message) {
            return res.status(404).json({ message: 'Message not found.' });
        }

        Message.deleteOne({ id: req.params.id })
            .then(() => {
            res.status(204).json({
                message: 'Message deleted successfully'
            });
            })
            .catch(error => {
            res.status(500).json({
                message: 'An error occurred',
                error: error
            });
            });
        })
        .catch(error => {
        res.status(500).json({
            message: 'Message not found.',
            error: { message: 'Message not found' }
        });
    });
});

module.exports = router;

