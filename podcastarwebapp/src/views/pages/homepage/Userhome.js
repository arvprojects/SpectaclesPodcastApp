import React from 'react'
import { useLocation } from 'react-router-dom'
import { CButton, CCard, CCardBody, CContainer, CRow, CCol } from '@coreui/react'

const Userhome = () => {
  const location = useLocation()
  const username = location.state?.username || 'User'

  const spotifyAuth = async () => {
    try {
      const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID
      const redirect_uri = import.meta.env.VITE_REDIRECT_URI
      const scope = 'user-read-playback-state user-modify-playback-state'
      const state = username

      console.log('Starting Spotify auth with:', {
        client_id,
        redirect_uri,
        scope,
        state,
      })

      const authUrl =
        'https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
          response_type: 'code',
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state,
        }).toString()

      console.log('Auth URL:', authUrl)

      window.location.href = authUrl
    } catch (error) {
      console.error('Spotify Auth Error:', error)
      alert('Failed to connect to Spotify: ' + error.message)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <h1 className="mb-4" style={{ color: 'green' }}>
              Welcome, {username}!
            </h1>
            <CCard className="bg-success text-white mb-4">
              <CCardBody className="text-center p-5">
                <h2 className="mb-3">Connect Your Spotify Account</h2>
                <p className="lead mb-4">
                  Enhance your podcast experience by connecting your Spotify account
                </p>
                <CButton
                  color="light"
                  size="lg"
                  className="px-5 py-3 fw-bold"
                  onClick={spotifyAuth}
                >
                  Connect to Spotify
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Userhome
