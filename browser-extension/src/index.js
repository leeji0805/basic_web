import axios from 'axios';

// form fields
const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api-key');

// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const clearBtn = document.querySelector('.clear-btn');

const calculateColor = async (value) => {
	let co2Scale = [0, 150, 600, 750, 800];
	let colors = ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02'];

	let closestNum = co2Scale.sort((a, b) => {
		return Math.abs(a - value) - Math.abs(b - value);
	})[0];
	//console.log(value + ' is closest to ' + closestNum);
	let num = (element) => element > closestNum;
	let scaleIndex = co2Scale.findIndex(num);

	let closestColor = colors[scaleIndex];
	//console.log(scaleIndex, closestColor);

	chrome.runtime.sendMessage({ action: 'updateIcon', value: { color: closestColor } });
};

const displayCarbonUsageForRegions = async (apiKey, regions) => {
	const regionList = regions.split(',').map(region => region.trim());
	results.innerHTML = ''; // 결과 초기화

	for (const region of regionList) {
		try {
			const response = await axios.get('https://api.co2signal.com/v1/latest', {
				params: { countryCode: region },
				headers: { 'auth-token': apiKey },
			});
			
			const CO2 = Math.floor(response.data.data.carbonIntensity);
			calculateColor(CO2);
			const fossilFuel = response.data.data.fossilFuelPercentage.toFixed(2);

			// 결과 표시
			results.innerHTML += `
		  <div>
			<h3>Region: ${region}</h3>
			<p>Carbon Intensity: ${CO2} grams CO2/kWh</p>
			<p>Fossil Fuel Percentage: ${fossilFuel}%</p>
		  </div>
		`;
		} catch (error) {
			results.innerHTML += `<div><h3>Region: ${region}</h3><p>Error fetching data.</p></div>`;
		}
	}
};

// 폼 제출 핸들러 수정
const handleSubmit = async (e) => {
	e.preventDefault();
	setUpUser(apiKey.value, region.value);
};

const setUpUser = async (apiKey, regions) => {
	localStorage.setItem('apiKey', apiKey);
	localStorage.setItem('regions', regions);
	loading.style.display = 'block';
	errors.textContent = '';
	clearBtn.style.display = 'block';

	// 여러 국가 데이터 요청
	await displayCarbonUsageForRegions(apiKey, regions);
	init();
};

//initial checks
const init = async () => {
	const storedApiKey = localStorage.getItem('apiKey');
	const storedRegions = localStorage.getItem('regions');



	//set icon to be generic green
	chrome.runtime.sendMessage({
		action: 'updateIcon',
		value: {
			color: 'green',
		},
	});

	if (storedApiKey === null || storedRegions === null) {
		form.style.display = 'block';
		results.style.display = 'none';
		loading.style.display = 'none';
		clearBtn.style.display = 'none';
		errors.textContent = '';
	} else {
		form.style.display = 'none';
		await displayCarbonUsageForRegions(storedApiKey, storedRegions);
		loading.style.display = 'none';
		clearBtn.style.display = 'block';
		results.style.display = 'block';
	}
};

const reset = async (e) => {
	e.preventDefault();
	//clear local storage for region only
	localStorage.removeItem('regions');
	init();
};

form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));

//start app
init();