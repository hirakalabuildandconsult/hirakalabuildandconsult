
document.getElementById("bookingForm")
.addEventListener("submit", function(e){

e.preventDefault();

alert(
"Consultation booking submitted successfully."
);

});

document.getElementById("quoteForm")
.addEventListener("submit", function(e){

e.preventDefault();

alert(
"Your quotation request has been submitted."
);

});

function askAI(){

let question =
document.getElementById("userQuestion").value;

let response =
document.getElementById("aiResponse");

if(question === ""){

response.innerHTML =
"Please enter your question.";

return;

}

response.innerHTML =
"AI Assistant: Thank you for your question regarding " +
question +
". Our engineering team will provide detailed guidance soon.";

}

const newsFeed =
document.getElementById("newsFeed");

const news = [

"New BIM Service launched.",

"Road design consultancy now available.",

"Project portfolio updated.",

"New engineering articles published."

];

let index = 0;

setInterval(() => {

newsFeed.innerHTML =
news[index];

index++;

if(index >= news.length){

index = 0;

}

},3000);

