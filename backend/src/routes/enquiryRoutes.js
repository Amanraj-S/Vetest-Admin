const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getAdminEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

// Public route to submit enquiry
router.post('/public', createEnquiry);

// Admin protected routes
router.get('/', protect, getAdminEnquiries);
router.get('/:id', protect, getEnquiryById);
router.patch('/:id', protect, updateEnquiry);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteEnquiry);

module.exports = router;
