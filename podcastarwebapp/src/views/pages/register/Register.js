import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const Register = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [snapchatUsername, setSnapchatUsername] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const handleSubmit = () => {
    if (password !== repeatPassword) {
      alert('Passwords do not match!')
    } else {
      createUser()
    }
  }

  //.env being annoying, skipped for now.. but replace fetch url with BACKEND_URL in future
  const createUser = async () => {
    try {
      console.log('Creating user...' + BACKEND_URL)
      const response = await fetch(`${BACKEND_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_author: false,
          name,
          snapchat_username: snapchatUsername,
          spectacles_device_id: snapchatUsername,
          spotify_auth_code: ' ',
          spotify_refresh_token: ' ',
        }),
      })

      if (response.ok) {
        // Navigate to Userhome page with the name as state
        navigate('/home', { state: { username: snapchatUsername } })
      } else {
        console.error('Failed to create user')
      }
    } catch (error) {
      console.error('Error sending POST request:', error)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Snapchat Username"
                      autoComplete="snap username"
                      value={snapchatUsername}
                      onChange={(e) => setSnapchatUsername(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" onClick={handleSubmit}>
                      Create Account
                    </CButton>
                  </div>
                  <p className="text-center mt-3">or</p>
                  <div className="d-grid">
                    <CButton
                      color="danger"
                      className="mt-2"
                      onClick={() => navigate('/unregister')}
                    >
                      Delete Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
