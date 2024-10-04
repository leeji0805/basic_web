var myVariable = 'I am a string';
console.log(myVariable); // use ES5
const myVariable = 'I am a string';
console.log(myVariable); // use ES6
let myVariable
myVariable = 'I am a string'
console.log(myVariable) // use ES6


// --------------------------------------------

const PI = 3.14159;
PI = 3.14; // This will give an error

const obj = {a:3};
obj.a = 4; // This will work
obj = {a:5}; // This will give an error
obj = {b:6}; // This will give an error

// --------------------------------------------

// let myString1 = "Hello";
// let myString2 = "World";
// myString1 + myString2 + "!"; //HelloWorld!
// myString1 + " " + myString2 + "!"; //Hello World!
// myString1 + ", " + myString2 + "!"; //Hello, World!

// `${myString1} ${myString2}!` //Hello World!
// `${myString1}, ${myString2}!` //Hello, World!

// let age01 =1;
// let age02 = 2;

// age1==age2; //false
// let age1 = 2;
// let age2 = '0';

// let age = 1;
// let Age = 2; // age에 재할당 하지 않음

// age1 = 0;
// age1 == age2 // true 
// age1 === age2 // false

//--------------------------------------------

// displayGreeting( ()=>{
//     console.log('Hello, World!')});

function displayGreeting(name, sal= 'Hello'){
    const messenge = `${sal}, ${name}!`;
    console.log(messenge);
    
// }
// <!--start-->
// <!DOCTYPE html>
// <html>

// <head>
//   <title>
//     Example
//   </title>
//   <link href='../assets/style.css' rel='stylesheet' type='text/css'>
// </head>

// <body>
//   <header class="site-header">
//     <p class="site-title">Turtle Ipsum</p>
//     <p class="site-subtitle">The World's Premier Turtle Fan Club</p>
//   </header>
//   <img src="http" alt="고양이사진인데 커서 없앰 이건 오류 메세지">
//   <nav class="main-nav">
//     <p class="nav-header">Resources</p>
//     <ul class="nav-list">
//       <li class="nav-item nav-item-bull"><a href="https://www.youtube.com/watch?v=CMNry4PE93Y">"I like turtles"</a></li>
//       <li class="nav-item nav-item-bull"><a href="https://en.wikipedia.org/wiki/Turtle">Basic Turtle Info</a></li>
//       <li class="nav-item nav-item-bull"><a href="https://en.wikipedia.org/wiki/Turtles_(chocolate)">Chocolate
//           Turtles</a></li>
//     </ul>
//   </nav>
//   <main class="main-content">
//     <div>
//       <p class="page-title">Welcome to Turtle Ipsum.
//         <a href="">Click here</a> to learn more.
//       </p>
//       <p class="article-text">
//         Turtle ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
//         magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
//         consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
//         pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
//         laborum
//       </p>
//     </div>
//   </main>
//   <footer class="footer">
//     <div class="footer-section">
//       <span class="button">Sign up for turtle news</span>
//     </div>
//     <div class="footer-section">
//       <p class="nav-header footer-title">
//         Internal Pages
//       </p>
//       <ul class="nav-list">
//         <li class="nav-item nav-item-bull"><a href="../">Index</a></li>
//         <li class="nav-item nav-item-bull"><a href="../semantic">Semantic Example</a></li>
//       </ul>
//     </div>
//     <p class="footer-copyright">&copy; 2016 Instrument</span>
//       </div>
// </body>

// </html> 

// <!--end-->

setTimeout(
    function() { // anonymous function
        console.log('Done!');
    },
    3000 // 3000 milliseconds (3 seconds)
)
setTimeout(
    () => { // anonymous function
        console.log('Done!');
    },
    3000 // 3000 milliseconds (3 seconds)
)