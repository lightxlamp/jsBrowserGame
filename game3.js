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


  function createNewHero(name) {
      var obj = {};
      obj.name = name;
      obj.height = 100;
      obj.width = 100; 
      obj.startPositionX = canvas.width / 2 - this.width;
      obj.startPositionY = canvas.height / 2 - this.height / 2;
      obj.positionX = this.startPositionX;
      obj.positionY = this.startPositionY;
      obj.heroImage = new Image(this.width, this.height); 
      //hero.onload = drawHero; // Draw when image has loaded
      obj.heroImage.src  = 'archer.jpg';

      obj.greeting = function() {
        alert('Hi! I\'m ' + this.name + '.' + ' width = ' + this.width);
      };
  return obj;
}

var heroStas = createNewHero('StasTest');
console.log(heroStas.heroImage);

window.onload = function() {
  document.addEventListener('keydown', changeDirection);
  setInterval(loop(heroStas), 1000/2); // 60 FPS
}

 function drawHero(hero) {
	ctx.drawImage(heroImage, hero.positionX, hero.positionY, hero.width, hero.height);
}

function moveHero(direction)
{
	if(direction == "left")
	{
		if(heroPositionX - heroWidth >= 0)
		{
			fillGameFieldWithBackgroundColor();
			//ctx.drawImage(hero, heroPositionX - heroWidth, heroPositionY, heroWidth, heroHeight);
			//heroPositionX = heroPositionX - heroWidth;
			//ctx.clearRect(0,0,100,100); // erase the rectangle
			ctx.save();
			ctx.scale(-1, 1);
			//ctx.translate(-100, 0);
			ctx.drawImage(hero, -heroPositionX, heroPositionY, heroWidth, heroHeight);
			heroPositionX = heroPositionX - heroWidth;
			ctx.restore();
		}
	}
	
	if(direction == "right")
	{
		if(heroPositionX + heroWidth < canvas.width)
		{
			fillGameFieldWithBackgroundColor();
			ctx.drawImage(hero, heroPositionX + heroWidth, heroPositionY, heroWidth, heroHeight);
			heroPositionX = heroPositionX + heroWidth;
		}
	}
	
	if(direction == "up")
	{
		if(heroPositionY - heroHeight >= 0)
		{	
			fillGameFieldWithBackgroundColor();
			ctx.drawImage(hero, heroPositionX, heroPositionY - heroHeight, heroWidth, heroHeight);
			heroPositionY = heroPositionY - heroHeight;
		}
	}
	
	if(direction == "down")
	{
		if(heroPositionY + heroHeight < canvas.height)
		{
			fillGameFieldWithBackgroundColor();
			ctx.drawImage(hero, heroPositionX, heroPositionY + heroHeight, heroWidth, heroHeight);
			heroPositionY = heroPositionY + heroHeight;
		}
	}
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
	   drawHero(hero);
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
		moveHero("left");
	}

 if( evt.keyCode == 38) // up arrow
    {
		moveHero("up");
	}

 if( evt.keyCode == 39) // right arrow
    {
		moveHero("right");
	}

  if( evt.keyCode == 40) // down arrow
    {
		moveHero("down");
	}
	
  cooldown = true;
  setTimeout(function() {cooldown = false;}, 100);
}