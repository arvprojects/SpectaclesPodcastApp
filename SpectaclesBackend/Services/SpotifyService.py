import requests
from flask import current_app
from base64 import b64encode

class SpotifyService:
    base_url = 'https://api.spotify.com/v1/me/player'
    

    @staticmethod
    def get_user_auth_token(spectacles_device_id):
        # Fetch the user object using the spectaclesDeviceId
        current_app.logger.info(f'Fetching user data for spectacles device id: {spectacles_device_id}')
        platform_url = current_app.config['PLATFORM_BACKEND_URL']
        url = f'{platform_url}/users/device/{spectacles_device_id}'
        current_app.logger.info(url)
        response = requests.get(url)
        user_data = response.json()
        return user_data.get('spotify_auth_code'), user_data.get('spotify_refresh_token'), user_data.get('id')
    

    @staticmethod 
    def update_user_auth_token(user_id, auth_code):
        current_app.logger.info(f'Updating user auth token in db for user ID: {user_id}')
        platform_url = current_app.config['PLATFORM_BACKEND_URL']
        response = requests.get(f'{platform_url}/users/{user_id}')
        user_data = response.json()
        user_data['spotify_auth_code'] = auth_code
        #log the user data

        #take out the podcasts and captured_moments from the user data
        user_data.pop('podcasts')
        user_data.pop('captured_moments')
        user_data.pop('id')

    
        # current_app.logger.info(f'User data: {user_data}')
        response = requests.put(f'{platform_url}/users/{user_id}', json=user_data)


    @staticmethod
    def refresh_token(refresh_token):
        # Spotify API token endpoint
        token_url = "https://accounts.spotify.com/api/token"

        # Encode client ID and secret for Basic Auth
        client_id = current_app.config['SPOTIFY_CLIENT_ID']
        client_secret = current_app.config['SPOTIFY_CLIENT_SECRET']
        auth_header = b64encode(f"{client_id}:{client_secret}".encode()).decode()

        # Prepare the request data
        payload = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token
        }
        headers = {
            "Authorization": f"Basic {auth_header}",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        # Send the POST request to refresh the token
        try:
            response = requests.post(token_url, data=payload, headers=headers)
            response.raise_for_status()
            token_data = response.json()
            current_app.logger.info(f"New access token: {token_data.get('access_token')}")
            return token_data.get('access_token')
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"Failed to refresh token: {str(e)}")
            return None

    # @staticmethod
    # def handle_expired_token(response, user_id, refresh_token, retry_func, spectacles_device_id,*args):
    #     if response.status_code == 401:
            
    #         current_app.logger.info('Access token expired, refreshing token...')
    #         new_auth_token = SpotifyService.refresh_token(refresh_token)
    #         if new_auth_token:
    #             SpotifyService.update_user_auth_token(user_id, new_auth_token)
    #             return retry_func(spectacles_device_id,*args)
    #     return response
        

    @staticmethod
    def get_playback(spectacles_device_id):
        auth_token, refresh_token, user_id = SpotifyService.get_user_auth_token(spectacles_device_id)
        response = requests.get(SpotifyService.base_url, headers={'Authorization': f'Bearer {auth_token}'})
        current_app.logger.info(response)
        if response.status_code == 401:
            current_app.logger.info('Access token expired, refreshing token...')
            new_auth_token = SpotifyService.refresh_token(refresh_token)
            if new_auth_token:
                SpotifyService.update_user_auth_token(user_id, new_auth_token)
                response = requests.get(SpotifyService.base_url, headers={'Authorization': f'Bearer {new_auth_token}'})
        elif response.status_code == 204:
            current_app.logger.info('No active device found')
            return {}
        return response.json()
    
    @staticmethod
    def get_playback_progress_with_token(auth_token, refresh_token, user_id, spectacles_device_id):
        refreshed = False
        response = requests.get(SpotifyService.base_url, headers={'Authorization': f'Bearer {auth_token}'})
        current_app.logger.info(response)
        if response.status_code == 401:
            refreshed = True
            current_app.logger.info('Access token expired, refreshing token...')
            new_auth_token = SpotifyService.refresh_token(refresh_token)
            if new_auth_token:
                SpotifyService.update_user_auth_token(user_id, new_auth_token)
                response = requests.get(SpotifyService.base_url, headers={'Authorization': f'Bearer {new_auth_token}'})
        elif response.status_code == 204:
            current_app.logger.info('No active device found')
            return {}
        return response.json()["progress_ms"],refreshed
        

    @staticmethod
    def login(spectacles_device_id, authorization_code):
        # Load client credentials from environment variables
        client_id = current_app.config['SPOTIFY_CLIENT_ID']
        client_secret = current_app.config['SPOTIFY_CLIENT_SECRET']
        if not client_id or not client_secret:
            raise ValueError("Client ID or Client Secret is not set in the environment variables.")
        
        # Prepare the request to exchange the authorization code for tokens
        token_url = "https://accounts.spotify.com/api/token"
        payload = {
            "grant_type": "authorization_code",
            "code": authorization_code,
            "redirect_uri": "http://3.136.225.244:5000/spotify/login"
        }
        headers = {
            "Authorization": f"Basic {b64encode(f'{client_id}:{client_secret}'.encode()).decode()}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        # Request tokens from Spotify
        response = requests.post(token_url, data=payload, headers=headers)
        response.raise_for_status()  # Raise an error for unsuccessful responses
        token_data = response.json()
        
        # Extract access and refresh tokens
        access_token = token_data.get('access_token')
        refresh_token = token_data.get('refresh_token')
        if not access_token or not refresh_token:
            raise ValueError("Failed to retrieve tokens from Spotify.")
        
        url = f"{current_app.config['PLATFORM_BACKEND_URL']}/users/device/{spectacles_device_id}"
        response = requests.get(url)
        data = response.json()
        current_app.logger.info(data)
        newdata=data
        newdata["spotify_auth_code"] = access_token
        newdata["spotify_refresh_token"] = refresh_token
        userid = data['id']
        newdata.pop('id',None)
        newdata.pop('podcasts',None)
        newdata.pop('captured_moments',None)
     
        url = f"{current_app.config['PLATFORM_BACKEND_URL']}/users/{userid}"
        response = requests.put(url, json=newdata)
    
  
        return response.status_code
    #UNLESS THE USER CAN SEND THEIR AUTH TOKEN WITH EVERY REQUEST WE NEED TO GET THE 
    # AUTH TOKEN FROM THE DB EVERYTIME WE DO A PLAY/PAUSE/SEEK. not the end of the world for now.
    # shoudl be simple if when we establish a websocket connection we send them the auth token? But what happens on 
    # an update of the token    
    @staticmethod
    def play(spectacles_device_id):
        auth_token, refresh_token, user_id = SpotifyService.get_user_auth_token(spectacles_device_id)
        response = requests.put(f'{SpotifyService.base_url}/play', headers={'Authorization': f'Bearer {auth_token}'})
        if response.status_code == 401:
            current_app.logger.info('Access token expired, refreshing token...')
            new_auth_token = SpotifyService.refresh_token(refresh_token)
            if new_auth_token:
                SpotifyService.update_user_auth_token(user_id, new_auth_token)
                response = requests.put(f'{SpotifyService.base_url}/play', headers={'Authorization': f'Bearer {new_auth_token}'})
        return response.status_code
    
    @staticmethod
    def start_playing(spectacles_device_id, podcast_identifier,start_time):
        auth_token, refresh_token, user_id = SpotifyService.get_user_auth_token(spectacles_device_id)
        body = {
                "uris": [f"spotify:episode:{podcast_identifier}"]
                }
        response = requests.put(f'{SpotifyService.base_url}/play', headers={'Authorization': f'Bearer {auth_token}'},
                                json=body)
        if response.status_code == 401:
            current_app.logger.info('Access token expired, refreshing token...')
            new_auth_token = SpotifyService.refresh_token(refresh_token)
            if new_auth_token:
                SpotifyService.update_user_auth_token(user_id, new_auth_token)
                response = requests.put(f'{SpotifyService.base_url}/play', headers={'Authorization': f'Bearer {new_auth_token}'})
    
        if 200<=response.status_code<=300:
            response = SpotifyService.seek(spectacles_device_id,start_time)

        return response

    @staticmethod
    def pause(spectacles_device_id):
        auth_token, refresh_token, user_id = SpotifyService.get_user_auth_token(spectacles_device_id)
        response = requests.put(f'{SpotifyService.base_url}/pause', headers={'Authorization': f'Bearer {auth_token}'})
        if response.status_code == 401:
            current_app.logger.info('Access token expired, refreshing token...')
            new_auth_token = SpotifyService.refresh_token(refresh_token)
            if new_auth_token:
                SpotifyService.update_user_auth_token(user_id, new_auth_token)
                response = requests.put(f'{SpotifyService.base_url}/pause', headers={'Authorization': f'Bearer {new_auth_token}'})
        return response.status_code

    @staticmethod
    def seek(spectacles_device_id, position_ms):
        auth_token, refresh_token, user_id = SpotifyService.get_user_auth_token(spectacles_device_id)
        response = requests.put(f'{SpotifyService.base_url}/seek?position_ms={position_ms}', headers={'Authorization': f'Bearer {auth_token}'})
        if response.status_code == 401:
            current_app.logger.info('Access token expired, refreshing token...')
            new_auth_token = SpotifyService.refresh_token(refresh_token)
            if new_auth_token:
                SpotifyService.update_user_auth_token(user_id, new_auth_token)
                response = requests.put(f'{SpotifyService.base_url}/seek?position_ms={position_ms}', headers={'Authorization': f'Bearer {new_auth_token}'})
        return response.status_code
    
    @staticmethod
    def seek_forward(spectacles_device_id, milliseconds):
        auth_token, refresh_token, user_id = SpotifyService.get_user_auth_token(spectacles_device_id)
        current_position_response = SpotifyService.get_playback(spectacles_device_id)
        current_position = current_position_response['progress_ms']
        new_position = current_position + milliseconds
        return SpotifyService.seek(spectacles_device_id, new_position)

    @staticmethod
    def seek_backward(spectacles_device_id, milliseconds):
        auth_token, refresh_token, user_id = SpotifyService.get_user_auth_token(spectacles_device_id)
        current_position_response = SpotifyService.get_playback(spectacles_device_id)
        current_position = current_position_response['progress_ms']
        new_position = max(current_position - milliseconds, 0)
        return SpotifyService.seek(spectacles_device_id, new_position)