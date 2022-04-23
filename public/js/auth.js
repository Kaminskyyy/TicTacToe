//	Forms
const $mainForm = document.getElementsByClassName('main-form')[0];

//	Input elements
const $username = document.getElementsByClassName('username')[0];
const $email = document.getElementsByClassName('email')[0];
const $password = document.getElementsByClassName('password')[0];
const $confirmPassword = document.getElementsByClassName('confirm-password')[0];

//	Buttons blocks
const $loginButtons = document.getElementsByClassName('login-buttons')[0];
const $signUpButtons = document.getElementsByClassName('sign-up-buttons')[0];

//	Buttons
const $loginButton = document.getElementsByClassName('login-btn')[0];
const $enableRegistrationButton = document.getElementsByClassName('enable-registration-btn')[0];
const $backToLoginButton = document.getElementsByClassName('back-to-login-btn')[0];
const $signUpButton = document.getElementsByClassName('sign-up-btn')[0];

$loginButton.addEventListener('click', async (event) => {
	event.preventDefault();

	const form = new FormData($mainForm);

	//	VALIDATE USER INPUT

	const body = {
		email: form.get('email'),
		password: form.get('password'),
	};

	return;

	try {
		const response = await fetch('/users/`login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) throw new Error(response.status);

		const body = await response.json();

		// REDIRECT TO LOBBY
		//
	} catch (error) {
		console.log('Error: ' + error);
	}
});

$signUpButton.addEventListener('click', async (event) => {
	event.preventDefault();

	const form = new FormData($mainForm);

	// VALIDATE USER INPUT

	const body = {
		username: form.get('username'),
		email: form.get('email'),
		password: form.get('password'),
	};

	console.log(body);

	return;

	try {
		const response = await fetch('/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) throw new Error(response.status);

		const body = await response.json();

		// REDIRECT TO LOBBY
	} catch (error) {
		console.log('Error: ' + error);
	}
});

$enableRegistrationButton.addEventListener('click', (event) => {
	event.preventDefault();

	registrationMode(true);
});

$backToLoginButton.addEventListener('click', (event) => {
	event.preventDefault();

	registrationMode(false);
});

function registrationMode(state) {
	const method = state ? 'remove' : 'add';

	$username.classList[method]('hide');
	$confirmPassword.classList[method]('hide');
	$signUpButtons.classList[method]('hide');

	if (state) $loginButtons.classList.add('hide');
	else $loginButtons.classList.remove('hide');
}
