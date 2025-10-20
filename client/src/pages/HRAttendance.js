import React, { useState } from 'react';
import BulkUpload from '../components/BulkUpload';

const HRAttendance = () => {
  const bulkUploadTemplate = [
    { name: 'Staff Name', role: 'Counsellor', date: '2025-10-20', status: 'Present', checkIn: '09:00 AM', checkOut: '06:00 PM' }
  ];
  
  const [formData, setFormData] = useState({
    staffMember: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });

  const [attendance, setAttendance] = useState([
    { id: 1, name: 'Aparna Banerjee', role: 'Counsellor', date: '2025-10-20', status: 'Present', checkIn: '09:15 AM', checkOut: '06:30 PM' },
    { id: 2, name: 'Dr. Rajesh Sharma', role: 'Doctor', date: '2025-10-20', status: 'Present', checkIn: '10:00 AM', checkOut: '05:45 PM' },
    { id: 3, name: 'Rahul Verma', role: 'Field Staff', date: '2025-10-20', status: 'On Leave', checkIn: '-', checkOut: '-' },
    { id: 4, name: 'Sita Sharma', role: 'Counsellor', date: '2025-10-20', status: 'Present', checkIn: '09:00 AM', checkOut: 'In Progress' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMarkAttendance = (e) => {
    e.preventDefault();
    
    if (!formData.staffMember) {
      alert('Please select a staff member');
      return;
    }

    const newRecord = {
      id: attendance.length + 1,
      name: formData.staffMember,
      role: 'Counsellor', // Would come from staff database
      date: formData.date,
      status: formData.status,
      checkIn: formData.status === 'Present' ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
      checkOut: '-'
    };

    setAttendance(prev => [newRecord, ...prev]);
    
    // Save to localStorage for persistence
    const updatedAttendance = [newRecord, ...attendance];
    localStorage.setItem('varhadAttendance', JSON.stringify(updatedAttendance));
    
    alert('Attendance marked successfully!');
    setFormData({
      staffMember: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Present'
    });
  };

  return (
    <div>
      <div className="alert alert-info">
        <strong>👥 HR & Attendance:</strong> Manage staff attendance, leave requests, and work schedules
      </div>

      <BulkUpload
        moduleName="HR Attendance"
        templateData={bulkUploadTemplate}
        onUpload={(file) => {
          // Attendance file uploaded successfully
        }}
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Staff</div>
          <div className="stat-value">28</div>
          <div className="stat-trend">Active employees</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Present Today</div>
          <div className="stat-value">24</div>
          <div className="stat-trend">85.7% attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">On Leave</div>
          <div className="stat-value">3</div>
          <div className="stat-trend">Approved leaves</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value">2</div>
          <div className="stat-trend">Leave applications</div>
        </div>
      </div>

      <form onSubmit={handleMarkAttendance}>
        <div className="card">
          <div className="card-title">Mark Attendance</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Staff Member *</label>
              <select 
                name="staffMember"
                value={formData.staffMember}
                onChange={handleInputChange}
                required
              >
                <option value="">Select staff member</option>
                <option>Aparna Banerjee</option>
                <option>Dr. Rajesh Sharma</option>
                <option>Rahul Verma</option>
                <option>Sita Sharma</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option>Present</option>
                <option>Absent</option>
                <option>On Leave</option>
                <option>Half Day</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Mark Attendance</button>
        </div>
      </form>

      <div className="card">
        <div className="card-title">Today's Attendance</div>
        <table>
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Role</th>
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id}>
                <td>{record.name}</td>
                <td>{record.role}</td>
                <td>{record.date}</td>
                <td>
                  <span className={`status-badge ${
                    record.status === 'Present' ? 'status-completed' :
                    record.status === 'On Leave' ? 'status-pending' : 'status-overdue'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td>{record.checkIn}</td>
                <td>{record.checkOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HRAttendance;
