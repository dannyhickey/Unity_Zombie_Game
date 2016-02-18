#pragma strict

public var idle_type_2:GameObject;//GameObject variable for the type 2 enemy prefab.
public var patroller_type1:GameObject;//GameObject variable for the type 1 enemy prefab.
var newObject : GameObject;
public var ammunition:GameObject;//GameObject variable for the ammunition prefab. 
public var health : GameObject;//GameObject variable for the health prefab.
private var objectsInstantiated = new Array();//array of objects instantiated.
private var indexOfObjectInstantiated:int;//integer index value for last array for reference to the new objects.
public var breadCrumb:GameObject; 

private var i:int;//declared two integer variables to use in for loop below
private var j:int;
function Start () 
{
	GameObject.Find("GUItext_ammo").guiText.text="";
	GameObject.Find("GUITexture_crosshair").guiTexture.enabled=false;
	GameObject.Find("displayMessage").guiText.text="";
	
	//these objects that are from the array created above. Once these are created the indexOfObjectInstantiated has an increment of 1. 
	//Vector3 values are the cartesian coordinates that these objects will be instantiated at. 
	objectsInstantiated [indexOfObjectInstantiated++] =Instantiate(ammunition, Vector3(0,1,1),Quaternion.Euler(0,0,0));
	objectsInstantiated [indexOfObjectInstantiated++] = Instantiate(ammunition, Vector3(3,1,-7),Quaternion.Euler(0,0,0));
	objectsInstantiated [indexOfObjectInstantiated++] = Instantiate(health, Vector3(3,1,6), Quaternion.identity);

	newObject = Instantiate(ammunition, Vector3(0,1,1),Quaternion.identity);
	newObject = Instantiate(ammunition, Vector3(3,1,-7),Quaternion.identity);
	newObject = Instantiate(health, Vector3(3,1,6),Quaternion.identity);
	

	for (i = 0; i<1; i++)
		{
			for (j = 0; j<2; j++)
			{
				print(i+":"+j);
				var orientation:float = Random.Range(0,5);//random orientation variable stores a random range between 0 and 180. 
				newObject = Instantiate(idle_type_2, Vector3(80+i,0.5,80+j), Quaternion.Euler(0,orientation,0)) as GameObject;
				newObject.GetComponent(AI).breadCrumb =	breadCrumb;//adding breadcrumb prefab to new object. 
				newObject.GetComponent(AI).setCharacterType(false);//setting the type of enemy object
				newObject.name = "zombie_a"+i+j;
				
				newObject = Instantiate(idle_type_2, Vector3(30+i+17,0.5,30+j), Quaternion.Euler(orientation,orientation,0)) as GameObject;
				newObject.GetComponent(AI).breadCrumb = breadCrumb;
				newObject.GetComponent(AI).setCharacterType(Random.Range(0,10) >5);
				newObject.name = "zombie_b"+i+j;
			}
		}
	}

function Update () 
{

}