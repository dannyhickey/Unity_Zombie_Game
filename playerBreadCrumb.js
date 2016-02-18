#pragma strict
/*
Daniel Hickey 20052264
This script handles the players breadcrumbs
*/

// Using very similar method for players breadcrumbs as I did for enemy
// Please see comments for AI breadcrumbs for explanation 
var breadCrumb:GameObject;
var timeForNextCrumb:float;
public var currentTime:float;
public var breadCrumbs = new Array();
public var index:int;

function Start ()
{
	timeForNextCrumb = Time.time;
	index = 0;
}

function Update ()
{
	if (Time.time > timeForNextCrumb)
	{
		timeForNextCrumb = Time.time+5;
		breadCrumbs[index] = gameObject.transform.position;
		var b:GameObject =
		GameObject.Instantiate(breadCrumb,transform.position,
		transform.rotation);
		b.name = "breadcrumb_player_"+index;
		Destroy(b, 10); //Destroys breadcrumb after ten seconds
		index++;
	}
}