const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Consultant = require('../models/consultantModel');

const updateConsultant = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      password,
      role,
      access_type,
      is_active,
      is_delete,
      availabilityText,
      information,
      clinicalDetails,
      specialization = [],
      certifications = [],
      availableSlots,
      experience,
      awards,
      educations,
      profileImage,
    } = req.body;

    if (!userId) {
      throw new Error('User ID is required for updating consultant records.');
    }

    console.log("award", awards);

    // Step 1: Find the existing User and Consultant
    const existingUser = await User.findOne({ userId });
    const existingConsultant = await Consultant.findOne({ userId });

    if (!existingUser || !existingConsultant) {
      throw new Error('User or consultant record not found.');
    }

    // Step 2: Update User fields (optional if needed)

    // Step 3: Update Consultant fields

    // Update simple fields if provided
    if (profileImage) existingConsultant.profileImage = profileImage;
    if (availabilityText) existingConsultant.availabilityText = availabilityText;

    // Replace experience only if provided and it's a non-empty array
    if (Array.isArray(experience) ) {
      existingConsultant.experience = experience;
    }

    // Merge `information` object if provided
    if (information && typeof information === 'object') {
      existingConsultant.information = {
        ...existingConsultant.information,
        ...information
      };

      // Handle displayName logic
      const { firstName, lastName, displayName } = existingConsultant.information;

      if (!displayName || displayName.trim() === '') {
        existingConsultant.information.displayName = `Dr. ${firstName || ''} ${lastName || ''}`.trim();
      } else {
        const hasDrPrefix = /^Dr\.\s*/i.test(displayName);
        if (!hasDrPrefix) {
          existingConsultant.information.displayName = `Dr. ${displayName}`;
        }
      }
    }

    // Merge `clinicalDetails` object if provided
    if (clinicalDetails && typeof clinicalDetails === 'object') {
      existingConsultant.clinicalDetails = {
        ...existingConsultant.clinicalDetails,
        ...clinicalDetails
      };
    }

    // Replace arrays only if provided and non-empty
    if (Array.isArray(specialization) && specialization.length > 0) {
      existingConsultant.specialization = specialization;
    }

    if (Array.isArray(certifications) && certifications.length > 0) {
      existingConsultant.certifications = certifications;
    }

    if (Array.isArray(educations) ) {
      existingConsultant.educations = educations;
    }

    if (Array.isArray(awards)) {
      existingConsultant.awards = awards;
    }
    

    // Only update knownLanguages if provided inside information
    if (information && information.knownLanguages) {
      existingConsultant.information.knownLanguages = information.knownLanguages;
    }
    // Update availableSlots with generated IDs if provided
    if (availableSlots && Array.isArray(availableSlots)) {
      const lastSlotId = existingConsultant.availableSlots.length
        ? Math.max(...existingConsultant.availableSlots.map(slot => slot.id))
        : 0;

      const updatedSlots = availableSlots.map((slot, index) => {
        const newId = lastSlotId + index + 1;
        return { ...slot, id: newId };
      });

      existingConsultant.availableSlots = updatedSlots;
    }

    existingConsultant.updatedAt = new Date();

    await existingConsultant.save();

    res.status(200).json({
      user: existingUser,
      consultant: existingConsultant,
      message: 'User and Consultant records updated successfully.',
    });
  } catch (error) {
    console.error('Error updating consultant:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { updateConsultant };
