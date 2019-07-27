var p_inc = 0.9;
var p_init = 1.2;
var max_depth = 5;
var border = 15;
function rect_(x, y, w, h, c) {
  fill(palette[0]);
  rect(x, y, w, h);
  fill(c);
  rect(x+border, y+border, w-2*border, h-2*border);
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

var LeafRectangle = function(x, y, w, h, c) {
  this.getNodeType = function() {
    return "leaf";
  }

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.c = c;
  this.target = createVector(random(width), random(height));
  this.keyPoints = [];
  //this.keyPointIndex = 0; //DO WE NEED THIS?

  this.keyPoints.push(createVector(x, y));

  this.draw = function() {
    var t = frameCount * 0.002 - 0.0002*this.y;
    var keyPointIndex;
    if (t % 1 == 0) {
      keyPointIndex = (keyPointIndex + 1) % this.keyPoints.length;
    }
    var tt = sin(HALF_PI*(t % 1));
    //tt = sq(tt);

    keyPointIndex = int(t) % this.keyPoints.length;
    var pStart = this.keyPoints[keyPointIndex];
    var pEnd = this.keyPoints[(keyPointIndex + 1) % this.keyPoints.length];

    fill(palette[this.c+1]);
    var x, y;
    if(tt < 0.5) {
      x = map(tt, 0, 0.5, pStart.x, this.target.x);
      y = map(tt, 0, 0.5, pStart.y, this.target.y);
    }
    else {
      x = map(tt, 0.5, 1, this.target.x, pEnd.x);
      y = map(tt, 0.5, 1, this.target.y, pEnd.y);
    }
    rect_( x, y, w, h, palette[this.c+1]);
  }
}

function shuffleBinaryTree(r, p, x, y, w, h) {
  if (r.getNodeType() == "leaf") {
    r.keyPoints.push(createVector(x, y));
    return r;
  }

  if (random(1) < p) {
    //{
    var tmp = r.left;
    r.left = r.right;
    r.right = tmp;
    var c = r.color1;
    r.color1 = r.color2;
    r.color2 = c;
    r.val = 1 - r.val;
  }

  var x1 = x;
  var y1 = y;
  var w1 = w, h1 = h;
  var x2 = x, y2 = y, w2 = w, h2 = h;
  var dim = r.dim;
  var val = r.val;

  if (dim === 0) {
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
  var color1;
  if(p > p_init*pow(p_inc, 5)) {
    color1 = palette.length - 2;
  }
  else {
    color1 = int(random(palette.length - 1));
  }

  if (random(1) < p) {
    dim = (dim + 1) % 2;

    if (p <= p_init*pow(p_inc, max_depth)) {
      p=0;
    } else {
      p *= p_inc;
    }
    var val = random(0.45, 0.5);
    var n = new InnerNode(val, dim);

    var x1 = x, y1 = y, w1 = w, h1 = h;
    var x2 = x, y2 = y, w2 = w, h2 = h;

    if (dim == 0) {
      w1 = w*val;
      w2 = (1-val)*w;
      x2 = x + w1;
    } else {
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
  var l = min(window.innerWidth, window.innerHeight);
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  palette = [color("#20202a"), color("#ddd001"), color("#dd0101"), color("#0101dd"), color("#f9f9f9"), color("#f9f9f9"), color("#f9f9f9")]
    root = generateBinaryTree(p_init, int(random(2)), (width - l)/2, (height-l)/2, l, l);
  root = shuffleBinaryTree(root, 0.7, (width - l)/2, (height-l)/2, l, l);
  root = shuffleBinaryTree(root, 0.7, (width - l)/2, (height-l)/2, l, l);
}

function draw() {
  background(palette[0]);
  root.draw();
}

function mouseClicked() {
  root = generateBinaryTree(p_init, int(random(2)), (width - l)/2, (height-l)/2, l, l);
  root = shuffleBinaryTree(root, 0.7, (width - l)/2, (height-l)/2, l, l);
  root = shuffleBinaryTree(root, 0.7, (width - l)/2, (height-l)/2, l, l);
}
