#pragma strict

private var message: String;
private var timerActive:boolean;
private var timer:float;
private var timeDuration:float;



function Start () {
	guiText.text = "";
}

function Update () {
	if (timerActive)
	{
	timer+=Time.deltaTime;
	if (timer > timeDuration)
		{ 
			timerActive=false;
			guiText.text="";
		}
	}
}

function startTimer()
{
	timer = 0.0f;
	guiText.text = message;
	timerActive = true;
	timeDuration = 2.0f;
}

function displayText(mes:String)
{
	message = mes;
	startTimer();
}