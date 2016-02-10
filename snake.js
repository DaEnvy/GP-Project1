$(document).ready(function(){
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var mainMusic = document.getElementById("main_music");
  
    canvas.width = 480;
	canvas.height = 480;
    var w = canvas.width;
    var h = canvas.height;
  
    var background = new Image();
	background.src = "http://i.imgur.com/pWSOlSO.png?1";
    ctx.drawImage(background,0,0);
  
	var normalDirection;
    var poisonDirection;
	var apples;
	var score;
    var score2;
    var spawn;
	
	
	var normalSnake; 
	var poisonSnake;
  	init();
  
	function init()
	{
        mainMusic.play();
		normalDirection = "right"; 
        poisonDirection = 0;
        spawn = false;
		spawnSnakes();
		apple();
		score = 0;
        score2 = 0;
		
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(update, 60);
	}
	
	function spawnSnakes()
	{
		normalSnake = []; 
        poisonSnake = [];
		for(var i = 4; i>=0; i--)
		{

			normalSnake.push({x: i+15, y:23});
		}
        for(i = 10; i >= 0; i--)
        {
          poisonSnake.push({x: i+5, y:23});
        }
	}
	
	//This is the function for creating an apple
	function apple()
	{
		apples = {
			x: Math.round(Math.random()*(w-15)/15), 
			y: Math.round(Math.random()*(h-15)/15), 
            z: Math.floor((Math.random() * 10) +1)
		};
	}
	
  
  //Method responsible for the animation of the original snake
	function normalSnakePaint(x, y)
	{
		ctx.fillStyle = "black";
		ctx.fillRect(x*15, y*15, 15, 15);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*15, y*15, 15, 15);   
	}
  
    //Method responsible for animating the second poison snake
    function poisonSnakePaint(x,y)
    {
        ctx.fillStyle = "purple";
		ctx.fillRect(x*15, y*15, 15, 15);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*15, y*15, 15, 15);
    }
  
    //Function responsible for painting the apples
    //It randomly determines if the color is red or black,
    //And once the second snake is present, it alternates
    //Between purple and black. 
    function paintApple(x,y)
   {
     if(apples.z > 5)
     {
       if(score > 5)
       {
       		ctx.fillStyle = "purple";
			ctx.fillRect(x*15, y*15, 15, 15);
			ctx.strokeStyle = "white";
			ctx.strokeRect(x*15, y*15, 15, 15);
       } 
       else
       {
         	ctx.fillStyle = "red";
			ctx.fillRect(x*15, y*15, 15, 15);
			ctx.strokeStyle = "white";
			ctx.strokeRect(x*15, y*15, 15, 15);
       }
     }
     else
     {
    	ctx.fillStyle = "black";
		ctx.fillRect(x*15, y*15, 15, 15);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*15, y*15, 15, 15);
     }  
   }
  
  
  
  //Main 'engine' for the game. It handles the logic
  //Behind the collisions and spawns.
	function update()
	{
		ctx.drawImage(background,0,0);
        ctx.lineWidth=10;
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		ctx.lineWidth=1;
		var nextX_normal = normalSnake[0].x;
		var nextY_normal = normalSnake[0].y;

      
      //Here, we determine the direction of each snake, and increment 
      //It's position accordingly, so that it moves in an appropriate motion
      if(normalDirection == "right")
      {
        nextX_normal++;
      }  
      else if(normalDirection == "left")
      {
        nextX_normal--;
      }  
      else if(normalDirection == "up")
      { 
        nextY_normal--;
      }
      else if(normalDirection == "down")
      { 
         nextY_normal++;
      }
      
        var nextX_poison = poisonSnake[0].x;
        var nextY_poison = poisonSnake[0].y;
      
      //Same thing as above, but this time for the hostile snake
      if(poisonDirection == "right")
      {
        nextX_poison++;
      }
      else if(poisonDirection == "left")
      { 
        nextX_poison--;
      }
      else if(poisonDirection == "up")
      { 
        nextY_poison--;
      }
      else if(poisonDirection == "down")
      { 
        nextY_poison++;
      }
      
		//COLLISION
        //The nested conditionals check to make sure either snake is within the bounds of the canvas, and that the original snake
        //Does not collide with itself. Allowing the hostile snake more free movement is intentional
		if(nextX_normal == -1 || nextX_normal == w/15 || nextY_normal == -1 || nextY_normal == h/15 || nextX_poison == -1 || nextX_poison == w/15 || nextY_poison == -1 || nextY_poison == h/15 )
		{
			init();
			return;
		}
      	
      //Here is where we check to see if the original snake has collided with
      //Itself or not. This is never checked for the hostile snake.
		for(var i = 0; i < normalSnake.length; i++)
		{
			if(normalSnake[i].x == nextX_normal && normalSnake[i].y == nextY_normal)
            {  
			 init();
            }  
		}
      
      	//Now we check to see if either snake has made contact and 
        //Eaten the apple. The poison snake doesn't spawn until the
        //Original snake's score is at least 6. 
        //If contact is made, the score is updated and a new apple is made.
		if(nextX_normal == apples.x && nextY_normal == apples.y)
		{
			var tail = {x: nextX_normal, y: nextY_normal};
			score++;
          
          	if(score > 5)
            {
            	spawn = true;
              	delete poisonSnake[poisonSnake.length-1];
          	}
			apple();
            var tail2 = poisonSnake.pop();
            tail2.x = nextX_poison; tail2.y = nextY_poison;
		}
      	else if(nextX_poison == apples.x && nextY_poison == apples.y)
      	{
          var tail2 = {x: nextX_poison, y: nextY_poison};
          score2++;
          delete normalSnake[normalSnake.length-1];
          apple();
          
          var tail = normalSnake.pop(); 
			tail.x = nextX_normal; tail.y = nextY_normal;
     	}
		else
		{
			var tail = normalSnake.pop();
			tail.x = nextX_normal; tail.y = nextY_normal;
            var tail2 = poisonSnake.pop();
            tail2.x = nextX_poison; tail2.y = nextY_poison;
		}

		
		normalSnake.unshift(tail); 
		poisonSnake.unshift(tail2);
      
		for(var i = 0; i < normalSnake.length; i++)
		{
			var n = normalSnake[i];
			normalSnakePaint(n.x, n.y);
		}
      	for(i = 0; i < poisonSnake.length; i++)
      	{
          if(spawn == true)
          {
            var p = poisonSnake[i];
        	poisonSnakePaint(p.x, p.y);
          }
      	} 
      
		paintApple(apples.x, apples.y);
        var normalScoreToString = "Score: " + score;
		ctx.fillStyle = "black";
		ctx.fillText(normalScoreToString, w-48, 13);
      
      if(score > 5){
        var poisonScoreToString = "Score: " + score2;
        ctx.fillStyle = "black";
		ctx.fillText(poisonScoreToString, 11, 13);
        
      }
	}
	
	

	$(document).keydown(function(e){
		var key = e.which;
      
        //KEY EVENTS FOR FIRST SNAKE
		if(key == "37" && normalDirection != "right")
        { 
          	normalDirection = "left";
        }
      	else if(key == "38" && normalDirection != "down")
        {
        	normalDirection = "up";
        }
		else if(key == "39" && normalDirection != "left") 
        {  
         	normalDirection = "right";
        }  
        else if(key == "40" && normalDirection != "up")
        {
            normalDirection = "down";
        }
      
      //KEY EVENTS FOR SECOND SNAKE
        else if(key == "65" && poisonDirection != "right") 
        {
          poisonDirection = "left";
        }
        else if(key == "87" && poisonDirection != "down")
        {
          poisonDirection = "up";
        }  
        else if(key == "68" && poisonDirection != "left")
        {
          poisonDirection = "right";
        }  
        else if(key == "83" && poisonDirection != "up") 
        {
          poisonDirection = "down";
        }  

	})
	
	
	
	
	
	
	
})
