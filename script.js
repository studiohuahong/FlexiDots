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