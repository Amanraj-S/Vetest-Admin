const Enquiry = require('../models/Enquiry');
const { logActivity } = require('../utils/logger');

// @desc    Submit public enquiry
// @route   POST /api/enquiries
// @access  Public
exports.createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, company, country, enquiryType, message, source } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone: phone || '',
      company: company || '',
      country: country || '',
      enquiryType: enquiryType || 'General Inquiry',
      message,
      source: source || 'Website Contact Form',
      status: 'NEW'
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting Vtest! Your enquiry has been received.',
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries (Admin)
// @route   GET /api/admin/enquiries
// @access  Private
exports.getAdminEnquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { status, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Enquiry.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: enquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single enquiry by ID
// @route   GET /api/admin/enquiries/:id
// @access  Private
exports.getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status / internal notes
// @route   PATCH /api/admin/enquiries/:id
// @access  Private
exports.updateEnquiry = async (req, res, next) => {
  try {
    const { status, internalNotes } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });

    if (status) enquiry.status = status;
    if (internalNotes !== undefined) enquiry.internalNotes = internalNotes;

    await enquiry.save();
    await logActivity(req.user._id, 'UPDATE', 'ENQUIRY', `Updated enquiry status for ${enquiry.name} to ${enquiry.status}`, req.ip);

    res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/admin/enquiries/:id
// @access  Private (Admin)
exports.deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });

    await enquiry.deleteOne();
    await logActivity(req.user._id, 'DELETE', 'ENQUIRY', `Deleted enquiry from ${enquiry.email}`, req.ip);

    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
