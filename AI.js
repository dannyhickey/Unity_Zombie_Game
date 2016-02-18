#pragma strict

public var breadCrumb:GameObject;//GameObject variable to hold the breadcrumb
private var timeForNextCrumb:float;//variable used to decide the time the next breadcrumb will be dropped
private var currentTime:float;//variable used to hold the current time.
private var breadCrumbs = new Array();// an array of breadcrumbs dropped for the enemy.
private var breadCrumbIndex:int;//stores the current index for the breadcrumb dropped.
public var walking:boolean = false;//boolean used for the animation in Animator Window.
public var anim:Animator;//Animator object that manages the animator component.
public var currentBaseState:AnimatorStateInfo;// used to find the current state the animation is in. 
public var walkForwardState : int = Animator.StringToHash("Base Layer.WalkForward");//represents the Walk state in the animator
public var FollowBreadCrumbsState : int = Animator.StringToHash("Base Layer.FollowBreadCrumbs"); //represents walk state in first animator
public var idleState:int = Animator.StringToHash("Base Layer.Idle");//represents the Idle state in the animator
private var playerTransform:Transform;//variable to determine position of the player
private var hit:RaycastHit;// raycast to detect the player

public var FollowPlayersBreadCrumbsState:int = Animator.StringToHash("Base Layer.FollowPlayersBreadCrumbs");//represents the follow players bread crumbs state in the animator.
public var playerBreadCrumbsIndex:int = 0;//index of breadcrumbs released by the player.
public var canFollowPlayersCrumbs:boolean; // to control which AI has the intelligence to follow the players breadcrumbs i.e. type 3 and type 4 only. 
private var player:GameObject;

public var hasAttacked:boolean = false;
var hitState:int = Animator.StringToHash("Base Layer.Hit");//represents the hit state in the animator.
public var damage:int;// variable for the damage the enemy receives.
public var deadState:int = Animator.StringToHash("Base Layer.Dead");//represents the dead state in the animator.
var attackState:int = Animator.StringToHash("Base Layer.Attack");//represents the attack state in the animator. 
public var patrolState : int = Animator.StringToHash("Base Layer.Patrol");//represents the patrol state in the patrol animator. 
private var wayPointIndex : int = 1; // integer variable used to determine the next waypoint.
public var detectedPlayersClosestCrumb : boolean = false; // boolean initialises the first breadcrumb that the AI must follow.

function Start () 
{
	 
	setCharacterType(canFollowPlayersCrumbs);
	player = GameObject.FindWithTag("Player");
	
	anim = GetComponent(Animator);//initializing the variable linking to gameObject.
	playerTransform = GameObject.FindWithTag("Player").transform;
	damage = 0;//start with damage set to zero
	breadCrumbIndex = 0;//start with breadCrumbIndex set to zero
	
}

function Update () 
{	
	currentBaseState = anim.GetCurrentAnimatorStateInfo(0);//getting updated on the state for the current animation.
	//variable to determine the distance that is initialized with a measure of the distance between player and zombie.
	//This is achieved with the Vector3 function built in to Unity. 
	var distance : float = Vector3.Distance(transform.position, playerTransform.position);
	

	if (distance < 5.0f) 
	{
		anim.SetBool("withinReach",true);
	}else 
		anim.SetBool("withinReach",false);	
	
	 //switch statement to go through different instructions
	 switch (currentBaseState.nameHash)
	{
		case idleState:	
			// in the idleState a raycast when the AI is within a distance of 200 meters and facing the player
			// or just within a distance of 10 meters without facing player
			//just like the players raycast it uses hit to get the tag of what it's looking at i.e. the player. 
			if ((Physics.Raycast (Vector3(transform.position.x, playerTransform.position.y+1, transform.position.z), transform.forward, hit, 200) 
			&& (hit.collider.gameObject.tag == "Player") || hit.collider.gameObject.tag == "zombie") || distance <10.0f)
			{
				//Debug.Log("40 meters detected");
				anim.SetBool("walking",true);//sets the walking boolean to true. 
			}
		break;
		
		case walkForwardState:
			hasAttacked = false;
			transform.LookAt(playerTransform);
			var zombies:GameObject [] = GameObject.FindGameObjectsWithTag("zombie");//an array of objects that that holds all the enemies with zombie tag. 
				for (var zombie:GameObject in zombies)//a for loop loops through this array and finds the distance between all of the AI objects. 
					{
						if (Vector3.Distance(transform.position, zombie.transform.position) < 16.0f)// if within 16 meters of other AI enemy 
						{
							zombie.GetComponent(AI).setWalking(true);//sets all zombies that were within 16 meters of other communicating zombie to walking
						}		
					}
					
			anim.SetBool("canSeePlayerWhileWalking",true);//sets boolean canSeePlayerWhileWalking to true
			if (Time.time > timeForNextCrumb)//checking to see if it's time to for the next breadcrumb
			{
				breadCrumbIndex++;//increase the index by one.
				timeForNextCrumb = Time.time+3;//releases a breadcrumb every 3 seconds.
				breadCrumbs[breadCrumbIndex] = transform.position;//saves the position of the new breadcrumb.
				var b:GameObject = GameObject.Instantiate(breadCrumb,transform.position,transform.rotation);//Instantiate the breadcrumb prefab
				b.name = "breadcrumb_"+ name+"_"+breadCrumbIndex;//makes sure each enemy follows their own breadcumb and not that of other enemy. 
			}
			if (Physics.Raycast (Vector3(transform.position.x,transform.position.y+.5, transform.position.z),transform.forward, hit, 40) 
			&& hit.collider.gameObject.tag != "Player")//If enemy no longer sees the player
			{
				anim.SetBool("canSeePlayerWhileWalking",false); //sets the canSeePlayerWhileWalking to false
			}
		break;
		
		//State where player has shot the enemy and detects the damage the enemy has taken. 
		case hitState:
			if (anim.GetBool("hit")) 
			{
				damage++;//increase damage if enemy is hit
			}
			if (damage >=5)//if damage reaches 5 
			{
			 	anim.SetBool("die",true);//enemy dies when die is set to true. 
			} 
			anim.SetBool("hit",false);
		break;
		
		//State for enemy attacking player and detects where player takes damage
		case attackState:
			if (!hasAttacked)
			{
				applyDamage();//decrement health of the player at the amount of 5 which has decreaseHealth function within its code blocks
				hasAttacked = true;
			}
			anim.SetBool("withinReach",false);
		break;
		
		case deadState:
			
			Destroy(gameObject, 3.0);//Destroys the enemy after 3 seconds when it is dead
			break;
		
		case patrolState:
			anim.SetBool("backToSquare1", false);
			transform.LookAt(GameObject.Find("wayPoint"+wayPointIndex).transform);//patrolling enemy looks in direction of next waypoint
			// the line below I am finding the distance between the AI and the next waypoint and then finds the waypoint using the wayPointIndex
			var distanceToWayPoint:float = Vector3.Distance(transform.position, GameObject.Find("wayPoint"+wayPointIndex).transform.position);
			
			if ( distanceToWayPoint< 1.0f)//if the next distance to the waypoint is closer than one meter 
			{
				wayPointIndex++;//then increment to the new waypoint
			}
			if (wayPointIndex > 4)//if wayPointIndex is more than 4
			{
				wayPointIndex = 1;//start back at wayPointIndex 1 
			}
			
			//Same statment as used in the idle state so that the patrolling enemy will see the player while in the patrolling state
			if ((Physics.Raycast (Vector3(transform.position.x, playerTransform.position.y+.5, transform.position.z), transform.forward, hit, 200) 
			&& hit.collider.gameObject.tag == "Player") || distance <10.0f)
			{
				Debug.Log("Patroller sees you!");
				anim.SetBool("walking",true);//sets the walking boolean to true. 
			}
				
		break;
		
		case FollowBreadCrumbsState:
			if (breadCrumbIndex >0)//if any breadcrumbs have been released
			{
				anim.SetBool("backToSquare1", false);
				var breadCrumbToFind: GameObject = GameObject.Find("breadcrumb_"+gameObject.name+"_"+breadCrumbIndex);
				transform.LookAt(breadCrumbToFind.transform);
				var distanceToBreadCrumb:float = Vector3.Distance(gameObject.transform.position, GameObject.Find
				("breadcrumb_"+gameObject.name+"_"+breadCrumbIndex).transform.position);//distance between AI and breadcrumb.
				if ( distanceToBreadCrumb < 1.0f)//if the distance between the AI and the breadcrumb is less than a meter. 
					{
						Destroy(GameObject.Find("breadcrumb_"+name+"_"+breadCrumbIndex));//Destroys it and then enemy walks towards the next breadcrumb.
						breadCrumbIndex--;//decrements the breadCrumbIndex value
					}
			}
			else 
			{
				anim.SetBool("walking",false);// otherwise set walking to false.
				anim.SetBool("backToSquare1",true);// and backToSquare1 to true. 
				
			}
			
			
		break;
		
		case FollowPlayersBreadCrumbsState:
			anim.SetBool("backtoSquare1", false);
			
			if (!detectedPlayersClosestCrumb)//if nearest breadcrumb is not found yet (not true)
			{
				var closest : float = 200.0f;
				var indexOfClosest : int;
				var maxIndex : int = player.GetComponent(playerBreadCrumb).index;//an array that stores all the breadcrumbs made by the player
				
				
				//for loop goes through all the breadcrumbs released by the player and finds the closest. 
				for (var i:int = 0; i < maxIndex; i++)
					{
						var objectToFind : GameObject = GameObject.Find("breadcrumb"+"_player_"+i);
						distance = Vector3.Distance(transform.position,objectToFind.transform.position);
						if (distance < closest)
							{
								indexOfClosest = i; 
								closest = distance;
							}
					}
				playerBreadCrumbsIndex = indexOfClosest;//when the closest breadcrumb is found. 
				detectedPlayersClosestCrumb = true;//set detectedPlayersClosestBreadCrumb to true.
			}
			else
			{	
				transform.LookAt(GameObject.Find("breadcrumb_player_"+playerBreadCrumbsIndex).transform);//AI looks at and follows player breadcrumb.
				distanceToBreadCrumb =Vector3.Distance(gameObject.transform.position,
				GameObject.Find("breadcrumb_player_"+playerBreadCrumbsIndex).transform.position);//storing the distance to the breadcrumb in distanceToBreadCrumb.
				
				if (distanceToBreadCrumb< 3.0f)
				{
					playerBreadCrumbsIndex++;
				}
			}
		break;
		
		default:
		break;
	}
	
	transform.position.y = -0.5;
	transform.rotation.x = 0.0;
	transform.rotation.z = 0.0;
}

//This function takes a boolean newWalkingValue that changes between Idle and WalkForward
function setWalking(newWalkingValue: boolean)
{
	anim.SetBool("walking",newWalkingValue);//uses anim.SetBool to set the value of the parameter "walking". 
}

function applyDamage()
{	
	// calls the decrease health function from healthBar and decreases by 5
	GameObject.Find("healthBar").GetComponent(healthBar).SendMessage("decreaseHealth",5);
	yield WaitForSeconds(3); //standard wait for 3 seconds.
}

//function to only allow type 3 and type 4 to follow the breadcrumbs of they player.

function setCharacterType(canFollow:boolean)
{
	anim = GetComponent("Animator");
	canFollowPlayersCrumbs = canFollow;
	anim.SetBool("canFollowPlayersCrumbs",canFollowPlayersCrumbs);
}


