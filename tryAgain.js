#pragma strict



function OnMouseEnter(){
	//change text color
	renderer.material.color=Color.red;
}

function OnMouseExit(){
	//change text color
	renderer.material.color=Color.white;
}

function OnMouseUp()
{
	//load level
	Application.LoadLevel(0);
	
}