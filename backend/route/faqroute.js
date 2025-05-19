// routes/faqRoute.js

const express = require('express');
const { getFaq, addFaq, deleteFaq } = require('../controller/faqcontroller');

const router = express.Router();

// Get all FAQs
router.get('/', getFaq);

// Add new FAQ
router.post('/', addFaq);

// Delete FAQ
router.delete('/', deleteFaq);

module.exports = router;
