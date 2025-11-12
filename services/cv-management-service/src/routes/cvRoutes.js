const express = require('express');
const CV = require('../models/CV');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/cvs - Get all CVs for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cvs = await CV.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ cvs });
  } catch (error) {
    console.error('Get CVs error:', error);
    res.status(500).json({ error: 'Failed to get CVs', message: error.message });
  }
});

// POST /api/cvs - Create new CV
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      fullName,
      email,
      phone,
      address,
      summary,
      experience,
      education,
      skills,
      languages,
      templateId
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const cv = await CV.create({
      userId: req.userId,
      title,
      fullName,
      email,
      phone,
      address,
      summary,
      experience,
      education,
      skills,
      languages,
      templateId
    });

    res.status(201).json({
      message: 'CV created successfully',
      cv
    });
  } catch (error) {
    console.error('Create CV error:', error);
    res.status(500).json({ error: 'Failed to create CV', message: error.message });
  }
});

// GET /api/cvs/:cvId - Get specific CV
router.get('/:cvId', authMiddleware, async (req, res) => {
  try {
    const cv = await CV.findOne({
      where: {
        id: req.params.cvId,
        userId: req.userId
      }
    });

    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }

    res.json({ cv });
  } catch (error) {
    console.error('Get CV error:', error);
    res.status(500).json({ error: 'Failed to get CV', message: error.message });
  }
});

// PUT /api/cvs/:cvId - Update CV
router.put('/:cvId', authMiddleware, async (req, res) => {
  try {
    const cv = await CV.findOne({
      where: {
        id: req.params.cvId,
        userId: req.userId
      }
    });

    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }

    const {
      title,
      fullName,
      email,
      phone,
      address,
      summary,
      experience,
      education,
      skills,
      languages,
      templateId
    } = req.body;

    await cv.update({
      title: title !== undefined ? title : cv.title,
      fullName: fullName !== undefined ? fullName : cv.fullName,
      email: email !== undefined ? email : cv.email,
      phone: phone !== undefined ? phone : cv.phone,
      address: address !== undefined ? address : cv.address,
      summary: summary !== undefined ? summary : cv.summary,
      experience: experience !== undefined ? experience : cv.experience,
      education: education !== undefined ? education : cv.education,
      skills: skills !== undefined ? skills : cv.skills,
      languages: languages !== undefined ? languages : cv.languages,
      templateId: templateId !== undefined ? templateId : cv.templateId
    });

    res.json({
      message: 'CV updated successfully',
      cv
    });
  } catch (error) {
    console.error('Update CV error:', error);
    res.status(500).json({ error: 'Failed to update CV', message: error.message });
  }
});

// DELETE /api/cvs/:cvId - Delete CV
router.delete('/:cvId', authMiddleware, async (req, res) => {
  try {
    const cv = await CV.findOne({
      where: {
        id: req.params.cvId,
        userId: req.userId
      }
    });

    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }

    await cv.destroy();

    res.json({ message: 'CV deleted successfully' });
  } catch (error) {
    console.error('Delete CV error:', error);
    res.status(500).json({ error: 'Failed to delete CV', message: error.message });
  }
});

module.exports = router;
