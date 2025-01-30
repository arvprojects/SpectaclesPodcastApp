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
  CModal,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const RemoveUserPage = () => {
  const navigate = useNavigate()
  const [snapchatUsername, setSnapchatUsername] = useState('')
  const [password, setPassword] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const getUserBySpectaclesId = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/device/${snapchatUsername}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user by spectacles ID')
      }
      const data = await response.json()
      return data.id
    } catch (error) {
      console.error('Error fetching user by spectacles ID:', error)
      return null
    }
  }

  const handleDelete = async () => {
    try {
      const userId = await getUserBySpectaclesId()
      if (!userId) {
        console.error('User ID not found')
        return
      }

      const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
        }),
      })

      if (response.ok) {
        setModalVisible(true)
      } else {
        console.error('Failed to delete user')
      }
    } catch (error) {
      console.error('Error sending DELETE request:', error)
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    navigate('/login')
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Remove Account</h1>
                  <p className="text-body-secondary">Enter your details to delete your account</p>
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
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="danger" onClick={handleDelete}>
                      Delete Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      <CModal visible={modalVisible} onClose={handleCloseModal}>
        <CModalBody>Account has been successfully deleted.</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default RemoveUserPage
