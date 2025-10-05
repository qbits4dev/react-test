import React, { useState, useEffect } from 'react';
import {
  CCard, CCardBody, CCol, CContainer, CRow, CForm, CFormInput, CFormSelect, CSpinner, CFormLabel,
  CButton, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { AppFooter, AppHeader } from '../../../components/index';

export default function RegisterAgentWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [designations, setDesignations] = useState([]);
  const [designationName, setDesignationName] = useState('Select Designation');
  const [loadingDesignations, setLoadingDesignations] = useState(true);
  const [designationError, setDesignationError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', fatherName: '', age: '', dob: '', email: '', phone: '',
    occupation: '', workExperience: '', language: '', maritalStatus: '', education: '',
    gender: '', designation: '', nomineeName: '', nomineeRelation: '', nomineeMobile: '',
    bankName: '', branch: '', accountNumber: '', ifscCode: '',
    permanentAddress: '', presentAddress: '',
    password: '', income: '', adhar: '', pan: '', referenceAgent: '', agentTeam: '', workLocation: '',
    photoFile: null, aadhaarFile: null, panFile: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    let { name, value, files } = e.target;

    if (['photoFile', 'aadhaarFile', 'panFile'].includes(name)) {
      const file = files.length > 0 ? files[0] : null;
      setForm(prev => ({ ...prev, [name]: file }));
      setErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }

    if (name === 'pan') {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    } else if (['firstName', 'lastName', 'fatherName', 'nomineeName', 'nomineeRelation', 'language', 'education', 'occupation', 'workLocation'].includes(name)) {
      value = value.replace(/[^A-Za-z ]/g, '');
    } else if (['phone', 'workExperience', 'accountNumber', 'income', 'adhar', 'nomineeMobile'].includes(name)) {
      value = value.replace(/[^0-9]/g, '');
    } else if (name === 'ifscCode') {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    } else if (['permanentAddress', 'presentAddress', 'bankName', 'branch'].includes(name)) {
      value = value.replace(/[^A-Za-z0-9 ,-]/g, '');
    }

    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'dob' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

      if (age >= 18) {
        setForm(prev => ({ ...prev, age: age.toString() }));
        setErrors(prev => ({ ...prev, dob: '' }));
      } else {
        setForm(prev => ({ ...prev, age: '' }));
        setErrors(prev => ({ ...prev, dob: 'You must be at least 18 years old.' }));
      }
    }
  };

  useEffect(() => {
    fetch('https://api.qbits4dev.com/register/?key=designation', { headers: { accept: 'application/json' } })
    // fetch('https://api.qbits4dev.com/register/?key=role', { headers: { accept: 'application/json' } })

    .then(res => res.json())
      .then(data => {
        if (data.status === 'ok' && Array.isArray(data.designation)) setDesignations(data.designation);
        else setDesignationError('No designations found');
      })
      .catch(() => setDesignationError('Failed to fetch designations'))
      .finally(() => setLoadingDesignations(false));
  }, []);

  const handleDesignationSelect = (designation) => {
    setDesignationName(designation.name);
    setForm(prev => ({ ...prev, designation: designation.name }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'fatherName':
      case 'nomineeName':
      case 'nomineeRelation':
      case 'referenceAgent':
      case 'agentTeam':
      case 'branch':
      case 'bankName':
      case 'workLocation':
        if (!value) return 'This field is required';
        if (!/^[A-Za-z0-9 ,]+$/.test(value)) return 'Invalid characters';
        break;
      case 'phone':
      case 'nomineeMobile':
        if (!/^[0-9]{10}$/.test(value)) return 'Enter a valid 10-digit phone number';
        break;
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        break;
      case 'workExperience':
        if (!/^[0-9]{1,2}$/.test(value)) return 'Enter valid years of experience';
        break;
      case 'accountNumber':
        if (!/^[0-9]{9,18}$/.test(value)) return 'Enter a valid account number (9-18 digits)';
        break;
      case 'ifscCode':
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) return 'Invalid IFSC code format (e.g., SBIN0123456)';
        break;
      case 'adhar':
        if (!/^[0-9]{12}$/.test(value)) return 'Aadhaar must be 12 digits';
        break;
      case 'pan':
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) return 'Invalid PAN format (e.g., ABCDE1234F)';
        break;
      case 'income':
        if (!/^[0-9]+$/.test(value)) return 'Income must be a numeric value';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        break;
      case 'maritalStatus':
      case 'designation':
      case 'dob':
      case 'gender':
      case 'language':
      case 'education':
      case 'occupation':
        if (!value) return 'This field is required';
        break;
      case 'photoFile':
      case 'aadhaarFile':
      case 'panFile':
        if (!value) return 'A file is required';
        break;
      default:
        return '';
    }
    return '';
  };

  const validateStep = () => {
    let newErrors = {};
    const fieldsToValidate = {
      1: ['firstName', 'lastName', 'fatherName', 'maritalStatus', 'dob', 'gender', 'email', 'phone', 'occupation', 'workExperience', 'language', 'education', 'password', 'income', 'adhar', 'pan'],
      2: ['designation', 'referenceAgent', 'agentTeam', 'workLocation', 'bankName', 'branch', 'accountNumber', 'ifscCode', 'nomineeName', 'nomineeRelation', 'nomineeMobile', 'photoFile', 'aadhaarFile', 'panFile'],
      3: ['permanentAddress', 'presentAddress']
    };

    fieldsToValidate[step]?.forEach(f => {
      const err = validateField(f, form[f]);
      if (err) newErrors[f] = err;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const formData = new FormData();
    formData.append('first_name', form.firstName);
    formData.append('last_name', form.lastName);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('dob', form.dob);
    formData.append('gender', form.gender.toLowerCase());
    formData.append('adhar', form.adhar);
    formData.append('pan', form.pan);
    formData.append('designation', form.designation);
    formData.append('role', 'agent');
    formData.append('reference_agent', form.referenceAgent);
    formData.append('agent_team', form.agentTeam);
    formData.append('mobile', form.phone);
    formData.append('address', form.presentAddress);
    formData.append('father_name', form.fatherName);
    formData.append('marital_status', form.maritalStatus.toLowerCase());
    formData.append('education', form.education);
    formData.append('language', form.language);
    formData.append('occupation', form.occupation);
    formData.append('work_experience', form.workExperience);
    formData.append('income', form.income);
    formData.append('bank_name', form.bankName);
    formData.append('account_number', form.accountNumber);
    formData.append('ifsc_code', form.ifscCode);
    formData.append('branch', form.branch);
    formData.append('work_location', form.workLocation);
    formData.append('nominiee', form.nomineeName);
    formData.append('relationship', form.nomineeRelation);
    formData.append('nominee_mobile', form.nomineeMobile);
    
    if (form.photoFile) formData.append('photo', form.photoFile);
    if (form.aadhaarFile) formData.append('aadhaar_file', form.aadhaarFile);
    if (form.panFile) formData.append('pan_file', form.panFile);

    console.log("--- Form Data Being Sent ---");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log("--------------------------");

    try {
      // const response = await fetch('https://api.qbits4dev.com/register/agent', {
        const response = await fetch('https://api.qbits4dev.com/auth/register', {
       
      method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert('Agent registered successfully!');
        navigate('/login');
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert('Network or server error. Please try again.');
    }
  };

  const renderError = (field) => errors[field] && <small className="text-danger d-block mt-1">{errors[field]}</small>;

  return (
    <div>
      <AppHeader />
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center py-5">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={12} lg={8}>
              <CCard className="shadow-sm rounded-4">
                <CCardBody className="p-5">
                  <CForm noValidate>
                    <h1 className="mb-4 text-primary" style={{ fontWeight: 'bold' }}>Agent Registration</h1>
                    {step === 1 && (
                      <CCard className="mb-4 p-4 bg-white shadow-sm border-0">
                        <h5 className="text-info mb-4">Personal Details</h5>
                        <CRow>
                          <CCol xs={12} md={6} className="mb-3">
                            <CFormInput name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} invalid={!!errors.firstName} />
                            {renderError('firstName')}
                          </CCol>
                          <CCol xs={12} md={6} className="mb-3">
                            <CFormInput name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} invalid={!!errors.lastName} />
                            {renderError('lastName')}
                          </CCol>
                        </CRow>
                        <div className="mb-3">
                          <CFormInput name="fatherName" placeholder="Father's Name" value={form.fatherName} onChange={handleChange} invalid={!!errors.fatherName} />
                          {renderError('fatherName')}
                        </div>
                        <div className="mb-3">
                          <CFormSelect name="maritalStatus" value={form.maritalStatus} onChange={handleChange} invalid={!!errors.maritalStatus}>
                            <option value="">Select Marital Status</option><option value="Single">Single</option><option value="Married">Married</option>
                          </CFormSelect>
                          {renderError('maritalStatus')}
                        </div>
                        <CRow>
                            <CCol xs={12} md={6} className="mb-3">
                                <CFormLabel>Date of Birth</CFormLabel>
                                <CFormInput type="date" name="dob" value={form.dob} onChange={handleChange} invalid={!!errors.dob} />
                                {renderError('dob')}
                            </CCol>
                            <CCol xs={12} md={6} className="mb-3">
                                <CFormLabel>Age</CFormLabel>
                                <CFormInput name="age" placeholder="Age" value={form.age} readOnly />
                            </CCol>
                        </CRow>
                        <div className="mb-3">
                          <CFormSelect name="gender" value={form.gender} onChange={handleChange} invalid={!!errors.gender}>
                            <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option>
                          </CFormSelect>
                          {renderError('gender')}
                        </div>
                        <CRow>
                            <CCol xs={12} md={6} className="mb-3">
                                <CFormInput name="email" placeholder="Email" autoComplete="email" value={form.email} onChange={handleChange} invalid={!!errors.email} />
                                {renderError('email')}
                            </CCol>
                            <CCol xs={12} md={6} className="mb-3">
                                <CFormInput name="phone" placeholder="Phone Number" maxLength={10} value={form.phone} onChange={handleChange} invalid={!!errors.phone} />
                                {renderError('phone')}
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol xs={12} md={6} className="mb-3">
                                <CFormInput name="occupation" placeholder="Occupation" value={form.occupation} onChange={handleChange} invalid={!!errors.occupation}/>
                                {renderError('occupation')}
                            </CCol>
                             <CCol xs={12} md={6} className="mb-3">
                                <CFormInput name="workExperience" placeholder="Work Experience (Years)" maxLength={2} value={form.workExperience} onChange={handleChange} invalid={!!errors.workExperience}/>
                                {renderError('workExperience')}
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol xs={12} md={6} className="mb-3">
                                <CFormSelect name="language" value={form.language} onChange={handleChange} invalid={!!errors.language}>
                                  <option value="">Select Language</option><option value="English">English</option><option value="Hindi">Hindi</option><option value="Telugu">Telugu</option>
                                </CFormSelect>
                                {renderError('language')}
                            </CCol>
                            <CCol xs={12} md={6} className="mb-3">
                                <CFormInput name="education" placeholder="Education" value={form.education} onChange={handleChange} invalid={!!errors.education}/>
                                {renderError('education')}
                            </CCol>
                        </CRow>
                        <div className="mb-3">
                          <CFormInput name="password" type="password" placeholder="Password" autoComplete="new-password" value={form.password} onChange={handleChange} invalid={!!errors.password}/>
                          {renderError('password')}
                        </div>
                        <div className="mb-3">
                          <CFormInput name="income" placeholder="Annual Income" value={form.income} onChange={handleChange} invalid={!!errors.income} />
                          {renderError('income')}
                        </div>
                        <div className="mb-3">
                          <CFormInput name="adhar" placeholder="Aadhaar Number" maxLength={12} value={form.adhar} onChange={handleChange} invalid={!!errors.adhar}/>
                          {renderError('adhar')}
                        </div>
                        <div className="mb-3">
                          <CFormInput name="pan" placeholder="PAN Number" maxLength={10} value={form.pan} onChange={handleChange} invalid={!!errors.pan} />
                          {renderError('pan')}
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                          <CButton color="primary" onClick={nextStep}>Next</CButton>
                        </div>
                      </CCard>
                    )}
                    {step === 2 && (
                      <CCard className='mb-4 p-4 bg-white shadow-sm border-0'>
                        <h5 className='text-info mb-4'>Designation, Bank & Nominee Details</h5>
                        <div className="mb-3">
                          <CDropdown className='w-100'>
                              <CDropdownToggle color='light' className='text-start w-100 d-flex justify-content-between align-items-center'>
                                {loadingDesignations ? <span><CSpinner size="sm" className="me-2" />Loading...</span> : designationName}
                              </CDropdownToggle>
                              <CDropdownMenu className="w-100">
                                {loadingDesignations && <CDropdownItem disabled>Loading...</CDropdownItem>}
                                {!loadingDesignations && designationError && <CDropdownItem disabled>{designationError}</CDropdownItem>}
                                {!loadingDesignations && !designationError && designations.map((d, idx) => (
                                  <CDropdownItem key={idx} onClick={() => handleDesignationSelect(d)}>{d.name}</CDropdownItem>
                                ))}
                              </CDropdownMenu>
                          </CDropdown>
                          {renderError('designation')}
                        </div>
                        <div className="mb-3">
                            <CFormInput name="referenceAgent" placeholder="Reference Agent Code" value={form.referenceAgent} onChange={handleChange} invalid={!!errors.referenceAgent} />
                            {renderError('referenceAgent')}
                        </div>
                        <div className="mb-3">
                            <CFormInput name="agentTeam" placeholder="Agent Team" value={form.agentTeam} onChange={handleChange} invalid={!!errors.agentTeam} />
                            {renderError('agentTeam')}
                        </div>
                        <div className="mb-3">
                            <CFormInput name="workLocation" placeholder="Work Location" value={form.workLocation} onChange={handleChange} invalid={!!errors.workLocation} />
                            {renderError('workLocation')}
                        </div>
                        <CCard className="p-3 bg-light shadow-sm mb-3 rounded-3">
                            <h6 className="text-primary mb-3 fw-semibold">Bank Details</h6>
                            <div className="mb-3"><CFormInput name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} invalid={!!errors.bankName}/>{renderError('bankName')}</div>
                            <div className="mb-3"><CFormInput name="branch" placeholder="Branch Name" value={form.branch} onChange={handleChange} invalid={!!errors.branch}/>{renderError('branch')}</div>
                            <div className="mb-3"><CFormInput name="accountNumber" placeholder="Account Number" value={form.accountNumber} onChange={handleChange} invalid={!!errors.accountNumber}/>{renderError('accountNumber')}</div>
                            <div className="mb-3"><CFormInput name="ifscCode" placeholder="IFSC Code" maxLength={11} value={form.ifscCode} onChange={handleChange} invalid={!!errors.ifscCode}/>{renderError('ifscCode')}</div>
                        </CCard>
                        <CCard className="p-3 bg-light shadow-sm mb-4 rounded-3">
                            <h6 className="text-primary mb-3 fw-semibold">Nominee Details</h6>
                            <div className="mb-3"><CFormInput name="nomineeName" placeholder="Nominee Name" value={form.nomineeName} onChange={handleChange} invalid={!!errors.nomineeName}/>{renderError('nomineeName')}</div>
                            <div className="mb-3"><CFormInput name="nomineeRelation" placeholder="Relation with Nominee" value={form.nomineeRelation} onChange={handleChange} invalid={!!errors.nomineeRelation}/>{renderError('nomineeRelation')}</div>
                            <div className="mb-3"><CFormInput name="nomineeMobile" placeholder="Nominee Mobile" maxLength={10} value={form.nomineeMobile} onChange={handleChange} invalid={!!errors.nomineeMobile}/>{renderError('nomineeMobile')}</div>
                        </CCard>
                        <CCard className="p-4 border-0 shadow-sm rounded-3">
                            <h5 className="mb-4 fw-semibold text-info">Upload Documents</h5>
                            <div className="mb-3"><CFormLabel>Photo (JPEG/JPG only, max 2MB)</CFormLabel><CFormInput type="file" name="photoFile" accept="image/jpeg,image/jpg" onChange={handleChange} invalid={!!errors.photoFile}/>{renderError('photoFile')}</div>
                            <div className="mb-3"><CFormLabel>Aadhaar File (PDF only, max 2MB)</CFormLabel><CFormInput type="file" name="aadhaarFile" accept="application/pdf" onChange={handleChange} invalid={!!errors.aadhaarFile} />{renderError('aadhaarFile')}</div>
                            <div><CFormLabel>PAN File (PDF only, max 2MB)</CFormLabel><CFormInput type="file" name="panFile" accept="application/pdf" onChange={handleChange} invalid={!!errors.panFile}/>{renderError('panFile')}</div>
                        </CCard>
                        <div className="d-flex justify-content-between mt-4">
                          <CButton color="secondary" onClick={prevStep}>Back</CButton>
                          <CButton color="primary" onClick={nextStep}>Next</CButton>
                        </div>
                      </CCard>
                    )}
                    {step === 3 && (
                      <CCard className="mb-4 p-4 bg-white shadow-sm border-0">
                        <h5 className="text-info mb-4">Address Details</h5>
                        <div className="mb-3">
                          <CFormInput placeholder="Permanent Address" name="permanentAddress" value={form.permanentAddress} onChange={handleChange} invalid={!!errors.permanentAddress} />
                          {renderError('permanentAddress')}
                        </div>
                        <div className="mb-3">
                          <CFormInput placeholder="Present Address" name="presentAddress" value={form.presentAddress} onChange={handleChange} invalid={!!errors.presentAddress} />
                          {renderError('presentAddress')}
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                          <CButton color="secondary" onClick={prevStep}>Back</CButton>
                          <CButton color="success" onClick={handleSubmit}>Submit</CButton>
                        </div>
                      </CCard>
                    )}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
      <AppFooter />
    </div>
  );
}
