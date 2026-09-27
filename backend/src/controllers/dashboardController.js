const Product = require('../models/Product');
const Category = require('../models/Category');
const Solution = require('../models/Solution');
const Industry = require('../models/Industry');
const Project = require('../models/Project');
const Resource = require('../models/Resource');
const MediaAsset = require('../models/MediaAsset');
const Enquiry = require('../models/Enquiry');
const AdminUser = require('../models/AdminUser');
const AdminActivityLog = require('../models/AdminActivityLog');

// @desc    Get real MongoDB dashboard analytics & recent feeds
// @route   GET /api/admin/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      publishedProducts,
      draftProducts,
      totalCategories,
      totalSolutions,
      totalIndustries,
      totalProjects,
      totalResources,
      totalMediaAssets,
      newEnquiries,
      openEnquiries,
      adminUsers,
      recentProducts,
      recentEnquiries,
      recentMedia,
      recentActivity
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'PUBLISHED' }),
      Product.countDocuments({ status: 'DRAFT' }),
      Category.countDocuments(),
      Solution.countDocuments(),
      Industry.countDocuments(),
      Project.countDocuments(),
      Resource.countDocuments(),
      MediaAsset.countDocuments(),
      Enquiry.countDocuments({ status: 'NEW' }),
      Enquiry.countDocuments({ status: { $in: ['NEW', 'IN_PROGRESS'] } }),
      AdminUser.countDocuments(),
      Product.find().sort({ createdAt: -1 }).limit(5).populate('category', 'name'),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      MediaAsset.find().sort({ createdAt: -1 }).limit(5),
      AdminActivityLog.find().sort({ createdAt: -1 }).limit(8).populate('user', 'name email role')
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        publishedProducts,
        draftProducts,
        totalCategories,
        totalSolutions,
        totalIndustries,
        totalProjects,
        totalResources,
        totalMediaAssets,
        newEnquiries,
        openEnquiries,
        adminUsers
      },
      recentProducts,
      recentEnquiries,
      recentMedia,
      recentActivity
    });
  } catch (error) {
    next(error);
  }
};
