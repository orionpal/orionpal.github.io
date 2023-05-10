document.addEventListener("DOMContentLoaded", function () {
    // Your JavaScript code here
    callLambdaFunction();
});

async function callLambdaFunction() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}