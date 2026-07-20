import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CButton,
  CFormFeedback,
} from '@coreui/react';
import { sanitizeNumeric, sanitizeText, sanitizeRestrictedText } from '../../../utils/validation';
import ErrorModal from '../../../components/ErrorModal';
import { extractErrorMessage, getResponseErrorMessage } from '../../../utils/errorUtils';

// Options for plot status dropdown
const plotStatusOptions = ['available', 'sold', 'reserved', 'on hold'];

export default function PlotForm() {
  const [form, setForm] = useState({
    project_name: '',
    plot_number: '',
    size: '',
    price: '',
    status: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const v = String(value || '').trim();
    if (name === 'project_name' && !v) return 'Project Name is required';
    if (name === 'plot_number' && !v) return 'Plot Number is required';
    if (name === 'size') {
      if (!v) return 'Size is required';
      if (Number(v) <= 0) return 'Size must be greater than 0';
    }
    if (name === 'price') {
      if (!v) return 'Price is required';
      if (Number(v) < 0) return 'Price cannot be negative';
    }
    if (name === 'status' && !v) return 'Status is required';
    return '';
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        const res = await fetch(`${globalThis.apiBaseUrl}/projects/`);
        if (res.ok) {
          const data = await res.json();
          setProjects(Array.isArray(data.data) ? data.data : []);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (['size', 'price'].includes(name)) {
      nextValue = sanitizeNumeric(value, 10);
    } else if (name === 'plot_number') {
      nextValue = sanitizeRestrictedText(value.toUpperCase(), 30);
    }
    setForm((prev) => ({ ...prev, [name]: nextValue }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, nextValue) }));
  };

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMsg, setErrorModalMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {
      project_name: validateField('project_name', form.project_name),
      plot_number: validateField('plot_number', form.plot_number),
      size: validateField('size', form.size),
      price: validateField('price', form.price),
      status: validateField('status', form.status),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    setLoading(true);

    const payload = {
      project_name: form.project_name,
      plot_number: form.plot_number,
      size: Number(form.size),
      price: Number(form.price),
      status: form.status.toLowerCase(),
    };

    try {
      const postUrl = `${globalThis.apiBaseUrl}/projects/plots`;

      const response = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMsg = await getResponseErrorMessage(response, 'Failed to add plot.');
        setErrorModalMsg(errorMsg);
        setErrorModalVisible(true);
        return;
      }

      setModalMessage('Success: Plot added successfully');
      setShowModal(true);
      setForm({
        project_name: '',
        plot_number: '',
        size: '',
        price: '',
        status: '',
      });
    } catch (error) {
      setErrorModalMsg(extractErrorMessage(error, 'Failed to submit plot.'));
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <CCard
        className="shadow-lg"
        style={{
          width: '100%',
          maxWidth: '700px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: 'none',
          background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
        }}
      >
        <CCardBody className="p-5">
          <div className="text-center mb-5">
            <h1
              style={{
                fontWeight: 800,
                background: 'linear-gradient(90deg, #4e54c8, #8f94fb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Add a New Plot
            </h1>
            <p
              style={{
                background: 'linear-gradient(90deg, #4e54c8, #8f94fb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Complete the details to register a plot
            </p>
          </div>

          <CForm onSubmit={handleSubmit}>
            <CRow className="g-4 mb-4">
              <CCol md={6}>
                <CFormSelect
                  floating
                  label="Project Name *"
                  name="project_name"
                  value={form.project_name}
                  onChange={handleChange}
                  invalid={!!errors.project_name}
                  required
                  disabled={projectsLoading}
                  style={{ borderRadius: '12px', border: '1px solid #ced4da' }}
                >
                  <option value="">{projectsLoading ? 'Loading projects...' : 'Select Project'}</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.name}>
                      {proj.name}
                    </option>
                  ))}
                </CFormSelect>
                {errors.project_name && <CFormFeedback className="d-block">{errors.project_name}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormInput
                  floating
                  label="Plot Number *"
                  name="plot_number"
                  value={form.plot_number}
                  onChange={handleChange}
                  placeholder="Plot Number"
                  invalid={!!errors.plot_number}
                  required
                  style={{ borderRadius: '12px', border: '1px solid #ced4da' }}
                />
                {errors.plot_number && <CFormFeedback className="d-block">{errors.plot_number}</CFormFeedback>}
              </CCol>
            </CRow>

            <CRow className="g-4 mb-4">
              <CCol md={6}>
                <CFormInput
                  floating
                  label="Size (sq. ft) *"
                  name="size"
                  type="number"
                  value={form.size}
                  onChange={handleChange}
                  placeholder="Size"
                  invalid={!!errors.size}
                  required
                  style={{ borderRadius: '12px', border: '1px solid #ced4da' }}
                />
                {errors.size && <CFormFeedback className="d-block">{errors.size}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormInput
                  floating
                  label="Price *"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  invalid={!!errors.price}
                  required
                  style={{ borderRadius: '12px', border: '1px solid #ced4da' }}
                />
                {errors.price && <CFormFeedback className="d-block">{errors.price}</CFormFeedback>}
              </CCol>
            </CRow>

            <CRow className="g-4 mb-5">
              <CCol>
                <CFormSelect
                  floating
                  label="Plot Status *"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  invalid={!!errors.status}
                  required
                  style={{ borderRadius: '12px', border: '1px solid #ced4da' }}
                >
                  <option value="">Select Status</option>
                  {plotStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </CFormSelect>
                {errors.status && <CFormFeedback className="d-block">{errors.status}</CFormFeedback>}
              </CCol>
            </CRow>

            <div className="d-grid">
              <CButton
                size="lg"
                color="primary"
                type="submit"
                disabled={loading}
                style={{
                  borderRadius: '12px',
                  fontWeight: 600,
                  background: 'linear-gradient(90deg, #4e54c8, #8f94fb)',
                  border: 'none',
                }}
              >
                {loading ? 'Submitting...' : 'Add Plot'}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              minWidth: '300px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                marginBottom: '1rem',
                color: modalMessage.startsWith('Error:') ? '#d32f2f' : '#388e3c',
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              {modalMessage.replace(/^Error:\s*/, '').replace(/^Success:\s*/, '')}
            </div>
            <button
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: '#4e54c8',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Designated Error Modal */}
      <ErrorModal
        visible={errorModalVisible}
        title="Plot Creation Failed"
        errorMessage={errorModalMsg}
        onClose={() => setErrorModalVisible(false)}
      />
    </div>
  );
}
