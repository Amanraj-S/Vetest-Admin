const express = require('express');
const router = express.Router();
const { getMediaAssets, getMediaAssetById, uploadMedia, updateMediaAsset, deleteMediaAsset } = require('../controllers/mediaController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.route('/')
  .get(getMediaAssets)
  .post(upload.any(), uploadMedia);

router.route('/:id')
  .get(getMediaAssetById)
  .patch(updateMediaAsset)
  .delete(deleteMediaAsset);

module.exports = router;
