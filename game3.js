//Movement left bug fixed 
//'use strict' added
//'use strict'

var
  canvas 			 = document.getElementById('mc'), // canvas
  ctx				 = canvas.getContext('2d'), // 2d context
  gs = fkp			 = false, // game started && first key pressed (initialization states)
  px 				 = ~~(canvas.width) / 2, // player X position
  py 				 = ~~(canvas.height) / 2, // player Y position
  pw = ph			 = 20, // player size
  aw = ah			 = 20, // apple size
  cooldown			 = false, // is key in cooldown mode
  score				 = 0; // current score

  const gameField = createMatrix(16, 10);

  function createObstacle()
  {
    var obj = {};
    obj.height = 100;
    obj.width = 100; 
    obj.image = new Image(obj.width, obj.height); 
    obj.image.src  = 'tree.jpg';
    obj.x = 100;
    obj.y = 100;

    console.log(obj.x);
    console.log(obj.y);
    console.log(obj.width);
    console.log(obj.image.src);

    obj.draw = function(){
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    return obj;
  }

  function createNewHero(name) {
      var obj = {};
      obj.name = name;
      obj.height = 100;
      obj.width = 100; 
      obj.startPositionX = canvas.width / 2 - obj.width;
      obj.startPositionY = canvas.height / 2 - obj.height / 2;
      obj.positionX = obj.startPositionX;
      obj.positionY = obj.startPositionY;
      obj.image = new Image(obj.width, obj.height); 
      //hero.onload = drawHero; // Draw when image has loaded
      obj.image.src  = 'archer.jpg';

      obj.greeting = function() {
        alert('Hi! I\'m ' + this.name + '.' + ' width = ' + this.width);
      };

      obj.draw = function(){
        ctx.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
      }

      obj.move = function(direction)
      {
      if(direction == "left")
        {
          if(obj.positionX - obj.width >= 0)
          {
            fillGameFieldWithBackgroundColor();
            //ctx.drawImage(hero, heroPositionX - heroWidth, heroPositionY, heroWidth, heroHeight);
            //heroPositionX = heroPositionX - heroWidth;
            //ctx.clearRect(0,0,100,100); // erase the rectangle
            ctx.save();
            ctx.scale(-1, 1);
            //ctx.translate(-100, 0);
            ctx.drawImage(this.image, -this.positionX, this.positionY, this.width, this.height);
            this.positionX -= this.width;
            ctx.restore();
          }
        }

        if(direction == "up")
        {
          if(obj.positionY - obj.height >= 0)
          { 
            fillGameFieldWithBackgroundColor();
            ctx.drawImage(this.image, this.positionX, this.positionY - this.height, this.width, this.height);
            this.positionY -= this.height;
          }
        }

        if(direction == "right")
        {
          if(obj.positionX + obj.width < canvas.width)
          {
            fillGameFieldWithBackgroundColor(); 
            ctx.drawImage(this.image, this.positionX + this.width, this.positionY, this.width, this.height);
            this.positionX += this.width;
          }
        }

        if(direction == "down")
        {
          if(this.positionY + this.height < canvas.height)
          {
            fillGameFieldWithBackgroundColor();
            ctx.drawImage(this.image, this.positionX, this.positionY + this.height, this.width, this.height);
            this.positionY += this.height;
          }
        }
      }
  return obj;
}

var heroStas = createNewHero('StasTest');
var obstacle = createObstacle();

window.onload = function() {
  document.addEventListener('keydown', changeDirection);
  setInterval(loop(heroStas), 1000/2); // 60 FPS
} 

function fillGameFieldWithBackgroundColor()
{
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
  
  
// game main loop
function loop(hero)
{
  // logic
  if(hero.positionX == hero.startPositionX && hero.positionY == hero.startPositionY) 
  {
     hero.draw();
     obstacle.draw();
  }
  
  // teleports
  if( px > canvas.width )
    {px = 0;}

  if( px + pw < 0 )
    {px = canvas.width;}

  if( py + ph < 0 )
    {py = canvas.height;}

  if( py > canvas.height )
    {py = 0;}

  // paint apples
  /*for( var a = 0; a < apples.length; a++ )
  {
    ctx.fillStyle = apples[a].color;
    ctx.fillRect(apples[a].x, apples[a].y, aw, ah);
  }

  // check for snake head collisions with apples
  for( var a = 0; a < apples.length; a++ )
  {
    if(
      px < (apples[a].x + pw)
      && px + pw > apples[a].x
      && py < (apples[a].y + ph)
      && py + ph > apples[a].y
    )
    {
      // got collision with apple
      apples.splice(a, 1); // remove this apple from the apples list
      tail += 10; // add tail length
      speed += .1; // add some speed
      spawnApple(); // spawn another apple(-s)
      break;
    }
  }*/
}

// apples spawner
function spawnApple()
{
  var
    newApple = {
      x: ~~(Math.random() * canvas.width),
      y: ~~(Math.random() * canvas.height),
      color: 'red'
    };

  // forbid to spawn near the edges
  if(
    (newApple.x < aw || newApple.x > canv.width - aw)
    ||
    (newApple.y < ah || newApple.y > canv.height - ah)
  )
  {
    spawnApple();
    return;
  }

  // check for collisions with tail element, so no apple will be spawned in it
  for( var i = 0; i < tail.length; i++ )
  {
    if(
      newApple.x < (trail[i].x + pw)
      && newApple.x + aw > trail[i].x
      && newApple.y < (trail[i].y + ph)
      && newApple.y + ah > trail[i].y
    )
    {
      // got collision
      spawnApple();
      return;
    }
  }

  apples.push(newApple);

  if( apples.length < 3 && ~~(Math.random() * 1000) > 700 )
  {
    // 30% chance to spawn one more apple
    spawnApple();
  }
}

// random color generator (for debugging purpose or just 4fun)
function rc()
{
  return '#' + ((~~(Math.random() * 255)).toString(16)) + ((~~(Math.random() * 255)).toString(16)) + ((~~(Math.random() * 255)).toString(16));
}

// velocity changer (controls)
function changeDirection(evt)
{
  if( !fkp && [37,38,39,40].indexOf(evt.keyCode) > -1 )
  {
    setTimeout(function() {gs = true;}, 1000);
    fkp = true;
    //spawnApple();
  }

  if( cooldown )
    {return false;}

  /*
    4 directional movement.
   */
  if( evt.keyCode == 37) // left arrow
  {
		console.log("right key pressed");
    heroStas.move("left");
	}

 if( evt.keyCode == 38) // up arrow
  {
		console.log("up key pressed");
    heroStas.move("up");
	}

 if( evt.keyCode == 39) // right arrow
  {
    console.log("right key pressed");
		heroStas.move("right");
	}

  if( evt.keyCode == 40) // down arrow
  {
    console.log("down key pressed");
    heroStas.move("down");
	}
	
  cooldown = true;
  setTimeout(function() {cooldown = false;}, 100);
}