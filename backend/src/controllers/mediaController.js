const MediaAsset = require('../models/MediaAsset');
const { uploadStreamToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { logActivity } = require('../utils/logger');

// @desc    Get all media assets (search, filter, pagination)
// @route   GET /api/admin/media
// @access  Private
exports.getMediaAssets = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const { search, type } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { filename: { $regex: search, $options: 'i' } },
        { altText: { $regex: search, $options: 'i' } },
        { caption: { $regex: search, $options: 'i' } }
      ];
    }

    if (type === 'IMAGE') {
      query.mimeType = { $regex: '^image/', $options: 'i' };
    } else if (type === 'DOCUMENT') {
      query.mimeType = { $not: { $regex: '^image/' } };
    }

    const [assets, total] = await Promise.all([
      MediaAsset.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      MediaAsset.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: assets,
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

// @desc    Get single media asset
// @route   GET /api/admin/media/:id
// @access  Private
exports.getMediaAssetById = async (req, res, next) => {
  try {
    const asset = await MediaAsset.findById(req.params.id);
    if (!asset) return res.status(404).json({ success: false, message: 'Media asset not found' });
    res.json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload new file(s) directly to Cloudinary
// @route   POST /api/admin/media
// @access  Private
exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload' });
    }

    const files = req.files || [req.file];
    const createdAssets = [];

    for (const file of files) {
      const isImage = file.mimetype.startsWith('image/');
      const resourceType = isImage ? 'image' : 'raw';

      // Upload memory buffer directly to Cloudinary
      const cloudinaryResult = await uploadStreamToCloudinary(file.buffer, 'vtest_cms', resourceType);

      const asset = await MediaAsset.create({
        filename: cloudinaryResult.public_id,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: cloudinaryResult.secure_url,
        altText: req.body.altText || file.originalname,
        caption: req.body.caption || '',
        storageType: 'CLOUDINARY'
      });
      createdAssets.push(asset);
    }

    if (req.user) {
      await logActivity(req.user._id, 'UPLOAD', 'MEDIA', `Uploaded ${createdAssets.length} file(s) to Cloudinary`, req.ip);
    }

    res.status(201).json({
      success: true,
      message: 'File(s) uploaded successfully to Cloudinary',
      data: createdAssets.length === 1 ? createdAssets[0] : createdAssets
    });
  } catch (error) {
    console.error('Cloudinary upload controller error:', error);
    next(error);
  }
};

// @desc    Update media asset metadata (altText, caption)
// @route   PATCH /api/admin/media/:id
// @access  Private
exports.updateMediaAsset = async (req, res, next) => {
  try {
    const { altText, caption } = req.body;
    const asset = await MediaAsset.findByIdAndUpdate(
      req.params.id,
      { altText, caption },
      { new: true, runValidators: true }
    );
    if (!asset) return res.status(404).json({ success: false, message: 'Media asset not found' });
    res.json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media asset
// @route   DELETE /api/admin/media/:id
// @access  Private
exports.deleteMediaAsset = async (req, res, next) => {
  try {
    const asset = await MediaAsset.findById(req.params.id);
    if (!asset) return res.status(404).json({ success: false, message: 'Media asset not found' });

    if (asset.storageType === 'CLOUDINARY' && asset.filename) {
      const isImage = asset.mimeType.startsWith('image/');
      await deleteFromCloudinary(asset.filename, isImage ? 'image' : 'raw');
    }

    await asset.deleteOne();
    if (req.user) {
      await logActivity(req.user._id, 'DELETE', 'MEDIA', `Deleted media: ${asset.filename}`, req.ip);
    }

    res.json({ success: true, message: 'Media asset deleted successfully' });
  } catch (error) {
    next(error);
  }
};
