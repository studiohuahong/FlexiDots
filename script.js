document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

//random hover color
$(document).ready(function()
{
    $("a").hover(function(e)
    {
        var randomClass = getRandomClass();
        $(e.target).attr("class", randomClass);
    });
});

function getRandomClass()
{
    //Store available css classes
    var classes = new Array("green", "purple", "teal", "orange", "blue");
    var randomNumber = Math.floor(Math.random()*classes.length);
    return classes[randomNumber];
}

let mouseCursor = document.querySelector('.custom-cursor')
window.addEventListener("mousemove", cursor)

function cursor(e) {
    // mouseCursor.style.left = `${e.clientX}px`;
    // mouseCursor.style.top = `${e.clientY}px`;
    mouseCursor.style.left = e.pageX + "px";
    mouseCursor.style.top = e.pageY + "px";
}

const links = document.querySelectorAll('a');

links.forEach((link) => {
    link.addEventListener('mouseover', () => {
        mouseCursor.style.backgroundColor = 'white';
    });

    link.addEventListener('mouseout', () => {
        mouseCursor.style.backgroundColor = 'black';
    });
});