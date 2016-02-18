#pragma strict

@script RequireComponent(AudioSource)
public var collection_sound : AudioClip;
private var keyCollected : boolean;
private var keyTwoCollected : boolean;
private var keyThreeCollected : boolean;
private var keyFourCollected : boolean;

private var starCollected : boolean;
private var gunEnabled : boolean;
private var ammoCollected : boolean;
private var healthCollected : boolean;
public static var score: int;
public static var level: int;
var GUIScore : GUIText;
var GUILevel : GUIText;


private var health : int;
private var guiAmmo : GameObject;


function Start ()
{
	guiAmmo = GameObject.Find("GUItext_ammo");
	score = 0;
	level = 1; 
	GUIScore.text = "Score: 0";
	GUILevel.text = "Level: 1";
	health = 0;
	
	starCollected = false;
	keyCollected = false;
	keyTwoCollected = false;
	keyThreeCollected = false;
	keyFourCollected = false;
	gunEnabled = false;
	ammoCollected = false;
	healthCollected = false;
	changeGUITexture(false, "key");
	changeGUITexture(false, "star");
	changeGUITexture(false, "gun");
	changeGUITexture(false, "health");
}

function OnCollisionEnter (win : Collision)
{
    if(win.gameObject.name == "HomeFree")
    {
        Destroy(win.gameObject);
    }
   
}

function disappear()
{
		
	if(gunEnabled)
	{
		yield WaitForSeconds(2);
		changeGUITexture(false, "gun");
		
	}
	
	if(starCollected)
	{
		yield WaitForSeconds(2);
		changeGUITexture(false, "star");
	}
	
	if(healthCollected)
	{
		yield WaitForSeconds(2);
		changeGUITexture(false, "health");
	}
}


function Update()
{	
	StartCoroutine(disappear());
	//Lose Condition
	if(timer.minutes > 4)
	{
		Application.LoadLevel(3);
	}	
	
	//gunEnabled boolean is true then update the number of bullets in the guiText ammo
	if (gunEnabled || ammoCollected)
	{
	 	guiAmmo.guiText.text= "Ammo: "+GetComponent(shoot).bulletCount;
	}
}




function OnControllerColliderHit(c : ControllerColliderHit)
{

	if (c.gameObject.tag == "Key" || c.gameObject.tag == "Key2" || c.gameObject.tag == "Key3" || c.gameObject.tag == "Key4" ||
	c.gameObject.tag == "Star" || c.gameObject.tag == "Gun" || c.gameObject.tag == "Health" || c.gameObject.tag == "Ammunition")
	{
	
		
		GameObject.Find("displayMessage").GetComponent(displayMessage).displayText(c.gameObject.tag+" collected!");		
		audio.clip = collection_sound;
		audio.Play();

		if (c.gameObject.tag == "Key")
		{ 
			Destroy(c.gameObject);
			keyCollected = true;
			changeGUITexture(true, "key");
		}
			if (c.gameObject.tag == "Key2")
		{ 
			Destroy(c.gameObject);
			keyTwoCollected = true;
			changeGUITexture(true, "key");
		}
			if (c.gameObject.tag == "Key3")
		{ 
			Destroy(c.gameObject);
			keyThreeCollected = true;
			changeGUITexture(true, "key");
		}
			if (c.gameObject.tag == "Key4")
		{ 
			Destroy(c.gameObject);
			keyFourCollected = true;
			changeGUITexture(true, "key");
		}
		if (c.gameObject.tag == "Star")
		{ 
			Destroy(c.gameObject);
			starCollected = true;
			changeGUITexture (true, "star");
			score+=10;
			GUIScore.text = "Score: " +score;
		}		
		if (c.gameObject.tag == "Gun")
		{ 
			Destroy(c.gameObject);
			gunEnabled = true;
			changeGUITexture(true, "gun");
			GameObject.Find("GUITexture_crosshair").guiTexture.enabled=true;
			GameObject.FindWithTag("Player").GetComponent(shoot).bulletCount += 40;
			
		}
		if (c.gameObject.tag == "Ammunition")
		{
			ammoCollected = true;
			Destroy(c.gameObject);
			GameObject.FindWithTag("Player").GetComponent(shoot).bulletCount += 30;
		}
		
		if (c.gameObject.tag == "Health")
		{ 
			Destroy(c.gameObject);
			healthCollected = true;
			changeGUITexture(true, "health");
			health = 100;			
			GameObject.Find("healthBar").GetComponent(healthBar).setHealth(health);	
		}
	
		
	}
	if (c.gameObject.tag == "Level2Door")
	{
		if (keyCollected && score == 50 && timer.minutes < 5) 
		{	
			level++;
			GUILevel.text = "Level: " +level;
			c.gameObject.animation.Play ("door_open");
			yield WaitForSeconds(1); //Wait for annimation to play
			score = 0;
			GUIScore.text = "Score: " +score;
			changeGUITexture(false, "key");	
			
			//Application.LoadLevel(4);
		}
		else
		GameObject.Find("displayMessage").GetComponent(displayMessage).displayText("To open this door you \nmust first find the key \nand collect all of the items!");
	}
	
	if (c.gameObject.tag == "Level3Door")
	{
		if (keyTwoCollected && score == 50 && timer.minutes < 5) 
		{	
			level++;
			GUILevel.text = "Level: " +level;
			c.gameObject.animation.Play ("door_open");
			yield WaitForSeconds(1); //Wait for annimation to play
			score = 0;
			GUIScore.text = "Score: " +score;
			changeGUITexture(false, "key");				
			//Application.LoadLevel(4);
		}
		else
		GameObject.Find("displayMessage").GetComponent(displayMessage).displayText("To open this door you \nmust first find the key \nand collect all of the items!");
	}
	
	if (c.gameObject.tag == "Level4Door")
	{
		if (keyThreeCollected && score == 50 && timer.minutes < 5) 
		{	
			level++;
			GUILevel.text = "Level: " +level;
			c.gameObject.animation.Play ("door_open");
			yield WaitForSeconds(1); //Wait for annimation to play
			score = 0;
			GUIScore.text = "Score: " +score;
			changeGUITexture(false, "key");		
			
			
			//Application.LoadLevel(4);
		}
		else
		GameObject.Find("displayMessage").GetComponent(displayMessage).displayText("To open this door you \nmust first find the key \nand collect all of the items!");
	}
	
	
	if (c.gameObject.tag == "exit_door")
	{
		if (keyFourCollected && score == 50 && timer.minutes < 5) 
		{
			c.gameObject.animation.Play ("door_open");
			timer.minutes = 5;
			yield WaitForSeconds(1); //Wait for annimation to play
			Application.LoadLevel(4);
			
		}
		else
		GameObject.Find("displayMessage").GetComponent(displayMessage).displayText("To open this door you \nmust first find the key \nand collect all of the items!");
	}
		if (c.gameObject.tag=="Mine")
		{
			Destroy(c.gameObject);
			GameObject.Find("healthBar").GetComponent(healthBar).decreaseHealth(30);//Sets the health variable to zero when collided with mine.			
			//yield WaitForSeconds(1);
			//Application.LoadLevel(3);//loads game over screen
			
		}
		
}

function changeGUITexture(display:boolean, name:String)
{
	GameObject.Find("GUITexture_"+name).guiTexture.enabled = display;
}

