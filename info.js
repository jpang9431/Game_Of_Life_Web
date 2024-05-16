const text = ["The dead block will turn into an alive block if there are three alive neighbors. It also has a 1 in 10000 chance to turn into a zombie block randomly.", "The alive blcok will turn into a dead block if there are less then two alive neighbors or if there is more than three alive neighbors. If there are more than one zombie neighbor and the number of zombie neighbors out numbers the number of alive neighbors, the alive block will turn into a zombie."]
document.addEventListener("DOMContentLoaded", function(event){
  let menuItems = document.getElementsByClassName("menuItem");
  for(let i=0; i<menuItems.length; i++){
    menuItems[i].addEventListener("click", function(event){
      let index = parseInt(event.target.id);
      document.getElementById("infoText").innerHTML = text[index];
    })
  }
});