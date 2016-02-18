#pragma strict

    var show : boolean = true;
    var target : GameObject;
    function Update ()
    {
    if(Input.GetKeyDown(KeyCode.P))
	    {
	    	if( show == true )
		    {
			    target.camera.enabled = true;
			    show = false;
		    }    		
	    }
	 if(Input.GetKeyUp(KeyCode.P))
	 
	 	if( show != true )
		   {
			    target.camera.enabled = false;
			    show = true;
		    }
    }