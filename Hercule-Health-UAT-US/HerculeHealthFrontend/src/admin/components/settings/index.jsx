import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../header';
import SidebarNav from '../sidebar';
import axios from "../../../axiosConfig"

const SettingsForm = (props) => {
  const [settings, setSettings] = useState({
    messageLimit: 100,
    appointmentFee: 50,
    serviceCharge: 0,
    taxPercentage: 0,
    standardConsultationFee: 55,
    extendedConsultationFee: 0,
    followupConsultationFee: 0,
    appointmentReminderPeriod: 24,
    labReportSharingPeriod: 7,
    patientCancellationDeadline: 24,
    doctorCancellationDeadline: 12,
    patientReschedulingDeadline: 24,
    chatHistoryExpirePeriod: { value: 7, valueType: 'day' },
    labResultRetentionPeriod: { value: 30, valueType: 'day' },
    labReportFields: [],
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    pricing: false,
    deadlines: false,
    labFields: false,
    maintenance: false
  });

   // Fetch existing settings on component load
   useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/get-admin-settings');
        if (response.data) {
          setSettings(response?.data?.setting); // Populate the form with fetched settings
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);


  // Save settings (Add/Update)
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await axios.post('/api/add-admin-settings', settings, {
        headers: { 'Content-Type': 'application/json' },
      });
      setSuccess('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };


  const handleFieldChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const handlePeriodChange = (field, key, value) => {
    setSettings({
      ...settings,
      [field]: {
        ...settings[field],
        [key]: key === 'value' ? parseInt(value, 10) : value
      }
    });
  };

  const handleAddLabField = () => {
    setSettings({
      ...settings,
      labReportFields: [
        ...settings.labReportFields,
        { mainValue: '', subValue: [] },
      ],
    });
  };

  const handleRemoveLabField = (index) => {
    const updatedFields = [...settings.labReportFields];
    updatedFields.splice(index, 1);
    setSettings({ ...settings, labReportFields: updatedFields });
  };

  const handleAddSubValue = (index) => {
    const updatedFields = [...settings.labReportFields];
    updatedFields[index].subValue.push('');
    setSettings({ ...settings, labReportFields: updatedFields });
  };

  const handleRemoveSubValue = (fieldIndex, subIndex) => {
    const updatedFields = [...settings.labReportFields];
    updatedFields[fieldIndex].subValue.splice(subIndex, 1);
    setSettings({ ...settings, labReportFields: updatedFields });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
    <Header {...props}/>
    <div className="main-wrapper">
    <SidebarNav />
    <div className="page-wrapper">
    <div className="content container-fluid pb-0">
    <div className="container mt-5">
    <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title"> Settings</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item active">Change the settings</li>
                  </ul>
                </div>
              </div>
            </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {/* General Settings */}
      <div className="card mb-3">
        <div 
          className="card-header d-flex justify-content-between align-items-center" 
          style={{ cursor: 'pointer' }}
          onClick={() => toggleSection('general')}
        >
          <h5 className="mb-0">
            <i className="fas fa-cog me-2"></i>
            General Settings
          </h5>
          <i className={`fas ${expandedSections.general ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </div>
        <div className={`collapse ${expandedSections.general ? 'show' : ''}`}>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <i className="fas fa-comment-dots me-2"></i>
                  Message Limit
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.messageLimit}
                  onChange={(e) =>
                    handleFieldChange('messageLimit', parseInt(e.target.value, 10))
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <i className="fas fa-bell me-2"></i>
                  Appointment Reminder Period (Hours)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.appointmentReminderPeriod}
                  onChange={(e) =>
                    handleFieldChange(
                      'appointmentReminderPeriod',
                      parseInt(e.target.value, 10)
                    )
                  }
                />
              </div>
            </div>
            
            {/* Lab Report Sharing Period */}
            <div className="mb-3">
              <label className="form-label">
                <i className="fas fa-share-alt me-2"></i>
                Lab Report Sharing Period to Doctor (Days)
              </label>
              <input
                type="number"
                className="form-control"
                value={settings.labReportSharingPeriod}
                onChange={(e) =>
                  handleFieldChange('labReportSharingPeriod', parseInt(e.target.value, 10))
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Settings */}
      <div className="card mb-3">
        <div 
          className="card-header d-flex justify-content-between align-items-center" 
          style={{ cursor: 'pointer' }}
          onClick={() => toggleSection('pricing')}
        >
          <h5 className="mb-0">
            <i className="fas fa-euro-sign me-2"></i>
            Pricing & Fees
          </h5>
          <i className={`fas ${expandedSections.pricing ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </div>
        <div className={`collapse ${expandedSections.pricing ? 'show' : ''}`}>
          <div className="card-body">
            {/* Basic Fees Row */}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  <i className="fas fa-calendar-check me-2"></i>
                  Appointment Fee (€)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.appointmentFee}
                  onChange={(e) =>
                    handleFieldChange('appointmentFee', parseInt(e.target.value, 10))
                  }
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  <i className="fas fa-plus-circle me-2"></i>
                  Service Charge (€)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.serviceCharge}
                  onChange={(e) =>
                    handleFieldChange('serviceCharge', parseInt(e.target.value, 10))
                  }
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  <i className="fas fa-percentage me-2"></i>
                  Tax Percentage (%)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.taxPercentage}
                  onChange={(e) =>
                    handleFieldChange('taxPercentage', parseFloat(e.target.value))
                  }
                />
              </div>
            </div>

            {/* Consultation Fees Section */}
            <hr className="my-4" />
            <h6 className="mb-3">
              <i className="fas fa-stethoscope me-2"></i>
              Consultation Fees
            </h6>
            <div className="row">
              {/* <div className="col-md-4 mb-3">
                <label className="form-label">
                  <i className="fas fa-clock me-2"></i>
                  Standard Consultation (30 min) - €
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.standardConsultationFee}
                  onChange={(e) =>
                    handleFieldChange('standardConsultationFee', parseInt(e.target.value, 10))
                  }
                  placeholder="55"
                />
                <small className="form-text text-muted">Default: €55</small>
              </div> */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  <i className="fas fa-clock me-2"></i>
                  Extended Consultation (60 min) - €
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.extendedConsultationFee}
                  onChange={(e) =>
                    handleFieldChange('extendedConsultationFee', parseInt(e.target.value, 10))
                  }
                  placeholder="95"
                />
                {/* <small className="form-text text-muted">Default: €95</small> */}
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  <i className="fas fa-redo me-2"></i>
                  Follow-up Consultation (20 min) - €
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.followupConsultationFee}
                  onChange={(e) =>
                    handleFieldChange('followupConsultationFee', parseInt(e.target.value, 10))
                  }
                  placeholder="45"
                />
                {/* <small className="form-text text-muted">Default: €45</small> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deadlines Settings */}
      <div className="card mb-3">
        <div 
          className="card-header d-flex justify-content-between align-items-center" 
          style={{ cursor: 'pointer' }}
          onClick={() => toggleSection('deadlines')}
        >
          <h5 className="mb-0">
            <i className="fas fa-clock me-2"></i>
            Cancellation & Rescheduling Deadlines
          </h5>
          <i className={`fas ${expandedSections.deadlines ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </div>
        <div className={`collapse ${expandedSections.deadlines ? 'show' : ''}`}>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <i className="fas fa-user me-2"></i>
                  Patient Cancellation Deadline (Hours)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.patientCancellationDeadline}
                  onChange={(e) =>
                    handleFieldChange('patientCancellationDeadline', parseInt(e.target.value, 10))
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <i className="fas fa-user-md me-2"></i>
                  Doctor Cancellation Deadline (Hours)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.doctorCancellationDeadline}
                  onChange={(e) =>
                    handleFieldChange('doctorCancellationDeadline', parseInt(e.target.value, 10))
                  }
                />
              </div>
            </div>

            {/* Rescheduling Deadline */}
            <div className="mb-3">
              <label className="form-label">
                <i className="fas fa-calendar-alt me-2"></i>
                Patient Rescheduling Deadline (Hours)
              </label>
              <input
                type="number"
                className="form-control"
                value={settings.patientReschedulingDeadline}
                onChange={(e) =>
                  handleFieldChange('patientReschedulingDeadline', parseInt(e.target.value, 10))
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lab Result Fields */}
      <div className="card mb-3">
        <div 
          className="card-header d-flex justify-content-between align-items-center" 
          style={{ cursor: 'pointer' }}
          onClick={() => toggleSection('labFields')}
        >
          <h5 className="mb-0">
            <i className="fas fa-vial me-2"></i>
            Lab Result Fields Configuration
          </h5>
          <i className={`fas ${expandedSections.labFields ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </div>
        <div className={`collapse ${expandedSections.labFields ? 'show' : ''}`}>
          <div className="card-body">
            {settings?.labReportFields?.length === 0 && (
              <div className="text-center text-muted mb-3">
                <i className="fas fa-flask fa-2x mb-2"></i>
                <p>No lab fields configured yet. Click "Add Lab Field" to get started.</p>
              </div>
            )}
            {settings?.labReportFields?.map((field, fieldIndex) => (
              <div key={fieldIndex} className="mb-3 border rounded p-3 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">
                    <i className="fas fa-list-alt me-2"></i>
                    Field {fieldIndex + 1}
                  </h6>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemoveLabField(fieldIndex)}
                  >
                    <i className="fas fa-trash me-1"></i>
                    Remove Field
                  </button>
                </div>
                <div className="mb-2">
                  <label className="form-label">
                    <i className="fas fa-tag me-2"></i>
                    Main Value
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter main field name..."
                    value={field.mainValue}
                    onChange={(e) => {
                      const updatedFields = [...settings.labReportFields];
                      updatedFields[fieldIndex].mainValue = e.target.value;
                      setSettings({ ...settings, labReportFields: updatedFields });
                    }}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">
                    <i className="fas fa-tags me-2"></i>
                    Sub Values
                  </label>
                  {field?.subValue?.length === 0 && (
                    <p className="text-muted small">No sub-values added yet.</p>
                  )}
                  {field?.subValue?.map((sub, subIndex) => (
                    <div key={subIndex} className="d-flex align-items-center mb-2">
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Enter sub-value..."
                        value={sub}
                        onChange={(e) => {
                          const updatedFields = [...settings.labReportFields];
                          updatedFields[fieldIndex].subValue[subIndex] =
                            e.target.value;
                          setSettings({
                            ...settings,
                            labReportFields: updatedFields,
                          });
                        }}
                      />
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          handleRemoveSubValue(fieldIndex, subIndex)
                        }
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleAddSubValue(fieldIndex)}
                >
                  <i className="fas fa-plus me-1"></i>
                  Add Sub-Value
                </button>
              </div>
            ))}
            <button className="btn btn-success" onClick={handleAddLabField}>
              <i className="fas fa-plus me-2"></i>
              Add Lab Field
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="card mb-4">
        <div 
          className="card-header d-flex justify-content-between align-items-center" 
          style={{ cursor: 'pointer' }}
          onClick={() => toggleSection('maintenance')}
        >
          <h5 className="mb-0">
            <i className="fas fa-tools me-2"></i>
            System Maintenance
          </h5>
          <i className={`fas ${expandedSections.maintenance ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </div>
        <div className={`collapse ${expandedSections.maintenance ? 'show' : ''}`}>
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="mb-1">
                  <i className="fas fa-power-off me-2"></i>
                  Maintenance Mode
                </h6>
                <p className="text-muted mb-0">
                  When enabled, the system will be temporarily unavailable to users
                </p>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  style={{ transform: 'scale(1.5)' }}
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    handleFieldChange('maintenanceMode', e.target.checked)
                  }
                />
              </div>
            </div>
            {settings.maintenanceMode && (
              <div className="alert alert-warning mt-3">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Warning:</strong> Maintenance mode is currently enabled. Users will not be able to access the system.
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-end pb-5">
        <button
          className="btn btn-primary btn-lg px-4"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin me-2"></i>
              Saving...
            </>
          ) : (
            <>
              <i className="fas fa-save me-2"></i>
              Save All Settings
            </>
          )}
        </button>
      </div>
    </div>
        
       
</div>

    </div>

    </div>
    </>
  );
};

export default SettingsForm;