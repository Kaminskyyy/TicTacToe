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

	try {
		const body = validateLoginData(new FormData($mainForm));

		const response = await fetch('/users/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) throw new Error(response.status);

		const responseBody = await response.json();

		console.log(responseBody);

		sessionStorage.setItem('bearer', responseBody.bearer);

		window.location = '/index.html';
	} catch (error) {
		console.log('Error: ' + error);
	}
});

$signUpButton.addEventListener('click', async (event) => {
	event.preventDefault();

	try {
		const body = validateSignUpData(new FormData($mainForm));

		const response = await fetch('/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) throw new Error(response.status);

		const responseBody = await response.json();

		sessionStorage.setItem('bearer', responseBody.bearer);

		console.log(responseBody);

		window.location = '/index.html';
	} catch (error) {
		console.log('Error: ' + error);
	}
});

$enableRegistrationButton.addEventListener('click', (event) => {
	event.preventDefault();

	console.log(sessionStorage.getItem('bearer'));

	registrationMode(true);
});

$backToLoginButton.addEventListener('click', (event) => {
	event.preventDefault();

	console.log(sessionStorage.getItem('bearer'));

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

function validateLoginData(form) {
	const emailOrUsername = form.get('email').trim();
	const password = form.get('password').trim();

	if (emailOrUsername.length < 4) throw new Error('Invalid username or email');
	if (password.length < 6) throw new Error('Invalid password');

	return {
		email_or_username: emailOrUsername,
		password,
	};
}

function validateSignUpData(form) {
	const username = form.get('username').trim();
	const email = form.get('email').trim().toLowerCase();
	const password = form.get('password').trim();
	const confirmPassword = form.get('confirm-password').trim();

	if (!validator.isAlphanumeric(username, 'en-US', { ignore: '-_' })) throw new Error('Username must contain only A-z, 0-9 and _-!');
	if (username.length < 4 || username.length > 20) throw new Error('Min length: 4, max: 20');

	if (!validator.isEmail(email)) throw new Error('Invalid email');

	if (password !== confirmPassword) throw new Error('Passwords must match');

	if (password.length < 6) throw new Error('Password is too short');

	return {
		username,
		email,
		password,
	};
}
