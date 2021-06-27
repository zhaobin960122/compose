// 模型抽象： [ [a, b, c], d ] a -> b -> c -> d
const handlers = [
  [
    function a(next) {
      console.log("1-1");
      next();
      console.log("1-2");
    },
    function b(next) {
      console.log("2-1");
      next();
      console.log("2-2");
    },
    function c(next) {
      console.log("3-1");
      next();
      console.log("3-2");
    },
  ],
  [
    function d(next) {
      console.log("4-1");
      next();
      console.log("4-2");
    },
  ],
];

function innerProcess(innerHandlers, out) {
  let idx = 0;

  function next() {
    if (idx >= innerHandlers.length) return out(); // 执行外部的函数，将使用权返还 c -> d
    innerHandlers[idx++](next); // 执行a() i = 1; 执行b() i = 2; 执行c() i = 3;
  }

  next(); // idx = 0
}

function outerProcess(outerHandlers) {
  let idx = 0;

  function next() {
    if (idx >= outerHandlers.length) return;
    innerProcess(outerHandlers[idx++], next); // 传入next
  }

  next();
}

outerProcess(handlers);
