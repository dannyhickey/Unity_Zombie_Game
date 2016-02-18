#pragma strict

public var bulletCount:int;
public var shootSound:AudioClip;
public var sparks:GameObject;
public var timeToReload:float = 0.2f;
public var timeForNextShot:float = 0.0;


function Start () 
{
	
	
	bulletCount = 0;
}



function Update ()
{
	
	if (Input.GetButton("Fire1") && Time.time >= timeForNextShot)//if fire button is pressed
	{
	if (bulletCount >= 1)//if you have any bullets in the gun
		{
			audio.clip = shootSound;
			audio.Play();
			var hit : RaycastHit; // the hit variable of type raycast identifies the object its looking at
			var ray = Camera.main.ScreenPointToRay (Vector3(Screen.width/2,Screen.height/2));
			
			if(Physics.Raycast (ray, hit, 100)) // the Physics raycast has 3 arguments the ray and hit variables created above and the length 
			{
				print("You fired at the "+hit.collider.gameObject.tag);
				var spark:GameObject = Instantiate( sparks, hit.point,Quaternion.identity);
				
				if (hit.collider.gameObject.tag == "zombie")//checking if bullet has collided with the AI enemy
				{
					hit.collider.gameObject.GetComponent(Animator).SetBool("hit",true);// the boolean hit is set to true if bullet hits enemy
				}
			}
			bulletCount--; //decrese bullets when shot is fired
			print("bullets: "+bulletCount);
		}
		timeForNextShot = Time.time + timeToReload;
	}
}