

export let constructResponseJson = (statusCode: number, status: string, responseData: any) => {
  	return ({
  		"payload": {
  			"status" : status,
  			"code" : statusCode,
	    	"type" : "application/JSON",
	    	"body" : responseData
		}
	})
};


// "payload": {
//     "responseType" : "application/JSON",
//     "responseCode" : "200 | 400 | 401 | 500", 
//     "status" : "FAIL | SUCCESS | ERROR ",
//     "responseBody" : {
//     }
// }