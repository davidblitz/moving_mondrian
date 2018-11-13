function rect_(x, y, w, h) {
  rect(x+5, y+5,  w-10, h-10);
}

var palette; //mondrian inspired palette

var InnerNode = function(val, dim) {
  this.getNodeType = function() {
    return "inner";
  }
  
  this.dim = dim;
  this.val = val;

  this.color1 = 0; //ARE WE REALLY USING THIS?
  this.color2 = 0; //ARE WE REALLY USING THIS?
  this.id = 0; //ARE WE REALLY USING THIS?
  
  this.left = null;
  this.right = null;
  
  this.draw = function() {
    this.left.draw()
    this.right.draw()
  }
}

var LeafRectangle = function(x, y, w, h, c){
  this.getNodeType = function() {
    return "leaf";
  }
  
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.c = c;
  //PVector target = new PVector(random(-1.2*width, 1.2*width + width), random(-1.2*height, 1.2*height + height));
  this.keyPoints = [];
  //this.keyPointIndex = 0; //DO WE NEED THIS?
  
  this.keyPoints.push(createVector(x, y));
  
  this.draw = function() {
    var t = frameCount * 0.005;
    if(t % 1 == 0) var keyPointIndex = (keyPointIndex + 1) % this.keyPoints.length;
    var tt = sin(HALF_PI*(t % 1) - 0.0000*this.y);
    tt = sq(tt);
    
    keyPointIndex = int(t) % this.keyPoints.length;
    var pStart = this.keyPoints[keyPointIndex];
    var pEnd = this.keyPoints[(keyPointIndex + 1) % this.keyPoints.length];
   
    fill(palette[this.c+1]);
    var x = map(tt, 0, 1, pStart.x, pEnd.x);
    var y = map(tt, 0, 1, pStart.y, pEnd.y);
    rect_( x, y, w, h);
  }
}

function shuffleBinaryTree(r, p, x, y, w, h) {
  if(r.getNodeType() === "leaf") {
    r.keyPoints.push(createVector(x, y));
    return r;
  }
 
  if(random(1) < p) {
    let tmp = r.left;
    r.left = r.right;
    r.right = tmp;
    let c = r.color1;
    r.color1 = r.color2;
    r.color2 = c;
    r.val = 1 - r.val;
  }
  
  let x1 = x, y1 = y, w1 = w, h1 = h;
  let x2 = x, y2 = y, w2 = w, h2 = h;
  let dim = r.dim;
  let val = r.val;
  
  if(dim === 0) {
    w1 = w*val;
    w2 = w - w1;
    x2 = x + w1;
  } else {
    h1 = h*val;
    h2 = h - h1;
    y2 = y + h1;
  }
  
  r.left = shuffleBinaryTree(r.left, p, x1, y1, w1, h1);
  r.right = shuffleBinaryTree(r.right, p, x2, y2, w2, h2);
  
  return r;
}

function generateBinaryTree(p, dim, x, y, w, h) {
  var color1 = int(random(palette.length - 1));
  
  if(random(1) < p) {
    dim = (dim + 1) % 2;
    p *= 0.8;
    var val = random(0.25, 0.75);
    var n = new InnerNode(val, dim);
  
    var x1 = x, y1 = y, w1 = w, h1 = h;
    var x2 = x, y2 = y, w2 = w, h2 = h;
  
    if(dim == 0) {
      w1 = w*val;
      w2 = (1-val)*w;
      x2 = x + w1;
    }
    else {
      h1 = h*val;
      h2 = (1-val)*h;
      y2 = y + h1;
    }
    n.left = generateBinaryTree(p, dim, x1, y1, w1, h1);
    n.right = generateBinaryTree(p, dim, x2, y2, w2, h2);
  
    return n;
  } else {
    return new LeafRectangle(x, y, w, h, color1);
  }
}

var root;

function setup() {
  createCanvas(800, 800);
  noStroke();
  palette = [color("#20202a"), color("#ddd001"), color("#dd0101"), color("#0101dd"), color("#f9f9f9")]
  root = generateBinaryTree(1.2, int(random(2)), 0, 0, width, height);
  root = shuffleBinaryTree(root, 0.3, 0, 0, width, height);
  root = shuffleBinaryTree(root, 0.3, 0, 0, width, height);
}

function draw() {
  background(palette[0]);
  root.draw();
}

function mouseClicked() {
  root = generateBinaryTree(1.2, int(random(2)), 0, 0, width, height);
  root = shuffleBinaryTree(root, 0.3, 0, 0, width, height);
  root = shuffleBinaryTree(root, 0.3, 0, 0, width, height);
}
