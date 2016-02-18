

private static var currHealth : int = 30;
private var currentColor:Texture2D;
public var style:GUIStyle;
public var redTexture:Texture2D;
public var blueTexture:Texture2D;
public var yellowTexture:Texture2D;
public var blackTexture:Texture2D;
public var life : int;
var GUILife : GUIText;


function Start()
{
	life = 3;
	GUILife.text = "Lives: 3";
	
}

function OnGUI()
{
	if(currHealth >= 67)
	
		currentColor = blueTexture;
	
	else if (currHealth >= 30)
		currentColor = yellowTexture;
		else currentColor = redTexture;
		style.normal.background = blackTexture;
		GUI.Box(Rect(10,600, 100,30),"", style);
		style.normal.background = currentColor;
		GUI.Box(Rect(10,600, currHealth,30),"",style);
	
}


function Update()
{
	
	if (currHealth <=0)
		{
			life --;
			Debug.Log("Life : " + life);			
			GUILife.text = "Lives: " +life;	
			currHealth = 100;
		}
		if(life < 1)
		{						
			Application.LoadLevel(3);
		}
}

function setHealth(updatedValue:int)
{	
	currHealth = updatedValue;	
}

function decreaseHealth (increment : int)
{
	currHealth -= increment;
}