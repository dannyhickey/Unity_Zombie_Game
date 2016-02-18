// Mutes-Unmutes the sound of this transfor each time the user presses space.

	function Update() {
		 if(Input.GetKeyDown(KeyCode.M)) {
		 	if(audio.mute)
				audio.mute = false;
			else
				audio.mute = true;
		}
	}