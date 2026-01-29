const Consultant = require('../models/consultantModel');
const moment = require('moment');

const getAllApprovedConsultants = async (req, res) => {
  const { 
    pageNumber = 1, 
    pageSize = 30, 
    searchTerm, 
    experience, 
    languages, 
    gender, 
    priceRange 
  } = req.body;

  try {
    const page = parseInt(pageNumber, 10);
    const size = parseInt(pageSize, 10);

    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ message: 'Invalid page number.' });
    }
    if (isNaN(size) || size <= 0) {
      return res.status(400).json({ message: 'Invalid page size.' });
    }

    // Only fetch consultants where ConsultantApprovalRequired is true
    let allConsultants = await Consultant.aggregate([
      { $match: { ConsultantApprovalRequired: true } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: 'userId',
          as: 'userDetails'
        }
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } }
    ]);

    // Filter: searchTerm
    if (typeof searchTerm === 'string' && searchTerm.trim()) {
      const searchRegex = new RegExp(searchTerm.trim(), 'i');
      allConsultants = allConsultants.filter(c =>
        searchRegex.test(c?.information?.displayName || '') ||
        searchRegex.test(c?.information?.firstName || '') ||
        searchRegex.test(c?.information?.lastName || '') ||
        searchRegex.test(c?.information?.email || '') ||
        searchRegex.test(c?.specialization?.join(',') || '') ||
        searchRegex.test(
          (c?.experience || [])
            .map(exp => exp.title || exp.hospitalName || '')
            .join(',')
        )
      );
    }

    // Filter: gender
    if (gender && (gender.male || gender.female)) {
      const selected = [];
      if (gender.male) selected.push('male');
      if (gender.female) selected.push('female');

      allConsultants = allConsultants.filter(c =>
        selected.includes((c?.information?.gender || '').toLowerCase())
      );
    }

    // Filter: experience range (total years)
    if (experience && experience.includes('-')) {
      const [minExp, maxExp] = experience.split('-').map(Number);
      allConsultants = allConsultants.filter(c => {
        const totalYears = (c.experience || []).reduce((sum, exp) => {
          if (exp.yearsOfExperience && !isNaN(exp.yearsOfExperience)) {
            return sum + exp.yearsOfExperience;
          }
          return sum;
        }, 0);
        return totalYears >= minExp && totalYears <= maxExp;
      });
    }

    // Filter: known languages
    if (languages && typeof languages === 'string' && languages.trim()) {
      allConsultants = allConsultants.filter(c =>
        (c.information?.knownLanguages || [])
          .map(l => l.toLowerCase())
          .includes(languages.toLowerCase())
      );
    }

    const totalCount = allConsultants.length;
    const totalPages = Math.ceil(totalCount / size);
    const skip = (page - 1) * size;
    const paginatedConsultants = allConsultants.slice(skip, skip + size);

    if (!paginatedConsultants.length) {
      return res.status(404).json({
        message: 'No approved consultants found matching the criteria.',
        data: [],
        totalPages: 0,
        currentPage: page,
        totalCount: 0
      });
    }

    return res.status(200).json({
      message: 'Approved consultants fetched successfully.',
      data: paginatedConsultants,
      totalPages,
      currentPage: page,
      totalCount
    });

  } catch (error) {
    console.error('Error fetching approved consultants:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = { getAllApprovedConsultants };