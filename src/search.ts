let search_blank_url 	= "http://docs.unity3d.com/ScriptReference/30_search.html";
let search_url 			= search_blank_url+"?q=";

//Open a URL using the npm module "open"
let open = require("open");
export function openURL (s?: string, not_searching?: boolean) {
    if (not_searching) { open(s); } else {    
	   if (!s) { s = search_blank_url; }
	   else { s = search_url+s; }
	   open(s);
    }
	return true;
}

// Slice and Trim
export function prepareInput(input: string, start: number, end: number) {
	//input is the whole line, part of which is selected by the user (defined by star/end) 
		
	if (start >= end) { return ""; }
		
	//Slice to just the selection
	input = input.slice(start,end);
		
	//Trim white space
	input = input.trim();
		
	//Possible future addition:
	//Check right here if valid variable/function name to search?
		
	//Everything looks good by this point, so time to open a web browser!
	return input;
}

export function openUnityDocs (input: string, start: number, end: number) {	
	//Use the node module "open" to open a web browser
	openURL(prepareInput(input,start,end));
}
