const text = ["The dead block will turn into an alive block if there are three alive neighbors. It also has a 1 in 10000 chance to turn into a zombie block randomly.", 
"The alive blcok will turn into a dead block if there are less then two alive neighbors or if there is more than three alive neighbors. If there are more than one zombie neighbor and the number of zombie neighbors out numbers the number of alive neighbors, the alive block will turn into a zombie.",
"The wall block does not interact with any other block and cannot be changed to any other block.",
"The random block will turn into a random block of another type after it is updated.", "The zombie block will turn into a dead block if there are more than one alive block around it and it has more than or an equal amount of alive neighbors than zombie neighbors. The zombie block will move towards an alive block on its update. It will turn into a dead block if next to a hunter block.",
"The hunter block will move towards a zombie block when udpated or kill any zombie nearby it turning the zombie blocks into dead blocks."]

function showText(number){
  document.getElementById("infoText").innerHTML = text[number];
}