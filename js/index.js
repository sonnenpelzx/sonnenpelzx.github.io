var currentDate = new Date().toJSON().slice(0, 10);
currentDate = JSON.stringify(currentDate);
var meals = [];
var goal = {
	calories: 0,
	carbs: 0,
	fat: 0,
	protein: 0,
};

function getValues(){
	if(window.localStorage.getItem("currentDate") != currentDate){
		window.localStorage.setItem("currentDate", currentDate);

	}
	else{
		mealsString = window.localStorage.getItem("meals").split('-');
		mealsString.forEach(function(n) { meals.push(JSON.parse(n));});
		goal = JSON.parse(window.localStorage.getItem("goal"));
	}
}
function removeall(){
	window.localStorage.clear();
}
function showGoalForm(){
	const goalForm = document.querySelector('#goal');
	const mealForm = document.querySelector('#meal');
	goalForm.style.visibility = "visible"
	mealForm.style.visibility = "hidden"
}
function showMealForm(){
	const goalForm = document.querySelector('#goal');
	const mealForm = document.querySelector('#meal');
	goalForm.style.visibility = "hidden"
	mealForm.style.visibility = "visible"
}
function showGoal(){
	const caloriesShow = document.querySelector('#caloriesGoalShow');
	const fatShow = document.querySelector('#fatGoalShow');
	const carbsShow = document.querySelector('#carbsGoalShow');
	const proteinShow = document.querySelector('#proteinGoalShow');
	var calories = parseFloat(goal['calories'])
	var carbs = parseFloat(goal['carbs'])
	var fat = parseFloat(goal['fat'])
	var protein = parseFloat(goal['protein'])
	caloriesShow.innerHTML = calories;
	fatShow.innerHTML = fat;
	carbsShow.innerHTML = carbs;
	proteinShow.innerHTML = protein;
}
function showEaten(){
	const caloriesShow = document.querySelector('#caloriesMealShow');
	const fatShow = document.querySelector('#fatMealShow');
	const carbsShow = document.querySelector('#carbsMealShow');
	const proteinShow = document.querySelector('#proteinMealShow');
	const goalReached = "green"
	const goalNotReached = "red"
	var calories = 0;
	var carbs = 0;
	var fat = 0;
	var protein = 0;
	meals.forEach(function(n){
		calories += parseFloat(n['calories'])
		carbs += parseFloat(n['carbs'])
		fat += parseFloat(n['fat'])
		protein += parseFloat(n['protein'])
	})
	caloriesShow.innerHTML = calories.toFixed(2);
	fatShow.innerHTML = fat.toFixed(2);
	carbsShow.innerHTML = carbs.toFixed(2);
	proteinShow.innerHTML = protein.toFixed(2);
	if(inRange('calories', calories))
		caloriesShow.style.color = goalReached
	else
		caloriesShow.style.color = goalNotReached
	if(inRange('carbs', carbs) ) 
		carbsShow.style.color = goalReached
	else 
		carbsShow.style.color = goalNotReached
	if(inRange('fat', fat))
		fatShow.style.color = goalReached
	else 
		fatShow.style.color = goalNotReached
	if(inRange('protein', protein)) 
		proteinShow.style.color = goalReached
	else 
		proteinShow.style.color = goalNotReached
}
function setGoal(){
	let calories = document.querySelector('#caloriesGoal').value;
	let fat = document.querySelector('#fatGoal').value;
	let protein = document.querySelector('#proteinGoal').value;
	let carbs = document.querySelector('#carbsGoal').value;
	if(calories != '' && carbs != '' && fat!='' && protein!=''){
		goal ={
			calories: calories,
			fat: fat,
			protein: protein,
			carbs: carbs,
		}
		window.localStorage.setItem("goal", JSON.stringify(goal));
	}
	checkGoal();
	showGoal();
	showEaten();
}
function addMeal(){
	let gramms= document.querySelector('#grammsMeal').value;
	let calories= document.querySelector('#caloriesMeal').value;
	let fat = document.querySelector('#fatMeal').value;
	let protein= document.querySelector('#proteinMeal').value;
	let carbs= document.querySelector('#carbsMeal').value;
	if(calories != '' && carbs != ''&&fat!=''&&protein!=''&&gramms != ''){
		if(calories >= 0 && carbs >= 0 && fat >= 0 && protein >= 0 && gramms >=0){
			calories *= gramms / 100 
			fat *= gramms / 100 
			protein *= gramms / 100 
			carbs *= gramms / 100 
			let meal ={
				calories: calories,
				fat: fat,
				protein: protein,
				carbs: carbs,
			}
			meals.push(meal)
			var mealsString = [];
			meals.forEach(function(n){
				mealsString.push(JSON.stringify(n))
			})
			window.localStorage.setItem("meals", mealsString.join('-'))
		}
	}
	checkGoal();
	showGoal();
	showEaten();
}
function delMeal(){
	meals.pop();
	var mealsString = [];
	meals.forEach(function(n){
		mealsString.push(JSON.stringify(n))
	})
	window.localStorage.setItem("meals", mealsString.join('-'))
	checkGoal();
	showGoal();
	showEaten();
}
function inRange(type, number){
	let value = goal[type];
	return (value * 1.05 > number && value * 0.95 < number)
}
function checkGoal(){
	const show = document.querySelector('#show');
	var calories = 0;
	var carbs = 0;
	var fat = 0;
	var protein = 0;
	meals.forEach(function(n){
		calories += parseInt(n['calories'])
		carbs += parseInt(n['carbs'])
		fat += parseInt(n['fat'])
		protein += parseInt(n['protein'])
	})
	if(inRange('calories', calories) && inRange('carbs', carbs) && inRange('fat', fat) && inRange('protein', protein)) 
	{
		show.innerHTML = "You have reached the goal";
	}
	else{
		show.innerHTML = "you haven't reached the goal"
	}
}
const submitGoal = document.querySelector('#submitGoal');
const submitMeal = document.querySelector('#submitMeal');
const showGoalButton = document.querySelector('#setGoal');
const showMealButton = document.querySelector('#addMeal');
const delMealButton = document.querySelector('#delMeal');
submitGoal.addEventListener("click", function(){setGoal()});
submitMeal.addEventListener("click", function(){addMeal()});
showGoalButton.addEventListener("click", function(){showGoalForm()});
showMealButton.addEventListener("click", function(){showMealForm()});
delMealButton.addEventListener("click", function(){delMeal()});

getValues()
if(goal == null){
	showGoalForm()
}
else{
	showMealForm()
	checkGoal();
	showGoal();
	showEaten();
}

