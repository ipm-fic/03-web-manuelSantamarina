const ip = "localhost:8080";

function fetchFacilities() {
	const url = 'http://'+ip+'/api/rest/facilities';
	const request = {
		headers:{
			"x-hasura-admin-secret": "myadminsecretkey"
		},
		method: "GET"
	};

	fetch(url, request)
	.then(data=>{return data.json()})
	.then(res=>{console.log(res)})
	.then(error=>console.log(error));
}

function fetchUserData(name, surname) {
	const url = 'http://'+ip+'/api/rest/user?name='+name+'&surname='+surname;
	const request = {
		headers:{
			"x-hasura-admin-secret": "myadminsecretkey"
		},
		method: "GET"
	};

	fetch(url, request)
	.then(data=>{return data.json()})
	.then(res=>{console.log(res)})
	.then(error=>console.log(error));
}


function fetchUserDataById(userId) {
	if(userId == null)
		return;
	const url = 'http://'+ip+'/api/rest/users/'+userId;
	const request = {
		headers:{
			"x-hasura-admin-secret": "myadminsecretkey"
		},
		method: "GET"
	};

	fetch(url, request)
	.then(data=>{return data.json()})
	.then(res=>{console.log(res)})
	.then(error=>console.log(error));
}

function addUser(username, password, name, surname, phone, email, is_vaccinated) {
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

	fetch(url, request)
	.then(data=>{return data.json()})
	.then(res=>{console.log(res)})
	.then(error=>console.log(error));
}

function fetchAccess(startdate, enddate) {
	const url = 'http://'+ip+'/api/rest/facilities';
	const data = {
		"startdate": startdate,
		"enddate": enddate
	};

	const request = {
		headers:{
			"Content-type" : "application/json; charset=UTF-8",
			"x-hasura-admin-secret": "myadminsecretkey"
		},
		body: JSON.stringify(data),
		method: "POST"
	};

	fetch(url, request)
	.then(data=>{return data.json()})
	.then(res=>{console.log(res)})
	.then(error=>console.log(error));
}