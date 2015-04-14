//Our arraylists for our numbers and operators
var operators = [];
var priority = [];
var operatorOrder = [];
var numbers = [];
var answer;

//Adding "r" to mean root!
//Regexes for fetching our input
var operatorsRegex = /[-*xX+/^%rR]/g;
var numbersRegex = /[.0-9-*xX+/^%rR]/g;
var priorityRegex = /[-*xX+/^%()rR]/g;


//No longer doing order of operations
//var order = ["^", "*", "/", "+", "-"];

//JQuery to execute funtion once the html is loaded, so we don't get null
//HTML document elements
jQuery(document).ready(function($) {
	var inputBox = document.getElementById("inputBox");
    inputBox.addEventListener("keyup",compute);
    
    var clearButton = document.getElementById("clearButton");
    clearButton.addEventListener("click",clear);
});

//Function to compute answer and display it in text
function compute()
{
	operators = [];
	numbers = [];
	//Get the input from the text box, working
	var input = document.getElementById('inputBox').value;
	
	//parse the string
	parseInput(input);
	
	//Use the parse string to do calculation
	performMath();
	
	//Output answer, working
	//If the input is empty, else show the answer
	if(inputBox.value == null || inputBox.value == "")
	{
		document.getElementById('answer').innerHTML = "";
	}
	else
	{
		document.getElementById('answer').innerHTML = answer;
	}
	
	//Now reset our variables
	//Our arraylists for our numbers and operators
	operators = [];
	priority = [];
	operatorOrder = [];
	numbers = [];
	answer = 0;
	
}

//Function to parse our input into operators and numbers
function parseInput(math)
{
	//parse the numbers and operators
	operators = math.match(operatorsRegex);
	
	//Create our operator priority array
	priority = math.match(priorityRegex);
	
	//Doing a loop to compare how many parntheses left brackets and right brackets
	//surround an operator,
	//and then create an array (operator order) to represent which operator should be performed
	//Left and right paran is to keep count of how many parantheses we see as we go along
	//should be paralel to operator index since we only have added parantheses in this string
	//left brackets - right brackets = priority, since we are reading from left to right
	//left starts priority, and right would be closing it
	if(priority != null)
	{
		var leftParan = 0;
		var rightParan = 0;
		for(i = 0; i < priority.length; i++)
		{
			//If it is not a parantheses, then it is an operator
			if(priority[i] != "(" && priority[i] != ")")
			{
					//Now that we know how many left and right parantheses surround it,
					//we can give it a priority, but it can never be greater than the left
					//parentheses since that starts our experssion
					var finalPri = 0;
					if(leftParan - rightParan < 0)
					{
						finalPri = 0;
					}
					else
					{
						finalPri = leftParan - rightParan;
					}
					
					//Add to our array
					operatorOrder.push(finalPri);
			}
			//Keep count of how many left parantheses we find as 
			//we go along to save processing power
			else if(priority[i] == "(")
			{
				leftParan++;
			}
			else if(priority[i] == ")")
			{
				rightParan++;
			}
		}
	}
	
	//Putting all digits, persiods and opertators into an array
	tempEquation = math.match(numbersRegex);
	//Now we are getting all the floats from the array, by adding all digits and periods to 
	//a string, and then parsing that string for floats
	if(tempEquation != null)
	{
		var tempFloat = "";
		for(i = 0; i < tempEquation.length; i++)
		{
			if(operatorsRegex.test(tempEquation[i]) == false)
			{
				tempFloat = tempFloat + tempEquation[i];
				//Need to check if last digit in string
				if(i == tempEquation.length - 1)
				{
					numbers.push(parseFloat(tempFloat));
				}
			} 
			else if(tempFloat != null && tempFloat != "")
			{
				numbers.push(parseFloat(tempFloat));
				tempFloat = "";
			}
		}
	}
}

function performMath()
{
		//performing math
		//Need to makesure opertators is not null or zero
		if(operators != null && operators.length > 0)
		{
			//perform math
			//make order of operations array
			//loop for order of operations
			console.log("START!!!!!!!!");
				//loop for doing math if those operators exist
				while(operators.length > 0 && numbers.length >= operators.length)
				{
					console.log("Operator order array: " + operatorOrder);
					console.log("Operator array: " + operators);
					console.log("Numbersarray: " + numbers);
					//Find the highest priority operator
					var index = 0;
					for(i = 0; i < operatorOrder.length; i++)
					{
						if(operatorOrder[i] > operatorOrder[index])
						{
							index = i;
						}
					}
					
					console.log("Index: " + index);
					console.log("numbers[index + 1]: " + numbers[index + 1]);
					
					//If we are currently doing the operator in order of operations,
					//and they are more numbers than operators or an equal amount (as it should be)
					if(numbers[index + 1] != null)
					{
						console.log("entered the matrix");
						var tempAnswer;
						//Exponent
						if(operators[index] == "^")
						{
							tempAnswer = Math.pow(numbers[index], numbers[index + 1]);
						}
						//Root
						if(operators[index] == "r" || operators[index] == "R")
						{
							//1 / number for root
							tempAnswer = Math.pow(numbers[index], 1 / numbers[index + 1]);
						}
						//Multiplication
						else if(operators[index] == "*" || operators[index] == "x"
						|| operators[index] == "X")
						{
							console.log(numbers[index] + "," + numbers[index + 1]);
							tempAnswer = numbers[index] * numbers[index + 1];
						}
						//Division
						else if(operators[index] == "/")
						{
							tempAnswer = numbers[index] / numbers[index + 1];
						}
						//Modulo
						else if(operators[index] == "%")
						{
							tempAnswer = numbers[index] % numbers[index + 1];
						}
						//Addition
						else if(operators[index] == "+")
						{
							tempAnswer = numbers[index] + numbers[index + 1];
							console.log(numbers[index] + "," + numbers[index + 1]);
						}
						//Subtraction
						else if(operators[index] == "-")
						{
							tempAnswer = numbers[index] - numbers[index + 1];
						}
						
						console.log("here is temp answer now: " + tempAnswer);
						//Lastly replace the old numbers and remove the operators
						//Using splice method
						numbers.splice(index, 2, tempAnswer);
						operators.splice(index, 1);
						//also need to splice our priority
						operatorOrder.splice(index, 1);
					}
					//failsafe to exit the loop when we have even number of operators
					//or other random errors that would cause an infinite loop
					//and stuff after evaluating an expressions
					else
					{
						if(numbers.length == operators.length)
						{
							operators.pop();
							operatorOrder.pop();
						}
					}
				}
			}
		//The last remaining number is the answer
		if(numbers != null && numbers.length > 0)
		{
			console.log("final answer: " + numbers[0]);
			answer = numbers[0];
		}
		
	}
	
//function to clear the screen through the clear button
function clear()
{
	//Get our variables
	var inputValue = document.getElementById("inputBox");
	var answer = document.getElementById('answer');
	
	
	
	//Fade our our variables
	$(inputValue).add(answer).animate
	({opacity: 0.0}, 500,
	function()
	{
		//Input Box and answer
		document.getElementById('inputBox').value = "";
		document.getElementById('answer').innerHTML = "";
	});
	
	//Fade back in
	$(inputValue).add(answer).animate
	({opacity: 1.0}, 500);
	
	//to prevent going back to the top of the page
	event.preventDefault();
}
