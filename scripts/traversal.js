var htmlString = '';

function accumulate(string) {
  htmlString += string;
}

function openTag(node) {
  accumulate('<' + node.nodeName + '>');
}

function closeTag(node) {
  accumulate('</' + node.nodeName + '>');
}


function printHTML(node) {
  var child = null;

  if (node.nodeName === '#text') {
    accumulate(node.textContent);
    return;
  }
  openTag(node);
  for (var i = 0; i < node.childNodes.length; i++) {
    child = node.childNodes[i];
    printHTML(child);
  }
  closeTag(node);
}

window.onload = function() {
  console.log("The window.onload function got called\n");
  var body = document.getElementsByTagName('body')[0];
  printHTML(body);
  console.log("the html is:\n", htmlString);
  htmlString = '';
  console.log("The html from an iterative method is:\n");
  var traversal = new Traversal({
    pre: function(node) {
      if (node.nodeName === '#text') {
        accumulate(node.textContent);
      } else {
        openTag(node);
      }
    },
    post: function(node) {
      if (node.nodeName === '#text') {
        
        // Do nothing
      } else {
        closeTag(node);
      }
    }
  });
  traversal.traverse(body);
  console.log(htmlString);
  console.log('AAAaaaaannnddd, we\'re done');
}

function Frame(options) {
  this.node = options.node;
  this.state = options.state || 'pre';
}


function Traversal(options) {
  this.pre = options.pre;
  this.post = options.post;
  this.stack = [];
}

Traversal.prototype.traverse = function(node) {
  var currentFrame = new Frame({
    node: node
  });

  this.stack.push(currentFrame);
  while (this.stack.length) {
    currentFrame = this.stack.pop();
    this.handleFrame(currentFrame);
  }
};

Traversal.prototype.handleFrame = function(frame) {
  if (frame.state === 'pre') {
    this.pre(frame.node);
    frame.state = 'in';
    this.stack.push(frame);
  } else if (frame.state === 'in') {
    frame.state = 'post';
    this.stack.push(frame);
    this.pushChildren(frame);
  } else { // The frame is in 'post' state.
    this.post(frame.node);
  }
};

Traversal.prototype.pushChildren = function(frame) {
  var childNode = null;
  var childFrame = null;
  var i = frame.node.childNodes.length - 1;

  while (i >= 0) {
    childNode = frame.node.childNodes[i];
    childFrame = new Frame({
      node: childNode
    });
    this.stack.push(childFrame);
    i -= 1;
  }
};
