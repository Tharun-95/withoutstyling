const Issue = require('../models/Issue');

// @desc    Create new issue
// @route   POST /api/issues
// @access  Public
exports.createIssue = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    let { lat, lng } = req.body;
    
    // Support legacy 'latitude' and 'longitude' keys just in case
    if (!lat && req.body.latitude) lat = req.body.latitude;
    if (!lng && req.body.longitude) lng = req.body.longitude;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude coordinates are required (lat, lng).'
      });
    }

    let image = 'no-photo.jpg';

    if (req.file) {
      image = req.file.filename;
    } else if (req.body.image) {
      image = req.body.image;
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    // Smart Feature: Duplicate Issue Detection
    // Find issues within a small radius (~50m) with same category
    // Simple coordinate bounding box approx: 1 degree ~ 111km -> 0.00045 ~ 50m
    const latThreshold = 0.00045;
    const lngThreshold = 0.00045;

    const duplicates = await Issue.find({
      category,
      status: { $in: ['Pending', 'In Progress'] },
      latitude: { $gte: latNum - latThreshold, $lte: latNum + latThreshold },
      longitude: { $gte: lngNum - lngThreshold, $lte: lngNum + lngThreshold }
    });

    if (duplicates && duplicates.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'A similar issue already exists in this area.',
        duplicateIssueId: duplicates[0]._id
      });
    }

    // Smart Feature: Priority Scoring
    let severity = 'Medium';
    if (category === 'Pothole') severity = 'High';
    if (category === 'Water Leak') severity = 'Critical';
    if (category === 'Streetlight') severity = 'Low';

    const issue = await Issue.create({
      title,
      description,
      category,
      image,
      latitude: latNum,
      longitude: lngNum,
      severity,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all issues
// @route   GET /api/issues
// @access  Public
exports.getAllIssues = async (req, res) => {
  try {
    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.status) query.status = req.query.status;

    const issues = await Issue.find(query).sort('-createdAt');
    res.status(200).json({ success: true, count: issues.length, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Public
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    res.status(200).json({ success: true, data: issue });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update issue status
// @route   PUT /api/issues/:id
// @access  Admin (would add auth middleware in real scenario)
exports.updateIssueStatus = async (req, res) => {
  try {
    let issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    // If status becomes resolved, could trigger notification logic here
    if (req.body.status === 'Resolved') {
      console.log(`Notification: Issue ${issue._id} marked as resolved!`);
    }

    res.status(200).json({ success: true, data: issue });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Admin 
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    await Issue.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
