using UnityEngine;
using System.Collections;

public class Mine : MonoBehaviour {
	
	public GameObject explosionPrefab;
	
	
	// Use this for initialization
	void Start ()
	{
		
	}
	
	// Update is called once per frame
	void Update ()
	{
		
	}
	//Setting a trap for the zombie that triggers and explosion
	void OnTriggerEnter(Collider col)
	{
		if(col.tag == "zombie")
		{
			Debug.Log("The explosion has been triggered");
			renderer.enabled = false;
			explosionPrefab.SetActive(true);//activates the explosion
			Invoke("DestroyLandMine", 2); //waits for two seconds 

		
			
		}
		
	}
	
	void DestroyLandMine()
	{
		Destroy(gameObject);//clean up object.
	}
	
}
