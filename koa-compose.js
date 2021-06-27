const sleep = (n) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, n * 1000);
  });
};

/**
 * @params middleware: Function[]
 * @return function() {
 *   执行第0个，并传入ctx和一个next函数，让第0个自己决定何时执行第1个
 *   return Promise
 * }
 *
 * next
 * @params i 表示执行第几个
 * @return 返回promise
 * 执行第i个中间件，并用promise包裹起来
 * function next (i) {
 *    // 执行当前的fn，将ctx, next传入（绑定下一个i, i + 1）
 *    return promise
 * }
 *
 */
/**
 *
 * 注意的细节
 * middleware必须是数组，其中每一项必须是function
 * 最后一个中间件调用了next，i === length
 * 一个中间件多次调用next
 */
const compose = function (middleware) {
  let index = -1;

  return function (ctx, next) {
    function dispatch(i) {
      if (index >= i) return Promise.reject("next multiples callback");

      index = i;

      let fn = middleware[i];
      if (i === middleware.length) fn = next;

      if (!fn) return Promise.resolve();

      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return dispatch(0);
  };
};

const fn = compose([
  async function (ctx, next) {
    console.log("1-1");
    await next();
    console.log("1-2");
  },
  async function (ctx, next) {
    console.log("2-1");
    await sleep(2);
    ctx.body = "hello";
    await next();
    console.log("2-2");
  },
  function (ctx, next) {
    console.log("3-1");
    next();
    console.log("3-2");
  },
]);

const context = {};

fn(context).then(() => {
  console.log("设置 res.send", context);
});
