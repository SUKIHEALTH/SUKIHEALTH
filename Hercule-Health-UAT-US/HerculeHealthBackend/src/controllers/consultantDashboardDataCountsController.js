const mongoose = require('mongoose');

const getConsultantDashboardData = async (req, res) => {
  const { consultantId } = req.params;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const appointmentStats = await mongoose.connection.db.collection('appointments').aggregate([
      {
        $match: {
          consultantId: parseInt(consultantId)
        }
      },
      // Join payments collection to fetch corresponding payment info
      {
        $lookup: {
          from: 'payments',
          localField: 'appointmentId',
          foreignField: 'appointmentId',
          as: 'paymentDetails'
        }
      },
      {
        $facet: {
          totalPatients: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: [
                        { $toLower: "$status" },
                        ["rescheduled", "confirmed"]
                      ]
                    },
                    {
                      $in: ["paid", "$paymentDetails.status"]
                    }
                  ]
                }
              }
            },
            { $group: { _id: "$patientId" } },
            { $count: "count" }
          ],
          patientsToday: [
            {
              $match: {
                appointmentDate: { $gte: today, $lt: tomorrow },
                $expr: {
                  $and: [
                    {
                      $in: [
                        { $toLower: "$status" },
                        ["rescheduled", "confirmed"]
                      ]
                    },
                    {
                      $in: ["paid", "$paymentDetails.status"]
                    }
                  ]
                }
              }
            },
            { $group: { _id: "$patientId" } },
            { $count: "count" }
          ],
          appointmentsToday: [
            {
              $match: {
                appointmentDate: { $gte: today, $lt: tomorrow },
                $expr: {
                  $and: [
                    {
                      $in: [
                        { $toLower: "$status" },
                        ["rescheduled", "confirmed"]
                      ]
                    },
                    {
                      $in: ["paid", "$paymentDetails.status"]
                    }
                  ]
                }
              }
            },
            { $count: "count" }
          ]
        }
      }
    ]).toArray();

    const stats = appointmentStats[0] || {};

    const totalPatients = stats.totalPatients[0]?.count || 0;
    const patientsToday = stats.patientsToday[0]?.count || 0;
    const appointmentsToday = stats.appointmentsToday[0]?.count || 0;

    res.status(200).json({
      totalPatients,
      patientsToday,
      appointmentsToday
    });

  } catch (error) {
    console.error('Error fetching consultant dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch consultant dashboard data.' });
  }
};

module.exports = { getConsultantDashboardData };
