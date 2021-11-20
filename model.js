const ip = "localhost:8080";

async function fetchUsers() { 
    const url = 'http://' + ip + '/api/rest/users';
    const request = {
        headers: {
            "x-hasura-admin-secret": "myadminsecretkey"
        },
        method: "GET"
    };

	try {
		
		let response = await fetch(url, request);

		if(response.status != 200)
			return {"error": "Request failed!"}; 

		let json_response = await response.json();
		return json_response;

	}catch(e) {
		return {"error": e.message};
	}
}

async function loadUserData(userId) {
	if(userId == null)
		return;

	const url = 'http://'+ip+'/api/rest/users/'+userId;
	const request = {
		headers:{
			"x-hasura-admin-secret": "myadminsecretkey"
		},
		method: "GET"
	};

	try {
		
		let response = await fetch(url, request);

		if(response.status != 200)
			return {"error": "Request failed!"}; 

		let json_response = await response.json();
		return json_response;

	}catch(e) {
		return {"error": e.message};
	}
}

async function login(username, password) {
	const url = 'http://' + ip + '/api/rest/login?username=' + username + '&password=' + password;
	if (username == null && password == null)
        return;

	const request = {
        headers: {
            "Content-type": "application/json",
            "x-hasura-admin-secret": "myadminsecretkey"
        },
        method: "POST"
    };

	try {
		
		let response = await fetch(url, request);

		if(response.status != 200)
			return {"error": "Request failed!"}; 

		let json_response = await response.json();
		return json_response;

	}catch(e) {
		return {"error": e.message};
	}
}

async function loadUserAccess(userId, offset, limit) {
	const url = 'http://' + ip + '/api/rest/user_access_log/'+userId+'?offset='+offset+'&limit='+limit;
	const request = {
		headers:{
			"x-hasura-admin-secret": "myadminsecretkey"
		},
		method: "GET"
	};

	try {
		
		let response = await fetch(url, request);

		if(response.status != 200)
			return {"error": "Request failed!"}; 

		let json_response = await response.json();
		return json_response;

	}catch(e) {
		return {"error": e.message};
	}
}



async function addUser(username, password, name, surname, phone, email, is_vaccinated) {
	const url = 'http://'+ip+'/api/rest/user';
	if(!(username != null && password != null && name != null && surname != null && phone != null && email != null && is_vaccinated))
		return;

	const data = {
		"username": username,
		"password": password,
		"name": name,
		"surname": surname,
		"phone": phone,
		"email": email,
		"is_vaccinated": is_vaccinated
	};

	const request = {
		headers:{
			"Content-type" : "application/json",
			"x-hasura-admin-secret": "myadminsecretkey"
		},
		body: JSON.stringify(data),
		method: "POST"
	};

	try {
		
		let response = await fetch(url, request);

		if(response.status != 200)
			return {"error": "Request failed!"}; 

		let json_response = await response.json();
		return json_response;

	}catch(e) {
		return {"error": e.message};
	}
}