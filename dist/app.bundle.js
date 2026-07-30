(() => {
  // node_modules/motion-utils/dist/es/array.mjs
  function addUniqueItem(arr, item) {
    if (arr.indexOf(item) === -1)
      arr.push(item);
  }
  function removeItem(arr, item) {
    const index = arr.indexOf(item);
    if (index > -1)
      arr.splice(index, 1);
  }

  // node_modules/motion-utils/dist/es/clamp.mjs
  var clamp = (min, max, v) => {
    if (v > max)
      return max;
    if (v < min)
      return min;
    return v;
  };

  // node_modules/motion-utils/dist/es/format-error-message.mjs
  function formatErrorMessage(message, errorCode) {
    return errorCode ? `${message}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${errorCode}` : message;
  }

  // node_modules/motion-utils/dist/es/errors.mjs
  var warning = () => {
  };
  var invariant = () => {
  };
  if (typeof process !== "undefined" && true) {
    warning = (check, message, errorCode) => {
      if (!check && typeof console !== "undefined") {
        console.warn(formatErrorMessage(message, errorCode));
      }
    };
    invariant = (check, message, errorCode) => {
      if (!check) {
        throw new Error(formatErrorMessage(message, errorCode));
      }
    };
  }

  // node_modules/motion-utils/dist/es/global-config.mjs
  var MotionGlobalConfig = {};

  // node_modules/motion-utils/dist/es/is-numerical-string.mjs
  var isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);

  // node_modules/motion-utils/dist/es/is-object.mjs
  var isObject = (value) => typeof value === "object" && value !== null;

  // node_modules/motion-utils/dist/es/is-zero-value-string.mjs
  var isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);

  // node_modules/motion-utils/dist/es/memo.mjs
  // @__NO_SIDE_EFFECTS__
  function memo(callback) {
    let result;
    return () => {
      if (result === void 0)
        result = callback();
      return result;
    };
  }

  // node_modules/motion-utils/dist/es/noop.mjs
  var noop = /* @__NO_SIDE_EFFECTS__ */ (any) => any;

  // node_modules/motion-utils/dist/es/pipe.mjs
  var pipe = (...transformers) => transformers.reduce((a, b) => (v) => b(a(v)));

  // node_modules/motion-utils/dist/es/progress.mjs
  var progress = /* @__NO_SIDE_EFFECTS__ */ (from, to, value) => {
    const range = to - from;
    return range ? (value - from) / range : 1;
  };

  // node_modules/motion-utils/dist/es/subscription-manager.mjs
  var SubscriptionManager = class {
    constructor() {
      this.subscriptions = [];
    }
    add(handler) {
      addUniqueItem(this.subscriptions, handler);
      return () => removeItem(this.subscriptions, handler);
    }
    notify(a, b, c) {
      const numSubscriptions = this.subscriptions.length;
      if (!numSubscriptions)
        return;
      if (numSubscriptions === 1) {
        this.subscriptions[0](a, b, c);
      } else {
        for (let i = 0; i < numSubscriptions; i++) {
          const handler = this.subscriptions[i];
          handler && handler(a, b, c);
        }
      }
    }
    getSize() {
      return this.subscriptions.length;
    }
    clear() {
      this.subscriptions.length = 0;
    }
  };

  // node_modules/motion-utils/dist/es/time-conversion.mjs
  var secondsToMilliseconds = /* @__NO_SIDE_EFFECTS__ */ (seconds) => seconds * 1e3;
  var millisecondsToSeconds = /* @__NO_SIDE_EFFECTS__ */ (milliseconds) => milliseconds / 1e3;

  // node_modules/motion-utils/dist/es/velocity-per-second.mjs
  var velocityPerSecond = /* @__NO_SIDE_EFFECTS__ */ (velocity, frameDuration) => frameDuration ? velocity * (1e3 / frameDuration) : 0;

  // node_modules/motion-utils/dist/es/warn-once.mjs
  var warned = /* @__PURE__ */ new Set();
  function warnOnce(condition, message, errorCode) {
    if (condition || warned.has(message))
      return;
    console.warn(formatErrorMessage(message, errorCode));
    warned.add(message);
  }

  // node_modules/motion-utils/dist/es/wrap.mjs
  var wrap = (min, max, v) => {
    const rangeSize = max - min;
    return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
  };

  // node_modules/motion-utils/dist/es/easing/cubic-bezier.mjs
  var calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
  var subdivisionPrecision = 1e-7;
  var subdivisionMaxIterations = 12;
  function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
    let currentX;
    let currentT;
    let i = 0;
    do {
      currentT = lowerBound + (upperBound - lowerBound) / 2;
      currentX = calcBezier(currentT, mX1, mX2) - x;
      if (currentX > 0) {
        upperBound = currentT;
      } else {
        lowerBound = currentT;
      }
    } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
    return currentT;
  }
  // @__NO_SIDE_EFFECTS__
  function cubicBezier(mX1, mY1, mX2, mY2) {
    if (mX1 === mY1 && mX2 === mY2)
      return noop;
    const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
    return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
  }

  // node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
  var mirrorEasing = /* @__NO_SIDE_EFFECTS__ */ (easing) => (p) => p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;

  // node_modules/motion-utils/dist/es/easing/modifiers/reverse.mjs
  var reverseEasing = /* @__NO_SIDE_EFFECTS__ */ (easing) => (p) => 1 - easing(1 - p);

  // node_modules/motion-utils/dist/es/easing/back.mjs
  var backOut = /* @__PURE__ */ cubicBezier(0.33, 1.53, 0.69, 0.99);
  var backIn = /* @__PURE__ */ reverseEasing(backOut);
  var backInOut = /* @__PURE__ */ mirrorEasing(backIn);

  // node_modules/motion-utils/dist/es/easing/anticipate.mjs
  var anticipate = (p) => p >= 1 ? 1 : (p *= 2) < 1 ? 0.5 * backIn(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));

  // node_modules/motion-utils/dist/es/easing/circ.mjs
  var circIn = (p) => 1 - Math.sin(Math.acos(p));
  var circOut = reverseEasing(circIn);
  var circInOut = mirrorEasing(circIn);

  // node_modules/motion-utils/dist/es/easing/ease.mjs
  var easeIn = /* @__PURE__ */ cubicBezier(0.42, 0, 1, 1);
  var easeOut = /* @__PURE__ */ cubicBezier(0, 0, 0.58, 1);
  var easeInOut = /* @__PURE__ */ cubicBezier(0.42, 0, 0.58, 1);

  // node_modules/motion-utils/dist/es/easing/utils/is-easing-array.mjs
  var isEasingArray = /* @__NO_SIDE_EFFECTS__ */ (ease2) => {
    return Array.isArray(ease2) && typeof ease2[0] !== "number";
  };

  // node_modules/motion-utils/dist/es/easing/utils/get-easing-for-segment.mjs
  // @__NO_SIDE_EFFECTS__
  function getEasingForSegment(easing, i) {
    return isEasingArray(easing) ? easing[wrap(0, easing.length, i)] : easing;
  }

  // node_modules/motion-utils/dist/es/easing/utils/is-bezier-definition.mjs
  var isBezierDefinition = /* @__NO_SIDE_EFFECTS__ */ (easing) => Array.isArray(easing) && typeof easing[0] === "number";

  // node_modules/motion-utils/dist/es/easing/utils/map.mjs
  var easingLookup = {
    linear: noop,
    easeIn,
    easeInOut,
    easeOut,
    circIn,
    circInOut,
    circOut,
    backIn,
    backInOut,
    backOut,
    anticipate
  };
  var isValidEasing = (easing) => {
    return typeof easing === "string";
  };
  var easingDefinitionToFunction = (definition) => {
    if (isBezierDefinition(definition)) {
      invariant(definition.length === 4, `Cubic bezier arrays must contain four numerical values.`, "cubic-bezier-length");
      const [x1, y1, x2, y2] = definition;
      return cubicBezier(x1, y1, x2, y2);
    } else if (isValidEasing(definition)) {
      invariant(easingLookup[definition] !== void 0, `Invalid easing type '${definition}'`, "invalid-easing-type");
      return easingLookup[definition];
    }
    return definition;
  };

  // node_modules/motion-dom/dist/es/frameloop/order.mjs
  var stepsOrder = [
    "setup",
    // Compute
    "read",
    // Read
    "resolveKeyframes",
    // Write/Read/Write/Read
    "preUpdate",
    // Compute
    "update",
    // Compute
    "preRender",
    // Compute
    "render",
    // Write
    "postRender"
    // Compute
  ];

  // node_modules/motion-dom/dist/es/frameloop/render-step.mjs
  function createRenderStep(runNextFrame) {
    let thisFrame = /* @__PURE__ */ new Set();
    let nextFrame = /* @__PURE__ */ new Set();
    let isProcessing = false;
    let flushNextFrame = false;
    const toKeepAlive = /* @__PURE__ */ new WeakSet();
    let latestFrameData = {
      delta: 0,
      timestamp: 0,
      isProcessing: false
    };
    function triggerCallback(callback) {
      if (toKeepAlive.has(callback)) {
        step.schedule(callback);
        runNextFrame();
      }
      callback(latestFrameData);
    }
    const step = {
      /**
       * Schedule a process to run on the next frame.
       */
      schedule: (callback, keepAlive = false, immediate = false) => {
        const addToCurrentFrame = immediate && isProcessing;
        const queue = addToCurrentFrame ? thisFrame : nextFrame;
        if (keepAlive)
          toKeepAlive.add(callback);
        queue.add(callback);
        return callback;
      },
      /**
       * Cancel the provided callback from running on the next frame.
       */
      cancel: (callback) => {
        nextFrame.delete(callback);
        toKeepAlive.delete(callback);
      },
      /**
       * Execute all schedule callbacks.
       */
      process: (frameData2) => {
        latestFrameData = frameData2;
        if (isProcessing) {
          flushNextFrame = true;
          return;
        }
        isProcessing = true;
        const prevFrame = thisFrame;
        thisFrame = nextFrame;
        nextFrame = prevFrame;
        thisFrame.forEach(triggerCallback);
        thisFrame.clear();
        isProcessing = false;
        if (flushNextFrame) {
          flushNextFrame = false;
          step.process(frameData2);
        }
      }
    };
    return step;
  }

  // node_modules/motion-dom/dist/es/frameloop/batcher.mjs
  var maxElapsed = 40;
  function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
    let runNextFrame = false;
    let useDefaultElapsed = true;
    const state = {
      delta: 0,
      timestamp: 0,
      isProcessing: false
    };
    const flagRunNextFrame = () => runNextFrame = true;
    const steps = stepsOrder.reduce((acc, key) => {
      acc[key] = createRenderStep(flagRunNextFrame);
      return acc;
    }, {});
    const { setup, read, resolveKeyframes, preUpdate, update, preRender, render, postRender } = steps;
    const processBatch = () => {
      const useManualTiming = MotionGlobalConfig.useManualTiming;
      const timestamp = useManualTiming ? state.timestamp : performance.now();
      runNextFrame = false;
      if (!useManualTiming) {
        state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);
      }
      state.timestamp = timestamp;
      state.isProcessing = true;
      setup.process(state);
      read.process(state);
      resolveKeyframes.process(state);
      preUpdate.process(state);
      update.process(state);
      preRender.process(state);
      render.process(state);
      postRender.process(state);
      state.isProcessing = false;
      if (runNextFrame && allowKeepAlive) {
        useDefaultElapsed = false;
        scheduleNextBatch(processBatch);
      }
    };
    const wake = () => {
      runNextFrame = true;
      useDefaultElapsed = true;
      if (!state.isProcessing) {
        scheduleNextBatch(processBatch);
      }
    };
    const schedule = stepsOrder.reduce((acc, key) => {
      const step = steps[key];
      acc[key] = (process2, keepAlive = false, immediate = false) => {
        if (!runNextFrame)
          wake();
        return step.schedule(process2, keepAlive, immediate);
      };
      return acc;
    }, {});
    const cancel = (process2) => {
      for (let i = 0; i < stepsOrder.length; i++) {
        steps[stepsOrder[i]].cancel(process2);
      }
    };
    return { schedule, cancel, state, steps };
  }

  // node_modules/motion-dom/dist/es/frameloop/frame.mjs
  var { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = /* @__PURE__ */ createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true);

  // node_modules/motion-dom/dist/es/frameloop/sync-time.mjs
  var now;
  function clearTime() {
    now = void 0;
  }
  var time = {
    now: () => {
      if (now === void 0) {
        time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
      }
      return now;
    },
    set: (newTime) => {
      now = newTime;
      queueMicrotask(clearTime);
    }
  };

  // node_modules/motion-dom/dist/es/animation/utils/is-css-variable.mjs
  var checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token);
  var isCSSVariableName = /* @__PURE__ */ checkStringStartsWith("--");
  var startsAsVariableToken = /* @__PURE__ */ checkStringStartsWith("var(--");
  var isCSSVariableToken = (value) => {
    const startsWithToken = startsAsVariableToken(value);
    if (!startsWithToken)
      return false;
    return singleCssVariableRegex.test(value.split("/*")[0].trim());
  };
  var singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
  function containsCSSVariable(value) {
    if (typeof value !== "string")
      return false;
    return value.split("/*")[0].includes("var(--");
  }

  // node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
  var number = {
    test: (v) => typeof v === "number",
    parse: parseFloat,
    transform: (v) => v
  };
  var alpha = {
    ...number,
    transform: (v) => clamp(0, 1, v)
  };
  var scale = {
    ...number,
    default: 1
  };

  // node_modules/motion-dom/dist/es/value/types/utils/sanitize.mjs
  var sanitize = (v) => Math.round(v * 1e5) / 1e5;

  // node_modules/motion-dom/dist/es/value/types/utils/float-regex.mjs
  var floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;

  // node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
  function isNullish(v) {
    return v == null;
  }

  // node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
  var singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;

  // node_modules/motion-dom/dist/es/value/types/color/utils.mjs
  var isColorString = (type, testProp) => (v) => {
    return Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
  };
  var splitColor = (aName, bName, cName) => (v) => {
    if (typeof v !== "string")
      return v;
    const [a, b, c, alpha2] = v.match(floatRegex);
    return {
      [aName]: parseFloat(a),
      [bName]: parseFloat(b),
      [cName]: parseFloat(c),
      alpha: alpha2 !== void 0 ? parseFloat(alpha2) : 1
    };
  };

  // node_modules/motion-dom/dist/es/value/types/color/rgba.mjs
  var clampRgbUnit = (v) => clamp(0, 255, v);
  var rgbUnit = {
    ...number,
    transform: (v) => Math.round(clampRgbUnit(v))
  };
  var rgba = {
    test: /* @__PURE__ */ isColorString("rgb", "red"),
    parse: /* @__PURE__ */ splitColor("red", "green", "blue"),
    transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
  };

  // node_modules/motion-dom/dist/es/value/types/color/hex.mjs
  function parseHex(v) {
    let r = "";
    let g = "";
    let b = "";
    let a = "";
    if (v.length > 5) {
      r = v.substring(1, 3);
      g = v.substring(3, 5);
      b = v.substring(5, 7);
      a = v.substring(7, 9);
    } else {
      r = v.substring(1, 2);
      g = v.substring(2, 3);
      b = v.substring(3, 4);
      a = v.substring(4, 5);
      r += r;
      g += g;
      b += b;
      a += a;
    }
    return {
      red: parseInt(r, 16),
      green: parseInt(g, 16),
      blue: parseInt(b, 16),
      alpha: a ? parseInt(a, 16) / 255 : 1
    };
  }
  var hex = {
    test: /* @__PURE__ */ isColorString("#"),
    parse: parseHex,
    transform: rgba.transform
  };

  // node_modules/motion-dom/dist/es/value/types/numbers/units.mjs
  var createUnitType = /* @__NO_SIDE_EFFECTS__ */ (unit) => ({
    test: (v) => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
    parse: parseFloat,
    transform: (v) => `${v}${unit}`
  });
  var degrees = /* @__PURE__ */ createUnitType("deg");
  var percent = /* @__PURE__ */ createUnitType("%");
  var px = /* @__PURE__ */ createUnitType("px");
  var vh = /* @__PURE__ */ createUnitType("vh");
  var vw = /* @__PURE__ */ createUnitType("vw");
  var progressPercentage = /* @__PURE__ */ (() => ({
    ...percent,
    parse: (v) => percent.parse(v) / 100,
    transform: (v) => percent.transform(v * 100)
  }))();

  // node_modules/motion-dom/dist/es/value/types/color/hsla.mjs
  var hsla = {
    test: /* @__PURE__ */ isColorString("hsl", "hue"),
    parse: /* @__PURE__ */ splitColor("hue", "saturation", "lightness"),
    transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
      return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
    }
  };

  // node_modules/motion-dom/dist/es/value/types/color/index.mjs
  var color = {
    test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
    parse: (v) => {
      if (rgba.test(v)) {
        return rgba.parse(v);
      } else if (hsla.test(v)) {
        return hsla.parse(v);
      } else {
        return hex.parse(v);
      }
    },
    transform: (v) => {
      return typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
    },
    getAnimatableNone: (v) => {
      const parsed = color.parse(v);
      parsed.alpha = 0;
      return color.transform(parsed);
    }
  };

  // node_modules/motion-dom/dist/es/value/types/utils/color-regex.mjs
  var colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;

  // node_modules/motion-dom/dist/es/value/types/complex/index.mjs
  function test(v) {
    return isNaN(v) && typeof v === "string" && (v.match(floatRegex)?.length || 0) + (v.match(colorRegex)?.length || 0) > 0;
  }
  var NUMBER_TOKEN = "number";
  var COLOR_TOKEN = "color";
  var VAR_TOKEN = "var";
  var VAR_FUNCTION_TOKEN = "var(";
  var SPLIT_TOKEN = "${}";
  var complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
  function analyseComplexValue(value) {
    const originalValue = value.toString();
    const values = [];
    const indexes = {
      color: [],
      number: [],
      var: []
    };
    const types = [];
    let i = 0;
    const tokenised = originalValue.replace(complexRegex, (parsedValue) => {
      if (color.test(parsedValue)) {
        indexes.color.push(i);
        types.push(COLOR_TOKEN);
        values.push(color.parse(parsedValue));
      } else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
        indexes.var.push(i);
        types.push(VAR_TOKEN);
        values.push(parsedValue);
      } else {
        indexes.number.push(i);
        types.push(NUMBER_TOKEN);
        values.push(parseFloat(parsedValue));
      }
      ++i;
      return SPLIT_TOKEN;
    });
    const split = tokenised.split(SPLIT_TOKEN);
    return { values, split, indexes, types };
  }
  function parseComplexValue(v) {
    return analyseComplexValue(v).values;
  }
  function buildTransformer({ split, types }) {
    const numSections = split.length;
    return (v) => {
      let output = "";
      for (let i = 0; i < numSections; i++) {
        output += split[i];
        if (v[i] !== void 0) {
          const type = types[i];
          if (type === NUMBER_TOKEN) {
            output += sanitize(v[i]);
          } else if (type === COLOR_TOKEN) {
            output += color.transform(v[i]);
          } else {
            output += v[i];
          }
        }
      }
      return output;
    };
  }
  function createTransformer(source) {
    return buildTransformer(analyseComplexValue(source));
  }
  var convertNumbersToZero = (v) => typeof v === "number" ? 0 : color.test(v) ? color.getAnimatableNone(v) : v;
  var convertToZero = (value, splitBefore) => {
    if (typeof value === "number") {
      return splitBefore?.trim().endsWith("/") ? value : 0;
    }
    return convertNumbersToZero(value);
  };
  function getAnimatableNone(v) {
    const info = analyseComplexValue(v);
    const transformer = buildTransformer(info);
    return transformer(info.values.map((value, i) => convertToZero(value, info.split[i])));
  }
  var complex = {
    test,
    parse: parseComplexValue,
    createTransformer,
    getAnimatableNone
  };

  // node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
  function hueToRgb(p, q, t) {
    if (t < 0)
      t += 1;
    if (t > 1)
      t -= 1;
    if (t < 1 / 6)
      return p + (q - p) * 6 * t;
    if (t < 1 / 2)
      return q;
    if (t < 2 / 3)
      return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
    hue /= 360;
    saturation /= 100;
    lightness /= 100;
    let red = 0;
    let green = 0;
    let blue = 0;
    if (!saturation) {
      red = green = blue = lightness;
    } else {
      const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
      const p = 2 * lightness - q;
      red = hueToRgb(p, q, hue + 1 / 3);
      green = hueToRgb(p, q, hue);
      blue = hueToRgb(p, q, hue - 1 / 3);
    }
    return {
      red: Math.round(red * 255),
      green: Math.round(green * 255),
      blue: Math.round(blue * 255),
      alpha: alpha2
    };
  }

  // node_modules/motion-dom/dist/es/utils/mix/immediate.mjs
  function mixImmediate(a, b) {
    return (p) => p > 0 ? b : a;
  }

  // node_modules/motion-dom/dist/es/utils/mix/number.mjs
  var mixNumber = (from, to, progress2) => {
    return from + (to - from) * progress2;
  };

  // node_modules/motion-dom/dist/es/utils/mix/color.mjs
  var mixLinearColor = (from, to, v) => {
    const fromExpo = from * from;
    const expo = v * (to * to - fromExpo) + fromExpo;
    return expo < 0 ? 0 : Math.sqrt(expo);
  };
  var colorTypes = [hex, rgba, hsla];
  var getColorType = (v) => colorTypes.find((type) => type.test(v));
  function asRGBA(color2) {
    const type = getColorType(color2);
    warning(Boolean(type), `'${color2}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable");
    if (!Boolean(type))
      return false;
    let model = type.parse(color2);
    if (type === hsla) {
      model = hslaToRgba(model);
    }
    return model;
  }
  var mixColor = (from, to) => {
    const fromRGBA = asRGBA(from);
    const toRGBA = asRGBA(to);
    if (!fromRGBA || !toRGBA) {
      return mixImmediate(from, to);
    }
    const blended = { ...fromRGBA };
    return (v) => {
      blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
      blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
      blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
      blended.alpha = mixNumber(fromRGBA.alpha, toRGBA.alpha, v);
      return rgba.transform(blended);
    };
  };

  // node_modules/motion-dom/dist/es/utils/mix/visibility.mjs
  var invisibleValues = /* @__PURE__ */ new Set(["none", "hidden"]);
  function mixVisibility(origin, target) {
    if (invisibleValues.has(origin)) {
      return (p) => p <= 0 ? origin : target;
    } else {
      return (p) => p >= 1 ? target : origin;
    }
  }

  // node_modules/motion-dom/dist/es/utils/mix/complex.mjs
  function mixNumber2(a, b) {
    return (p) => mixNumber(a, b, p);
  }
  function getMixer(a) {
    if (typeof a === "number") {
      return mixNumber2;
    } else if (typeof a === "string") {
      return isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex;
    } else if (Array.isArray(a)) {
      return mixArray;
    } else if (typeof a === "object") {
      return color.test(a) ? mixColor : mixObject;
    }
    return mixImmediate;
  }
  function mixArray(a, b) {
    const output = [...a];
    const numValues = output.length;
    const blendValue = a.map((v, i) => getMixer(v)(v, b[i]));
    return (p) => {
      for (let i = 0; i < numValues; i++) {
        output[i] = blendValue[i](p);
      }
      return output;
    };
  }
  function mixObject(a, b) {
    const output = { ...a, ...b };
    const blendValue = {};
    for (const key in output) {
      if (a[key] !== void 0 && b[key] !== void 0) {
        blendValue[key] = getMixer(a[key])(a[key], b[key]);
      }
    }
    return (v) => {
      for (const key in blendValue) {
        output[key] = blendValue[key](v);
      }
      return output;
    };
  }
  function matchOrder(origin, target) {
    const orderedOrigin = [];
    const pointers = { color: 0, var: 0, number: 0 };
    for (let i = 0; i < target.values.length; i++) {
      const type = target.types[i];
      const originIndex = origin.indexes[type][pointers[type]];
      const originValue = origin.values[originIndex] ?? 0;
      orderedOrigin[i] = originValue;
      pointers[type]++;
    }
    return orderedOrigin;
  }
  var mixComplex = (origin, target) => {
    const template = complex.createTransformer(target);
    const originStats = analyseComplexValue(origin);
    const targetStats = analyseComplexValue(target);
    const canInterpolate = originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length;
    if (canInterpolate) {
      if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) {
        return mixVisibility(origin, target);
      }
      return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
    } else {
      warning(true, `Complex values '${origin}' and '${target}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different");
      return mixImmediate(origin, target);
    }
  };

  // node_modules/motion-dom/dist/es/utils/mix/index.mjs
  function mix(from, to, p) {
    if (typeof from === "number" && typeof to === "number" && typeof p === "number") {
      return mixNumber(from, to, p);
    }
    const mixer = getMixer(from);
    return mixer(from, to);
  }

  // node_modules/motion-dom/dist/es/animation/drivers/frame.mjs
  var frameloopDriver = (update) => {
    const passTimestamp = ({ timestamp }) => update(timestamp);
    return {
      start: (keepAlive = true) => frame.update(passTimestamp, keepAlive),
      stop: () => cancelFrame(passTimestamp),
      /**
       * If we're processing this frame we can use the
       * framelocked timestamp to keep things in sync.
       */
      now: () => frameData.isProcessing ? frameData.timestamp : time.now()
    };
  };

  // node_modules/motion-dom/dist/es/animation/waapi/utils/linear.mjs
  var generateLinearEasing = (easing, duration, resolution = 10) => {
    let points = "";
    const numPoints = Math.max(Math.round(duration / resolution), 2);
    for (let i = 0; i < numPoints; i++) {
      points += Math.round(easing(i / (numPoints - 1)) * 1e4) / 1e4 + ", ";
    }
    return `linear(${points.substring(0, points.length - 2)})`;
  };

  // node_modules/motion-dom/dist/es/animation/generators/utils/calc-duration.mjs
  var maxGeneratorDuration = 2e4;
  function calcGeneratorDuration(generator) {
    let duration = 0;
    const timeStep = 50;
    let state = generator.next(duration);
    while (!state.done && duration < maxGeneratorDuration) {
      duration += timeStep;
      state = generator.next(duration);
    }
    return duration >= maxGeneratorDuration ? Infinity : duration;
  }

  // node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
  function createGeneratorEasing(options, scale2 = 100, createGenerator) {
    const generator = createGenerator({ ...options, keyframes: [0, scale2] });
    const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
    return {
      type: "keyframes",
      ease: (progress2) => {
        return generator.next(duration * progress2).value / scale2;
      },
      duration: millisecondsToSeconds(duration)
    };
  }

  // node_modules/motion-dom/dist/es/animation/generators/spring.mjs
  var springDefaults = {
    // Default spring physics
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    // Default duration/bounce-based options
    duration: 800,
    // in ms
    bounce: 0.3,
    visualDuration: 0.3,
    // in seconds
    // Rest thresholds
    restSpeed: {
      granular: 0.01,
      default: 2
    },
    restDelta: {
      granular: 5e-3,
      default: 0.5
    },
    // Limits
    minDuration: 0.01,
    // in seconds
    maxDuration: 10,
    // in seconds
    minDamping: 0.05,
    maxDamping: 1
  };
  function calcAngularFreq(undampedFreq, dampingRatio) {
    return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
  }
  var rootIterations = 12;
  function approximateRoot(envelope, derivative, initialGuess) {
    let result = initialGuess;
    for (let i = 1; i < rootIterations; i++) {
      result = result - envelope(result) / derivative(result);
    }
    return result;
  }
  var safeMin = 1e-3;
  function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
    let envelope;
    let derivative;
    warning(duration <= secondsToMilliseconds(springDefaults.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
    let dampingRatio = 1 - bounce;
    dampingRatio = clamp(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
    duration = clamp(springDefaults.minDuration, springDefaults.maxDuration, millisecondsToSeconds(duration));
    if (dampingRatio < 1) {
      envelope = (undampedFreq2) => {
        const exponentialDecay = undampedFreq2 * dampingRatio;
        const delta = exponentialDecay * duration;
        const a = exponentialDecay - velocity;
        const b = calcAngularFreq(undampedFreq2, dampingRatio);
        const c = Math.exp(-delta);
        return safeMin - a / b * c;
      };
      derivative = (undampedFreq2) => {
        const exponentialDecay = undampedFreq2 * dampingRatio;
        const delta = exponentialDecay * duration;
        const d = delta * velocity + velocity;
        const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration;
        const f = Math.exp(-delta);
        const g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
        const factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
        return factor * ((d - e) * f) / g;
      };
    } else {
      envelope = (undampedFreq2) => {
        const a = Math.exp(-undampedFreq2 * duration);
        const b = (undampedFreq2 - velocity) * duration + 1;
        return -safeMin + a * b;
      };
      derivative = (undampedFreq2) => {
        const a = Math.exp(-undampedFreq2 * duration);
        const b = (velocity - undampedFreq2) * (duration * duration);
        return a * b;
      };
    }
    const initialGuess = 5 / duration;
    const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
    duration = secondsToMilliseconds(duration);
    if (isNaN(undampedFreq)) {
      return {
        stiffness: springDefaults.stiffness,
        damping: springDefaults.damping,
        duration
      };
    } else {
      const stiffness = Math.pow(undampedFreq, 2) * mass;
      return {
        stiffness,
        damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
        duration
      };
    }
  }
  var durationKeys = ["duration", "bounce"];
  var physicsKeys = ["stiffness", "damping", "mass"];
  function isSpringType(options, keys) {
    return keys.some((key) => options[key] !== void 0);
  }
  function getSpringOptions(options) {
    let springOptions = {
      velocity: springDefaults.velocity,
      stiffness: springDefaults.stiffness,
      damping: springDefaults.damping,
      mass: springDefaults.mass,
      isResolvedFromDuration: false,
      ...options
    };
    if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
      springOptions.velocity = 0;
      if (options.visualDuration) {
        const visualDuration = options.visualDuration;
        const root = 2 * Math.PI / (visualDuration * 1.2);
        const stiffness = root * root;
        const damping = 2 * clamp(0.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
        springOptions = {
          ...springOptions,
          mass: springDefaults.mass,
          stiffness,
          damping
        };
      } else {
        const derived = findSpring({ ...options, velocity: 0 });
        springOptions = {
          ...springOptions,
          ...derived,
          mass: springDefaults.mass
        };
        springOptions.isResolvedFromDuration = true;
      }
    }
    return springOptions;
  }
  function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
    const options = typeof optionsOrVisualDuration !== "object" ? {
      visualDuration: optionsOrVisualDuration,
      keyframes: [0, 1],
      bounce
    } : optionsOrVisualDuration;
    let { restSpeed, restDelta } = options;
    const origin = options.keyframes[0];
    const target = options.keyframes[options.keyframes.length - 1];
    const state = { done: false, value: origin };
    const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
      ...options,
      velocity: -millisecondsToSeconds(options.velocity || 0)
    });
    const initialVelocity = velocity || 0;
    const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
    const initialDelta = target - origin;
    const undampedAngularFreq = millisecondsToSeconds(Math.sqrt(stiffness / mass));
    const isGranularScale = Math.abs(initialDelta) < 5;
    restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
    restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
    let resolveSpring;
    let resolveVelocity;
    let angularFreq;
    let A;
    let sinCoeff;
    let cosCoeff;
    if (dampingRatio < 1) {
      angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
      A = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq;
      resolveSpring = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        return target - envelope * (A * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
      };
      sinCoeff = dampingRatio * undampedAngularFreq * A + initialDelta * angularFreq;
      cosCoeff = dampingRatio * undampedAngularFreq * initialDelta - A * angularFreq;
      resolveVelocity = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        return envelope * (sinCoeff * Math.sin(angularFreq * t) + cosCoeff * Math.cos(angularFreq * t));
      };
    } else if (dampingRatio === 1) {
      resolveSpring = (t) => target - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
      const C = initialVelocity + undampedAngularFreq * initialDelta;
      resolveVelocity = (t) => Math.exp(-undampedAngularFreq * t) * (undampedAngularFreq * C * t - initialVelocity);
    } else {
      const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
      resolveSpring = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        const freqForT = Math.min(dampedAngularFreq * t, 300);
        return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
      };
      const P = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / dampedAngularFreq;
      const sinhCoeff = dampingRatio * undampedAngularFreq * P - initialDelta * dampedAngularFreq;
      const coshCoeff = dampingRatio * undampedAngularFreq * initialDelta - P * dampedAngularFreq;
      resolveVelocity = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        const freqForT = Math.min(dampedAngularFreq * t, 300);
        return envelope * (sinhCoeff * Math.sinh(freqForT) + coshCoeff * Math.cosh(freqForT));
      };
    }
    const generator = {
      calculatedDuration: isResolvedFromDuration ? duration || null : null,
      velocity: (t) => secondsToMilliseconds(resolveVelocity(t)),
      next: (t) => {
        if (!isResolvedFromDuration && dampingRatio < 1) {
          const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
          const sin = Math.sin(angularFreq * t);
          const cos = Math.cos(angularFreq * t);
          const current2 = target - envelope * (A * sin + initialDelta * cos);
          const currentVelocity = secondsToMilliseconds(envelope * (sinCoeff * sin + cosCoeff * cos));
          state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current2) <= restDelta;
          state.value = state.done ? target : current2;
          return state;
        }
        const current = resolveSpring(t);
        if (!isResolvedFromDuration) {
          const currentVelocity = secondsToMilliseconds(resolveVelocity(t));
          state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current) <= restDelta;
        } else {
          state.done = t >= duration;
        }
        state.value = state.done ? target : current;
        return state;
      },
      toString: () => {
        const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
        const easing = generateLinearEasing((progress2) => generator.next(calculatedDuration * progress2).value, calculatedDuration, 30);
        return calculatedDuration + "ms " + easing;
      },
      toTransition: () => {
      }
    };
    return generator;
  }
  spring.applyToOptions = (options) => {
    const generatorOptions = createGeneratorEasing(options, 100, spring);
    options.ease = generatorOptions.ease;
    options.duration = secondsToMilliseconds(generatorOptions.duration);
    options.type = "keyframes";
    return options;
  };

  // node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
  var velocitySampleDuration = 5;
  function getGeneratorVelocity(resolveValue, t, current) {
    const prevT = Math.max(t - velocitySampleDuration, 0);
    return velocityPerSecond(current - resolveValue(prevT), t - prevT);
  }

  // node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
  function inertia({ keyframes: keyframes2, velocity = 0, power = 0.8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = 0.5, restSpeed }) {
    const origin = keyframes2[0];
    const state = {
      done: false,
      value: origin
    };
    const isOutOfBounds = (v) => min !== void 0 && v < min || max !== void 0 && v > max;
    const nearestBoundary = (v) => {
      if (min === void 0)
        return max;
      if (max === void 0)
        return min;
      return Math.abs(min - v) < Math.abs(max - v) ? min : max;
    };
    let amplitude = power * velocity;
    const ideal = origin + amplitude;
    const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
    if (target !== ideal)
      amplitude = target - origin;
    const calcDelta = (t) => -amplitude * Math.exp(-t / timeConstant);
    const calcLatest = (t) => target + calcDelta(t);
    const applyFriction = (t) => {
      const delta = calcDelta(t);
      const latest = calcLatest(t);
      state.done = Math.abs(delta) <= restDelta;
      state.value = state.done ? target : latest;
    };
    let timeReachedBoundary;
    let spring$1;
    const checkCatchBoundary = (t) => {
      if (!isOutOfBounds(state.value))
        return;
      timeReachedBoundary = t;
      spring$1 = spring({
        keyframes: [state.value, nearestBoundary(state.value)],
        velocity: getGeneratorVelocity(calcLatest, t, state.value),
        // TODO: This should be passing * 1000
        damping: bounceDamping,
        stiffness: bounceStiffness,
        restDelta,
        restSpeed
      });
    };
    checkCatchBoundary(0);
    return {
      calculatedDuration: null,
      next: (t) => {
        let hasUpdatedFrame = false;
        if (!spring$1 && timeReachedBoundary === void 0) {
          hasUpdatedFrame = true;
          applyFriction(t);
          checkCatchBoundary(t);
        }
        if (timeReachedBoundary !== void 0 && t >= timeReachedBoundary) {
          return spring$1.next(t - timeReachedBoundary);
        } else {
          !hasUpdatedFrame && applyFriction(t);
          return state;
        }
      }
    };
  }

  // node_modules/motion-dom/dist/es/utils/interpolate.mjs
  function createMixers(output, ease2, customMixer) {
    const mixers = [];
    const mixerFactory = customMixer || MotionGlobalConfig.mix || mix;
    const numMixers = output.length - 1;
    for (let i = 0; i < numMixers; i++) {
      let mixer = mixerFactory(output[i], output[i + 1]);
      if (ease2) {
        const easingFunction = Array.isArray(ease2) ? ease2[i] || noop : ease2;
        mixer = pipe(easingFunction, mixer);
      }
      mixers.push(mixer);
    }
    return mixers;
  }
  function interpolate(input, output, { clamp: isClamp = true, ease: ease2, mixer } = {}) {
    const inputLength = input.length;
    invariant(inputLength === output.length, "Both input and output ranges must be the same length", "range-length");
    if (inputLength === 1)
      return () => output[0];
    if (inputLength === 2 && output[0] === output[1])
      return () => output[1];
    const isZeroDeltaRange = input[0] === input[1];
    if (input[0] > input[inputLength - 1]) {
      input = [...input].reverse();
      output = [...output].reverse();
    }
    const mixers = createMixers(output, ease2, mixer);
    const numMixers = mixers.length;
    const interpolator = (v) => {
      if (isZeroDeltaRange && v < input[0])
        return output[0];
      let i = 0;
      if (numMixers > 1) {
        for (; i < input.length - 2; i++) {
          if (v < input[i + 1])
            break;
        }
      }
      const progressInRange = progress(input[i], input[i + 1], v);
      return mixers[i](progressInRange);
    };
    return isClamp ? (v) => interpolator(clamp(input[0], input[inputLength - 1], v)) : interpolator;
  }

  // node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
  function fillOffset(offset, remaining) {
    const min = offset[offset.length - 1];
    for (let i = 1; i <= remaining; i++) {
      const offsetProgress = progress(0, remaining, i);
      offset.push(mixNumber(min, 1, offsetProgress));
    }
  }

  // node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
  function defaultOffset(arr) {
    const offset = [0];
    fillOffset(offset, arr.length - 1);
    return offset;
  }

  // node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
  function convertOffsetToTimes(offset, duration) {
    return offset.map((o) => o * duration);
  }

  // node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
  function defaultEasing(values, easing) {
    return values.map(() => easing || easeInOut).splice(0, values.length - 1);
  }
  function keyframes({ duration = 300, keyframes: keyframeValues, times, ease: ease2 = "easeInOut" }) {
    const easingFunctions = isEasingArray(ease2) ? ease2.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease2);
    const state = {
      done: false,
      value: keyframeValues[0]
    };
    const absoluteTimes = convertOffsetToTimes(
      // Only use the provided offsets if they're the correct length
      // TODO Maybe we should warn here if there's a length mismatch
      times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues),
      duration
    );
    const mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, {
      ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions)
    });
    return {
      calculatedDuration: duration,
      next: (t) => {
        state.value = mapTimeToKeyframe(t);
        state.done = t >= duration;
        return state;
      }
    };
  }

  // node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
  var isNotNull = (value) => value !== null;
  function getFinalKeyframe(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe, speed = 1) {
    const resolvedKeyframes = keyframes2.filter(isNotNull);
    const useFirstKeyframe = speed < 0 || repeat && repeatType !== "loop" && repeat % 2 === 1;
    const index = useFirstKeyframe ? 0 : resolvedKeyframes.length - 1;
    return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
  }

  // node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
  var transitionTypeMap = {
    decay: inertia,
    inertia,
    tween: keyframes,
    keyframes,
    spring
  };
  function replaceTransitionType(transition) {
    if (typeof transition.type === "string") {
      transition.type = transitionTypeMap[transition.type];
    }
  }

  // node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
  var WithPromise = class {
    constructor() {
      this.updateFinished();
    }
    get finished() {
      return this._finished;
    }
    updateFinished() {
      this._finished = new Promise((resolve) => {
        this.resolve = resolve;
      });
    }
    notifyFinished() {
      this.resolve();
    }
    /**
     * Allows the animation to be awaited.
     *
     * @deprecated Use `finished` instead.
     */
    then(onResolve, onReject) {
      return this.finished.then(onResolve, onReject);
    }
  };

  // node_modules/motion-dom/dist/es/animation/JSAnimation.mjs
  var percentToProgress = (percent2) => percent2 / 100;
  var JSAnimation = class extends WithPromise {
    constructor(options) {
      super();
      this.state = "idle";
      this.startTime = null;
      this.isStopped = false;
      this.currentTime = 0;
      this.holdTime = null;
      this.playbackSpeed = 1;
      this.delayState = {
        done: false,
        value: void 0
      };
      this.stop = () => {
        const { motionValue: motionValue2 } = this.options;
        if (motionValue2 && motionValue2.updatedAt !== time.now()) {
          this.tick(time.now());
        }
        this.isStopped = true;
        if (this.state === "idle")
          return;
        this.teardown();
        this.options.onStop?.();
      };
      this.options = options;
      this.initAnimation();
      this.play();
      if (options.autoplay === false)
        this.pause();
    }
    initAnimation() {
      const { options } = this;
      replaceTransitionType(options);
      const { type = keyframes, repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = options;
      let { keyframes: keyframes$1 } = options;
      const generatorFactory = type || keyframes;
      if (generatorFactory !== keyframes) {
        invariant(keyframes$1.length <= 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${keyframes$1}`, "spring-two-frames");
      }
      if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
        this.mixKeyframes = pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
        keyframes$1 = [0, 100];
      }
      const generator = generatorFactory({ ...options, keyframes: keyframes$1 });
      if (repeatType === "mirror") {
        this.mirroredGenerator = generatorFactory({
          ...options,
          keyframes: [...keyframes$1].reverse(),
          velocity: -velocity
        });
      }
      if (generator.calculatedDuration === null) {
        generator.calculatedDuration = calcGeneratorDuration(generator);
      }
      const { calculatedDuration } = generator;
      this.calculatedDuration = calculatedDuration;
      this.resolvedDuration = calculatedDuration + repeatDelay;
      this.totalDuration = this.resolvedDuration * (repeat + 1) - repeatDelay;
      this.generator = generator;
    }
    updateTime(timestamp) {
      const animationTime = Math.round(timestamp - this.startTime) * this.playbackSpeed;
      if (this.holdTime !== null) {
        this.currentTime = this.holdTime;
      } else {
        this.currentTime = animationTime;
      }
    }
    tick(timestamp, sample = false) {
      const { generator, totalDuration, mixKeyframes, mirroredGenerator, resolvedDuration, calculatedDuration } = this;
      if (this.startTime === null)
        return generator.next(0);
      const { delay = 0, keyframes: keyframes2, repeat, repeatType, repeatDelay, type, onUpdate, finalKeyframe } = this.options;
      if (this.speed > 0) {
        this.startTime = Math.min(this.startTime, timestamp);
      } else if (this.speed < 0) {
        this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
      }
      if (sample) {
        this.currentTime = timestamp;
      } else {
        this.updateTime(timestamp);
      }
      const timeWithoutDelay = this.currentTime - delay * (this.playbackSpeed >= 0 ? 1 : -1);
      const isInDelayPhase = this.playbackSpeed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
      this.currentTime = Math.max(timeWithoutDelay, 0);
      if (this.state === "finished" && this.holdTime === null) {
        this.currentTime = totalDuration;
      }
      let elapsed = this.currentTime;
      let frameGenerator = generator;
      if (repeat) {
        const progress2 = Math.min(this.currentTime, totalDuration) / resolvedDuration;
        let currentIteration = Math.floor(progress2);
        let iterationProgress = progress2 % 1;
        if (!iterationProgress && progress2 >= 1) {
          iterationProgress = 1;
        }
        iterationProgress === 1 && currentIteration--;
        currentIteration = Math.min(currentIteration, repeat + 1);
        const isOddIteration = Boolean(currentIteration % 2);
        if (isOddIteration) {
          if (repeatType === "reverse") {
            iterationProgress = 1 - iterationProgress;
            if (repeatDelay) {
              iterationProgress -= repeatDelay / resolvedDuration;
            }
          } else if (repeatType === "mirror") {
            frameGenerator = mirroredGenerator;
          }
        }
        elapsed = clamp(0, 1, iterationProgress) * resolvedDuration;
      }
      let state;
      if (isInDelayPhase) {
        this.delayState.value = keyframes2[0];
        state = this.delayState;
      } else {
        state = frameGenerator.next(elapsed);
      }
      if (mixKeyframes && !isInDelayPhase) {
        state.value = mixKeyframes(state.value);
      }
      let { done } = state;
      if (!isInDelayPhase && calculatedDuration !== null) {
        done = this.playbackSpeed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
      }
      const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
      if (isAnimationFinished && type !== inertia) {
        state.value = getFinalKeyframe(keyframes2, this.options, finalKeyframe, this.speed);
      }
      if (onUpdate) {
        onUpdate(state.value);
      }
      if (isAnimationFinished) {
        this.finish();
      }
      return state;
    }
    /**
     * Allows the returned animation to be awaited or promise-chained. Currently
     * resolves when the animation finishes at all but in a future update could/should
     * reject if its cancels.
     */
    then(resolve, reject) {
      return this.finished.then(resolve, reject);
    }
    get duration() {
      return millisecondsToSeconds(this.calculatedDuration);
    }
    get iterationDuration() {
      const { delay = 0 } = this.options || {};
      return this.duration + millisecondsToSeconds(delay);
    }
    get time() {
      return millisecondsToSeconds(this.currentTime);
    }
    set time(newTime) {
      newTime = secondsToMilliseconds(newTime);
      this.currentTime = newTime;
      if (this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0) {
        this.holdTime = newTime;
      } else if (this.driver) {
        this.startTime = this.driver.now() - newTime / this.playbackSpeed;
      }
      if (this.driver) {
        this.driver.start(false);
      } else {
        this.startTime = 0;
        this.state = "paused";
        this.holdTime = newTime;
        this.tick(newTime);
      }
    }
    /**
     * Returns the generator's velocity at the current time in units/second.
     * Uses the analytical derivative when available (springs), avoiding
     * the MotionValue's frame-dependent velocity estimation.
     */
    getGeneratorVelocity() {
      const t = this.currentTime;
      if (t <= 0)
        return this.options.velocity || 0;
      if (this.generator.velocity) {
        return this.generator.velocity(t);
      }
      const current = this.generator.next(t).value;
      return getGeneratorVelocity((s) => this.generator.next(s).value, t, current);
    }
    get speed() {
      return this.playbackSpeed;
    }
    set speed(newSpeed) {
      const hasChanged = this.playbackSpeed !== newSpeed;
      if (hasChanged && this.driver) {
        this.updateTime(time.now());
      }
      this.playbackSpeed = newSpeed;
      if (hasChanged && this.driver) {
        this.time = millisecondsToSeconds(this.currentTime);
      }
    }
    play() {
      if (this.isStopped)
        return;
      const { driver = frameloopDriver, startTime } = this.options;
      if (!this.driver) {
        this.driver = driver((timestamp) => this.tick(timestamp));
      }
      this.options.onPlay?.();
      const now2 = this.driver.now();
      if (this.state === "finished") {
        this.updateFinished();
        this.startTime = now2;
      } else if (this.holdTime !== null) {
        this.startTime = now2 - this.holdTime;
      } else if (!this.startTime) {
        this.startTime = startTime ?? now2;
      }
      if (this.state === "finished" && this.speed < 0) {
        this.startTime += this.calculatedDuration;
      }
      this.holdTime = null;
      this.state = "running";
      this.driver.start();
    }
    pause() {
      this.state = "paused";
      this.updateTime(time.now());
      this.holdTime = this.currentTime;
    }
    complete() {
      if (this.state !== "running") {
        this.play();
      }
      this.state = "finished";
      this.holdTime = null;
    }
    finish() {
      this.notifyFinished();
      this.teardown();
      this.state = "finished";
      this.options.onComplete?.();
    }
    cancel() {
      this.holdTime = null;
      this.startTime = 0;
      this.tick(0);
      this.teardown();
      this.options.onCancel?.();
    }
    teardown() {
      this.state = "idle";
      this.stopDriver();
      this.startTime = this.holdTime = null;
    }
    stopDriver() {
      if (!this.driver)
        return;
      this.driver.stop();
      this.driver = void 0;
    }
    sample(sampleTime) {
      this.startTime = 0;
      return this.tick(sampleTime, true);
    }
    attachTimeline(timeline) {
      if (this.options.allowFlatten) {
        this.options.type = "keyframes";
        this.options.ease = "linear";
        this.initAnimation();
      }
      this.driver?.stop();
      return timeline.observe(this);
    }
  };

  // node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
  function fillWildcards(keyframes2) {
    for (let i = 1; i < keyframes2.length; i++) {
      keyframes2[i] ?? (keyframes2[i] = keyframes2[i - 1]);
    }
  }

  // node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
  var radToDeg = (rad) => rad * 180 / Math.PI;
  var rotate = (v) => {
    const angle = radToDeg(Math.atan2(v[1], v[0]));
    return rebaseAngle(angle);
  };
  var matrix2dParsers = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (v) => (Math.abs(v[0]) + Math.abs(v[3])) / 2,
    rotate,
    rotateZ: rotate,
    skewX: (v) => radToDeg(Math.atan(v[1])),
    skewY: (v) => radToDeg(Math.atan(v[2])),
    skew: (v) => (Math.abs(v[1]) + Math.abs(v[2])) / 2
  };
  var rebaseAngle = (angle) => {
    angle = angle % 360;
    if (angle < 0)
      angle += 360;
    return angle;
  };
  var rotateZ = rotate;
  var scaleX = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  var scaleY = (v) => Math.sqrt(v[4] * v[4] + v[5] * v[5]);
  var matrix3dParsers = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX,
    scaleY,
    scale: (v) => (scaleX(v) + scaleY(v)) / 2,
    rotateX: (v) => rebaseAngle(radToDeg(Math.atan2(v[6], v[5]))),
    rotateY: (v) => rebaseAngle(radToDeg(Math.atan2(-v[2], v[0]))),
    rotateZ,
    rotate: rotateZ,
    skewX: (v) => radToDeg(Math.atan(v[4])),
    skewY: (v) => radToDeg(Math.atan(v[1])),
    skew: (v) => (Math.abs(v[1]) + Math.abs(v[4])) / 2
  };
  function defaultTransformValue(name) {
    return name.includes("scale") ? 1 : 0;
  }
  function parseValueFromTransform(transform, name) {
    if (!transform || transform === "none") {
      return defaultTransformValue(name);
    }
    const matrix3dMatch = transform.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
    let parsers;
    let match;
    if (matrix3dMatch) {
      parsers = matrix3dParsers;
      match = matrix3dMatch;
    } else {
      const matrix2dMatch = transform.match(/^matrix\(([-\d.e\s,]+)\)$/u);
      parsers = matrix2dParsers;
      match = matrix2dMatch;
    }
    if (!match) {
      return defaultTransformValue(name);
    }
    const valueParser = parsers[name];
    const values = match[1].split(",").map(convertTransformToNumber);
    return typeof valueParser === "function" ? valueParser(values) : values[valueParser];
  }
  var readTransformValue = (instance, name) => {
    const { transform = "none" } = getComputedStyle(instance);
    return parseValueFromTransform(transform, name);
  };
  function convertTransformToNumber(value) {
    return parseFloat(value.trim());
  }

  // node_modules/motion-dom/dist/es/render/utils/keys-transform.mjs
  var transformPropOrder = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY"
  ];
  var transformProps = /* @__PURE__ */ (() => /* @__PURE__ */ new Set([...transformPropOrder, "pathRotation"]))();

  // node_modules/motion-dom/dist/es/animation/keyframes/utils/unit-conversion.mjs
  var isNumOrPxType = (v) => v === number || v === px;
  var transformKeys = /* @__PURE__ */ new Set(["x", "y", "z"]);
  var nonTranslationalTransformKeys = transformPropOrder.filter((key) => !transformKeys.has(key));
  function removeNonTranslationalTransform(visualElement) {
    const removedTransforms = [];
    nonTranslationalTransformKeys.forEach((key) => {
      const value = visualElement.getValue(key);
      if (value !== void 0) {
        removedTransforms.push([key, value.get()]);
        value.set(key.startsWith("scale") ? 1 : 0);
      }
    });
    return removedTransforms;
  }
  var positionalValues = {
    // Dimensions
    width: ({ x }, { paddingLeft = "0", paddingRight = "0", boxSizing }) => {
      const width = x.max - x.min;
      return boxSizing === "border-box" ? width : width - parseFloat(paddingLeft) - parseFloat(paddingRight);
    },
    height: ({ y }, { paddingTop = "0", paddingBottom = "0", boxSizing }) => {
      const height = y.max - y.min;
      return boxSizing === "border-box" ? height : height - parseFloat(paddingTop) - parseFloat(paddingBottom);
    },
    top: (_bbox, { top }) => parseFloat(top),
    left: (_bbox, { left }) => parseFloat(left),
    bottom: ({ y }, { top }) => parseFloat(top) + (y.max - y.min),
    right: ({ x }, { left }) => parseFloat(left) + (x.max - x.min),
    // Transform
    x: (_bbox, { transform }) => parseValueFromTransform(transform, "x"),
    y: (_bbox, { transform }) => parseValueFromTransform(transform, "y")
  };
  positionalValues.translateX = positionalValues.x;
  positionalValues.translateY = positionalValues.y;

  // node_modules/motion-dom/dist/es/animation/keyframes/KeyframesResolver.mjs
  var toResolve = /* @__PURE__ */ new Set();
  var isScheduled = false;
  var anyNeedsMeasurement = false;
  var isForced = false;
  function measureAllKeyframes() {
    if (anyNeedsMeasurement) {
      const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement);
      const elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element));
      const transformsToRestore = /* @__PURE__ */ new Map();
      elementsToMeasure.forEach((element) => {
        const removedTransforms = removeNonTranslationalTransform(element);
        if (!removedTransforms.length)
          return;
        transformsToRestore.set(element, removedTransforms);
        element.render();
      });
      resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
      elementsToMeasure.forEach((element) => {
        element.render();
        const restore = transformsToRestore.get(element);
        if (restore) {
          restore.forEach(([key, value]) => {
            element.getValue(key)?.set(value);
          });
        }
      });
      resolversToMeasure.forEach((resolver) => resolver.measureEndState());
      resolversToMeasure.forEach((resolver) => {
        if (resolver.suspendedScrollY !== void 0) {
          window.scrollTo(0, resolver.suspendedScrollY);
        }
      });
    }
    anyNeedsMeasurement = false;
    isScheduled = false;
    toResolve.forEach((resolver) => resolver.complete(isForced));
    toResolve.clear();
  }
  function readAllKeyframes() {
    toResolve.forEach((resolver) => {
      resolver.readKeyframes();
      if (resolver.needsMeasurement) {
        anyNeedsMeasurement = true;
      }
    });
  }
  function flushKeyframeResolvers() {
    isForced = true;
    readAllKeyframes();
    measureAllKeyframes();
    isForced = false;
  }
  var KeyframeResolver = class {
    constructor(unresolvedKeyframes, onComplete, name, motionValue2, element, isAsync = false) {
      this.state = "pending";
      this.isAsync = false;
      this.needsMeasurement = false;
      this.unresolvedKeyframes = [...unresolvedKeyframes];
      this.onComplete = onComplete;
      this.name = name;
      this.motionValue = motionValue2;
      this.element = element;
      this.isAsync = isAsync;
    }
    scheduleResolve() {
      this.state = "scheduled";
      if (this.isAsync) {
        toResolve.add(this);
        if (!isScheduled) {
          isScheduled = true;
          frame.read(readAllKeyframes);
          frame.resolveKeyframes(measureAllKeyframes);
        }
      } else {
        this.readKeyframes();
        this.complete();
      }
    }
    readKeyframes() {
      const { unresolvedKeyframes, name, element, motionValue: motionValue2 } = this;
      if (unresolvedKeyframes[0] === null) {
        const currentValue = motionValue2?.get();
        const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
        if (currentValue !== void 0) {
          unresolvedKeyframes[0] = currentValue;
        } else if (element && name) {
          const valueAsRead = element.readValue(name, finalKeyframe);
          if (valueAsRead !== void 0 && valueAsRead !== null) {
            unresolvedKeyframes[0] = valueAsRead;
          }
        }
        if (unresolvedKeyframes[0] === void 0) {
          unresolvedKeyframes[0] = finalKeyframe;
        }
        if (motionValue2 && currentValue === void 0) {
          motionValue2.set(unresolvedKeyframes[0]);
        }
      }
      fillWildcards(unresolvedKeyframes);
    }
    setFinalKeyframe() {
    }
    measureInitialState() {
    }
    renderEndStyles() {
    }
    measureEndState() {
    }
    complete(isForcedComplete = false) {
      this.state = "complete";
      this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, isForcedComplete);
      toResolve.delete(this);
    }
    cancel() {
      if (this.state === "scheduled") {
        toResolve.delete(this);
        this.state = "pending";
      }
    }
    resume() {
      if (this.state === "pending")
        this.scheduleResolve();
    }
  };

  // node_modules/motion-dom/dist/es/render/dom/is-css-var.mjs
  var isCSSVar = (name) => name.startsWith("--");

  // node_modules/motion-dom/dist/es/render/dom/style-set.mjs
  function setStyle(element, name, value) {
    isCSSVar(name) ? element.style.setProperty(name, value) : element.style[name] = value;
  }

  // node_modules/motion-dom/dist/es/utils/supports/flags.mjs
  var supportsFlags = {};

  // node_modules/motion-dom/dist/es/utils/supports/memo.mjs
  function memoSupports(callback, supportsFlag) {
    const memoized = memo(callback);
    return () => supportsFlags[supportsFlag] ?? memoized();
  }

  // node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
  var supportsScrollTimeline = /* @__PURE__ */ memoSupports(() => window.ScrollTimeline !== void 0, "scrollTimeline");

  // node_modules/motion-dom/dist/es/utils/supports/linear-easing.mjs
  var supportsLinearEasing = /* @__PURE__ */ memoSupports(() => {
    try {
      document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch (e) {
      return false;
    }
    return true;
  }, "linearEasing");

  // node_modules/motion-dom/dist/es/animation/waapi/easing/cubic-bezier.mjs
  var cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;

  // node_modules/motion-dom/dist/es/animation/waapi/easing/supported.mjs
  var supportedWaapiEasing = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: /* @__PURE__ */ cubicBezierAsString([0, 0.65, 0.55, 1]),
    circOut: /* @__PURE__ */ cubicBezierAsString([0.55, 0, 1, 0.45]),
    backIn: /* @__PURE__ */ cubicBezierAsString([0.31, 0.01, 0.66, -0.59]),
    backOut: /* @__PURE__ */ cubicBezierAsString([0.33, 1.53, 0.69, 0.99])
  };

  // node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
  function mapEasingToNativeEasing(easing, duration) {
    if (!easing) {
      return void 0;
    } else if (typeof easing === "function") {
      return supportsLinearEasing() ? generateLinearEasing(easing, duration) : "ease-out";
    } else if (isBezierDefinition(easing)) {
      return cubicBezierAsString(easing);
    } else if (Array.isArray(easing)) {
      return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
    } else {
      return supportedWaapiEasing[easing];
    }
  }

  // node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
  function startWaapiAnimation(element, valueName, keyframes2, { delay = 0, duration = 300, repeat = 0, repeatType = "loop", ease: ease2 = "easeOut", times } = {}, pseudoElement = void 0) {
    const keyframeOptions = {
      [valueName]: keyframes2
    };
    if (times)
      keyframeOptions.offset = times;
    const easing = mapEasingToNativeEasing(ease2, duration);
    if (Array.isArray(easing))
      keyframeOptions.easing = easing;
    const options = {
      delay,
      duration,
      easing: !Array.isArray(easing) ? easing : "linear",
      fill: "both",
      iterations: repeat + 1,
      direction: repeatType === "reverse" ? "alternate" : "normal"
    };
    if (pseudoElement)
      options.pseudoElement = pseudoElement;
    return element.animate(keyframeOptions, options);
  }

  // node_modules/motion-dom/dist/es/animation/generators/utils/is-generator.mjs
  function isGenerator(type) {
    return typeof type === "function" && "applyToOptions" in type;
  }

  // node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
  function applyGeneratorOptions({ type, ...options }) {
    if (isGenerator(type) && supportsLinearEasing()) {
      return type.applyToOptions(options);
    } else {
      options.duration ?? (options.duration = 300);
      options.ease ?? (options.ease = "easeOut");
    }
    return options;
  }

  // node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
  var NativeAnimation = class extends WithPromise {
    constructor(options) {
      super();
      this.finishedTime = null;
      this.isStopped = false;
      this.manualStartTime = null;
      if (!options)
        return;
      const { element, name, keyframes: keyframes2, pseudoElement, allowFlatten = false, finalKeyframe, onComplete } = options;
      this.isPseudoElement = Boolean(pseudoElement);
      this.allowFlatten = allowFlatten;
      this.options = options;
      invariant(typeof options.type !== "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
      const transition = applyGeneratorOptions(options);
      this.animation = startWaapiAnimation(element, name, keyframes2, transition, pseudoElement);
      if (transition.autoplay === false) {
        this.animation.pause();
      }
      this.animation.onfinish = () => {
        this.finishedTime = this.time;
        if (!pseudoElement) {
          const keyframe = getFinalKeyframe(keyframes2, this.options, finalKeyframe, this.speed);
          if (this.updateMotionValue) {
            this.updateMotionValue(keyframe);
          }
          setStyle(element, name, keyframe);
          this.animation.cancel();
        }
        onComplete?.();
        this.notifyFinished();
      };
    }
    play() {
      if (this.isStopped)
        return;
      this.manualStartTime = null;
      this.animation.play();
      if (this.state === "finished") {
        this.updateFinished();
      }
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.finish?.();
    }
    cancel() {
      try {
        this.animation.cancel();
      } catch (e) {
      }
    }
    stop() {
      if (this.isStopped)
        return;
      this.isStopped = true;
      const { state } = this;
      if (state === "idle" || state === "finished") {
        return;
      }
      if (this.updateMotionValue) {
        this.updateMotionValue();
      } else {
        this.commitStyles();
      }
      if (!this.isPseudoElement)
        this.cancel();
    }
    /**
     * WAAPI doesn't natively have any interruption capabilities.
     *
     * In this method, we commit styles back to the DOM before cancelling
     * the animation.
     *
     * This is designed to be overridden by NativeAnimationExtended, which
     * will create a renderless JS animation and sample it twice to calculate
     * its current value, "previous" value, and therefore allow
     * Motion to also correctly calculate velocity for any subsequent animation
     * while deferring the commit until the next animation frame.
     */
    commitStyles() {
      const element = this.options?.element;
      if (!this.isPseudoElement && element?.isConnected) {
        this.animation.commitStyles?.();
      }
    }
    get duration() {
      const duration = this.animation.effect?.getComputedTiming?.().duration || 0;
      return millisecondsToSeconds(Number(duration));
    }
    get iterationDuration() {
      const { delay = 0 } = this.options || {};
      return this.duration + millisecondsToSeconds(delay);
    }
    get time() {
      return millisecondsToSeconds(Number(this.animation.currentTime) || 0);
    }
    set time(newTime) {
      const wasFinished = this.finishedTime !== null;
      this.manualStartTime = null;
      this.finishedTime = null;
      this.animation.currentTime = secondsToMilliseconds(newTime);
      if (wasFinished) {
        this.animation.pause();
      }
    }
    /**
     * The playback speed of the animation.
     * 1 = normal speed, 2 = double speed, 0.5 = half speed.
     */
    get speed() {
      return this.animation.playbackRate;
    }
    set speed(newSpeed) {
      if (newSpeed < 0)
        this.finishedTime = null;
      this.animation.playbackRate = newSpeed;
    }
    get state() {
      return this.finishedTime !== null ? "finished" : this.animation.playState;
    }
    get startTime() {
      return this.manualStartTime ?? Number(this.animation.startTime);
    }
    set startTime(newStartTime) {
      this.manualStartTime = this.animation.startTime = newStartTime;
    }
    /**
     * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
     */
    attachTimeline({ timeline, rangeStart, rangeEnd, observe }) {
      if (this.allowFlatten) {
        this.animation.effect?.updateTiming({ easing: "linear" });
      }
      this.animation.onfinish = null;
      if (timeline && supportsScrollTimeline()) {
        this.animation.timeline = timeline;
        if (rangeStart)
          this.animation.rangeStart = rangeStart;
        if (rangeEnd)
          this.animation.rangeEnd = rangeEnd;
        return noop;
      } else {
        return observe(this);
      }
    }
  };

  // node_modules/motion-dom/dist/es/animation/waapi/utils/unsupported-easing.mjs
  var unsupportedEasingFunctions = {
    anticipate,
    backInOut,
    circInOut
  };
  function isUnsupportedEase(key) {
    return key in unsupportedEasingFunctions;
  }
  function replaceStringEasing(transition) {
    if (typeof transition.ease === "string" && isUnsupportedEase(transition.ease)) {
      transition.ease = unsupportedEasingFunctions[transition.ease];
    }
  }

  // node_modules/motion-dom/dist/es/animation/NativeAnimationExtended.mjs
  var sampleDelta = 10;
  var NativeAnimationExtended = class extends NativeAnimation {
    constructor(options) {
      replaceStringEasing(options);
      replaceTransitionType(options);
      super(options);
      if (options.startTime !== void 0 && options.autoplay !== false) {
        this.startTime = options.startTime;
      }
      this.options = options;
    }
    /**
     * WAAPI doesn't natively have any interruption capabilities.
     *
     * Rather than read committed styles back out of the DOM, we can
     * create a renderless JS animation and sample it twice to calculate
     * its current value, "previous" value, and therefore allow
     * Motion to calculate velocity for any subsequent animation.
     */
    updateMotionValue(value) {
      const { motionValue: motionValue2, onUpdate, onComplete, element, ...options } = this.options;
      if (!motionValue2)
        return;
      if (value !== void 0) {
        motionValue2.set(value);
        return;
      }
      const sampleAnimation = new JSAnimation({
        ...options,
        autoplay: false
      });
      const sampleTime = Math.max(sampleDelta, time.now() - this.startTime);
      const delta = clamp(0, sampleDelta, sampleTime - sampleDelta);
      const current = sampleAnimation.sample(sampleTime).value;
      const { name } = this.options;
      if (element && name)
        setStyle(element, name, current);
      motionValue2.setWithVelocity(sampleAnimation.sample(Math.max(0, sampleTime - delta)).value, current, delta);
      sampleAnimation.stop();
    }
  };

  // node_modules/motion-dom/dist/es/animation/utils/is-animatable.mjs
  var isAnimatable = (value, name) => {
    if (name === "zIndex")
      return false;
    if (typeof value === "number" || Array.isArray(value))
      return true;
    if (typeof value === "string" && // It's animatable if we have a string
    (complex.test(value) || value === "0") && // And it contains numbers and/or colors
    !value.startsWith("url(")) {
      return true;
    }
    return false;
  };

  // node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
  function hasKeyframesChanged(keyframes2) {
    const current = keyframes2[0];
    if (keyframes2.length === 1)
      return true;
    for (let i = 0; i < keyframes2.length; i++) {
      if (keyframes2[i] !== current)
        return true;
    }
  }
  function canAnimate(keyframes2, name, type, velocity) {
    const originKeyframe = keyframes2[0];
    if (originKeyframe === null) {
      return false;
    }
    if (name === "display" || name === "visibility")
      return true;
    const targetKeyframe = keyframes2[keyframes2.length - 1];
    const isOriginAnimatable = isAnimatable(originKeyframe, name);
    const isTargetAnimatable = isAnimatable(targetKeyframe, name);
    warning(isOriginAnimatable === isTargetAnimatable, `You are trying to animate ${name} from "${originKeyframe}" to "${targetKeyframe}". "${isOriginAnimatable ? targetKeyframe : originKeyframe}" is not an animatable value.`, "value-not-animatable");
    if (!isOriginAnimatable || !isTargetAnimatable) {
      return false;
    }
    return hasKeyframesChanged(keyframes2) || (type === "spring" || isGenerator(type)) && velocity;
  }

  // node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
  function makeAnimationInstant(options) {
    options.duration = 0;
    options.type = "keyframes";
  }

  // node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
  var acceleratedValues = /* @__PURE__ */ new Set([
    "opacity",
    "clipPath",
    "filter",
    "transform",
    "backgroundColor"
  ]);

  // node_modules/motion-dom/dist/es/animation/waapi/utils/is-browser-color.mjs
  var browserColorFunctions = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
  function hasBrowserOnlyColors(keyframes2) {
    for (let i = 0; i < keyframes2.length; i++) {
      if (typeof keyframes2[i] === "string" && browserColorFunctions.test(keyframes2[i])) {
        return true;
      }
    }
    return false;
  }

  // node_modules/motion-dom/dist/es/animation/waapi/supports/waapi.mjs
  var colorProperties = /* @__PURE__ */ new Set([
    "color",
    "backgroundColor",
    "outlineColor",
    "fill",
    "stroke",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor"
  ]);
  var supportsWaapi = /* @__PURE__ */ memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
  function supportsBrowserAnimation(options) {
    const { motionValue: motionValue2, name, repeatDelay, repeatType, damping, type, keyframes: keyframes2 } = options;
    const subject = motionValue2?.owner?.current;
    if (!(subject instanceof HTMLElement) && !(subject instanceof SVGElement)) {
      return false;
    }
    const { onUpdate, transformTemplate } = motionValue2.owner.getProps();
    return supportsWaapi() && name && /**
     * Force WAAPI for color properties with browser-only color formats
     * (oklch, oklab, lab, lch, etc.) that the JS animation path can't parse.
     */
    (acceleratedValues.has(name) || colorProperties.has(name) && hasBrowserOnlyColors(keyframes2)) && (name !== "transform" || !transformTemplate) && /**
     * If we're outputting values to onUpdate then we can't use WAAPI as there's
     * no way to read the value from WAAPI every frame.
     */
    !onUpdate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
  }

  // node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
  var MAX_RESOLVE_DELAY = 40;
  var AsyncMotionValueAnimation = class extends WithPromise {
    constructor({ autoplay = true, delay = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", keyframes: keyframes2, name, motionValue: motionValue2, element, ...options }) {
      super();
      this.stop = () => {
        if (this._animation) {
          this._animation.stop();
          this.stopTimeline?.();
        }
        this.keyframeResolver?.cancel();
      };
      this.createdAt = time.now();
      const optionsWithDefaults = {
        autoplay,
        delay,
        type,
        repeat,
        repeatDelay,
        repeatType,
        name,
        motionValue: motionValue2,
        element,
        ...options
      };
      const KeyframeResolver$1 = element?.KeyframeResolver || KeyframeResolver;
      this.keyframeResolver = new KeyframeResolver$1(keyframes2, (resolvedKeyframes, finalKeyframe, forced) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe, optionsWithDefaults, !forced), name, motionValue2, element);
      this.keyframeResolver?.scheduleResolve();
    }
    onKeyframesResolved(keyframes2, finalKeyframe, options, sync) {
      this.keyframeResolver = void 0;
      const { name, type, velocity, delay, isHandoff, onUpdate } = options;
      this.resolvedAt = time.now();
      let canAnimateValue = true;
      if (!canAnimate(keyframes2, name, type, velocity)) {
        canAnimateValue = false;
        if (MotionGlobalConfig.instantAnimations || !delay) {
          onUpdate?.(getFinalKeyframe(keyframes2, options, finalKeyframe));
        }
        keyframes2[0] = keyframes2[keyframes2.length - 1];
        makeAnimationInstant(options);
        options.repeat = 0;
      }
      const startTime = sync ? !this.resolvedAt ? this.createdAt : this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt : void 0;
      const resolvedOptions = {
        startTime,
        finalKeyframe,
        ...options,
        keyframes: keyframes2
      };
      const useWaapi = canAnimateValue && !isHandoff && supportsBrowserAnimation(resolvedOptions);
      const element = resolvedOptions.motionValue?.owner?.current;
      let animation;
      if (useWaapi) {
        try {
          animation = new NativeAnimationExtended({
            ...resolvedOptions,
            element
          });
        } catch {
          animation = new JSAnimation(resolvedOptions);
        }
      } else {
        animation = new JSAnimation(resolvedOptions);
      }
      animation.finished.then(() => {
        this.notifyFinished();
      }).catch(noop);
      if (this.pendingTimeline) {
        this.stopTimeline = animation.attachTimeline(this.pendingTimeline);
        this.pendingTimeline = void 0;
      }
      this._animation = animation;
    }
    get finished() {
      if (!this._animation) {
        return this._finished;
      } else {
        return this.animation.finished;
      }
    }
    then(onResolve, _onReject) {
      return this.finished.finally(onResolve).then(() => {
      });
    }
    get animation() {
      if (!this._animation) {
        this.keyframeResolver?.resume();
        flushKeyframeResolvers();
      }
      return this._animation;
    }
    get duration() {
      return this.animation.duration;
    }
    get iterationDuration() {
      return this.animation.iterationDuration;
    }
    get time() {
      return this.animation.time;
    }
    set time(newTime) {
      this.animation.time = newTime;
    }
    get speed() {
      return this.animation.speed;
    }
    get state() {
      return this.animation.state;
    }
    set speed(newSpeed) {
      this.animation.speed = newSpeed;
    }
    get startTime() {
      return this.animation.startTime;
    }
    attachTimeline(timeline) {
      if (this._animation) {
        this.stopTimeline = this.animation.attachTimeline(timeline);
      } else {
        this.pendingTimeline = timeline;
      }
      return () => this.stop();
    }
    play() {
      this.animation.play();
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.complete();
    }
    cancel() {
      if (this._animation) {
        this.animation.cancel();
      }
      this.keyframeResolver?.cancel();
    }
  };

  // node_modules/motion-dom/dist/es/animation/GroupAnimation.mjs
  var GroupAnimation = class {
    constructor(animations) {
      this.stop = () => this.runAll("stop");
      this.animations = animations.filter(Boolean);
    }
    get finished() {
      return Promise.all(this.animations.map((animation) => animation.finished));
    }
    /**
     * TODO: Filter out cancelled or stopped animations before returning
     */
    getAll(propName) {
      return this.animations[0][propName];
    }
    setAll(propName, newValue) {
      for (let i = 0; i < this.animations.length; i++) {
        this.animations[i][propName] = newValue;
      }
    }
    attachTimeline(timeline) {
      const subscriptions = this.animations.map((animation) => animation.attachTimeline(timeline));
      return () => {
        subscriptions.forEach((cancel, i) => {
          cancel && cancel();
          this.animations[i].stop();
        });
      };
    }
    get time() {
      return this.getAll("time");
    }
    set time(time2) {
      this.setAll("time", time2);
    }
    get speed() {
      return this.getAll("speed");
    }
    set speed(speed) {
      this.setAll("speed", speed);
    }
    get state() {
      return this.getAll("state");
    }
    get startTime() {
      return this.getAll("startTime");
    }
    get duration() {
      return getMax(this.animations, "duration");
    }
    get iterationDuration() {
      return getMax(this.animations, "iterationDuration");
    }
    runAll(methodName) {
      this.animations.forEach((controls) => controls[methodName]());
    }
    play() {
      this.runAll("play");
    }
    pause() {
      this.runAll("pause");
    }
    cancel() {
      this.runAll("cancel");
    }
    complete() {
      this.runAll("complete");
    }
  };
  function getMax(animations, propName) {
    let max = 0;
    for (let i = 0; i < animations.length; i++) {
      const value = animations[i][propName];
      if (value !== null && value > max) {
        max = value;
      }
    }
    return max;
  }

  // node_modules/motion-dom/dist/es/animation/GroupAnimationWithThen.mjs
  var GroupAnimationWithThen = class extends GroupAnimation {
    then(onResolve, _onReject) {
      return this.finished.finally(onResolve).then(() => {
      });
    }
  };

  // node_modules/motion-dom/dist/es/value/index.mjs
  var MAX_VELOCITY_DELTA = 30;
  var isFloat = (value) => {
    return !isNaN(parseFloat(value));
  };
  var collectMotionValues = {
    current: void 0
  };
  var MotionValue = class {
    /**
     * @param init - The initiating value
     * @param config - Optional configuration options
     *
     * -  `transformer`: A function to transform incoming values with.
     */
    constructor(init, options = {}) {
      this.canTrackVelocity = null;
      this.events = {};
      this.updateAndNotify = (v) => {
        const currentTime = time.now();
        if (this.updatedAt !== currentTime) {
          this.setPrevFrameValue();
        }
        this.prev = this.current;
        this.setCurrent(v);
        if (this.current !== this.prev) {
          this.events.change?.notify(this.current);
          if (this.dependents) {
            for (const dependent of this.dependents) {
              dependent.dirty();
            }
          }
        }
      };
      this.hasAnimated = false;
      this.setCurrent(init);
      this.owner = options.owner;
    }
    setCurrent(current) {
      this.current = current;
      this.updatedAt = time.now();
      if (this.canTrackVelocity === null && current !== void 0) {
        this.canTrackVelocity = isFloat(this.current);
      }
    }
    setPrevFrameValue(prevFrameValue = this.current) {
      this.prevFrameValue = prevFrameValue;
      this.prevUpdatedAt = this.updatedAt;
    }
    /**
     * Adds a function that will be notified when the `MotionValue` is updated.
     *
     * It returns a function that, when called, will cancel the subscription.
     *
     * When calling `onChange` inside a React component, it should be wrapped with the
     * `useEffect` hook. As it returns an unsubscribe function, this should be returned
     * from the `useEffect` function to ensure you don't add duplicate subscribers..
     *
     * ```jsx
     * export const MyComponent = () => {
     *   const x = useMotionValue(0)
     *   const y = useMotionValue(0)
     *   const opacity = useMotionValue(1)
     *
     *   useEffect(() => {
     *     function updateOpacity() {
     *       const maxXY = Math.max(x.get(), y.get())
     *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
     *       opacity.set(newOpacity)
     *     }
     *
     *     const unsubscribeX = x.on("change", updateOpacity)
     *     const unsubscribeY = y.on("change", updateOpacity)
     *
     *     return () => {
     *       unsubscribeX()
     *       unsubscribeY()
     *     }
     *   }, [])
     *
     *   return <motion.div style={{ x }} />
     * }
     * ```
     *
     * @param subscriber - A function that receives the latest value.
     * @returns A function that, when called, will cancel this subscription.
     *
     * @deprecated
     */
    onChange(subscription) {
      if (true) {
        warnOnce(false, `value.onChange(callback) is deprecated. Switch to value.on("change", callback).`);
      }
      return this.on("change", subscription);
    }
    on(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = new SubscriptionManager();
      }
      const unsubscribe = this.events[eventName].add(callback);
      if (eventName === "change") {
        return () => {
          unsubscribe();
          frame.read(() => {
            if (!this.events.change.getSize()) {
              this.stop();
            }
          });
        };
      }
      return unsubscribe;
    }
    clearListeners() {
      for (const eventManagers in this.events) {
        this.events[eventManagers].clear();
      }
    }
    /**
     * Attaches a passive effect to the `MotionValue`.
     */
    attach(passiveEffect, stopPassiveEffect) {
      this.passiveEffect = passiveEffect;
      this.stopPassiveEffect = stopPassiveEffect;
    }
    /**
     * Sets the state of the `MotionValue`.
     *
     * @remarks
     *
     * ```jsx
     * const x = useMotionValue(0)
     * x.set(10)
     * ```
     *
     * @param latest - Latest value to set.
     * @param render - Whether to notify render subscribers. Defaults to `true`
     *
     * @public
     */
    set(v) {
      if (!this.passiveEffect) {
        this.updateAndNotify(v);
      } else {
        this.passiveEffect(v, this.updateAndNotify);
      }
    }
    setWithVelocity(prev, current, delta) {
      this.set(current);
      this.prev = void 0;
      this.prevFrameValue = prev;
      this.prevUpdatedAt = this.updatedAt - delta;
    }
    /**
     * Set the state of the `MotionValue`, stopping any active animations,
     * effects, and resets velocity to `0`.
     */
    jump(v, endAnimation = true) {
      this.updateAndNotify(v);
      this.prev = v;
      this.prevUpdatedAt = this.prevFrameValue = void 0;
      endAnimation && this.stop();
      if (this.stopPassiveEffect)
        this.stopPassiveEffect();
    }
    dirty() {
      this.events.change?.notify(this.current);
    }
    addDependent(dependent) {
      if (!this.dependents) {
        this.dependents = /* @__PURE__ */ new Set();
      }
      this.dependents.add(dependent);
    }
    removeDependent(dependent) {
      if (this.dependents) {
        this.dependents.delete(dependent);
      }
    }
    /**
     * Returns the latest state of `MotionValue`
     *
     * @returns - The latest state of `MotionValue`
     *
     * @public
     */
    get() {
      if (collectMotionValues.current) {
        collectMotionValues.current.push(this);
      }
      return this.current;
    }
    /**
     * @public
     */
    getPrevious() {
      return this.prev;
    }
    /**
     * Returns the latest velocity of `MotionValue`
     *
     * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
     *
     * @public
     */
    getVelocity() {
      const currentTime = time.now();
      if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) {
        return 0;
      }
      const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
      return velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
    }
    /**
     * Registers a new animation to control this `MotionValue`. Only one
     * animation can drive a `MotionValue` at one time.
     *
     * ```jsx
     * value.start()
     * ```
     *
     * @param animation - A function that starts the provided animation
     */
    start(startAnimation) {
      this.stop();
      return new Promise((resolve) => {
        this.hasAnimated = true;
        this.animation = startAnimation(resolve);
        if (this.events.animationStart) {
          this.events.animationStart.notify();
        }
      }).then(() => {
        if (this.events.animationComplete) {
          this.events.animationComplete.notify();
        }
        this.clearAnimation();
      });
    }
    /**
     * Stop the currently active animation.
     *
     * @public
     */
    stop() {
      if (this.animation) {
        this.animation.stop();
        if (this.events.animationCancel) {
          this.events.animationCancel.notify();
        }
      }
      this.clearAnimation();
    }
    /**
     * Returns `true` if this value is currently animating.
     *
     * @public
     */
    isAnimating() {
      return !!this.animation;
    }
    clearAnimation() {
      delete this.animation;
    }
    /**
     * Destroy and clean up subscribers to this `MotionValue`.
     *
     * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
     * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
     * created a `MotionValue` via the `motionValue` function.
     *
     * @public
     */
    destroy() {
      this.dependents?.clear();
      this.events.destroy?.notify();
      this.clearListeners();
      this.stop();
      if (this.stopPassiveEffect) {
        this.stopPassiveEffect();
      }
    }
  };
  function motionValue(init, options) {
    return new MotionValue(init, options);
  }

  // node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
  function resolveTransition(transition, parentTransition) {
    if (transition?.inherit && parentTransition) {
      const { inherit: _, ...rest } = transition;
      return { ...parentTransition, ...rest };
    }
    return transition;
  }

  // node_modules/motion-dom/dist/es/animation/utils/get-value-transition.mjs
  function getValueTransition(transition, key) {
    const valueTransition = transition?.[key] ?? transition?.["default"] ?? transition;
    if (valueTransition !== transition) {
      return resolveTransition(valueTransition, transition);
    }
    return valueTransition;
  }

  // node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
  var underDampedSpring = {
    type: "spring",
    stiffness: 500,
    damping: 25,
    restSpeed: 10
  };
  var criticallyDampedSpring = (target) => ({
    type: "spring",
    stiffness: 550,
    damping: target === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10
  });
  var keyframesTransition = {
    type: "keyframes",
    duration: 0.8
  };
  var ease = {
    type: "keyframes",
    ease: [0.25, 0.1, 0.35, 1],
    duration: 0.3
  };
  var getDefaultTransition = (valueKey, { keyframes: keyframes2 }) => {
    if (keyframes2.length > 2) {
      return keyframesTransition;
    } else if (transformProps.has(valueKey)) {
      return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes2[1]) : underDampedSpring;
    }
    return ease;
  };

  // node_modules/motion-dom/dist/es/animation/utils/is-transition-defined.mjs
  var orchestrationKeys = /* @__PURE__ */ new Set([
    "when",
    "delay",
    "delayChildren",
    "staggerChildren",
    "staggerDirection",
    "repeat",
    "repeatType",
    "repeatDelay",
    "from",
    "elapsed"
  ]);
  function isTransitionDefined(transition) {
    for (const key in transition) {
      if (!orchestrationKeys.has(key))
        return true;
    }
    return false;
  }

  // node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
  var animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
    const valueTransition = getValueTransition(transition, name) || {};
    const delay = valueTransition.delay || transition.delay || 0;
    let { elapsed = 0 } = transition;
    elapsed = elapsed - secondsToMilliseconds(delay);
    const options = {
      keyframes: Array.isArray(target) ? target : [null, target],
      ease: "easeOut",
      velocity: value.getVelocity(),
      ...valueTransition,
      delay: -elapsed,
      onUpdate: (v) => {
        value.set(v);
        valueTransition.onUpdate && valueTransition.onUpdate(v);
      },
      onComplete: () => {
        onComplete();
        valueTransition.onComplete && valueTransition.onComplete();
      },
      name,
      motionValue: value,
      element: isHandoff ? void 0 : element
    };
    if (!isTransitionDefined(valueTransition)) {
      Object.assign(options, getDefaultTransition(name, options));
    }
    options.duration && (options.duration = secondsToMilliseconds(options.duration));
    options.repeatDelay && (options.repeatDelay = secondsToMilliseconds(options.repeatDelay));
    if (options.from !== void 0) {
      options.keyframes[0] = options.from;
    }
    let shouldSkip = false;
    if (options.type === false || options.duration === 0 && !options.repeatDelay) {
      makeAnimationInstant(options);
      if (options.delay === 0) {
        shouldSkip = true;
      }
    }
    if (MotionGlobalConfig.instantAnimations || MotionGlobalConfig.skipAnimations || element?.shouldSkipAnimations || valueTransition.skipAnimations) {
      shouldSkip = true;
      makeAnimationInstant(options);
      options.delay = 0;
    }
    options.allowFlatten = !valueTransition.type && !valueTransition.ease;
    if (shouldSkip && !isHandoff && value.get() !== void 0) {
      const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
      if (finalKeyframe !== void 0) {
        frame.update(() => {
          options.onUpdate(finalKeyframe);
          options.onComplete();
        });
        return;
      }
    }
    return valueTransition.isSync ? new JSAnimation(options) : new AsyncMotionValueAnimation(options);
  };

  // node_modules/motion-dom/dist/es/animation/utils/css-variables-conversion.mjs
  var splitCSSVariableRegex = (
    // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
    /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
  );
  function parseCSSVariable(current) {
    const match = splitCSSVariableRegex.exec(current);
    if (!match)
      return [,];
    const [, token1, token2, fallback] = match;
    return [`--${token1 ?? token2}`, fallback];
  }
  var maxDepth = 4;
  function getVariableValue(current, element, depth = 1) {
    invariant(depth <= maxDepth, `Max CSS variable fallback depth detected in property "${current}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
    const [token, fallback] = parseCSSVariable(current);
    if (!token)
      return;
    const resolved = window.getComputedStyle(element).getPropertyValue(token);
    if (resolved) {
      const trimmed = resolved.trim();
      return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
    }
    return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
  }

  // node_modules/motion-dom/dist/es/render/utils/resolve-variants.mjs
  function getValueState(visualElement) {
    const state = [{}, {}];
    visualElement?.values.forEach((value, key) => {
      state[0][key] = value.get();
      state[1][key] = value.getVelocity();
    });
    return state;
  }
  function resolveVariantFromProps(props, definition, custom, visualElement) {
    if (typeof definition === "function") {
      const [current, velocity] = getValueState(visualElement);
      definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
    }
    if (typeof definition === "string") {
      definition = props.variants && props.variants[definition];
    }
    if (typeof definition === "function") {
      const [current, velocity] = getValueState(visualElement);
      definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
    }
    return definition;
  }

  // node_modules/motion-dom/dist/es/render/utils/resolve-dynamic-variants.mjs
  function resolveVariant(visualElement, definition, custom) {
    const props = visualElement.getProps();
    return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
  }

  // node_modules/motion-dom/dist/es/render/utils/keys-position.mjs
  var positionalKeys = /* @__PURE__ */ new Set([
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    ...transformPropOrder
  ]);

  // node_modules/motion-dom/dist/es/render/utils/is-keyframes-target.mjs
  var isKeyframesTarget = (v) => {
    return Array.isArray(v);
  };

  // node_modules/motion-dom/dist/es/render/utils/setters.mjs
  function setMotionValue(visualElement, key, value) {
    if (visualElement.hasValue(key)) {
      visualElement.getValue(key).set(value);
    } else {
      visualElement.addValue(key, motionValue(value));
    }
  }
  function resolveFinalValueInKeyframes(v) {
    return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
  }
  function setTarget(visualElement, definition) {
    const resolved = resolveVariant(visualElement, definition);
    let { transitionEnd = {}, transition = {}, ...target } = resolved || {};
    target = { ...target, ...transitionEnd };
    for (const key in target) {
      const value = resolveFinalValueInKeyframes(target[key]);
      setMotionValue(visualElement, key, value);
    }
  }

  // node_modules/motion-dom/dist/es/value/utils/is-motion-value.mjs
  var isMotionValue = (value) => Boolean(value && value.getVelocity);

  // node_modules/motion-dom/dist/es/value/will-change/is.mjs
  function isWillChangeMotionValue(value) {
    return Boolean(isMotionValue(value) && value.add);
  }

  // node_modules/motion-dom/dist/es/value/will-change/add-will-change.mjs
  function addValueToWillChange(visualElement, key) {
    const willChange = visualElement.getValue("willChange");
    if (isWillChangeMotionValue(willChange)) {
      return willChange.add(key);
    } else if (!willChange && MotionGlobalConfig.WillChange) {
      const newWillChange = new MotionGlobalConfig.WillChange("auto");
      visualElement.addValue("willChange", newWillChange);
      newWillChange.add(key);
    }
  }

  // node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
  function camelToDash(str) {
    return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
  }

  // node_modules/motion-dom/dist/es/animation/optimized-appear/data-id.mjs
  var optimizedAppearDataId = "framerAppearId";
  var optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);

  // node_modules/motion-dom/dist/es/animation/optimized-appear/get-appear-id.mjs
  function getOptimisedAppearId(visualElement) {
    return visualElement.props[optimizedAppearDataAttribute];
  }

  // node_modules/motion-dom/dist/es/animation/interfaces/visual-element-target.mjs
  function shouldBlockAnimation({ protectedKeys, needsAnimating }, key) {
    const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
    needsAnimating[key] = false;
    return shouldBlock;
  }
  function animateTarget(visualElement, targetAndTransition, { delay = 0, transitionOverride, type } = {}) {
    let { transition, transitionEnd, ...target } = targetAndTransition;
    const defaultTransition = visualElement.getDefaultTransition();
    transition = transition ? resolveTransition(transition, defaultTransition) : defaultTransition;
    const reduceMotion = transition?.reduceMotion;
    const skipAnimations = transition?.skipAnimations;
    if (transitionOverride)
      transition = transitionOverride;
    const animations = [];
    const animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
    const path = transition?.path;
    if (path) {
      path.animateVisualElement(visualElement, target, transition, delay, animations);
    }
    for (const key in target) {
      const value = visualElement.getValue(key, visualElement.latestValues[key] ?? null);
      const valueTarget = target[key];
      if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) {
        continue;
      }
      const valueTransition = {
        delay,
        ...getValueTransition(transition || {}, key)
      };
      if (skipAnimations)
        valueTransition.skipAnimations = true;
      const currentValue = value.get();
      if (currentValue !== void 0 && !value.isAnimating() && !Array.isArray(valueTarget) && valueTarget === currentValue && !valueTransition.velocity) {
        frame.update(() => value.set(valueTarget));
        continue;
      }
      let isHandoff = false;
      if (window.MotionHandoffAnimation) {
        const appearId = getOptimisedAppearId(visualElement);
        if (appearId) {
          const startTime = window.MotionHandoffAnimation(appearId, key, frame);
          if (startTime !== null) {
            valueTransition.startTime = startTime;
            isHandoff = true;
          }
        }
      }
      addValueToWillChange(visualElement, key);
      const shouldReduceMotion = reduceMotion ?? visualElement.shouldReduceMotion;
      value.start(animateMotionValue(key, value, valueTarget, shouldReduceMotion && positionalKeys.has(key) ? { type: false } : valueTransition, visualElement, isHandoff));
      const animation = value.animation;
      if (animation) {
        animations.push(animation);
      }
    }
    if (transitionEnd) {
      const applyTransitionEnd = () => frame.update(() => {
        transitionEnd && setTarget(visualElement, transitionEnd);
      });
      if (animations.length) {
        Promise.all(animations).then(applyTransitionEnd);
      } else {
        applyTransitionEnd();
      }
    }
    return animations;
  }

  // node_modules/motion-dom/dist/es/value/types/auto.mjs
  var auto = {
    test: (v) => v === "auto",
    parse: (v) => v
  };

  // node_modules/motion-dom/dist/es/value/types/test.mjs
  var testValueType = (v) => (type) => type.test(v);

  // node_modules/motion-dom/dist/es/value/types/dimensions.mjs
  var dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
  var findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));

  // node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
  function isNone(value) {
    if (typeof value === "number") {
      return value === 0;
    } else if (value !== null) {
      return value === "none" || value === "0" || isZeroValueString(value);
    } else {
      return true;
    }
  }

  // node_modules/motion-dom/dist/es/value/types/complex/filter.mjs
  var maxDefaults = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
  function applyDefaultFilter(v) {
    const [name, value] = v.slice(0, -1).split("(");
    if (name === "drop-shadow")
      return v;
    const [number2] = value.match(floatRegex) || [];
    if (!number2)
      return v;
    const unit = value.replace(number2, "");
    let defaultValue = maxDefaults.has(name) ? 1 : 0;
    if (number2 !== value)
      defaultValue *= 100;
    return name + "(" + defaultValue + unit + ")";
  }
  var functionRegex = /\b([a-z-]*)\(.*?\)/gu;
  var filter = {
    ...complex,
    getAnimatableNone: (v) => {
      const functions = v.match(functionRegex);
      return functions ? functions.map(applyDefaultFilter).join(" ") : v;
    }
  };

  // node_modules/motion-dom/dist/es/value/types/complex/mask.mjs
  var mask = {
    ...complex,
    getAnimatableNone: (v) => {
      const parsed = complex.parse(v);
      const transformer = complex.createTransformer(v);
      return transformer(parsed.map((v2) => typeof v2 === "number" ? 0 : typeof v2 === "object" ? { ...v2, alpha: 1 } : v2));
    }
  };

  // node_modules/motion-dom/dist/es/value/types/int.mjs
  var int = {
    ...number,
    transform: Math.round
  };

  // node_modules/motion-dom/dist/es/value/types/maps/transform.mjs
  var transformValueTypes = {
    rotate: degrees,
    /**
     * Internal channel for `transition.path` orientToPath. Composed onto
     * `rotate` at the transform-build sites so the user's `rotate` is
     * never read or overwritten. Not part of `transformPropOrder`.
     */
    pathRotation: degrees,
    rotateX: degrees,
    rotateY: degrees,
    rotateZ: degrees,
    scale,
    scaleX: scale,
    scaleY: scale,
    scaleZ: scale,
    skew: degrees,
    skewX: degrees,
    skewY: degrees,
    distance: px,
    translateX: px,
    translateY: px,
    translateZ: px,
    x: px,
    y: px,
    z: px,
    perspective: px,
    transformPerspective: px,
    opacity: alpha,
    originX: progressPercentage,
    originY: progressPercentage,
    originZ: px
  };

  // node_modules/motion-dom/dist/es/value/types/maps/number.mjs
  var numberValueTypes = {
    // Border props
    borderWidth: px,
    borderTopWidth: px,
    borderRightWidth: px,
    borderBottomWidth: px,
    borderLeftWidth: px,
    borderRadius: px,
    borderTopLeftRadius: px,
    borderTopRightRadius: px,
    borderBottomRightRadius: px,
    borderBottomLeftRadius: px,
    // Positioning props
    width: px,
    maxWidth: px,
    height: px,
    maxHeight: px,
    top: px,
    right: px,
    bottom: px,
    left: px,
    inset: px,
    insetBlock: px,
    insetBlockStart: px,
    insetBlockEnd: px,
    insetInline: px,
    insetInlineStart: px,
    insetInlineEnd: px,
    // Spacing props
    padding: px,
    paddingTop: px,
    paddingRight: px,
    paddingBottom: px,
    paddingLeft: px,
    paddingBlock: px,
    paddingBlockStart: px,
    paddingBlockEnd: px,
    paddingInline: px,
    paddingInlineStart: px,
    paddingInlineEnd: px,
    margin: px,
    marginTop: px,
    marginRight: px,
    marginBottom: px,
    marginLeft: px,
    marginBlock: px,
    marginBlockStart: px,
    marginBlockEnd: px,
    marginInline: px,
    marginInlineStart: px,
    marginInlineEnd: px,
    // Typography
    fontSize: px,
    // Misc
    backgroundPositionX: px,
    backgroundPositionY: px,
    ...transformValueTypes,
    zIndex: int,
    // SVG
    fillOpacity: alpha,
    strokeOpacity: alpha,
    numOctaves: int
  };

  // node_modules/motion-dom/dist/es/value/types/maps/defaults.mjs
  var defaultValueTypes = {
    ...numberValueTypes,
    // Color props
    color,
    backgroundColor: color,
    outlineColor: color,
    fill: color,
    stroke: color,
    // Border props
    borderColor: color,
    borderTopColor: color,
    borderRightColor: color,
    borderBottomColor: color,
    borderLeftColor: color,
    filter,
    WebkitFilter: filter,
    mask,
    WebkitMask: mask
  };
  var getDefaultValueType = (key) => defaultValueTypes[key];

  // node_modules/motion-dom/dist/es/value/types/utils/animatable-none.mjs
  var customTypes = /* @__PURE__ */ new Set([filter, mask]);
  function getAnimatableNone2(key, value) {
    let defaultValueType = getDefaultValueType(key);
    if (!customTypes.has(defaultValueType))
      defaultValueType = complex;
    return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
  }

  // node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
  var invalidTemplates = /* @__PURE__ */ new Set(["auto", "none", "0"]);
  function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
    let i = 0;
    let animatableTemplate = void 0;
    while (i < unresolvedKeyframes.length && !animatableTemplate) {
      const keyframe = unresolvedKeyframes[i];
      if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) {
        animatableTemplate = unresolvedKeyframes[i];
      }
      i++;
    }
    if (animatableTemplate && name) {
      for (const noneIndex of noneKeyframeIndexes) {
        unresolvedKeyframes[noneIndex] = getAnimatableNone2(name, animatableTemplate);
      }
    }
  }

  // node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
  var DOMKeyframesResolver = class extends KeyframeResolver {
    constructor(unresolvedKeyframes, onComplete, name, motionValue2, element) {
      super(unresolvedKeyframes, onComplete, name, motionValue2, element, true);
    }
    readKeyframes() {
      const { unresolvedKeyframes, element, name } = this;
      if (!element || !element.current)
        return;
      super.readKeyframes();
      for (let i = 0; i < unresolvedKeyframes.length; i++) {
        let keyframe = unresolvedKeyframes[i];
        if (typeof keyframe === "string") {
          keyframe = keyframe.trim();
          if (isCSSVariableToken(keyframe)) {
            const resolved = getVariableValue(keyframe, element.current);
            if (resolved !== void 0) {
              unresolvedKeyframes[i] = resolved;
            }
            if (i === unresolvedKeyframes.length - 1) {
              this.finalKeyframe = keyframe;
            }
          }
        }
      }
      this.resolveNoneKeyframes();
      if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) {
        return;
      }
      const [origin, target] = unresolvedKeyframes;
      const originType = findDimensionValueType(origin);
      const targetType = findDimensionValueType(target);
      const originHasVar = containsCSSVariable(origin);
      const targetHasVar = containsCSSVariable(target);
      if (originHasVar !== targetHasVar && positionalValues[name]) {
        this.needsMeasurement = true;
        return;
      }
      if (originType === targetType)
        return;
      if (isNumOrPxType(originType) && isNumOrPxType(targetType)) {
        for (let i = 0; i < unresolvedKeyframes.length; i++) {
          const value = unresolvedKeyframes[i];
          if (typeof value === "string") {
            unresolvedKeyframes[i] = parseFloat(value);
          }
        }
      } else if (positionalValues[name]) {
        this.needsMeasurement = true;
      }
    }
    resolveNoneKeyframes() {
      const { unresolvedKeyframes, name } = this;
      const noneKeyframeIndexes = [];
      for (let i = 0; i < unresolvedKeyframes.length; i++) {
        if (unresolvedKeyframes[i] === null || isNone(unresolvedKeyframes[i])) {
          noneKeyframeIndexes.push(i);
        }
      }
      if (noneKeyframeIndexes.length) {
        makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
      }
    }
    measureInitialState() {
      const { element, unresolvedKeyframes, name } = this;
      if (!element || !element.current)
        return;
      if (name === "height") {
        this.suspendedScrollY = window.pageYOffset;
      }
      this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
      unresolvedKeyframes[0] = this.measuredOrigin;
      const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
      if (measureKeyframe !== void 0) {
        element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
      }
    }
    measureEndState() {
      const { element, name, unresolvedKeyframes } = this;
      if (!element || !element.current)
        return;
      const value = element.getValue(name);
      value && value.jump(this.measuredOrigin, false);
      const finalKeyframeIndex = unresolvedKeyframes.length - 1;
      const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
      unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
      if (finalKeyframe !== null && this.finalKeyframe === void 0) {
        this.finalKeyframe = finalKeyframe;
      }
      if (this.removedTransforms?.length) {
        this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
          element.getValue(unsetTransformName).set(unsetTransformValue);
        });
      }
      this.resolveNoneKeyframes();
    }
  };

  // node_modules/motion-dom/dist/es/utils/border-radius.mjs
  var cornerRadiusProps = [
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomRightRadius",
    "borderBottomLeftRadius"
  ];

  // node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
  function resolveElements(elementOrSelector, scope, selectorCache) {
    if (elementOrSelector == null) {
      return [];
    }
    if (elementOrSelector instanceof EventTarget) {
      return [elementOrSelector];
    } else if (typeof elementOrSelector === "string") {
      let root = document;
      if (scope) {
        root = scope.current;
      }
      const elements = selectorCache?.[elementOrSelector] ?? root.querySelectorAll(elementOrSelector);
      return elements ? Array.from(elements) : [];
    }
    return Array.from(elementOrSelector).filter((element) => element != null);
  }

  // node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
  var getValueAsType = (value, type) => {
    return type && typeof value === "number" ? type.transform(value) : value;
  };

  // node_modules/motion-dom/dist/es/frameloop/microtask.mjs
  var { schedule: microtask, cancel: cancelMicrotask } = /* @__PURE__ */ createRenderBatcher(queueMicrotask, false);

  // node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
  function isSVGElement(element) {
    return isObject(element) && "ownerSVGElement" in element;
  }

  // node_modules/motion-dom/dist/es/utils/is-svg-svg-element.mjs
  function isSVGSVGElement(element) {
    return isSVGElement(element) && element.tagName === "svg";
  }

  // node_modules/motion-dom/dist/es/utils/stagger.mjs
  function getOriginIndex(from, total) {
    if (from === "first") {
      return 0;
    } else {
      const lastIndex = total - 1;
      return from === "last" ? lastIndex : lastIndex / 2;
    }
  }
  function stagger(duration = 0.1, { startDelay = 0, from = 0, ease: ease2 } = {}) {
    return (i, total) => {
      const fromIndex = typeof from === "number" ? from : getOriginIndex(from, total);
      const distance = Math.abs(fromIndex - i);
      let delay = duration * distance;
      if (ease2) {
        const maxDelay = total * duration;
        const easingFunction = easingDefinitionToFunction(ease2);
        delay = easingFunction(delay / maxDelay) * maxDelay;
      }
      return startDelay + delay;
    };
  }

  // node_modules/motion-dom/dist/es/value/types/utils/find.mjs
  var valueTypes = [...dimensionValueTypes, color, complex];
  var findValueType = (v) => valueTypes.find(testValueType(v));

  // node_modules/motion-dom/dist/es/projection/geometry/models.mjs
  var createAxis = () => ({ min: 0, max: 0 });
  var createBox = () => ({
    x: createAxis(),
    y: createAxis()
  });

  // node_modules/motion-dom/dist/es/render/store.mjs
  var visualElementStore = /* @__PURE__ */ new WeakMap();

  // node_modules/motion-dom/dist/es/render/utils/is-animation-controls.mjs
  function isAnimationControls(v) {
    return v !== null && typeof v === "object" && typeof v.start === "function";
  }

  // node_modules/motion-dom/dist/es/render/utils/is-variant-label.mjs
  function isVariantLabel(v) {
    return typeof v === "string" || Array.isArray(v);
  }

  // node_modules/motion-dom/dist/es/render/utils/variant-props.mjs
  var variantPriorityOrder = [
    "animate",
    "whileInView",
    "whileFocus",
    "whileHover",
    "whileTap",
    "whileDrag",
    "exit"
  ];
  var variantProps = ["initial", ...variantPriorityOrder];

  // node_modules/motion-dom/dist/es/render/utils/is-controlling-variants.mjs
  function isControllingVariants(props) {
    return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
  }
  function isVariantNode(props) {
    return Boolean(isControllingVariants(props) || props.variants);
  }

  // node_modules/motion-dom/dist/es/render/utils/motion-values.mjs
  function updateMotionValuesFromProps(element, next, prev) {
    for (const key in next) {
      const nextValue = next[key];
      const prevValue = prev[key];
      if (isMotionValue(nextValue)) {
        element.addValue(key, nextValue);
      } else if (isMotionValue(prevValue)) {
        element.addValue(key, motionValue(nextValue, { owner: element }));
      } else if (prevValue !== nextValue) {
        if (element.hasValue(key)) {
          const existingValue = element.getValue(key);
          if (existingValue.liveStyle === true) {
            existingValue.jump(nextValue);
          } else if (!existingValue.hasAnimated) {
            existingValue.set(nextValue);
          }
        } else {
          const latestValue = element.getStaticValue(key);
          element.addValue(key, motionValue(latestValue !== void 0 ? latestValue : nextValue, { owner: element }));
        }
      }
    }
    for (const key in prev) {
      if (next[key] === void 0)
        element.removeValue(key);
    }
    return next;
  }

  // node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs
  var prefersReducedMotion = { current: null };
  var hasReducedMotionListener = { current: false };

  // node_modules/motion-dom/dist/es/render/utils/reduced-motion/index.mjs
  var isBrowser = typeof window !== "undefined";
  function initPrefersReducedMotion() {
    hasReducedMotionListener.current = true;
    if (!isBrowser)
      return;
    if (window.matchMedia) {
      const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
      const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
      motionMediaQuery.addEventListener("change", setReducedMotionPreferences);
      setReducedMotionPreferences();
    } else {
      prefersReducedMotion.current = false;
    }
  }

  // node_modules/motion-dom/dist/es/render/VisualElement.mjs
  var propEventHandlers = [
    "AnimationStart",
    "AnimationComplete",
    "Update",
    "BeforeLayoutMeasure",
    "LayoutMeasure",
    "LayoutAnimationStart",
    "LayoutAnimationComplete"
  ];
  var featureDefinitions = {};
  var VisualElement = class {
    /**
     * This method takes React props and returns found MotionValues. For example, HTML
     * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
     *
     * This isn't an abstract method as it needs calling in the constructor, but it is
     * intended to be one.
     */
    scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
      return {};
    }
    constructor({ parent, props, presenceContext, reducedMotionConfig, skipAnimations, blockInitialAnimation, visualState }, options = {}) {
      this.current = null;
      this.children = /* @__PURE__ */ new Set();
      this.isVariantNode = false;
      this.isControllingVariants = false;
      this.shouldReduceMotion = null;
      this.shouldSkipAnimations = false;
      this.values = /* @__PURE__ */ new Map();
      this.KeyframeResolver = KeyframeResolver;
      this.features = {};
      this.valueSubscriptions = /* @__PURE__ */ new Map();
      this.prevMotionValues = {};
      this.hasBeenMounted = false;
      this.events = {};
      this.propEventSubscriptions = {};
      this.notifyUpdate = () => this.notify("Update", this.latestValues);
      this.render = () => {
        if (!this.current)
          return;
        this.triggerBuild();
        this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
      };
      this.renderScheduledAt = 0;
      this.scheduleRender = () => {
        const now2 = time.now();
        if (this.renderScheduledAt < now2) {
          this.renderScheduledAt = now2;
          frame.render(this.render, false, true);
        }
      };
      const { latestValues, renderState } = visualState;
      this.latestValues = latestValues;
      this.baseTarget = { ...latestValues };
      this.initialValues = props.initial ? { ...latestValues } : {};
      this.renderState = renderState;
      this.parent = parent;
      this.props = props;
      this.presenceContext = presenceContext;
      this.depth = parent ? parent.depth + 1 : 0;
      this.reducedMotionConfig = reducedMotionConfig;
      this.skipAnimationsConfig = skipAnimations;
      this.options = options;
      this.blockInitialAnimation = Boolean(blockInitialAnimation);
      this.isControllingVariants = isControllingVariants(props);
      this.isVariantNode = isVariantNode(props);
      if (this.isVariantNode) {
        this.variantChildren = /* @__PURE__ */ new Set();
      }
      this.manuallyAnimateOnMount = Boolean(parent && parent.current);
      const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
      for (const key in initialMotionValues) {
        const value = initialMotionValues[key];
        if (latestValues[key] !== void 0 && isMotionValue(value)) {
          value.set(latestValues[key]);
        }
      }
    }
    mount(instance) {
      if (this.hasBeenMounted) {
        for (const key in this.initialValues) {
          this.values.get(key)?.jump(this.initialValues[key]);
          this.latestValues[key] = this.initialValues[key];
        }
      }
      this.current = instance;
      visualElementStore.set(instance, this);
      if (this.projection && !this.projection.instance) {
        this.projection.mount(instance);
      }
      if (this.parent && this.isVariantNode && !this.isControllingVariants) {
        this.removeFromVariantTree = this.parent.addVariantChild(this);
      }
      this.values.forEach((value, key) => this.bindToMotionValue(key, value));
      if (this.reducedMotionConfig === "never") {
        this.shouldReduceMotion = false;
      } else if (this.reducedMotionConfig === "always") {
        this.shouldReduceMotion = true;
      } else {
        if (!hasReducedMotionListener.current) {
          initPrefersReducedMotion();
        }
        this.shouldReduceMotion = prefersReducedMotion.current;
      }
      if (true) {
        warnOnce(this.shouldReduceMotion !== true, "You have Reduced Motion enabled on your device. Animations may not appear as expected.", "reduced-motion-disabled");
      }
      this.shouldSkipAnimations = this.skipAnimationsConfig ?? false;
      this.parent?.addChild(this);
      this.update(this.props, this.presenceContext);
      this.hasBeenMounted = true;
    }
    unmount() {
      this.projection && this.projection.unmount();
      cancelFrame(this.notifyUpdate);
      cancelFrame(this.render);
      this.valueSubscriptions.forEach((remove) => remove());
      this.valueSubscriptions.clear();
      this.removeFromVariantTree && this.removeFromVariantTree();
      this.parent?.removeChild(this);
      for (const key in this.events) {
        this.events[key].clear();
      }
      for (const key in this.features) {
        const feature = this.features[key];
        if (feature) {
          feature.unmount();
          feature.isMounted = false;
        }
      }
      this.current = null;
    }
    addChild(child) {
      this.children.add(child);
      this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set());
      this.enteringChildren.add(child);
    }
    removeChild(child) {
      this.children.delete(child);
      this.enteringChildren && this.enteringChildren.delete(child);
    }
    bindToMotionValue(key, value) {
      if (this.valueSubscriptions.has(key)) {
        this.valueSubscriptions.get(key)();
      }
      if (value.accelerate && acceleratedValues.has(key) && this.current instanceof HTMLElement) {
        const { factory, keyframes: keyframes2, times, ease: ease2, duration } = value.accelerate;
        const animation = new NativeAnimation({
          element: this.current,
          name: key,
          keyframes: keyframes2,
          times,
          ease: ease2,
          duration: secondsToMilliseconds(duration)
        });
        const cleanup = factory(animation);
        this.valueSubscriptions.set(key, () => {
          cleanup();
          animation.cancel();
        });
        return;
      }
      const valueIsTransform = transformProps.has(key);
      if (valueIsTransform && this.onBindTransform) {
        this.onBindTransform();
      }
      const removeOnChange = value.on("change", (latestValue) => {
        this.latestValues[key] = latestValue;
        this.props.onUpdate && frame.preRender(this.notifyUpdate);
        if (valueIsTransform && this.projection) {
          this.projection.isTransformDirty = true;
        }
        this.scheduleRender();
      });
      let removeSyncCheck;
      if (typeof window !== "undefined" && window.MotionCheckAppearSync) {
        removeSyncCheck = window.MotionCheckAppearSync(this, key, value);
      }
      this.valueSubscriptions.set(key, () => {
        removeOnChange();
        if (removeSyncCheck)
          removeSyncCheck();
      });
    }
    sortNodePosition(other) {
      if (!this.current || !this.sortInstanceNodePosition || this.type !== other.type) {
        return 0;
      }
      return this.sortInstanceNodePosition(this.current, other.current);
    }
    updateFeatures() {
      let key = "animation";
      for (key in featureDefinitions) {
        const featureDefinition = featureDefinitions[key];
        if (!featureDefinition)
          continue;
        const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
        if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) {
          this.features[key] = new FeatureConstructor(this);
        }
        if (this.features[key]) {
          const feature = this.features[key];
          if (feature.isMounted) {
            feature.update();
          } else {
            feature.mount();
            feature.isMounted = true;
          }
        }
      }
    }
    triggerBuild() {
      this.build(this.renderState, this.latestValues, this.props);
    }
    /**
     * Measure the current viewport box with or without transforms.
     * Only measures axis-aligned boxes, rotate and skew must be manually
     * removed with a re-render to work.
     */
    measureViewportBox() {
      return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
    }
    getStaticValue(key) {
      return this.latestValues[key];
    }
    setStaticValue(key, value) {
      this.latestValues[key] = value;
    }
    /**
     * Update the provided props. Ensure any newly-added motion values are
     * added to our map, old ones removed, and listeners updated.
     */
    update(props, presenceContext) {
      if (props.transformTemplate || this.props.transformTemplate) {
        this.scheduleRender();
      }
      this.prevProps = this.props;
      this.props = props;
      this.prevPresenceContext = this.presenceContext;
      this.presenceContext = presenceContext;
      for (let i = 0; i < propEventHandlers.length; i++) {
        const key = propEventHandlers[i];
        if (this.propEventSubscriptions[key]) {
          this.propEventSubscriptions[key]();
          delete this.propEventSubscriptions[key];
        }
        const listenerName = "on" + key;
        const listener = props[listenerName];
        if (listener) {
          this.propEventSubscriptions[key] = this.on(key, listener);
        }
      }
      this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps || {}, this), this.prevMotionValues);
      if (this.handleChildMotionValue) {
        this.handleChildMotionValue();
      }
    }
    getProps() {
      return this.props;
    }
    /**
     * Returns the variant definition with a given name.
     */
    getVariant(name) {
      return this.props.variants ? this.props.variants[name] : void 0;
    }
    /**
     * Returns the defined default transition on this component.
     */
    getDefaultTransition() {
      return this.props.transition;
    }
    getTransformPagePoint() {
      return this.props.transformPagePoint;
    }
    getClosestVariantNode() {
      return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
    }
    /**
     * Add a child visual element to our set of children.
     */
    addVariantChild(child) {
      const closestVariantNode = this.getClosestVariantNode();
      if (closestVariantNode) {
        closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
        return () => closestVariantNode.variantChildren.delete(child);
      }
    }
    /**
     * Add a motion value and bind it to this visual element.
     */
    addValue(key, value) {
      const existingValue = this.values.get(key);
      if (value !== existingValue) {
        if (existingValue)
          this.removeValue(key);
        this.bindToMotionValue(key, value);
        this.values.set(key, value);
        this.latestValues[key] = value.get();
      }
    }
    /**
     * Remove a motion value and unbind any active subscriptions.
     */
    removeValue(key) {
      this.values.delete(key);
      const unsubscribe = this.valueSubscriptions.get(key);
      if (unsubscribe) {
        unsubscribe();
        this.valueSubscriptions.delete(key);
      }
      delete this.latestValues[key];
      this.removeValueFromRenderState(key, this.renderState);
    }
    /**
     * Check whether we have a motion value for this key
     */
    hasValue(key) {
      return this.values.has(key);
    }
    getValue(key, defaultValue) {
      if (this.props.values && this.props.values[key]) {
        return this.props.values[key];
      }
      let value = this.values.get(key);
      if (value === void 0 && defaultValue !== void 0) {
        value = motionValue(defaultValue === null ? void 0 : defaultValue, { owner: this });
        this.addValue(key, value);
      }
      return value;
    }
    /**
     * If we're trying to animate to a previously unencountered value,
     * we need to check for it in our state and as a last resort read it
     * directly from the instance (which might have performance implications).
     */
    readValue(key, target) {
      let value = this.latestValues[key] !== void 0 || !this.current ? this.latestValues[key] : this.getBaseTargetFromProps(this.props, key) ?? this.readValueFromInstance(this.current, key, this.options);
      if (value !== void 0 && value !== null) {
        if (typeof value === "string" && (isNumericalString(value) || isZeroValueString(value))) {
          value = parseFloat(value);
        } else if (!findValueType(value) && complex.test(target)) {
          value = getAnimatableNone2(key, target);
        }
        this.setBaseTarget(key, isMotionValue(value) ? value.get() : value);
      }
      return isMotionValue(value) ? value.get() : value;
    }
    /**
     * Set the base target to later animate back to. This is currently
     * only hydrated on creation and when we first read a value.
     */
    setBaseTarget(key, value) {
      this.baseTarget[key] = value;
    }
    /**
     * Find the base target for a value thats been removed from all animation
     * props.
     */
    getBaseTarget(key) {
      const { initial } = this.props;
      let valueFromInitial;
      if (typeof initial === "string" || typeof initial === "object") {
        const variant = resolveVariantFromProps(this.props, initial, this.presenceContext?.custom);
        if (variant) {
          valueFromInitial = variant[key];
        }
      }
      if (initial && valueFromInitial !== void 0) {
        return valueFromInitial;
      }
      const target = this.getBaseTargetFromProps(this.props, key);
      if (target !== void 0 && !isMotionValue(target))
        return target;
      return this.initialValues[key] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key];
    }
    on(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = new SubscriptionManager();
      }
      return this.events[eventName].add(callback);
    }
    notify(eventName, ...args) {
      if (this.events[eventName]) {
        this.events[eventName].notify(...args);
      }
    }
    scheduleRenderMicrotask() {
      microtask.render(this.render);
    }
  };

  // node_modules/motion-dom/dist/es/render/dom/DOMVisualElement.mjs
  var DOMVisualElement = class extends VisualElement {
    constructor() {
      super(...arguments);
      this.KeyframeResolver = DOMKeyframesResolver;
    }
    sortInstanceNodePosition(a, b) {
      return a.compareDocumentPosition(b) & 2 ? 1 : -1;
    }
    getBaseTargetFromProps(props, key) {
      const style = props.style;
      return style ? style[key] : void 0;
    }
    removeValueFromRenderState(key, { vars, style }) {
      delete vars[key];
      delete style[key];
    }
    handleChildMotionValue() {
      if (this.childSubscription) {
        this.childSubscription();
        delete this.childSubscription;
      }
      const { children } = this.props;
      if (isMotionValue(children)) {
        this.childSubscription = children.on("change", (latest) => {
          if (this.current) {
            this.current.textContent = `${latest}`;
          }
        });
      }
    }
  };

  // node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
  function convertBoundingBoxToBox({ top, left, right, bottom }) {
    return {
      x: { min: left, max: right },
      y: { min: top, max: bottom }
    };
  }
  function transformBoxPoints(point, transformPoint) {
    if (!transformPoint)
      return point;
    const topLeft = transformPoint({ x: point.left, y: point.top });
    const bottomRight = transformPoint({ x: point.right, y: point.bottom });
    return {
      top: topLeft.y,
      left: topLeft.x,
      bottom: bottomRight.y,
      right: bottomRight.x
    };
  }

  // node_modules/motion-dom/dist/es/projection/utils/measure.mjs
  function measureViewportBox(instance, transformPoint) {
    return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint));
  }

  // node_modules/motion-dom/dist/es/render/html/utils/build-transform.mjs
  var translateAlias = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective"
  };
  var numTransforms = transformPropOrder.length;
  function buildTransform(latestValues, transform, transformTemplate) {
    let transformString = "";
    let transformIsDefault = true;
    for (let i = 0; i < numTransforms; i++) {
      const key = transformPropOrder[i];
      const value = latestValues[key];
      if (value === void 0)
        continue;
      let valueIsDefault = true;
      if (typeof value === "number") {
        valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
      } else {
        const parsed = parseFloat(value);
        valueIsDefault = key.startsWith("scale") ? parsed === 1 : parsed === 0;
      }
      if (!valueIsDefault || transformTemplate) {
        const valueAsType = getValueAsType(value, numberValueTypes[key]);
        if (!valueIsDefault) {
          transformIsDefault = false;
          const transformName = translateAlias[key] || key;
          transformString += `${transformName}(${valueAsType}) `;
        }
        if (transformTemplate) {
          transform[key] = valueAsType;
        }
      }
    }
    const pathRotation = latestValues.pathRotation;
    if (pathRotation) {
      transformIsDefault = false;
      transformString += `rotate(${getValueAsType(pathRotation, numberValueTypes.pathRotation)}) `;
    }
    transformString = transformString.trim();
    if (transformTemplate) {
      transformString = transformTemplate(transform, transformIsDefault ? "" : transformString);
    } else if (transformIsDefault) {
      transformString = "none";
    }
    return transformString;
  }

  // node_modules/motion-dom/dist/es/render/html/utils/build-styles.mjs
  function buildHTMLStyles(state, latestValues, transformTemplate) {
    const { style, vars, transformOrigin } = state;
    let hasTransform = false;
    let hasTransformOrigin = false;
    for (const key in latestValues) {
      const value = latestValues[key];
      if (transformProps.has(key)) {
        hasTransform = true;
        continue;
      } else if (isCSSVariableName(key)) {
        vars[key] = value;
        continue;
      } else {
        const valueAsType = getValueAsType(value, numberValueTypes[key]);
        if (key.startsWith("origin")) {
          hasTransformOrigin = true;
          transformOrigin[key] = valueAsType;
        } else {
          style[key] = valueAsType;
        }
      }
    }
    if (!latestValues.transform) {
      if (hasTransform || transformTemplate) {
        style.transform = buildTransform(latestValues, state.transform, transformTemplate);
      } else if (style.transform) {
        style.transform = "none";
      }
    }
    if (hasTransformOrigin) {
      const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin;
      style.transformOrigin = `${originX} ${originY} ${originZ}`;
    }
  }

  // node_modules/motion-dom/dist/es/render/html/utils/render.mjs
  function renderHTML(element, { style, vars }, styleProp, projection) {
    const elementStyle = element.style;
    let key;
    for (key in style) {
      elementStyle[key] = style[key];
    }
    projection?.applyProjectionStyles(elementStyle, styleProp);
    for (key in vars) {
      elementStyle.setProperty(key, vars[key]);
    }
  }

  // node_modules/motion-dom/dist/es/projection/styles/scale-border-radius.mjs
  function pixelsToPercent(pixels, axis) {
    if (axis.max === axis.min)
      return 0;
    return pixels / (axis.max - axis.min) * 100;
  }
  var correctBorderRadius = {
    correct: (latest, node) => {
      if (!node.target)
        return latest;
      if (typeof latest === "string") {
        if (px.test(latest)) {
          latest = parseFloat(latest);
        } else {
          return latest;
        }
      }
      const x = pixelsToPercent(latest, node.target.x);
      const y = pixelsToPercent(latest, node.target.y);
      return `${x}% ${y}%`;
    }
  };

  // node_modules/motion-dom/dist/es/projection/styles/scale-box-shadow.mjs
  var correctBoxShadow = {
    correct: (latest, { treeScale, projectionDelta }) => {
      const original = latest;
      const shadow = complex.parse(latest);
      if (shadow.length > 5)
        return original;
      const template = complex.createTransformer(latest);
      const offset = typeof shadow[0] !== "number" ? 1 : 0;
      const xScale = projectionDelta.x.scale * treeScale.x;
      const yScale = projectionDelta.y.scale * treeScale.y;
      shadow[0 + offset] /= xScale;
      shadow[1 + offset] /= yScale;
      const averageScale = mixNumber(xScale, yScale, 0.5);
      if (typeof shadow[2 + offset] === "number")
        shadow[2 + offset] /= averageScale;
      if (typeof shadow[3 + offset] === "number")
        shadow[3 + offset] /= averageScale;
      return template(shadow);
    }
  };

  // node_modules/motion-dom/dist/es/projection/styles/scale-correction.mjs
  var scaleCorrectors = {
    borderRadius: {
      ...correctBorderRadius,
      applyTo: [...cornerRadiusProps]
    },
    borderTopLeftRadius: correctBorderRadius,
    borderTopRightRadius: correctBorderRadius,
    borderBottomLeftRadius: correctBorderRadius,
    borderBottomRightRadius: correctBorderRadius,
    boxShadow: correctBoxShadow
  };

  // node_modules/motion-dom/dist/es/render/utils/is-forced-motion-value.mjs
  function isForcedMotionValue(key, { layout, layoutId }) {
    return transformProps.has(key) || key.startsWith("origin") || (layout || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
  }

  // node_modules/motion-dom/dist/es/render/html/utils/scrape-motion-values.mjs
  function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    const style = props.style;
    const prevStyle = prevProps?.style;
    const newValues = {};
    if (!style)
      return newValues;
    for (const key in style) {
      if (isMotionValue(style[key]) || prevStyle && isMotionValue(prevStyle[key]) || isForcedMotionValue(key, props) || visualElement?.getValue(key)?.liveStyle !== void 0) {
        newValues[key] = style[key];
      }
    }
    return newValues;
  }

  // node_modules/motion-dom/dist/es/render/html/HTMLVisualElement.mjs
  function getComputedStyle2(element) {
    return window.getComputedStyle(element);
  }
  var HTMLVisualElement = class extends DOMVisualElement {
    constructor() {
      super(...arguments);
      this.type = "html";
      this.renderInstance = renderHTML;
    }
    mount(instance) {
      invariant(Boolean(instance.style), "motion.create() components must forward their ref to a HTML or SVG element", "custom-component-ref");
      super.mount(instance);
    }
    readValueFromInstance(instance, key) {
      if (transformProps.has(key)) {
        return this.projection?.isProjecting ? defaultTransformValue(key) : readTransformValue(instance, key);
      } else {
        const computedStyle = getComputedStyle2(instance);
        const value = (isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
        return typeof value === "string" ? value.trim() : value;
      }
    }
    measureInstanceViewportBox(instance, { transformPagePoint }) {
      return measureViewportBox(instance, transformPagePoint);
    }
    build(renderState, latestValues, props) {
      buildHTMLStyles(renderState, latestValues, props.transformTemplate);
    }
    scrapeMotionValuesFromProps(props, prevProps, visualElement) {
      return scrapeMotionValuesFromProps(props, prevProps, visualElement);
    }
  };

  // node_modules/motion-dom/dist/es/render/object/ObjectVisualElement.mjs
  function isObjectKey(key, object) {
    return key in object;
  }
  var ObjectVisualElement = class extends VisualElement {
    constructor() {
      super(...arguments);
      this.type = "object";
    }
    readValueFromInstance(instance, key) {
      if (isObjectKey(key, instance)) {
        const value = instance[key];
        if (typeof value === "string" || typeof value === "number") {
          return value;
        }
      }
      return void 0;
    }
    getBaseTargetFromProps() {
      return void 0;
    }
    removeValueFromRenderState(key, renderState) {
      delete renderState.output[key];
    }
    measureInstanceViewportBox() {
      return createBox();
    }
    build(renderState, latestValues) {
      Object.assign(renderState.output, latestValues);
    }
    renderInstance(instance, { output }) {
      Object.assign(instance, output);
    }
    sortInstanceNodePosition() {
      return 0;
    }
  };

  // node_modules/motion-dom/dist/es/render/svg/utils/path.mjs
  var dashKeys = {
    offset: "stroke-dashoffset",
    array: "stroke-dasharray"
  };
  var camelKeys = {
    offset: "strokeDashoffset",
    array: "strokeDasharray"
  };
  function buildSVGPath(attrs, length, spacing = 1, offset = 0, useDashCase = true) {
    attrs.pathLength = 1;
    const keys = useDashCase ? dashKeys : camelKeys;
    attrs[keys.offset] = `${-offset}`;
    attrs[keys.array] = `${length} ${spacing}`;
  }

  // node_modules/motion-dom/dist/es/render/svg/utils/build-attrs.mjs
  var cssMotionPathProperties = [
    "offsetDistance",
    "offsetPath",
    "offsetRotate",
    "offsetAnchor"
  ];
  function buildSVGAttrs(state, {
    attrX,
    attrY,
    attrScale,
    pathLength,
    pathSpacing = 1,
    pathOffset = 0,
    // This is object creation, which we try to avoid per-frame.
    ...latest
  }, isSVGTag2, transformTemplate, styleProp) {
    buildHTMLStyles(state, latest, transformTemplate);
    if (isSVGTag2) {
      if (state.style.viewBox) {
        state.attrs.viewBox = state.style.viewBox;
      }
      return;
    }
    state.attrs = state.style;
    state.style = {};
    const { attrs, style } = state;
    if (attrs.transform) {
      style.transform = attrs.transform;
      delete attrs.transform;
    }
    if (style.transform || attrs.transformOrigin) {
      style.transformOrigin = attrs.transformOrigin ?? "50% 50%";
      delete attrs.transformOrigin;
    }
    if (style.transform) {
      style.transformBox = styleProp?.transformBox ?? "fill-box";
      delete attrs.transformBox;
    }
    for (const key of cssMotionPathProperties) {
      if (attrs[key] !== void 0) {
        style[key] = attrs[key];
        delete attrs[key];
      }
    }
    if (attrX !== void 0)
      attrs.x = attrX;
    if (attrY !== void 0)
      attrs.y = attrY;
    if (attrScale !== void 0)
      attrs.scale = attrScale;
    if (pathLength !== void 0) {
      buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
    }
  }

  // node_modules/motion-dom/dist/es/render/svg/utils/camel-case-attrs.mjs
  var camelCaseAttributes = /* @__PURE__ */ new Set([
    "baseFrequency",
    "diffuseConstant",
    "kernelMatrix",
    "kernelUnitLength",
    "keySplines",
    "keyTimes",
    "limitingConeAngle",
    "markerHeight",
    "markerWidth",
    "numOctaves",
    "targetX",
    "targetY",
    "surfaceScale",
    "specularConstant",
    "specularExponent",
    "stdDeviation",
    "tableValues",
    "viewBox",
    "gradientTransform",
    "pathLength",
    "startOffset",
    "textLength",
    "lengthAdjust"
  ]);

  // node_modules/motion-dom/dist/es/render/svg/utils/is-svg-tag.mjs
  var isSVGTag = (tag) => typeof tag === "string" && tag.toLowerCase() === "svg";

  // node_modules/motion-dom/dist/es/render/svg/utils/render.mjs
  function renderSVG(element, renderState, _styleProp, projection) {
    renderHTML(element, renderState, void 0, projection);
    for (const key in renderState.attrs) {
      element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
    }
  }

  // node_modules/motion-dom/dist/es/render/svg/utils/scrape-motion-values.mjs
  function scrapeMotionValuesFromProps2(props, prevProps, visualElement) {
    const newValues = scrapeMotionValuesFromProps(props, prevProps, visualElement);
    for (const key in props) {
      if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
        const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
        newValues[targetKey] = props[key];
      }
    }
    return newValues;
  }

  // node_modules/motion-dom/dist/es/render/svg/SVGVisualElement.mjs
  var SVGVisualElement = class extends DOMVisualElement {
    constructor() {
      super(...arguments);
      this.type = "svg";
      this.isSVGTag = false;
      this.measureInstanceViewportBox = createBox;
    }
    getBaseTargetFromProps(props, key) {
      return props[key];
    }
    readValueFromInstance(instance, key) {
      if (transformProps.has(key)) {
        const defaultType = getDefaultValueType(key);
        return defaultType ? defaultType.default || 0 : 0;
      }
      key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
      return instance.getAttribute(key);
    }
    scrapeMotionValuesFromProps(props, prevProps, visualElement) {
      return scrapeMotionValuesFromProps2(props, prevProps, visualElement);
    }
    build(renderState, latestValues, props) {
      buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate, props.style);
    }
    renderInstance(instance, renderState, styleProp, projection) {
      renderSVG(instance, renderState, styleProp, projection);
    }
    mount(instance) {
      this.isSVGTag = isSVGTag(instance.tagName);
      super.mount(instance);
    }
  };

  // node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
  function animateSingleValue(value, keyframes2, options) {
    const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
    motionValue$1.start(animateMotionValue("", motionValue$1, keyframes2, options));
    return motionValue$1.animation;
  }

  // node_modules/framer-motion/dist/es/animation/utils/is-dom-keyframes.mjs
  function isDOMKeyframes(keyframes2) {
    return typeof keyframes2 === "object" && !Array.isArray(keyframes2);
  }

  // node_modules/framer-motion/dist/es/animation/animate/resolve-subjects.mjs
  function resolveSubjects(subject, keyframes2, scope, selectorCache) {
    if (subject == null) {
      return [];
    }
    if (typeof subject === "string" && isDOMKeyframes(keyframes2)) {
      return resolveElements(subject, scope, selectorCache);
    } else if (subject instanceof NodeList) {
      return Array.from(subject);
    } else if (Array.isArray(subject)) {
      return subject.filter((s) => s != null);
    } else {
      return [subject];
    }
  }

  // node_modules/framer-motion/dist/es/animation/sequence/utils/calc-repeat-duration.mjs
  function calculateRepeatDuration(duration, repeat, repeatDelay) {
    return duration * (repeat + 1) + repeatDelay * repeat;
  }

  // node_modules/framer-motion/dist/es/animation/sequence/utils/calc-time.mjs
  function calcNextTime(current, next, prev, labels) {
    if (typeof next === "number") {
      return next;
    } else if (next.startsWith("-") || next.startsWith("+")) {
      return Math.max(0, current + parseFloat(next));
    } else if (next === "<") {
      return prev;
    } else if (next.startsWith("<")) {
      return Math.max(0, prev + parseFloat(next.slice(1)));
    } else {
      return labels.get(next) ?? current;
    }
  }

  // node_modules/framer-motion/dist/es/animation/sequence/utils/edit.mjs
  function eraseKeyframes(sequence, startTime, endTime) {
    for (let i = 0; i < sequence.length; i++) {
      const keyframe = sequence[i];
      if (keyframe.at > startTime && keyframe.at < endTime) {
        removeItem(sequence, keyframe);
        i--;
      }
    }
  }
  function addKeyframes(sequence, keyframes2, easing, offset, startTime, endTime) {
    eraseKeyframes(sequence, startTime, endTime);
    for (let i = 0; i < keyframes2.length; i++) {
      sequence.push({
        value: keyframes2[i],
        at: mixNumber(startTime, endTime, offset[i]),
        easing: getEasingForSegment(easing, i)
      });
    }
  }

  // node_modules/framer-motion/dist/es/animation/sequence/utils/normalize-times.mjs
  function normalizeTimes(times, repeat, repeatDelayUnits = 0) {
    const totalUnits = repeat + 1 + repeat * repeatDelayUnits;
    for (let i = 0; i < times.length; i++) {
      times[i] = times[i] / totalUnits;
    }
  }

  // node_modules/framer-motion/dist/es/animation/sequence/utils/sort.mjs
  function compareByTime(a, b) {
    if (a.at === b.at) {
      if (a.value === null)
        return 1;
      if (b.value === null)
        return -1;
      return 0;
    } else {
      return a.at - b.at;
    }
  }

  // node_modules/framer-motion/dist/es/animation/sequence/create.mjs
  var defaultSegmentEasing = "easeInOut";
  var MAX_REPEAT = 20;
  function createAnimationsFromSequence(sequence, { defaultTransition = {}, ...sequenceTransition } = {}, scope, generators) {
    const defaultDuration = defaultTransition.duration || 0.3;
    const animationDefinitions = /* @__PURE__ */ new Map();
    const sequences = /* @__PURE__ */ new Map();
    const elementCache = {};
    const timeLabels = /* @__PURE__ */ new Map();
    let prevTime = 0;
    let currentTime = 0;
    let totalDuration = 0;
    for (let i = 0; i < sequence.length; i++) {
      const segment = sequence[i];
      if (typeof segment === "string") {
        timeLabels.set(segment, currentTime);
        continue;
      } else if (!Array.isArray(segment)) {
        timeLabels.set(segment.name, calcNextTime(currentTime, segment.at, prevTime, timeLabels));
        continue;
      }
      let [subject, keyframes2, transition = {}] = segment;
      if (transition.at !== void 0) {
        currentTime = calcNextTime(currentTime, transition.at, prevTime, timeLabels);
      }
      let maxDuration = 0;
      const resolveValueSequence = (valueKeyframes, valueTransition, valueSequence, elementIndex = 0, numSubjects = 0) => {
        const valueKeyframesAsList = keyframesAsList(valueKeyframes);
        const { delay = 0, times = defaultOffset(valueKeyframesAsList), type = defaultTransition.type || "keyframes", repeat, repeatType, repeatDelay = 0, ...remainingTransition } = valueTransition;
        let { ease: ease2 = defaultTransition.ease || "easeOut", duration } = valueTransition;
        const calculatedDelay = typeof delay === "function" ? delay(elementIndex, numSubjects) : delay;
        const numKeyframes = valueKeyframesAsList.length;
        const createGenerator = isGenerator(type) ? type : generators?.[type || "keyframes"];
        if (numKeyframes <= 2 && createGenerator) {
          let absoluteDelta = 100;
          if (numKeyframes === 2 && isNumberKeyframesArray(valueKeyframesAsList)) {
            const delta = valueKeyframesAsList[1] - valueKeyframesAsList[0];
            absoluteDelta = Math.abs(delta);
          }
          const springTransition = {
            ...defaultTransition,
            ...remainingTransition
          };
          if (duration !== void 0) {
            springTransition.duration = secondsToMilliseconds(duration);
          }
          const springEasing = createGeneratorEasing(springTransition, absoluteDelta, createGenerator);
          ease2 = springEasing.ease;
          duration = springEasing.duration;
        }
        duration ?? (duration = defaultDuration);
        const startTime = currentTime + calculatedDelay;
        if (times.length === 1 && times[0] === 0) {
          times[1] = 1;
        }
        const remainder = times.length - valueKeyframesAsList.length;
        remainder > 0 && fillOffset(times, remainder);
        valueKeyframesAsList.length === 1 && valueKeyframesAsList.unshift(null);
        if (repeat) {
          warning(repeat < MAX_REPEAT, `Sequence segments can't repeat ${repeat} times \u2014 ignoring repeat option. Use a value below ${MAX_REPEAT} or apply repeat at the sequence level instead.`);
        }
        if (repeat && repeat < MAX_REPEAT) {
          const repeatDelayUnits = duration > 0 ? repeatDelay / duration : 0;
          duration = calculateRepeatDuration(duration, repeat, repeatDelay);
          const originalKeyframes = [...valueKeyframesAsList];
          const originalTimes = [...times];
          ease2 = Array.isArray(ease2) ? [...ease2] : [ease2];
          const originalEase = [...ease2];
          const isFlipping = repeatType === "reverse" || repeatType === "mirror";
          let flippedKeyframes = originalKeyframes;
          let flippedEases = originalEase;
          if (isFlipping) {
            flippedKeyframes = [...originalKeyframes].reverse();
            if (repeatType === "reverse") {
              flippedEases = [...originalEase].reverse().map((e) => typeof e === "function" ? reverseEasing(e) : e);
            }
          }
          for (let repeatIndex = 0; repeatIndex < repeat; repeatIndex++) {
            const isFlipped = isFlipping && repeatIndex % 2 === 0;
            const iterKeyframes = isFlipped ? flippedKeyframes : originalKeyframes;
            const iterEase = isFlipped ? flippedEases : originalEase;
            const iterStartOffset = (repeatIndex + 1) * (1 + repeatDelayUnits);
            if (repeatDelayUnits > 0) {
              valueKeyframesAsList.push(valueKeyframesAsList[valueKeyframesAsList.length - 1]);
              times.push(iterStartOffset);
              ease2.push("linear");
            }
            valueKeyframesAsList.push(...iterKeyframes);
            for (let keyframeIndex = 0; keyframeIndex < iterKeyframes.length; keyframeIndex++) {
              times.push(originalTimes[keyframeIndex] + iterStartOffset);
              ease2.push(keyframeIndex === 0 ? "linear" : getEasingForSegment(iterEase, keyframeIndex - 1));
            }
          }
          normalizeTimes(times, repeat, repeatDelayUnits);
        }
        const targetTime = startTime + duration;
        addKeyframes(valueSequence, valueKeyframesAsList, ease2, times, startTime, targetTime);
        maxDuration = Math.max(calculatedDelay + duration, maxDuration);
        totalDuration = Math.max(targetTime, totalDuration);
      };
      if (isMotionValue(subject)) {
        const subjectSequence = getSubjectSequence(subject, sequences);
        resolveValueSequence(keyframes2, transition, getValueSequence("default", subjectSequence));
      } else {
        const subjects = resolveSubjects(subject, keyframes2, scope, elementCache);
        const numSubjects = subjects.length;
        for (let subjectIndex = 0; subjectIndex < numSubjects; subjectIndex++) {
          keyframes2 = keyframes2;
          transition = transition;
          const thisSubject = subjects[subjectIndex];
          const subjectSequence = getSubjectSequence(thisSubject, sequences);
          for (const key in keyframes2) {
            resolveValueSequence(keyframes2[key], getValueTransition2(transition, key), getValueSequence(key, subjectSequence), subjectIndex, numSubjects);
          }
        }
      }
      prevTime = currentTime;
      currentTime += maxDuration;
    }
    sequences.forEach((valueSequences, element) => {
      for (const key in valueSequences) {
        const valueSequence = valueSequences[key];
        valueSequence.sort(compareByTime);
        const keyframes2 = [];
        const valueOffset = [];
        const valueEasing = [];
        for (let i = 0; i < valueSequence.length; i++) {
          const { at, value, easing } = valueSequence[i];
          keyframes2.push(value);
          valueOffset.push(progress(0, totalDuration, at));
          valueEasing.push(easing || "easeOut");
        }
        if (valueOffset[0] !== 0) {
          valueOffset.unshift(0);
          keyframes2.unshift(keyframes2[0]);
          valueEasing.unshift(defaultSegmentEasing);
        }
        if (valueOffset[valueOffset.length - 1] !== 1) {
          valueOffset.push(1);
          keyframes2.push(null);
        }
        if (!animationDefinitions.has(element)) {
          animationDefinitions.set(element, {
            keyframes: {},
            transition: {}
          });
        }
        const definition = animationDefinitions.get(element);
        definition.keyframes[key] = keyframes2;
        const { type: _type, ...remainingDefaultTransition } = defaultTransition;
        definition.transition[key] = {
          ...remainingDefaultTransition,
          duration: totalDuration,
          ease: valueEasing,
          times: valueOffset,
          ...sequenceTransition
        };
      }
    });
    return animationDefinitions;
  }
  function getSubjectSequence(subject, sequences) {
    !sequences.has(subject) && sequences.set(subject, {});
    return sequences.get(subject);
  }
  function getValueSequence(name, sequences) {
    if (!sequences[name])
      sequences[name] = [];
    return sequences[name];
  }
  function keyframesAsList(keyframes2) {
    return Array.isArray(keyframes2) ? keyframes2 : [keyframes2];
  }
  function getValueTransition2(transition, key) {
    return transition && transition[key] ? {
      ...transition,
      ...transition[key]
    } : { ...transition };
  }
  var isNumber = (keyframe) => typeof keyframe === "number";
  var isNumberKeyframesArray = (keyframes2) => keyframes2.every(isNumber);

  // node_modules/framer-motion/dist/es/animation/utils/create-visual-element.mjs
  function createDOMVisualElement(element) {
    const options = {
      presenceContext: null,
      props: {},
      visualState: {
        renderState: {
          transform: {},
          transformOrigin: {},
          style: {},
          vars: {},
          attrs: {}
        },
        latestValues: {}
      }
    };
    const node = isSVGElement(element) && !isSVGSVGElement(element) ? new SVGVisualElement(options) : new HTMLVisualElement(options);
    node.mount(element);
    visualElementStore.set(element, node);
  }
  function createObjectVisualElement(subject) {
    const options = {
      presenceContext: null,
      props: {},
      visualState: {
        renderState: {
          output: {}
        },
        latestValues: {}
      }
    };
    const node = new ObjectVisualElement(options);
    node.mount(subject);
    visualElementStore.set(subject, node);
  }

  // node_modules/framer-motion/dist/es/animation/animate/subject.mjs
  function isSingleValue(subject, keyframes2) {
    return isMotionValue(subject) || typeof subject === "number" || typeof subject === "string" && !isDOMKeyframes(keyframes2);
  }
  function animateSubject(subject, keyframes2, options, scope) {
    const animations = [];
    if (isSingleValue(subject, keyframes2)) {
      animations.push(animateSingleValue(subject, isDOMKeyframes(keyframes2) ? keyframes2.default || keyframes2 : keyframes2, options ? options.default || options : options));
    } else {
      if (subject == null) {
        return animations;
      }
      const subjects = resolveSubjects(subject, keyframes2, scope);
      const numSubjects = subjects.length;
      invariant(Boolean(numSubjects), "No valid elements provided.", "no-valid-elements");
      for (let i = 0; i < numSubjects; i++) {
        const thisSubject = subjects[i];
        const createVisualElement = thisSubject instanceof Element ? createDOMVisualElement : createObjectVisualElement;
        if (!visualElementStore.has(thisSubject)) {
          createVisualElement(thisSubject);
        }
        const visualElement = visualElementStore.get(thisSubject);
        const transition = { ...options };
        if ("delay" in transition && typeof transition.delay === "function") {
          transition.delay = transition.delay(i, numSubjects);
        }
        animations.push(...animateTarget(visualElement, { ...keyframes2, transition }, {}));
      }
    }
    return animations;
  }

  // node_modules/framer-motion/dist/es/animation/animate/sequence.mjs
  function animateSequence(sequence, options, scope) {
    const animations = [];
    const processedSequence = sequence.map((segment) => {
      if (Array.isArray(segment) && typeof segment[0] === "function") {
        const callback = segment[0];
        const mv = motionValue(0);
        mv.on("change", callback);
        if (segment.length === 1) {
          return [mv, [0, 1]];
        } else if (segment.length === 2) {
          return [mv, [0, 1], segment[1]];
        } else {
          return [mv, segment[1], segment[2]];
        }
      }
      return segment;
    });
    const animationDefinitions = createAnimationsFromSequence(processedSequence, options, scope, { spring });
    animationDefinitions.forEach(({ keyframes: keyframes2, transition }, subject) => {
      animations.push(...animateSubject(subject, keyframes2, transition));
    });
    return animations;
  }

  // node_modules/framer-motion/dist/es/animation/animate/index.mjs
  function isSequence(value) {
    return Array.isArray(value) && value.some(Array.isArray);
  }
  function createScopedAnimate(options = {}) {
    const { scope, reduceMotion, skipAnimations } = options;
    function scopedAnimate(subjectOrSequence, optionsOrKeyframes, options2) {
      let animations = [];
      let animationOnComplete;
      const inherited = {};
      if (reduceMotion !== void 0)
        inherited.reduceMotion = reduceMotion;
      if (skipAnimations !== void 0)
        inherited.skipAnimations = skipAnimations;
      if (isSequence(subjectOrSequence)) {
        const { onComplete, ...sequenceOptions } = optionsOrKeyframes || {};
        if (typeof onComplete === "function") {
          animationOnComplete = onComplete;
        }
        animations = animateSequence(subjectOrSequence, { ...inherited, ...sequenceOptions }, scope);
      } else {
        const { onComplete, ...rest } = options2 || {};
        if (typeof onComplete === "function") {
          animationOnComplete = onComplete;
        }
        animations = animateSubject(subjectOrSequence, optionsOrKeyframes, { ...inherited, ...rest }, scope);
      }
      const animation = new GroupAnimationWithThen(animations);
      if (animationOnComplete) {
        animation.finished.then(animationOnComplete);
      }
      if (scope) {
        scope.animations.push(animation);
        animation.finished.then(() => {
          removeItem(scope.animations, animation);
        });
      }
      return animation;
    }
    return scopedAnimate;
  }
  var animate = createScopedAnimate();

  // app.js
  (function() {
    "use strict";
    const STORAGE_KEY = "rtwDashboardState_v1";
    const REGION_LABELS = { asia: "\u4E9E\u6D32", europe: "\u6B50\u6D32", americas: "\u7F8E\u6D32", oceania: "\u5927\u6D0B\u6D32", africa: "\u975E\u6D32" };
    const REGION_ORDER = ["asia", "europe", "americas", "oceania", "africa"];
    const VISA_LABELS = {
      visa_free: "\u514D\u7C3D\u8B49",
      eta: "ETA\u96FB\u5B50\u8A31\u53EF",
      voa: "\u843D\u5730\u7C3D\u8B49",
      evisa: "\u96FB\u5B50\u7C3D\u8B49",
      visa_required: "\u9700\u8FA6\u7C3D\u8B49",
      restricted: "\u5165\u5883\u53D7\u9650"
    };
    const VISA_CLASS = {
      visa_free: "vfree",
      eta: "veta",
      voa: "vvoa",
      evisa: "vevisa",
      visa_required: "vreq",
      restricted: "vrestricted"
    };
    const SAFETY_LABELS = {
      grey: "\u7070\u8272\u63D0\u9192",
      yellow: "\u9EC3\u8272\u6CE8\u610F",
      orange: "\u6A59\u8272\u907F\u514D\u524D\u5F80",
      red: "\u7D05\u8272\u5118\u901F\u96E2\u5883"
    };
    const YELLOW_FEVER_LABELS = {
      required: "\u9700\u9EC3\u71B1\u75C5\u8B49\u660E",
      conditional: "\u8996\u60C5\u6CC1\u9700\u9EC3\u71B1\u75C5\u8B49\u660E"
    };
    const SCHENGEN_IDS = ["fr", "de", "it", "es", "pt", "nl", "at", "ch", "gr", "cz", "pl", "hu", "hr", "se", "no", "is", "be", "dk", "fi", "lu", "mt", "si", "sk", "ee", "lv", "lt", "bg", "ro", "li"];
    const STATUS_LABELS = {
      "": "\uFF0D \u5C1A\u672A\u8A2D\u5B9A \uFF0D",
      idea: "\u{1F4AD} \u60F3\u53BB\u770B\u770B",
      planned: "\u{1F4DD} \u5DF2\u898F\u5283",
      booked: "\u{1F3AB} \u5DF2\u8A02\u7968/\u8A02\u623F",
      done: "\u2705 \u5DF2\u5B8C\u6210"
    };
    const COUNTRY_CURRENCY = {
      jp: "JPY",
      kr: "KRW",
      hk: "HKD",
      mo: "MOP",
      sg: "SGD",
      my: "MYR",
      bn: "BND",
      th: "THB",
      ph: "PHP",
      vn: "VND",
      kh: "KHR",
      la: "LAK",
      mm: "MMK",
      id: "IDR",
      tl: "USD",
      in: "INR",
      np: "NPR",
      lk: "LKR",
      bd: "BDT",
      mv: "MVR",
      mn: "MNT",
      kz: "KZT",
      kg: "KGS",
      ae: "AED",
      qa: "QAR",
      jo: "JOD",
      tr: "TRY",
      bh: "BHD",
      bt: "BTN",
      pk: "PKR",
      iq: "IQD",
      sy: "SYP",
      tj: "TJS",
      tm: "TMT",
      ua: "UAH",
      af: "AFN",
      am: "AMD",
      ru: "RUB",
      fr: "EUR",
      de: "EUR",
      it: "EUR",
      es: "EUR",
      pt: "EUR",
      nl: "EUR",
      at: "EUR",
      ch: "CHF",
      gr: "EUR",
      cz: "CZK",
      pl: "PLN",
      hu: "HUF",
      hr: "EUR",
      se: "SEK",
      no: "NOK",
      is: "ISK",
      be: "EUR",
      dk: "DKK",
      fi: "EUR",
      lu: "EUR",
      mt: "EUR",
      si: "EUR",
      sk: "EUR",
      ee: "EUR",
      lv: "EUR",
      lt: "EUR",
      bg: "BGN",
      ro: "RON",
      li: "CHF",
      gb: "GBP",
      ie: "EUR",
      al: "ALL",
      ad: "EUR",
      ba: "BAM",
      cy: "EUR",
      sm: "EUR",
      rs: "RSD",
      me: "EUR",
      mk: "MKD",
      by: "BYN",
      az: "AZN",
      ge: "GEL",
      md: "MDL",
      us: "USD",
      ca: "CAD",
      mx: "MXN",
      ag: "XCD",
      bz: "BZD",
      cl: "CLP",
      cr: "CRC",
      dm: "XCD",
      do: "DOP",
      ec: "USD",
      gt: "GTQ",
      ht: "HTG",
      hn: "HNL",
      jm: "JMD",
      pa: "PAB",
      py: "PYG",
      lc: "XCD",
      vc: "XCD",
      sr: "SRD",
      bs: "BSD",
      bo: "BOB",
      co: "COP",
      cu: "CUP",
      ni: "NIO",
      kn: "XCD",
      tt: "TTD",
      pe: "PEN",
      ar: "ARS",
      br: "BRL",
      bb: "BBD",
      sv: "USD",
      gd: "XCD",
      uy: "UYU",
      gy: "GYD",
      ve: "VES",
      fj: "FJD",
      mh: "USD",
      fm: "USD",
      pw: "USD",
      ws: "WST",
      tv: "AUD",
      nr: "AUD",
      au: "AUD",
      nz: "NZD",
      pg: "PGK",
      ki: "AUD",
      to: "TOP",
      sb: "SBD",
      sz: "SZL",
      gm: "GMD",
      sc: "SCR",
      ls: "LSL",
      ml: "XOF",
      mu: "MUR",
      sn: "XOF",
      za: "ZAR",
      eg: "EGP",
      ke: "KES",
      ma: "MAD",
      mz: "MZN",
      sd: "SDG",
      tn: "TND",
      dz: "DZD",
      et: "ETB",
      rw: "RWF",
      tz: "TZS",
      ug: "UGX",
      ng: "NGN",
      mg: "MGA",
      na: "NAD",
      mw: "MWK"
    };
    const GENERAL_CHECKLIST = [
      { id: "g_passport", label: "\u8B77\u7167\u6548\u671F\u9084\u67096\u500B\u6708\u4EE5\u4E0A" },
      { id: "g_copies", label: "\u8B77\u7167/\u7C3D\u8B49\u5F71\u672C\uFF08\u7D19\u672C\uFF0B\u96F2\u7AEF\u5099\u4EFD\uFF09" },
      { id: "g_insurance", label: "\u65C5\u904A\u5E73\u5B89\u96AA\uFF0F\u6D77\u5916\u91AB\u7642\u96AA" },
      { id: "g_bank", label: "\u4FE1\u7528\u5361\uFF0F\u63D0\u6B3E\u5361\u6D77\u5916\u7528\u5361\u9810\u544A" },
      { id: "g_emergency", label: "\u7DCA\u6025\u806F\u7D61\u4EBA\u8CC7\u8A0A\u5361" },
      { id: "g_idp", label: "\u570B\u969B\u99D5\u7167\uFF08\u5982\u9700\u81EA\u99D5\uFF09" },
      { id: "g_meds", label: "\u5E38\u5099\u85E5\u54C1\u8207\u82F1\u6587/\u7576\u5730\u8A9E\u8A00\u8655\u65B9\u7B8B" },
      { id: "g_vaccine", label: "\u570B\u969B\u9810\u9632\u63A5\u7A2E\u8B49\u66F8\uFF08\u9EC3\u76AE\u66F8\uFF0C\u5982\u76EE\u7684\u5730\u9700\u8981\u9EC3\u71B1\u75C5\u7B49\u75AB\u82D7\u8B49\u660E\uFF09" }
    ];
    function defaultState() {
      return {
        customCountries: [],
        overrides: {},
        personalNotes: {},
        status: {},
        route: [],
        schedule: {},
        checklist: { done: {}, customGeneral: [], customCountry: {} },
        homeCurrency: "TWD",
        budget: { perStop: {}, availableFunds: null },
        cities: {},
        legTransport: {},
        emergencyCard: { insurerName: "", insurerPhone: "", medicalNote: "", passportNo: "", cards: [], contacts: [] }
      };
    }
    function migrateRoute(route) {
      if (!Array.isArray(route)) return [];
      return route.map(function(entry) {
        if (typeof entry === "string") return { id: entry, countryId: entry };
        return entry;
      });
    }
    function loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) throw new Error("empty");
        const parsed = JSON.parse(raw);
        const merged = Object.assign(defaultState(), parsed);
        merged.route = migrateRoute(merged.route);
        return merged;
      } catch (e) {
        return defaultState();
      }
    }
    let state = loadState();
    let selectedId = null;
    function saveState() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    function newStopId() {
      return "stop_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }
    function findStopIndex(stopId) {
      return state.route.findIndex(function(r) {
        return r.id === stopId;
      });
    }
    function getAllCountries() {
      const seeded = SEED_COUNTRIES.map(function(c) {
        const ov = state.overrides[c.id];
        return ov ? Object.assign({}, c, ov, { isCustom: false }) : Object.assign({}, c, { isCustom: false });
      });
      const custom = state.customCountries.map(function(c) {
        return Object.assign({}, c, { isCustom: true });
      });
      return seeded.concat(custom);
    }
    function findCountry(id) {
      return getAllCountries().find(function(c) {
        return c.id === id;
      });
    }
    function flagImg(id) {
      if (!id || id.length !== 2) return "";
      const code = id.toLowerCase();
      return '<img class="flag-icon" src="https://flagcdn.com/' + code + '.svg" alt="" loading="lazy">';
    }
    function formatFee(country) {
      if (country.fee === null || country.fee === void 0) {
        return country.visaType === "visa_free" ? "" : "\u8CBB\u7528\u5F85\u67E5\u8B49";
      }
      if (country.fee === 0) return "\u514D\u8CBB";
      const cur = country.feeCurrency || "";
      return (cur + " " + country.fee).trim();
    }
    const DAY_MS = 864e5;
    function getSchedule(id) {
      return state.schedule[id] || {};
    }
    function getCities(id) {
      return state.cities[id] || [];
    }
    function addCity(countryId, name, nights) {
      if (!state.cities[countryId]) state.cities[countryId] = [];
      const city = {
        id: "city_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name,
        nights: nights === "" || nights === null || nights === void 0 ? null : Number(nights),
        lat: null,
        lng: null,
        geocodeStatus: null
      };
      state.cities[countryId].push(city);
      saveState();
      renderRoute();
      const stop = state.route.filter(function(r) {
        return r.id === countryId;
      })[0];
      const country = stop ? findCountry(stop.countryId) : null;
      ensureCityGeocoded(countryId, city, country && country.id);
    }
    function removeCity(countryId, cityId) {
      if (!state.cities[countryId]) return;
      state.cities[countryId] = state.cities[countryId].filter(function(c) {
        return c.id !== cityId;
      });
      saveState();
      renderRoute();
    }
    const geocodeQueue = [];
    let geocodeQueueBusy = false;
    const geocodeAttempted = /* @__PURE__ */ new Set();
    function findCityEntry(stopId, cityId) {
      const list = state.cities[stopId];
      if (!list) return null;
      return list.filter(function(c) {
        return c.id === cityId;
      })[0] || null;
    }
    function ensureCityGeocoded(stopId, city, countryCode) {
      if (!city || city.geocodeStatus || geocodeAttempted.has(city.id)) return;
      geocodeAttempted.add(city.id);
      city.geocodeStatus = "pending";
      geocodeQueue.push({ stopId, cityId: city.id, name: city.name, countryCode });
      runGeocodeQueue();
    }
    function runGeocodeQueue() {
      if (geocodeQueueBusy || !geocodeQueue.length) return;
      geocodeQueueBusy = true;
      const job = geocodeQueue.shift();
      const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1" + (job.countryCode ? "&countrycodes=" + encodeURIComponent(job.countryCode) : "") + "&q=" + encodeURIComponent(job.name);
      fetch(url).then(function(res) {
        if (!res.ok) throw new Error("geocode http " + res.status);
        return res.json();
      }).then(function(results) {
        const city = findCityEntry(job.stopId, job.cityId);
        if (!city) return;
        if (results && results.length) {
          city.lat = parseFloat(results[0].lat);
          city.lng = parseFloat(results[0].lon);
          city.geocodeStatus = "ok";
        } else {
          city.geocodeStatus = "error";
        }
        saveState();
        renderRoute();
      }).catch(function() {
        const city = findCityEntry(job.stopId, job.cityId);
        if (city) {
          city.geocodeStatus = "error";
          saveState();
        }
      }).then(function() {
        setTimeout(function() {
          geocodeQueueBusy = false;
          runGeocodeQueue();
        }, 1100);
      });
    }
    function parseDay(str) {
      if (!str) return null;
      const d = /* @__PURE__ */ new Date(str + "T00:00:00");
      return isNaN(d.getTime()) ? null : d;
    }
    function stopDuration(sched) {
      const a = parseDay(sched.arrive), d = parseDay(sched.depart);
      if (!a || !d || d < a) return null;
      return Math.round((d - a) / DAY_MS);
    }
    function fmtMD(date) {
      return date.getMonth() + 1 + "/" + date.getDate();
    }
    const TRANSPORT_SPEEDS = {
      flight: { kmh: 850, overheadH: 0.75 },
      // taxi/takeoff/landing/climb buffer
      land: { kmh: 65, overheadH: 0.4 },
      // bus/train/drive, incl. border-crossing buffer
      sea: { kmh: 35, overheadH: 0.6 }
      // ferry, incl. boarding buffer
    };
    const TRANSPORT_ICONS = { flight: "\u2708", land: "\u{1F68C}", sea: "\u26F4" };
    const TRANSPORT_LABELS = { flight: "\u98DB\u6A5F", land: "\u9678\u8DEF", sea: "\u6D77\u8DEF" };
    function haversineKm(lat1, lng1, lat2, lng2) {
      const R = 6371;
      const toRad = function(d) {
        return d * Math.PI / 180;
      };
      const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    function cityPoint(stopId, useLast) {
      const cities = getCities(stopId);
      if (!cities.length) return null;
      const ordered = useLast ? cities.slice().reverse() : cities;
      for (let i = 0; i < ordered.length; i++) {
        const ct = ordered[i];
        if (typeof ct.lat === "number" && typeof ct.lng === "number") return { lat: ct.lat, lng: ct.lng, cityName: ct.name };
      }
      return null;
    }
    function legRoutePoints(prevStopId, prevCountry, curStopId, curCountry) {
      if (!prevCountry || !curCountry || typeof prevCountry.lat !== "number" || typeof curCountry.lat !== "number") return null;
      const a = cityPoint(prevStopId, true) || { lat: prevCountry.lat, lng: prevCountry.lng, cityName: null };
      const b = cityPoint(curStopId, false) || { lat: curCountry.lat, lng: curCountry.lng, cityName: null };
      return { a, b, km: haversineKm(a.lat, a.lng, b.lat, b.lng), usedCity: !!(a.cityName || b.cityName) };
    }
    function suggestTransportMode(a, b, km) {
      if (!a || !b) return "flight";
      if (a.island || b.island) return "flight";
      if (km !== null && km !== void 0 && km <= 800) return "land";
      return "flight";
    }
    function getLegMode(stopId, a, b, km) {
      return stopId && state.legTransport[stopId] || suggestTransportMode(a, b, km);
    }
    function setLegMode(stopId, mode) {
      if (!mode || mode === "auto") delete state.legTransport[stopId];
      else state.legTransport[stopId] = mode;
      saveState();
      renderAll();
    }
    function computeLeg(prevStopId, prevCountry, curStopId, curCountry) {
      const pts = legRoutePoints(prevStopId, prevCountry, curStopId, curCountry);
      if (!pts) return null;
      const mode = getLegMode(curStopId, prevCountry, curCountry, pts.km);
      const spec = TRANSPORT_SPEEDS[mode] || TRANSPORT_SPEEDS.flight;
      return {
        km: pts.km,
        hours: pts.km / spec.kmh + spec.overheadH,
        mode,
        usedCity: pts.usedCity,
        fromCity: pts.a.cityName,
        toCity: pts.b.cityName
      };
    }
    function fmtKm(km) {
      return Math.round(km).toLocaleString("zh-Hant") + " km";
    }
    function fmtHours(hours) {
      let h = Math.floor(hours);
      let m = Math.round((hours - h) * 60);
      if (m === 60) {
        h += 1;
        m = 0;
      }
      return (h > 0 ? h + "h" : "") + (m > 0 ? m + "m" : h > 0 ? "" : "<1m");
    }
    function fmtDate(date) {
      return date.getFullYear() + "/" + fmtMD(date);
    }
    function getTzOffsetMinutes(tz, now2) {
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" }).formatToParts(now2);
      const offsetPart = parts.find(function(p) {
        return p.type === "timeZoneName";
      });
      if (!offsetPart) return null;
      const m = offsetPart.value.match(/GMT([+-]\d+)(?::(\d+))?/);
      if (!m) return 0;
      const hours = parseInt(m[1], 10);
      const mins = m[2] ? parseInt(m[2], 10) : 0;
      return hours * 60 + (hours < 0 ? -mins : mins);
    }
    function getLocalTimeInfo(tz) {
      if (!tz) return null;
      const now2 = /* @__PURE__ */ new Date();
      let timeStr;
      try {
        timeStr = new Intl.DateTimeFormat("zh-Hant", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(now2);
      } catch (e) {
        return null;
      }
      const tzOffset = getTzOffsetMinutes(tz, now2);
      const homeOffset = getTzOffsetMinutes("Asia/Taipei", now2);
      if (tzOffset === null || homeOffset === null) return { timeStr, diffLabel: "" };
      const diffMinutes = tzOffset - homeOffset;
      let diffLabel;
      if (diffMinutes === 0) {
        diffLabel = "\u8207\u53F0\u7063\u540C\u6642\u5340";
      } else {
        const diffHours = Math.abs(diffMinutes) / 60;
        const hoursLabel = Number.isInteger(diffHours) ? diffHours : diffHours.toFixed(1);
        diffLabel = "\u6BD4\u53F0\u7063" + (diffMinutes > 0 ? "\u5FEB" : "\u6162") + hoursLabel + "\u5C0F\u6642";
      }
      return { timeStr, diffLabel };
    }
    function getFilters() {
      return {
        q: document.getElementById("searchInput").value.trim().toLowerCase(),
        region: document.getElementById("regionFilter").value,
        visaType: document.getElementById("visaFilter").value,
        status: document.getElementById("statusFilter").value,
        safety: document.getElementById("safetyFilter").value,
        heritage: document.getElementById("heritageFilter").value,
        vaccine: document.getElementById("vaccineFilter").value
      };
    }
    function hasActiveFilter(f) {
      return !!(f.q || f.region || f.visaType || f.status || f.safety || f.heritage || f.vaccine);
    }
    function computeFilteredList() {
      const f = getFilters();
      let list = getAllCountries();
      if (f.q) {
        list = list.filter(function(c) {
          return c.name.toLowerCase().indexOf(f.q) !== -1 || (c.nameEn || "").toLowerCase().indexOf(f.q) !== -1;
        });
      }
      if (f.region) list = list.filter(function(c) {
        return c.region === f.region;
      });
      if (f.visaType) list = list.filter(function(c) {
        return c.visaType === f.visaType;
      });
      if (f.status) list = list.filter(function(c) {
        return (state.status[c.id] || "") === f.status;
      });
      if (f.safety) {
        list = list.filter(function(c) {
          return f.safety === "none" ? !c.safetyLevel : c.safetyLevel === f.safety;
        });
      }
      if (f.heritage === "has") {
        list = list.filter(function(c) {
          return c.heritageSites && c.heritageSites.length;
        });
      }
      if (f.vaccine) list = list.filter(function(c) {
        return c.yellowFeverStatus === f.vaccine;
      });
      list.sort(function(a, b) {
        const ra = REGION_ORDER.indexOf(a.region), rb = REGION_ORDER.indexOf(b.region);
        if (ra !== rb) return ra - rb;
        return a.name.localeCompare(b.name, "zh-Hant");
      });
      if (selectedId) {
        list = list.filter(function(c) {
          return c.id === selectedId;
        });
      }
      return list;
    }
    function renderStats() {
      const all = getAllCountries();
      const visaFreeCount = all.filter(function(c) {
        return c.visaType === "visa_free";
      }).length;
      const routeCount = state.route.length;
      const unknownFeeInRoute = state.route.map(function(r) {
        return findCountry(r.countryId);
      }).filter(Boolean).filter(function(c) {
        return c.visaType !== "visa_free" && (c.fee === null || c.fee === void 0);
      }).length;
      const sc = computeSchedule();
      const stats = [
        { num: all.length, label: "\u76EE\u7684\u5730\u7E3D\u6578" },
        { num: visaFreeCount, label: "\u514D\u7C3D\u8B49\u570B\u5BB6" },
        { num: routeCount, label: "\u5DF2\u52A0\u5165\u8DEF\u7DDA" },
        { num: unknownFeeInRoute, label: "\u8DEF\u7DDA\u4E2D\u8CBB\u7528\u5F85\u67E5\u8B49" },
        { num: sc.totalDays || "\u2013", label: "\u884C\u7A0B\u7E3D\u5929\u6578" }
      ];
      const el = document.getElementById("statsRow");
      el.innerHTML = stats.map(function(s) {
        return '<div class="stat-card"><span class="num">' + s.num + '</span><span class="label">' + s.label + "</span></div>";
      }).join("");
    }
    function renderGrid() {
      const list = computeFilteredList();
      const grid = document.getElementById("countryGrid");
      document.getElementById("listCount").textContent = "\u5171 " + list.length + " \u500B\u76EE\u7684\u5730";
      if (!list.length) {
        grid.innerHTML = '<div class="empty-state">\u6C92\u6709\u7B26\u5408\u689D\u4EF6\u7684\u570B\u5BB6\uFF0C\u8A66\u8A66\u8ABF\u6574\u7BE9\u9078\u689D\u4EF6\uFF0C\u6216\u6309\u300C\uFF0B \u65B0\u589E\u570B\u5BB6\u300D\u81EA\u5DF1\u52A0\u4E00\u500B\u3002</div>';
        return;
      }
      grid.innerHTML = list.map(function(c) {
        const routeCount = state.route.filter(function(r) {
          return r.countryId === c.id;
        }).length;
        const status = state.status[c.id] || "";
        const note = c.note ? '<div class="card-note">\u{1F4CC} ' + escapeHtml(c.note) + "</div>" : "";
        const personal = state.personalNotes[c.id] ? '<div class="card-personal-note">\u{1F4DD} ' + escapeHtml(state.personalNotes[c.id]) + "</div>" : "";
        const stayLine = c.stayDays ? "\u53EF\u505C\u7559 " + c.stayDays + " \u5929" : "";
        const feeLine = formatFee(c);
        const metaBits = [REGION_LABELS[c.region] || c.region, stayLine, feeLine].filter(Boolean);
        const powerLine = c.powerVoltage ? '<div class="card-power">\u{1F50C} ' + escapeHtml(c.powerVoltage) + (c.powerPlug ? "\u30FBType " + escapeHtml(c.powerPlug) : "") + "</div>" : "";
        const seasonLine = c.bestSeason ? '<div class="card-season">\u2600\uFE0F ' + escapeHtml(c.bestSeason) + "</div>" : "";
        const highlighted = c.id === selectedId ? " highlighted" : "";
        const safetyBadge = c.safetyLevel ? '<span class="badge safety-badge-' + c.safetyLevel + '">\u{1F6E1} ' + SAFETY_LABELS[c.safetyLevel] + "</span>" : "";
        const safetyNoteLine = c.safetyNote ? '<div class="card-safety-note">\u{1F6E1} ' + escapeHtml(c.safetyNote) + "</div>" : "";
        const vaccineBadge = c.yellowFeverStatus ? '<span class="badge badge-vaccine-' + c.yellowFeverStatus + '" title="\u9EC3\u71B1\u75C5\u75AB\u82D7\u8B49\u660E\u898F\u5B9A">\u{1F489} ' + YELLOW_FEVER_LABELS[c.yellowFeverStatus] + "</span>" : "";
        const healthNoteLine = c.healthNote ? '<div class="card-health-note">\u{1F489} ' + escapeHtml(c.healthNote) + "</div>" : "";
        const heritageCount = c.heritageSites ? c.heritageSites.length : 0;
        const heritageBadge = heritageCount ? '<span class="badge badge-heritage" title="UNESCO \u4E16\u754C\u907A\u7522">\u{1F3DB} ' + heritageCount + "</span>" : "";
        const heritageDetail = heritageCount ? '<details class="card-heritage"><summary>\u{1F3DB} ' + heritageCount + ' \u9805\u4E16\u754C\u907A\u7522</summary><ul class="heritage-list">' + c.heritageSites.map(function(s) {
          return "<li>" + escapeHtml(s) + "</li>";
        }).join("") + "</ul></details>" : "";
        return '<div class="country-card' + highlighted + '" data-id="' + c.id + '"><div class="card-top"><div><div class="card-name">' + flagImg(c.id) + escapeHtml(c.name) + "</div>" + (c.nameEn ? '<div class="card-name-en">' + escapeHtml(c.nameEn) + "</div>" : "") + '</div><div class="card-badges"><span class="badge badge-' + c.visaType + '">' + VISA_LABELS[c.visaType] + "</span>" + safetyBadge + heritageBadge + vaccineBadge + '</div></div><div class="card-meta">' + metaBits.map(function(b) {
          return "<span>" + escapeHtml(b) + "</span>";
        }).join("") + "</div>" + powerLine + seasonLine + note + safetyNoteLine + healthNoteLine + personal + heritageDetail + '<div class="card-bottom"><select class="status-select" data-action="status" data-id="' + c.id + '">' + Object.keys(STATUS_LABELS).map(function(k) {
          return '<option value="' + k + '"' + (k === status ? " selected" : "") + ">" + STATUS_LABELS[k] + "</option>";
        }).join("") + '</select><div class="card-actions">' + (routeCount ? '<span class="route-count-badge">\u8DEF\u7DDA\u4E2D\xD7' + routeCount + "</span>" : "") + '<button class="btn btn-small btn-primary" data-action="add-route" data-id="' + c.id + '">' + (routeCount ? "\uFF0B \u518D\u6B21\u52A0\u5165" : "\uFF0B \u52A0\u5165\u8DEF\u7DDA") + '</button><button class="btn btn-small btn-ghost" data-action="edit" data-id="' + c.id + '">\u7DE8\u8F2F</button></div></div></div>';
      }).join("");
      animate(grid.querySelectorAll(".country-card"), { opacity: [0, 1], y: [8, 0] }, { duration: 0.25, delay: stagger(0.03), ease: "ease-out" });
    }
    function renderCitySectionHtml(stopId, stopDurationDays, country) {
      const cities = getCities(stopId);
      cities.forEach(function(c) {
        ensureCityGeocoded(stopId, c, country && country.id);
      });
      const totalNights = cities.reduce(function(sum, c) {
        return sum + (c.nights || 0);
      }, 0);
      const hasNights = cities.some(function(c) {
        return c.nights;
      });
      let mismatch = "";
      if (hasNights && stopDurationDays !== null && totalNights !== stopDurationDays) {
        mismatch = ' <span class="city-mismatch">\uFF08\u7AD9\u9EDE\u6392\u5B9A' + stopDurationDays + "\u5929\uFF0C\u57CE\u5E02\u5408\u8A08" + totalNights + "\u665A\uFF09</span>";
      }
      const chips = cities.map(function(c) {
        const geoIcon = c.geocodeStatus === "ok" ? '<span class="city-geo ok" title="\u5DF2\u5B9A\u4F4D\uFF0C\u6703\u7528\u65BC\u8DDD\u96E2\u4F30\u7B97">\u{1F4CD}</span>' : c.geocodeStatus === "pending" ? '<span class="city-geo pending" title="\u6B63\u5728\u5B9A\u4F4D\u2026">\u22EF</span>' : c.geocodeStatus === "error" ? '<span class="city-geo error" title="\u627E\u4E0D\u5230\u5EA7\u6A19\uFF0C\u66AB\u7528\u570B\u5BB6\u4E2D\u5FC3\u9EDE\u4F30\u7B97\u8DDD\u96E2">\u26A0</span>' : "";
        return '<span class="city-chip">' + geoIcon + escapeHtml(c.name) + (c.nights ? " <b>" + c.nights + "\u665A</b>" : "") + '<button type="button" class="city-remove" data-action="city-remove" data-stop="' + stopId + '" data-city="' + c.id + '">\u2715</button></span>';
      }).join("");
      return '<div class="city-section"><div class="city-header">\u{1F3D9} \u57CE\u5E02\u6E05\u55AE' + (cities.length ? "\uFF08" + cities.length + "\uFF09" + mismatch : "") + "</div>" + (chips ? '<div class="city-chips">' + chips + "</div>" : "") + '<div class="city-add-row"><input type="text" class="city-name-input" data-field="cityName" data-stop="' + stopId + '" placeholder="\u57CE\u5E02\u540D\u7A31"><input type="number" class="city-nights-input" data-field="cityNights" data-stop="' + stopId + '" min="0" placeholder="\u665A\u6578"><button type="button" class="btn btn-small btn-ghost" data-action="city-add" data-stop="' + stopId + '">+ \u65B0\u589E</button></div></div>';
    }
    function renderRoute() {
      const list = document.getElementById("routeList");
      const summary = document.getElementById("routeSummary");
      if (!state.route.length) {
        list.innerHTML = '<div class="empty-state">\u8DEF\u7DDA\u662F\u7A7A\u7684\uFF0C\u53BB\u5730\u5716\u6216\u6E05\u55AE\u6311\u5E7E\u500B\u570B\u5BB6\u5427\uFF01</div>';
        summary.innerHTML = "";
      } else {
        list.innerHTML = state.route.map(function(stop, idx) {
          const id = stop.id;
          const c = findCountry(stop.countryId);
          if (!c) return "";
          const fee = formatFee(c);
          const sched = getSchedule(id);
          const duration = stopDuration(sched);
          let warning2 = "";
          if (duration !== null && c.stayDays && duration > c.stayDays) {
            warning2 = '<div class="stay-warning">\u26A0 \u8D85\u904E\u514D\u7C3D/\u8A31\u53EF\u5929\u6578\u4E0A\u9650\uFF08\u9650' + c.stayDays + "\u5929\uFF0C\u76EE\u524D\u6392" + duration + "\u5929\uFF09</div>";
          }
          let legLine = "";
          if (idx > 0) {
            const prevStop = state.route[idx - 1];
            const prev = findCountry(prevStop.countryId);
            const leg = computeLeg(prevStop.id, prev, id, c);
            if (leg) {
              const isAuto = !state.legTransport[id];
              const cityBadge = leg.usedCity ? '<span class="leg-city-badge" title="\u4F9D\u57CE\u5E02\u5EA7\u6A19\u4F30\u7B97\uFF1A' + escapeHtml(leg.fromCity || prev.name) + " \u2192 " + escapeHtml(leg.toCity || c.name) + '">\u{1F3D9}</span>' : "";
              legLine = '<div class="leg-line">' + TRANSPORT_ICONS[leg.mode] + " \u8DDD\u4E0A\u4E00\u7AD9 " + fmtKm(leg.km) + " \xB7 \u9810\u4F30" + TRANSPORT_LABELS[leg.mode] + " " + fmtHours(leg.hours) + cityBadge + '<select class="leg-mode-select" data-action="leg-mode" data-id="' + id + '"><option value="auto"' + (isAuto ? " selected" : "") + '>\u81EA\u52D5\u5EFA\u8B70</option><option value="flight"' + (!isAuto && leg.mode === "flight" ? " selected" : "") + '>\u2708 \u98DB\u6A5F</option><option value="land"' + (!isAuto && leg.mode === "land" ? " selected" : "") + '>\u{1F68C} \u9678\u8DEF</option><option value="sea"' + (!isAuto && leg.mode === "sea" ? " selected" : "") + ">\u26F4 \u6D77\u8DEF</option></select></div>";
            }
          }
          const visitLabel = state.route.filter(function(r, i) {
            return i <= idx && r.countryId === stop.countryId;
          }).length > 1 ? "\uFF08\u7B2C" + state.route.filter(function(r, i) {
            return i <= idx && r.countryId === stop.countryId;
          }).length + "\u6B21\uFF09" : "";
          const timeInfo = getLocalTimeInfo(c.tz);
          const timeLine = timeInfo ? '<div class="local-time" data-tz="' + escapeHtml(c.tz) + '">\u{1F550} ' + timeInfo.timeStr + (timeInfo.diffLabel ? "\uFF08" + timeInfo.diffLabel + "\uFF09" : "") + "</div>" : "";
          return '<li class="route-item" data-id="' + id + '"><span class="order">' + (idx + 1) + '</span><div class="info"><div class="name">' + flagImg(c.id) + escapeHtml(c.name) + visitLabel + '</div><div class="fee">' + VISA_LABELS[c.visaType] + (fee ? " \xB7 " + escapeHtml(fee) : "") + (duration !== null ? " \xB7 " + duration + "\u5929" : "") + "</div>" + timeLine + legLine + '</div><div class="move-btns"><button data-action="move-up" data-id="' + id + '" ' + (idx === 0 ? "disabled" : "") + '>\u25B2</button><button data-action="move-down" data-id="' + id + '" ' + (idx === state.route.length - 1 ? "disabled" : "") + '>\u25BC</button></div><button class="btn btn-small btn-ghost" data-action="remove-route" data-id="' + id + '">\u79FB\u9664</button><div class="date-row"><input type="date" data-action="date-arrive" data-id="' + id + '" value="' + (sched.arrive || "") + '"><span class="date-sep">\u2192</span><input type="date" data-action="date-depart" data-id="' + id + '" value="' + (sched.depart || "") + '"></div>' + warning2 + renderCitySectionHtml(id, duration, c) + "</li>";
        }).join("");
        const totals = {};
        let unknownCount = 0;
        state.route.forEach(function(stop) {
          const c = findCountry(stop.countryId);
          if (!c) return;
          if (c.fee === null || c.fee === void 0) {
            if (c.visaType !== "visa_free") unknownCount++;
            return;
          }
          const cur = c.feeCurrency || "\u5176\u4ED6";
          totals[cur] = (totals[cur] || 0) + c.fee;
        });
        const totalParts = Object.keys(totals).map(function(cur) {
          return cur + " " + totals[cur].toFixed(2).replace(/\.00$/, "");
        });
        summary.innerHTML = "<div>\u9810\u4F30\u7C3D\u8B49\u8CBB\u7528\uFF1A<strong>" + (totalParts.length ? totalParts.join(" + ") : "\u5C1A\u7121\u8CBB\u7528\u8CC7\u6599") + "</strong></div>" + (unknownCount ? "<div>\u26A0\uFE0F \u9084\u6709 " + unknownCount + " \u500B\u76EE\u7684\u5730\u8CBB\u7528\u5F85\u67E5\u8B49</div>" : "");
      }
      renderRouteLines();
      renderTimeline();
      renderShareSummary();
    }
    function computeSchedule() {
      const stops = state.route.map(function(stop) {
        return { id: stop.id, country: findCountry(stop.countryId), sched: getSchedule(stop.id) };
      }).filter(function(s) {
        return s.country;
      });
      const scheduled = [];
      const unscheduled = [];
      stops.forEach(function(s) {
        const duration = stopDuration(s.sched);
        if (duration !== null) {
          scheduled.push(Object.assign({}, s, {
            duration,
            arriveDate: parseDay(s.sched.arrive),
            departDate: parseDay(s.sched.depart)
          }));
        } else {
          unscheduled.push(s);
        }
      });
      if (!scheduled.length) return { scheduled, unscheduled, minDate: null, maxDate: null, totalDays: 0 };
      const minDate = scheduled.reduce(function(m, s) {
        return s.arriveDate < m ? s.arriveDate : m;
      }, scheduled[0].arriveDate);
      const maxDate = scheduled.reduce(function(m, s) {
        return s.departDate > m ? s.departDate : m;
      }, scheduled[0].departDate);
      const totalDays = Math.round((maxDate - minDate) / DAY_MS) + 1;
      return { scheduled, unscheduled, minDate, maxDate, totalDays };
    }
    function computeSchengenUsage(sc) {
      const ranges = sc.scheduled.filter(function(s) {
        return SCHENGEN_IDS.indexOf(s.country.id) !== -1;
      }).map(function(s) {
        return { start: s.arriveDate.getTime(), end: s.departDate.getTime() };
      });
      if (!ranges.length) return null;
      const minTime = Math.min.apply(null, ranges.map(function(r) {
        return r.start;
      }));
      const maxTime = Math.max.apply(null, ranges.map(function(r) {
        return r.end;
      }));
      function inSchengenOn(t) {
        return ranges.some(function(r) {
          return t >= r.start && t <= r.end;
        });
      }
      let peakDays = 0, peakEndTime = null;
      for (let d = minTime; d <= maxTime; d += DAY_MS) {
        let count = 0;
        for (let w = d - 179 * DAY_MS; w <= d; w += DAY_MS) {
          if (inSchengenOn(w)) count++;
        }
        if (count > peakDays) {
          peakDays = count;
          peakEndTime = d;
        }
      }
      return { peakDays, peakDate: peakEndTime !== null ? new Date(peakEndTime) : null, overLimit: peakDays > 90 };
    }
    function renderTimeline() {
      const track = document.getElementById("timelineTrack");
      const summaryEl = document.getElementById("timelineSummary");
      const unscheduledEl = document.getElementById("timelineUnscheduled");
      if (!track) return;
      const sc = computeSchedule();
      const scheduled = sc.scheduled, unscheduled = sc.unscheduled;
      unscheduledEl.innerHTML = unscheduled.map(function(s) {
        return '<button type="button" class="timeline-chip" data-id="' + s.id + '">' + escapeHtml(s.country.name) + " \u672A\u6392\u5B9A</button>";
      }).join("");
      renderTimelineStats(sc);
      renderActivityLog();
      if (!scheduled.length) {
        track.style.width = "";
        track.innerHTML = '<div class="timeline-empty">\u5E6B\u300C\u6211\u7684\u8DEF\u7DDA\u300D\u88E1\u7684\u570B\u5BB6\u586B\u4E0A\u5165\u5883/\u96E2\u5883\u65E5\u671F\uFF0C\u9019\u88E1\u5C31\u6703\u51FA\u73FE\u4F60\u7684\u884C\u7A0B\u6642\u9593\u8EF8\u3002</div>';
        summaryEl.textContent = "";
        return;
      }
      const minDate = sc.minDate, maxDate = sc.maxDate, totalDays = sc.totalDays;
      const pxPerDay = 20;
      const trackWidth = Math.max(600, totalDays * pxPerDay);
      let gridHtml = "";
      const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
      while (cursor <= maxDate) {
        const offset = Math.round((cursor - minDate) / DAY_MS) * pxPerDay;
        if (offset >= 0) {
          gridHtml += '<div class="timeline-month-line" style="left:' + offset + 'px"></div>';
          gridHtml += '<div class="timeline-month-label" style="left:' + offset + 'px">' + (cursor.getMonth() + 1) + "\u6708</div>";
        }
        cursor.setMonth(cursor.getMonth() + 1);
      }
      let rowsHtml = "";
      let overlapCount = 0;
      let totalKm = 0, totalHours = 0, legCount = 0;
      const legOf = function(idx) {
        const prev = scheduled[idx - 1], cur = scheduled[idx];
        return computeLeg(prev.id, prev.country, cur.id, cur.country);
      };
      scheduled.forEach(function(s, idx) {
        const left = Math.round((s.arriveDate - minDate) / DAY_MS) * pxPerDay;
        const width = Math.max(pxPerDay * 0.8, s.duration * pxPerDay);
        const routeIdx = findStopIndex(s.id);
        const isOverstay = !!(s.country.stayDays && s.duration > s.country.stayDays);
        let isOverlap = false;
        if (idx > 0 && s.arriveDate < scheduled[idx - 1].departDate) isOverlap = true;
        if (isOverlap) overlapCount++;
        if (idx > 0) {
          const leg = legOf(idx);
          if (leg) {
            totalKm += leg.km;
            totalHours += leg.hours;
            legCount++;
            const prev = scheduled[idx - 1];
            const prevLeft = Math.round((prev.arriveDate - minDate) / DAY_MS) * pxPerDay;
            const prevWidth = Math.max(pxPerDay * 0.8, prev.duration * pxPerDay);
            const midX = (prevLeft + prevWidth + left) / 2;
            const legBasis = leg.usedCity ? "\uFF08\u4F9D\u57CE\u5E02\u5EA7\u6A19\uFF1A" + (leg.fromCity || prev.country.name) + " \u2192 " + (leg.toCity || s.country.name) + "\uFF09" : "\uFF08\u7C97\u7565\u4F30\u7B97\uFF0C\u672A\u8A08\u5165\u8F49\u6A5F/\u7B49\u5019\u6642\u9593\uFF09";
            rowsHtml += '<div class="timeline-transit-row"><span class="timeline-transit" style="left:' + midX + 'px" title="' + escapeHtml(prev.country.name + " \u2192 " + s.country.name + "\uFF1A\u7D04 " + fmtKm(leg.km) + "\uFF0C\u9810\u4F30" + TRANSPORT_LABELS[leg.mode] + " " + fmtHours(leg.hours) + legBasis) + '">' + TRANSPORT_ICONS[leg.mode] + " " + fmtKm(leg.km) + " \xB7 " + fmtHours(leg.hours) + "</span></div>";
          }
        }
        const cls = ["timeline-bar", VISA_CLASS[s.country.visaType]];
        if (isOverstay) cls.push("overstay");
        if (isOverlap) cls.push("overlap");
        const tip = s.country.name + " " + s.sched.arrive + " \u2192 " + s.sched.depart + "\uFF08" + s.duration + "\u5929\uFF09" + (isOverstay ? " \u26A0\u8D85\u904E\u5929\u6578\u4E0A\u9650" : "") + (isOverlap ? " \u26A0\u8207\u524D\u4E00\u7AD9\u65E5\u671F\u91CD\u758A" : "");
        rowsHtml += '<div class="timeline-row"><div class="' + cls.join(" ") + '" data-id="' + s.id + '" style="left:' + left + "px;width:" + width + 'px" title="' + escapeHtml(tip) + '"><span class="order">' + (routeIdx + 1) + "</span><span>" + escapeHtml(s.country.name) + "</span><span>" + s.duration + "\u5929</span></div></div>";
      });
      track.style.width = trackWidth + "px";
      track.innerHTML = gridHtml + '<div class="timeline-rows">' + rowsHtml + "</div>";
      summaryEl.textContent = fmtDate(minDate) + " \u2192 " + fmtDate(maxDate) + "\uFF0C\u5171 " + totalDays + " \u5929\uFF0C" + scheduled.length + " \u7AD9\u5DF2\u6392\u5B9A" + (unscheduled.length ? "\uFF0C" + unscheduled.length + " \u7AD9\u672A\u6392\u5B9A" : "") + (overlapCount ? "\uFF0C\u26A0 " + overlapCount + " \u8655\u65E5\u671F\u91CD\u758A" : "") + (legCount ? "\uFF0C\u7E3D\u79FB\u52D5\u8DDD\u96E2\u7D04 " + fmtKm(totalKm) + "\uFF08\u7D04 " + fmtHours(totalHours) + "\uFF09" : "");
    }
    function routeTripTotals() {
      let km = 0, hours = 0;
      const feesByCurrency = {};
      let feeConvertedTotal = 0, hasUnknownFee = false, hasConvertibleFee = false;
      state.route.forEach(function(stop, idx) {
        const c = findCountry(stop.countryId);
        if (!c) return;
        if (idx > 0) {
          const prevStop = state.route[idx - 1];
          const prevC = findCountry(prevStop.countryId);
          const leg = computeLeg(prevStop.id, prevC, stop.id, c);
          if (leg) {
            km += leg.km;
            hours += leg.hours;
          }
        }
        if (c.fee !== null && c.fee !== void 0 && c.fee > 0) {
          const cur = c.feeCurrency || "USD";
          feesByCurrency[cur] = (feesByCurrency[cur] || 0) + c.fee;
          if (rates && rates[cur] && state.homeCurrency && rates[state.homeCurrency]) {
            feeConvertedTotal += convertCurrency(c.fee, cur, state.homeCurrency) || 0;
            hasConvertibleFee = true;
          }
        } else if (c.visaType !== "visa_free") {
          hasUnknownFee = true;
        }
      });
      return { km, hours, feesByCurrency, feeConvertedTotal, hasConvertibleFee, hasUnknownFee };
    }
    function renderTimelineStats(sc) {
      const el = document.getElementById("timelineStats");
      if (!el) return;
      if (!state.route.length) {
        el.innerHTML = "";
        return;
      }
      const totals = routeTripTotals();
      const feeText = totals.hasConvertibleFee ? state.homeCurrency + " " + fmtMoney(totals.feeConvertedTotal) : Object.keys(totals.feesByCurrency).length ? Object.keys(totals.feesByCurrency).map(function(cur) {
        return cur + " " + totals.feesByCurrency[cur];
      }).join(" + ") : "\uFF0D";
      const tiles = [
        { num: sc.totalDays || "\uFF0D", label: "\u7E3D\u5929\u6578" },
        { num: state.route.length, label: "\u7AD9\u9EDE\u6578" },
        { num: totals.km ? fmtKm(totals.km) : "\uFF0D", label: "\u7E3D\u79FB\u52D5\u8DDD\u96E2" },
        { num: feeText, label: "\u7E3D\u7C3D\u8B49\u8CBB\u7528" + (totals.hasUnknownFee ? "\uFF0A" : "") }
      ];
      const schengen = computeSchengenUsage(sc);
      if (schengen) {
        tiles.push({
          num: schengen.peakDays + " / 90",
          label: "\u7533\u6839\u5340 180 \u5929\u5167\u7D2F\u7A4D\u5929\u6578",
          cls: schengen.overLimit ? "stat-card-warning" : ""
        });
      }
      el.innerHTML = tiles.map(function(t) {
        return '<div class="stat-card' + (t.cls ? " " + t.cls : "") + '"><span class="num">' + t.num + '</span><span class="label">' + t.label + "</span></div>";
      }).join("") + (totals.hasUnknownFee ? '<div class="timeline-stats-note">\uFF0A\u90E8\u5206\u8CBB\u7528\u5F85\u67E5\u8B49\uFF0C\u672A\u8A08\u5165</div>' : "") + (schengen && schengen.overLimit ? '<div class="timeline-stats-note timeline-stats-warning">\u26A0 \u7533\u6839\u5340 90/180 \u5929\u898F\u5247\uFF1A\u4EE5 ' + fmtDate(schengen.peakDate) + " \u70BA\u57FA\u6E96\u5F80\u56DE\u63A8 180 \u5929\uFF0C\u7D2F\u7A4D\u5728\u7533\u6839\u5340\u5F85\u4E86 " + schengen.peakDays + " \u5929\uFF0C\u5DF2\u8D85\u904E 90 \u5929\u4E0A\u9650\uFF0C\u8ACB\u8ABF\u6574\u884C\u7A0B\u6216\u5206\u6563\u7533\u6839\u7AD9\u9EDE\u7684\u6642\u9593</div>" : "");
    }
    function renderActivityLog() {
      const el = document.getElementById("activityLog");
      if (!el) return;
      if (!state.route.length) {
        el.innerHTML = '<div class="empty-state">\u8DEF\u7DDA\u662F\u7A7A\u7684\uFF0C\u53BB\u5730\u5716\u6216\u6E05\u55AE\u6311\u5E7E\u500B\u570B\u5BB6\u5427\uFF01</div>';
        return;
      }
      el.innerHTML = state.route.map(function(stop, idx) {
        const c = findCountry(stop.countryId);
        if (!c) return "";
        const sched = getSchedule(stop.id);
        const duration = stopDuration(sched);
        const visitCount = state.route.filter(function(r, i) {
          return i <= idx && r.countryId === stop.countryId;
        }).length;
        const visitLabel = visitCount > 1 ? '<span class="visit-label">\uFF08\u7B2C' + visitCount + "\u6B21\uFF09</span>" : "";
        const dateText = sched.arrive && sched.depart ? sched.arrive + " \u2192 " + sched.depart : "\u5C1A\u672A\u6392\u5B9A\u65E5\u671F";
        let legStat = "";
        if (idx > 0) {
          const prevStop = state.route[idx - 1];
          const prevC = findCountry(prevStop.countryId);
          const leg = computeLeg(prevStop.id, prevC, stop.id, c);
          if (leg) legStat = '<div class="activity-stat"><span class="label">\u8DDD\u4E0A\u4E00\u7AD9</span><span class="value">' + fmtKm(leg.km) + '</span></div><div class="activity-stat"><span class="label">' + TRANSPORT_ICONS[leg.mode] + " \u9810\u4F30" + TRANSPORT_LABELS[leg.mode] + '</span><span class="value">' + fmtHours(leg.hours) + "</span></div>";
        }
        const feeStr = formatFee(c);
        const feeStat = '<div class="activity-stat"><span class="label">\u7C3D\u8B49\u8CBB\u7528</span><span class="value' + (feeStr ? "" : " dim") + '">' + (feeStr || (c.visaType === "visa_free" ? "\u514D\u7C3D\u8B49" : "\u5F85\u67E5\u8B49")) + "</span></div>";
        const nightsStat = duration !== null ? '<div class="activity-stat"><span class="label">\u5929\u6578</span><span class="value">' + duration + " \u5929</span></div>" : "";
        const cities = getCities(stop.id);
        const citiesHtml = cities.length ? '<div class="activity-cities">\u{1F3D9} ' + cities.map(function(city) {
          return "<b>" + escapeHtml(city.name) + "</b>" + (city.nights ? "(" + city.nights + "\u665A)" : "");
        }).join("\u3001") + "</div>" : "";
        const warning2 = duration !== null && c.stayDays && duration > c.stayDays ? '<div class="activity-warning">\u26A0 \u8D85\u904E\u514D\u7C3D/\u8A31\u53EF\u5929\u6578\u4E0A\u9650\uFF08\u9650' + c.stayDays + "\u5929\uFF09</div>" : "";
        return '<div class="activity-card"><div class="activity-order" style="color:' + (c.safetyLevel === "red" ? "var(--c-restricted)" : c.safetyLevel === "orange" ? "var(--c-voa)" : "#8ee060") + '">' + (idx + 1) + '</div><div class="activity-body"><div class="activity-top"><div class="activity-name">' + escapeHtml(c.name) + visitLabel + '</div><div class="activity-dates">' + escapeHtml(dateText) + '</div></div><div class="activity-stats">' + nightsStat + legStat + feeStat + "</div>" + citiesHtml + warning2 + "</div></div>";
      }).join("");
    }
    function getCountryAutoItems(country, stopId) {
      const items = [];
      if (country.visaType !== "visa_free") {
        const fee = formatFee(country);
        items.push({ id: "c_" + stopId + "_visa", label: "\u8FA6\u7406" + VISA_LABELS[country.visaType] + (fee ? "\uFF08" + fee + "\uFF09" : "") });
      }
      if (country.note) {
        items.push({ id: "c_" + stopId + "_note", label: "\u78BA\u8A8D\u5165\u5883\u5099\u8A3B\uFF1A" + country.note });
      }
      if (country.safetyLevel === "orange" || country.safetyLevel === "red") {
        items.push({ id: "c_" + stopId + "_safety", label: "\u67E5\u770B\u5916\u4EA4\u90E8\u65C5\u904A\u8B66\u793A\uFF08" + SAFETY_LABELS[country.safetyLevel] + (country.safetyNote ? "\uFF0C" + country.safetyNote : "") + "\uFF09" });
      }
      if (country.yellowFeverStatus === "required") {
        items.push({ id: "c_" + stopId + "_yf", label: "\u6E96\u5099\u9EC3\u71B1\u75C5\u75AB\u82D7\u8B49\u660E\uFF08\u570B\u969B\u9810\u9632\u63A5\u7A2E\u8B49\u66F8\uFF0C\u5165\u5883\u5F37\u5236\u8981\u6C42\uFF0C\u4E0D\u8AD6\u4F86\u6E90\u5730\uFF09" + (country.healthNote ? "\uFF1A" + country.healthNote : "") });
      } else if (country.yellowFeverStatus === "conditional") {
        items.push({ id: "c_" + stopId + "_yf", label: "\u78BA\u8A8D\u662F\u5426\u9700\u6E96\u5099\u9EC3\u71B1\u75C5\u75AB\u82D7\u8B49\u660E\uFF08\u82E5\u884C\u7A0B\u66FE\u9014\u7D93/\u8F49\u6A5F\u9EC3\u71B1\u75C5\u75AB\u5340\u53EF\u80FD\u88AB\u8981\u6C42\u51FA\u793A\uFF09" + (country.healthNote ? "\uFF1A" + country.healthNote : "") });
      }
      return items;
    }
    function toggleChecklistItem(id) {
      if (state.checklist.done[id]) delete state.checklist.done[id];
      else state.checklist.done[id] = true;
      saveState();
      renderChecklist();
      const li = document.querySelector('.checklist-item[data-id="' + id + '"]');
      if (li) animate(li, { scale: [1, 1.04, 1] }, { duration: 0.22, ease: "ease-out" });
    }
    function addChecklistItem(scope, countryId, label) {
      const item = { id: (scope === "general" ? "gc_" : "cc_") + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), label };
      if (scope === "general") {
        state.checklist.customGeneral.push(item);
      } else {
        if (!state.checklist.customCountry[countryId]) state.checklist.customCountry[countryId] = [];
        state.checklist.customCountry[countryId].push(item);
      }
      saveState();
      renderChecklist();
    }
    function removeChecklistItem(scope, countryId, itemId) {
      if (scope === "general") {
        state.checklist.customGeneral = state.checklist.customGeneral.filter(function(it) {
          return it.id !== itemId;
        });
      } else if (state.checklist.customCountry[countryId]) {
        state.checklist.customCountry[countryId] = state.checklist.customCountry[countryId].filter(function(it) {
          return it.id !== itemId;
        });
      }
      delete state.checklist.done[itemId];
      saveState();
      renderChecklist();
    }
    function renderChecklistItemsHtml(items, scope, countryId) {
      return items.map(function(it) {
        const isCustom = it.id.indexOf("gc_") === 0 || it.id.indexOf("cc_") === 0;
        const done = !!state.checklist.done[it.id];
        return '<li class="checklist-item' + (done ? " done" : "") + '" data-id="' + it.id + '"><input type="checkbox" data-action="cl-toggle" data-id="' + it.id + '"' + (done ? " checked" : "") + '><span class="cl-label">' + escapeHtml(it.label) + "</span>" + (isCustom ? '<button type="button" class="cl-remove" data-action="cl-remove" data-scope="' + scope + '" data-country="' + (countryId || "") + '" data-id="' + it.id + '" title="\u522A\u9664">\u2715</button>' : "") + "</li>";
      }).join("");
    }
    function renderChecklist() {
      const generalEl = document.getElementById("generalChecklist");
      if (!generalEl) return;
      const generalItems = GENERAL_CHECKLIST.concat(state.checklist.customGeneral);
      generalEl.innerHTML = renderChecklistItemsHtml(generalItems, "general", null);
      const countryEl = document.getElementById("countryChecklists");
      if (!state.route.length) {
        countryEl.innerHTML = '<div class="empty-state">\u5148\u628A\u570B\u5BB6\u52A0\u5165\u8DEF\u7DDA\uFF0C\u9019\u88E1\u5C31\u6703\u5217\u51FA\u5C0D\u61C9\u7684\u6587\u4EF6\u6E05\u55AE\u3002</div>';
      } else {
        countryEl.innerHTML = state.route.map(function(stop, idx) {
          const id = stop.id;
          const c = findCountry(stop.countryId);
          if (!c) return "";
          const visitLabel = state.route.filter(function(r, i) {
            return i <= idx && r.countryId === stop.countryId;
          }).length > 1 ? "\uFF08\u7B2C" + state.route.filter(function(r, i) {
            return i <= idx && r.countryId === stop.countryId;
          }).length + "\u6B21\uFF09" : "";
          const items = getCountryAutoItems(c, id).concat(state.checklist.customCountry[id] || []);
          const doneCount = items.filter(function(it) {
            return state.checklist.done[it.id];
          }).length;
          const itemsHtml = items.length ? renderChecklistItemsHtml(items, "country", id) : '<li class="empty-state">\u9019\u500B\u570B\u5BB6\u76EE\u524D\u6C92\u6709\u9700\u8981\u7279\u5225\u6E96\u5099\u7684\u6587\u4EF6</li>';
          return '<div class="country-checklist-group" data-country="' + id + '"><h4>' + escapeHtml(c.name) + visitLabel + ' <span class="cl-progress">(' + doneCount + "/" + items.length + ')</span></h4><ul class="checklist-list">' + itemsHtml + '</ul><div class="checklist-add-row"><input type="text" data-action="cl-add-input" data-country="' + id + '" placeholder="+ \u65B0\u589E\u9019\u570B\u7684\u9805\u76EE\u2026\uFF08\u6309 Enter \u65B0\u589E\uFF09"></div></div>';
        }).join("");
      }
      const allItems = generalItems.concat(state.route.reduce(function(acc, stop) {
        const c = findCountry(stop.countryId);
        if (!c) return acc;
        return acc.concat(getCountryAutoItems(c, stop.id)).concat(state.checklist.customCountry[stop.id] || []);
      }, []));
      const doneTotal = allItems.filter(function(it) {
        return state.checklist.done[it.id];
      }).length;
      document.getElementById("checklistSummary").textContent = allItems.length ? "\u5DF2\u5B8C\u6210 " + doneTotal + " / " + allItems.length : "";
    }
    document.getElementById("generalChecklist").addEventListener("change", function(e) {
      const cb = e.target.closest('[data-action="cl-toggle"]');
      if (cb) toggleChecklistItem(cb.getAttribute("data-id"));
    });
    document.getElementById("generalChecklist").addEventListener("click", function(e) {
      const btn = e.target.closest('[data-action="cl-remove"]');
      if (btn) removeChecklistItem(btn.getAttribute("data-scope"), null, btn.getAttribute("data-id"));
    });
    document.getElementById("generalAddInput").addEventListener("keydown", function(e) {
      if (e.key !== "Enter") return;
      const value = e.target.value.trim();
      if (!value) return;
      addChecklistItem("general", null, value);
      e.target.value = "";
    });
    document.getElementById("countryChecklists").addEventListener("change", function(e) {
      const cb = e.target.closest('[data-action="cl-toggle"]');
      if (cb) toggleChecklistItem(cb.getAttribute("data-id"));
    });
    document.getElementById("countryChecklists").addEventListener("click", function(e) {
      const btn = e.target.closest('[data-action="cl-remove"]');
      if (btn) removeChecklistItem("country", btn.getAttribute("data-country"), btn.getAttribute("data-id"));
    });
    document.getElementById("countryChecklists").addEventListener("keydown", function(e) {
      const input = e.target.closest('[data-action="cl-add-input"]');
      if (!input || e.key !== "Enter") return;
      const value = input.value.trim();
      if (!value) return;
      addChecklistItem("country", input.getAttribute("data-country"), value);
    });
    function renderAll() {
      renderStats();
      renderGrid();
      renderRoute();
      renderMap();
      renderChecklist();
      renderCurrencyTab();
      renderConverter();
      renderBudgetTab();
      renderShareSummary();
      renderEmergencyTab();
    }
    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, function(ch) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
      });
    }
    function onFiltersChanged() {
      selectedId = null;
      renderGrid();
      renderMap();
    }
    function setStatus(id, value) {
      if (value) state.status[id] = value;
      else delete state.status[id];
      saveState();
      renderStats();
    }
    function addRouteStop(countryId) {
      state.route.push({ id: newStopId(), countryId });
      saveState();
      renderAll();
    }
    function setStopDate(id, field, value) {
      state.schedule[id] = Object.assign({}, state.schedule[id], {}, { [field]: value });
      saveState();
      renderStats();
      renderRoute();
      renderBudgetTab();
    }
    function moveRoute(stopId, dir) {
      const idx = findStopIndex(stopId);
      const swapWith = idx + dir;
      if (idx === -1 || swapWith < 0 || swapWith >= state.route.length) return;
      const tmp = state.route[idx];
      state.route[idx] = state.route[swapWith];
      state.route[swapWith] = tmp;
      saveState();
      renderRoute();
    }
    function removeFromRoute(stopId) {
      state.route = state.route.filter(function(r) {
        return r.id !== stopId;
      });
      delete state.schedule[stopId];
      delete state.cities[stopId];
      delete state.budget.perStop[stopId];
      delete state.checklist.customCountry[stopId];
      saveState();
      renderAll();
    }
    function selectCountry(id) {
      selectedId = id;
      const country = findCountry(id);
      const searchInput = document.getElementById("searchInput");
      if (country && searchInput) searchInput.value = country.name;
      renderGrid();
      renderMap();
      const grid = document.getElementById("countryGrid");
      grid.scrollTop = 0;
      const card = grid.querySelector(".country-card.highlighted");
      if (card) {
        card.classList.remove("just-selected");
        void card.offsetWidth;
        card.classList.add("just-selected");
      }
    }
    const backdrop = document.getElementById("modalBackdrop");
    const form = document.getElementById("countryForm");
    let modalOpenerEl = null;
    function getModalFocusable() {
      return Array.from(document.getElementById("countryModal").querySelectorAll(
        'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]):not([hidden])'
      ));
    }
    function openModal(country) {
      modalOpenerEl = document.activeElement;
      document.getElementById("modalTitle").textContent = country ? "\u7DE8\u8F2F\u570B\u5BB6" : "\u65B0\u589E\u570B\u5BB6";
      document.getElementById("f_id").value = country ? country.id : "";
      document.getElementById("f_name").value = country ? country.name : "";
      document.getElementById("f_nameEn").value = country ? country.nameEn || "" : "";
      document.getElementById("f_region").value = country ? country.region : "asia";
      document.getElementById("f_visaType").value = country ? country.visaType : "visa_free";
      document.getElementById("f_stayDays").value = country && country.stayDays !== null && country.stayDays !== void 0 ? country.stayDays : "";
      document.getElementById("f_fee").value = country && country.fee !== null && country.fee !== void 0 ? country.fee : "";
      document.getElementById("f_feeCurrency").value = country ? country.feeCurrency || "" : "";
      document.getElementById("f_note").value = country ? country.note || "" : "";
      document.getElementById("f_safetyLevel").value = country ? country.safetyLevel || "" : "";
      document.getElementById("f_safetyNote").value = country ? country.safetyNote || "" : "";
      document.getElementById("f_yellowFeverStatus").value = country ? country.yellowFeverStatus || "" : "";
      document.getElementById("f_healthNote").value = country ? country.healthNote || "" : "";
      document.getElementById("f_personalNote").value = country ? state.personalNotes[country.id] || "" : "";
      const deleteBtn = document.getElementById("deleteCountryBtn");
      if (country) {
        deleteBtn.hidden = false;
        deleteBtn.textContent = country.isCustom ? "\u522A\u9664\u9019\u500B\u570B\u5BB6" : "\u91CD\u8A2D\u70BA\u9810\u8A2D\u8CC7\u6599";
      } else {
        deleteBtn.hidden = true;
      }
      backdrop.classList.add("open");
      document.getElementById("f_name").focus();
    }
    function closeModal() {
      backdrop.classList.remove("open");
      form.reset();
      if (modalOpenerEl && typeof modalOpenerEl.focus === "function") modalOpenerEl.focus();
      modalOpenerEl = null;
    }
    backdrop.addEventListener("keydown", function(e) {
      if (!backdrop.classList.contains("open")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = getModalFocusable();
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const id = document.getElementById("f_id").value;
      const fields = {
        name: document.getElementById("f_name").value.trim(),
        nameEn: document.getElementById("f_nameEn").value.trim(),
        region: document.getElementById("f_region").value,
        visaType: document.getElementById("f_visaType").value,
        stayDays: document.getElementById("f_stayDays").value === "" ? null : Number(document.getElementById("f_stayDays").value),
        fee: document.getElementById("f_fee").value === "" ? null : Number(document.getElementById("f_fee").value),
        feeCurrency: document.getElementById("f_feeCurrency").value.trim() || null,
        note: document.getElementById("f_note").value.trim(),
        safetyLevel: document.getElementById("f_safetyLevel").value || null,
        safetyNote: document.getElementById("f_safetyNote").value.trim(),
        yellowFeverStatus: document.getElementById("f_yellowFeverStatus").value || null,
        healthNote: document.getElementById("f_healthNote").value.trim()
      };
      const personalNote = document.getElementById("f_personalNote").value.trim();
      if (!id) {
        const newId = "custom_" + Date.now().toString(36);
        state.customCountries.push(Object.assign({ id: newId }, fields));
        if (personalNote) state.personalNotes[newId] = personalNote;
      } else {
        const existing = findCountry(id);
        if (existing && existing.isCustom) {
          state.customCountries = state.customCountries.map(function(c) {
            return c.id === id ? Object.assign({ id }, fields) : c;
          });
        } else {
          state.overrides[id] = fields;
        }
        if (personalNote) state.personalNotes[id] = personalNote;
        else delete state.personalNotes[id];
      }
      saveState();
      closeModal();
      renderAll();
    });
    document.getElementById("cancelModalBtn").addEventListener("click", closeModal);
    backdrop.addEventListener("click", function(e) {
      if (e.target === backdrop) closeModal();
    });
    document.getElementById("deleteCountryBtn").addEventListener("click", function() {
      const id = document.getElementById("f_id").value;
      const country = findCountry(id);
      if (!country) return closeModal();
      if (country.isCustom) {
        if (!confirm("\u78BA\u5B9A\u8981\u522A\u9664\u300C" + country.name + "\u300D\u55CE\uFF1F\u9019\u6703\u4E00\u4F75\u79FB\u9664\u5B83\u7684\u72C0\u614B\u3001\u7B46\u8A18\u8207\u8DEF\u7DDA\u7D00\u9304\u3002")) return;
        state.customCountries = state.customCountries.filter(function(c) {
          return c.id !== id;
        });
        delete state.status[id];
        delete state.personalNotes[id];
        const removedStopIds = state.route.filter(function(r) {
          return r.countryId === id;
        }).map(function(r) {
          return r.id;
        });
        removedStopIds.forEach(function(stopId) {
          delete state.schedule[stopId];
          delete state.cities[stopId];
          delete state.budget.perStop[stopId];
          delete state.checklist.customCountry[stopId];
        });
        state.route = state.route.filter(function(r) {
          return r.countryId !== id;
        });
      } else {
        delete state.overrides[id];
      }
      saveState();
      closeModal();
      renderAll();
    });
    document.getElementById("addCountryBtn").addEventListener("click", function() {
      openModal(null);
    });
    document.getElementById("countryGrid").addEventListener("click", function(e) {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");
      if (action === "add-route") addRouteStop(id);
      if (action === "edit") openModal(findCountry(id));
    });
    document.getElementById("countryGrid").addEventListener("change", function(e) {
      const sel = e.target.closest('[data-action="status"]');
      if (!sel) return;
      setStatus(sel.getAttribute("data-id"), sel.value);
    });
    function addCityFromInputs(stopId) {
      const nameInput = document.querySelector('.city-name-input[data-stop="' + stopId + '"]');
      const nightsInput = document.querySelector('.city-nights-input[data-stop="' + stopId + '"]');
      const name = nameInput.value.trim();
      if (!name) return;
      addCity(stopId, name, nightsInput.value);
    }
    document.getElementById("routeList").addEventListener("click", function(e) {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");
      if (action === "move-up") moveRoute(id, -1);
      if (action === "move-down") moveRoute(id, 1);
      if (action === "remove-route") removeFromRoute(id);
      if (action === "city-remove") removeCity(btn.getAttribute("data-stop"), btn.getAttribute("data-city"));
      if (action === "city-add") addCityFromInputs(btn.getAttribute("data-stop"));
    });
    document.getElementById("routeList").addEventListener("keydown", function(e) {
      if (e.key !== "Enter") return;
      const input = e.target.closest(".city-name-input, .city-nights-input");
      if (!input) return;
      e.preventDefault();
      addCityFromInputs(input.getAttribute("data-stop"));
    });
    document.getElementById("routeList").addEventListener("change", function(e) {
      const dateInput = e.target.closest('[data-action="date-arrive"], [data-action="date-depart"]');
      if (dateInput) {
        const field = dateInput.getAttribute("data-action") === "date-arrive" ? "arrive" : "depart";
        setStopDate(dateInput.getAttribute("data-id"), field, dateInput.value);
        return;
      }
      const legModeSelect = e.target.closest('[data-action="leg-mode"]');
      if (legModeSelect) setLegMode(legModeSelect.getAttribute("data-id"), legModeSelect.value);
    });
    function focusStopDateInput(id) {
      const el = document.querySelector('.route-item[data-id="' + id + '"] input[data-action="date-arrive"]');
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
    }
    document.getElementById("timelineUnscheduled").addEventListener("click", function(e) {
      const chip = e.target.closest("[data-id]");
      if (!chip) return;
      focusStopDateInput(chip.getAttribute("data-id"));
    });
    document.getElementById("timelineTrack").addEventListener("click", function(e) {
      const bar = e.target.closest(".timeline-bar");
      if (!bar) return;
      focusStopDateInput(bar.getAttribute("data-id"));
    });
    ["searchInput", "regionFilter", "visaFilter", "statusFilter", "safetyFilter", "heritageFilter", "vaccineFilter"].forEach(function(id) {
      document.getElementById(id).addEventListener("input", onFiltersChanged);
      document.getElementById(id).addEventListener("change", onFiltersChanged);
    });
    document.getElementById("exportBtn").addEventListener("click", function() {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rtw-dashboard-backup-" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ".json";
      a.click();
      URL.revokeObjectURL(url);
    });
    document.getElementById("importBtn").addEventListener("click", function() {
      document.getElementById("importFile").click();
    });
    document.getElementById("importFile").addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function() {
        try {
          const parsed = JSON.parse(reader.result);
          if (!confirm("\u532F\u5165\u5C07\u6703\u8986\u84CB\u76EE\u524D\u7684\u8CC7\u6599\uFF0C\u78BA\u5B9A\u8981\u7E7C\u7E8C\u55CE\uFF1F")) return;
          state = Object.assign(defaultState(), parsed);
          state.route = migrateRoute(state.route);
          saveState();
          renderAll();
        } catch (err) {
          alert("\u532F\u5165\u5931\u6557\uFF0C\u6A94\u6848\u683C\u5F0F\u4E0D\u6B63\u78BA\u3002");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });
    let mapSvg = null;
    const mapGroups = {};
    let routeLinesLayer = null;
    const tooltip = document.getElementById("mapTooltip");
    function renderLegend() {
      const items = [
        { cls: "vfree", label: VISA_LABELS.visa_free },
        { cls: "veta", label: VISA_LABELS.eta },
        { cls: "vvoa", label: VISA_LABELS.voa },
        { cls: "vevisa", label: VISA_LABELS.evisa },
        { cls: "vreq", label: VISA_LABELS.visa_required },
        { cls: "vrestricted", label: VISA_LABELS.restricted }
      ];
      const colorVar = {
        vfree: "var(--c-free)",
        veta: "var(--c-eta)",
        vvoa: "var(--c-voa)",
        vevisa: "var(--c-evisa)",
        vreq: "var(--c-required)",
        vrestricted: "var(--c-restricted)"
      };
      document.getElementById("mapLegend").innerHTML = items.map(function(it) {
        return '<div class="legend-item"><span class="legend-swatch" style="background:' + colorVar[it.cls] + '"></span>' + it.label + "</div>";
      }).join("") + '<div class="legend-item"><span class="legend-swatch" style="background:#1a2338"></span>\u5C1A\u7121\u8CC7\u6599</div><div class="legend-sep"></div><div class="legend-item"><span class="legend-swatch legend-swatch-outline" style="border-color:var(--c-voa)"></span>\u6A59\u8272\u65C5\u904A\u8B66\u793A</div><div class="legend-item"><span class="legend-swatch legend-swatch-outline" style="border-color:var(--c-restricted)"></span>\u7D05\u8272\u65C5\u904A\u8B66\u793A</div>';
    }
    function getMapLabelName(svgGroupId) {
      if (!mapSvg) return svgGroupId;
      const labelEl = mapSvg.querySelector("#" + CSS.escape(svgGroupId + "-label"));
      return labelEl ? labelEl.textContent : svgGroupId;
    }
    function initMap() {
      const container = document.getElementById("mapContainer");
      if (typeof WORLD_MAP_SVG === "undefined") return;
      container.innerHTML = WORLD_MAP_SVG;
      mapSvg = container.querySelector("svg");
      if (!mapSvg) return;
      mapSvg.removeAttribute("width");
      mapSvg.removeAttribute("height");
      mapSvg.classList.add("world-map-svg");
      mapSvg.querySelectorAll("g[id]").forEach(function(g) {
        mapGroups[g.id.toLowerCase()] = g;
      });
      routeLinesLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
      routeLinesLayer.setAttribute("id", "routeLinesLayer");
      mapSvg.appendChild(routeLinesLayer);
      mapSvg.addEventListener("mouseover", function(e) {
        const g = e.target.closest("g.country");
        if (!g) return;
        const c = findCountry(g.id.toLowerCase());
        if (!c) {
          tooltip.innerHTML = '<div class="tt-name">' + flagImg(g.id) + escapeHtml(getMapLabelName(g.id)) + '</div><div class="tt-badge">\u5C1A\u7121\u7C3D\u8B49\u8CC7\u6599</div>';
          tooltip.hidden = false;
          return;
        }
        const fee = formatFee(c);
        const heritageCount = c.heritageSites ? c.heritageSites.length : 0;
        tooltip.innerHTML = '<div class="tt-name">' + flagImg(c.id) + escapeHtml(c.name) + '</div><div class="tt-badge badge badge-' + c.visaType + '">' + VISA_LABELS[c.visaType] + "</div>" + (c.stayDays ? "<div>\u53EF\u505C\u7559 " + c.stayDays + " \u5929</div>" : "") + (fee ? "<div>" + escapeHtml(fee) + "</div>" : "") + (c.safetyLevel ? '<div class="tt-badge safety-badge-' + c.safetyLevel + '">\u{1F6E1} ' + SAFETY_LABELS[c.safetyLevel] + "</div>" : "") + (heritageCount ? '<div class="tt-badge badge-heritage">\u{1F3DB} ' + heritageCount + " \u9805\u4E16\u754C\u907A\u7522</div>" : "");
        tooltip.hidden = false;
      });
      mapSvg.addEventListener("mousemove", function(e) {
        if (tooltip.hidden) return;
        tooltip.style.left = e.clientX + 16 + "px";
        tooltip.style.top = e.clientY + 16 + "px";
      });
      mapSvg.addEventListener("mouseout", function(e) {
        const g = e.target.closest("g.country");
        if (!g) return;
        tooltip.hidden = true;
      });
      setupMapZoomPan();
      setupTimelineMapZoomPan();
      renderLegend();
    }
    function renderMap() {
      if (!mapSvg) return;
      const all = getAllCountries();
      const byId = {};
      all.forEach(function(c) {
        byId[c.id] = c;
      });
      const filteredList = computeFilteredList();
      const filteredIds = new Set(filteredList.map(function(c) {
        return c.id;
      }));
      const f = getFilters();
      const filtering = hasActiveFilter(f);
      Object.keys(mapGroups).forEach(function(id) {
        const g = mapGroups[id];
        const country = byId[id];
        g.classList.remove("country", "vfree", "veta", "vvoa", "vevisa", "vreq", "vrestricted", "in-route", "dimmed", "safety-orange", "safety-red", "no-data");
        g.removeAttribute("role");
        g.removeAttribute("aria-label");
        const existingTitle = g.querySelector(":scope > title");
        if (existingTitle) existingTitle.remove();
        if (!country) {
          g.classList.add("country", "no-data");
          const name = getMapLabelName(g.id);
          g.setAttribute("role", "button");
          g.setAttribute("aria-label", name + " - \u5C1A\u7121\u7C3D\u8B49\u8CC7\u6599");
          const noDataTitle = document.createElementNS("http://www.w3.org/2000/svg", "title");
          noDataTitle.textContent = name + " \xB7 \u5C1A\u7121\u7C3D\u8B49\u8CC7\u6599";
          g.insertBefore(noDataTitle, g.firstChild);
          return;
        }
        g.classList.add("country", VISA_CLASS[country.visaType]);
        g.setAttribute("role", "button");
        g.setAttribute("aria-label", country.name + " - " + VISA_LABELS[country.visaType]);
        if (state.route.some(function(r) {
          return r.countryId === id;
        })) g.classList.add("in-route");
        if (filtering && !filteredIds.has(id)) g.classList.add("dimmed");
        if (country.safetyLevel === "orange") g.classList.add("safety-orange");
        if (country.safetyLevel === "red") g.classList.add("safety-red");
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = country.name + " \xB7 " + VISA_LABELS[country.visaType] + (country.safetyLevel ? " \xB7 \u65C5\u904A\u8B66\u793A\uFF1A" + SAFETY_LABELS[country.safetyLevel] : "");
        g.insertBefore(title, g.firstChild);
      });
    }
    function renderRouteLines() {
      if (!mapSvg || !routeLinesLayer) return;
      routeLinesLayer.innerHTML = "";
      const points = [];
      state.route.forEach(function(stop, idx) {
        const g = mapGroups[stop.countryId];
        if (!g) return;
        try {
          const bbox = g.getBBox();
          points.push({ id: stop.countryId, stopId: stop.id, x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2, order: idx + 1 });
        } catch (e) {
        }
      });
      const svgNS = "http://www.w3.org/2000/svg";
      for (let i = 0; i < points.length - 1; i++) {
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", points[i].x);
        line.setAttribute("y1", points[i].y);
        line.setAttribute("x2", points[i + 1].x);
        line.setAttribute("y2", points[i + 1].y);
        routeLinesLayer.appendChild(line);
        const legA = findCountry(points[i].id), legB = findCountry(points[i + 1].id);
        const leg = computeLeg(points[i].stopId, legA, points[i + 1].stopId, legB);
        if (leg) {
          const lx = (points[i].x + points[i + 1].x) / 2, ly = (points[i].y + points[i + 1].y) / 2 - 2;
          appendScaledMarker(routeLinesLayer, lx, ly, function(g) {
            const label = document.createElementNS(svgNS, "text");
            label.setAttribute("class", "route-leg-label");
            label.setAttribute("x", lx);
            label.setAttribute("y", ly);
            label.textContent = TRANSPORT_ICONS[leg.mode] + " " + fmtKm(leg.km) + " \xB7 " + fmtHours(leg.hours);
            g.appendChild(label);
          });
        }
      }
      points.forEach(function(p) {
        appendScaledMarker(routeLinesLayer, p.x, p.y, function(g) {
          const dot = document.createElementNS(svgNS, "circle");
          dot.setAttribute("class", "route-dot");
          dot.setAttribute("cx", p.x);
          dot.setAttribute("cy", p.y);
          dot.setAttribute("r", 4.5);
          g.appendChild(dot);
          const text = document.createElementNS(svgNS, "text");
          text.setAttribute("class", "route-order");
          text.setAttribute("x", p.x);
          text.setAttribute("y", p.y);
          text.textContent = p.order;
          g.appendChild(text);
        });
      });
      fitMapToPoints(points);
    }
    function appendScaledMarker(parent, px2, py, buildFn) {
      const svgNS = "http://www.w3.org/2000/svg";
      const g = document.createElementNS(svgNS, "g");
      g.setAttribute("class", "route-marker-scale");
      g.setAttribute("data-px", px2);
      g.setAttribute("data-py", py);
      g.setAttribute("transform", markerScaleTransform(px2, py));
      buildFn(g);
      parent.appendChild(g);
      return g;
    }
    function markerScaleTransform(px2, py) {
      const s = 1 / zoomScale;
      return "translate(" + px2 + "," + py + ") scale(" + s + ") translate(" + -px2 + "," + -py + ")";
    }
    let zoomScale = 1, panX = 0, panY = 0;
    let mapDragging = false, mapDragMoved = false, dragStartX = 0, dragStartY = 0, dragStartPanX = 0, dragStartPanY = 0;
    function applyMapTransform() {
      mapSvg.style.transform = "translate(" + panX + "px," + panY + "px) scale(" + zoomScale + ")";
      if (routeLinesLayer) {
        routeLinesLayer.querySelectorAll(".route-marker-scale").forEach(function(g) {
          g.setAttribute("transform", markerScaleTransform(g.getAttribute("data-px"), g.getAttribute("data-py")));
        });
      }
    }
    let timelineMapUserAdjusted = false;
    let lastFitRouteKey = null;
    function fitMapToPoints(points) {
      const host = document.getElementById("timelineMapContainer");
      const viewport = document.getElementById("timelineMapViewport");
      if (!mapSvg || !host || !viewport || !host.contains(mapSvg)) return;
      const key = points.map(function(p) {
        return p.stopId;
      }).join(",");
      if (timelineMapUserAdjusted && key === lastFitRouteKey) return;
      lastFitRouteKey = key;
      timelineMapUserAdjusted = false;
      if (!points.length) {
        zoomScale = 1;
        panX = 0;
        panY = 0;
        applyMapTransform();
        return;
      }
      const vb = mapSvg.viewBox.baseVal;
      const baseScale = viewport.clientWidth / vb.width;
      const minX = Math.min.apply(null, points.map(function(p) {
        return p.x;
      }));
      const maxX = Math.max.apply(null, points.map(function(p) {
        return p.x;
      }));
      const minY = Math.min.apply(null, points.map(function(p) {
        return p.y;
      }));
      const maxY = Math.max.apply(null, points.map(function(p) {
        return p.y;
      }));
      const pad = Math.max(vb.width, vb.height) * 0.08;
      const spanX = Math.max(maxX - minX, vb.width * 0.04) + pad * 2;
      const spanY = Math.max(maxY - minY, vb.height * 0.04) + pad * 2;
      const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
      zoomScale = Math.min(6, Math.max(1, Math.min(viewport.clientWidth / (spanX * baseScale), viewport.clientHeight / (spanY * baseScale))));
      panX = viewport.clientWidth / 2 - zoomScale * baseScale * cx;
      panY = viewport.clientHeight / 2 - zoomScale * baseScale * cy;
      applyMapTransform();
    }
    function setupMapZoomPan() {
      const viewport = document.getElementById("mapViewport");
      function zoomBy(factor, cx, cy) {
        const newScale = Math.min(6, Math.max(1, zoomScale * factor));
        panX = cx - (cx - panX) * (newScale / zoomScale);
        panY = cy - (cy - panY) * (newScale / zoomScale);
        zoomScale = newScale;
        applyMapTransform();
      }
      viewport.addEventListener("wheel", function(e) {
        e.preventDefault();
        const rect = viewport.getBoundingClientRect();
        zoomBy(e.deltaY > 0 ? 0.88 : 1.14, e.clientX - rect.left, e.clientY - rect.top);
      }, { passive: false });
      document.getElementById("mapZoomIn").addEventListener("click", function() {
        const rect = viewport.getBoundingClientRect();
        zoomBy(1.3, rect.width / 2, rect.height / 2);
      });
      document.getElementById("mapZoomOut").addEventListener("click", function() {
        const rect = viewport.getBoundingClientRect();
        zoomBy(1 / 1.3, rect.width / 2, rect.height / 2);
      });
      document.getElementById("mapZoomReset").addEventListener("click", function() {
        zoomScale = 1;
        panX = 0;
        panY = 0;
        applyMapTransform();
      });
      viewport.addEventListener("pointerdown", function(e) {
        mapDragging = true;
        mapDragMoved = false;
        dragStartX = e.clientX - panX;
        dragStartY = e.clientY - panY;
        dragStartPanX = panX;
        dragStartPanY = panY;
        viewport.setPointerCapture(e.pointerId);
        viewport.classList.add("grabbing");
      });
      viewport.addEventListener("pointermove", function(e) {
        if (!mapDragging) return;
        const nx = e.clientX - dragStartX, ny = e.clientY - dragStartY;
        if (!mapDragMoved && (Math.abs(nx - dragStartPanX) > 8 || Math.abs(ny - dragStartPanY) > 8)) mapDragMoved = true;
        panX = nx;
        panY = ny;
        applyMapTransform();
      });
      function endDrag(e) {
        mapDragging = false;
        viewport.classList.remove("grabbing");
        if (e && e.pointerId != null && viewport.hasPointerCapture(e.pointerId)) {
          viewport.releasePointerCapture(e.pointerId);
        }
        setTimeout(function() {
          mapDragMoved = false;
        }, 0);
      }
      viewport.addEventListener("pointerup", function(e) {
        const wasClick = !mapDragMoved;
        endDrag(e);
        if (!wasClick) return;
        const hit = document.elementFromPoint(e.clientX, e.clientY);
        const g = hit && hit.closest("g.country");
        if (!g) return;
        if (!findCountry(g.id.toLowerCase())) return;
        selectCountry(g.id.toLowerCase());
      });
      viewport.addEventListener("pointercancel", endDrag);
      viewport.addEventListener("dblclick", function() {
        zoomScale = 1;
        panX = 0;
        panY = 0;
        applyMapTransform();
      });
    }
    function setupTimelineMapZoomPan() {
      const viewport = document.getElementById("timelineMapViewport");
      if (!viewport) return;
      function zoomBy(factor, cx, cy) {
        const newScale = Math.min(6, Math.max(1, zoomScale * factor));
        panX = cx - (cx - panX) * (newScale / zoomScale);
        panY = cy - (cy - panY) * (newScale / zoomScale);
        zoomScale = newScale;
        timelineMapUserAdjusted = true;
        applyMapTransform();
      }
      viewport.addEventListener("wheel", function(e) {
        e.preventDefault();
        const rect = viewport.getBoundingClientRect();
        zoomBy(e.deltaY > 0 ? 0.88 : 1.14, e.clientX - rect.left, e.clientY - rect.top);
      }, { passive: false });
      document.getElementById("timelineMapZoomIn").addEventListener("click", function() {
        const rect = viewport.getBoundingClientRect();
        zoomBy(1.3, rect.width / 2, rect.height / 2);
      });
      document.getElementById("timelineMapZoomOut").addEventListener("click", function() {
        const rect = viewport.getBoundingClientRect();
        zoomBy(1 / 1.3, rect.width / 2, rect.height / 2);
      });
      document.getElementById("timelineMapZoomReset").addEventListener("click", function() {
        timelineMapUserAdjusted = false;
        renderRouteLines();
      });
      let dragging = false, dragMoved = false, dragStartX2 = 0, dragStartY2 = 0, dragStartPanX2 = 0, dragStartPanY2 = 0;
      viewport.addEventListener("pointerdown", function(e) {
        dragging = true;
        dragMoved = false;
        dragStartX2 = e.clientX - panX;
        dragStartY2 = e.clientY - panY;
        dragStartPanX2 = panX;
        dragStartPanY2 = panY;
        viewport.setPointerCapture(e.pointerId);
        viewport.classList.add("grabbing");
      });
      viewport.addEventListener("pointermove", function(e) {
        if (!dragging) return;
        const nx = e.clientX - dragStartX2, ny = e.clientY - dragStartY2;
        if (!dragMoved && (Math.abs(nx - dragStartPanX2) > 8 || Math.abs(ny - dragStartPanY2) > 8)) dragMoved = true;
        if (dragMoved) {
          panX = nx;
          panY = ny;
          timelineMapUserAdjusted = true;
          applyMapTransform();
        }
      });
      function endDrag(e) {
        dragging = false;
        viewport.classList.remove("grabbing");
        if (e && e.pointerId != null && viewport.hasPointerCapture(e.pointerId)) {
          viewport.releasePointerCapture(e.pointerId);
        }
      }
      viewport.addEventListener("pointerup", endDrag);
      viewport.addEventListener("pointercancel", endDrag);
      viewport.addEventListener("dblclick", function() {
        timelineMapUserAdjusted = false;
        renderRouteLines();
      });
    }
    const TAB_STORAGE_KEY = "rtwActiveTab_v1";
    function switchTab(tab) {
      document.querySelectorAll(".tab-btn").forEach(function(btn) {
        btn.classList.toggle("active", btn.getAttribute("data-tab") === tab);
      });
      document.querySelectorAll(".tab-panel").forEach(function(panel) {
        panel.hidden = panel.getAttribute("data-tab-panel") !== tab;
      });
      localStorage.setItem(TAB_STORAGE_KEY, tab);
      relocateMap(tab);
      if (tab === "map" || tab === "timeline") renderRoute();
    }
    function relocateMap(tab) {
      if (!mapSvg) return;
      const mainHost = document.getElementById("mapContainer");
      const timelineHost = document.getElementById("timelineMapContainer");
      if (!mainHost || !timelineHost) return;
      const targetHost = tab === "timeline" ? timelineHost : mainHost;
      if (mapSvg.parentElement !== targetHost) targetHost.appendChild(mapSvg);
      mapSvg.classList.toggle("in-timeline-context", tab === "timeline");
      if (routeLinesLayer) routeLinesLayer.classList.toggle("in-timeline-context", tab === "timeline");
      timelineMapUserAdjusted = false;
      zoomScale = 1;
      panX = 0;
      panY = 0;
      applyMapTransform();
    }
    document.getElementById("tabBar").addEventListener("click", function(e) {
      const btn = e.target.closest(".tab-btn");
      if (!btn) return;
      switchTab(btn.getAttribute("data-tab"));
    });
    const RATES_URL = "https://open.er-api.com/v6/latest/USD";
    const RATES_CACHE_KEY = "rtwCurrencyRatesCache_v1";
    const FALLBACK_RATES = {
      USD: 1,
      TWD: 32.35,
      KRW: 1459.6,
      GBP: 0.7495,
      CAD: 1.4087,
      AUD: 1.4304,
      NZD: 1.7256,
      EUR: 0.878,
      JPY: 163.68
    };
    let rates = null;
    let lastBudgetTotal = 0;
    function convertCurrency(amount, from, to) {
      if (!rates || !amount || !rates[from] || !rates[to]) return null;
      return amount / rates[from] * rates[to];
    }
    function fmtMoney(n) {
      if (n === null || n === void 0 || isNaN(n)) return "\u2013";
      return n.toLocaleString("zh-Hant", { maximumFractionDigits: 2 });
    }
    function populateCurrencySelects() {
      if (!rates) return;
      const codes = Object.keys(rates).sort();
      const home = state.homeCurrency || "TWD";
      ["homeCurrencySelect", "budgetHomeCurrencySelect"].forEach(function(id) {
        const sel = document.getElementById(id);
        if (!sel) return;
        sel.innerHTML = codes.map(function(c) {
          return '<option value="' + c + '">' + c + "</option>";
        }).join("");
        sel.value = codes.indexOf(home) !== -1 ? home : "TWD";
      });
      const fromSel = document.getElementById("convFrom"), toSel = document.getElementById("convTo");
      fromSel.innerHTML = codes.map(function(c) {
        return '<option value="' + c + '">' + c + "</option>";
      }).join("");
      toSel.innerHTML = codes.map(function(c) {
        return '<option value="' + c + '">' + c + "</option>";
      }).join("");
      fromSel.value = codes.indexOf("USD") !== -1 ? "USD" : codes[0];
      toSel.value = codes.indexOf("TWD") !== -1 ? "TWD" : codes[0];
    }
    function populateConverterCountrySelects() {
      const withCurrency = getAllCountries().filter(function(c) {
        return COUNTRY_CURRENCY[c.id];
      }).sort(function(a, b) {
        return a.name.localeCompare(b.name, "zh-Hant");
      });
      const optionsHtml = '<option value="">\uFF0D \u9078\u64C7\u570B\u5BB6 \uFF0D</option>' + withCurrency.map(function(c) {
        return '<option value="' + c.id + '">' + escapeHtml(c.name) + "\uFF08" + COUNTRY_CURRENCY[c.id] + "\uFF09</option>";
      }).join("");
      ["convFromCountry", "convToCountry"].forEach(function(id) {
        const sel = document.getElementById(id);
        if (sel) sel.innerHTML = optionsHtml;
      });
    }
    function currencyOptionsHtml(selected, codes) {
      return codes.map(function(c) {
        return '<option value="' + c + '"' + (c === selected ? " selected" : "") + ">" + c + "</option>";
      }).join("");
    }
    function renderCurrencyTab() {
      if (!rates) return;
      const home = document.getElementById("homeCurrencySelect").value || state.homeCurrency;
      const body = document.getElementById("feeTableBody");
      const route = state.route;
      if (!route.length) {
        body.innerHTML = '<tr><td colspan="4" class="empty-state">\u300C\u6211\u7684\u8DEF\u7DDA\u300D\u76EE\u524D\u662F\u7A7A\u7684\uFF0C\u5148\u53BB\u5730\u5716\u6216\u6E05\u55AE\u52A0\u5E7E\u500B\u570B\u5BB6\u5427\u3002</td></tr>';
        document.getElementById("feeTotal").textContent = "\u2013";
        return;
      }
      let total = 0, hasUnknown = false;
      const rows = route.map(function(stop) {
        const c = findCountry(stop.countryId);
        if (!c) return "";
        let converted = null, origText = "\u2014";
        if (c.fee !== null && c.fee !== void 0) {
          origText = c.fee === 0 ? "\u514D\u8CBB" : (c.feeCurrency || "") + " " + c.fee;
          if (c.fee > 0) {
            converted = convertCurrency(c.fee, c.feeCurrency || "USD", home);
            if (converted !== null) total += converted;
            else hasUnknown = true;
          }
        } else if (c.visaType !== "visa_free") {
          hasUnknown = true;
        }
        return "<tr><td>" + escapeHtml(c.name) + "</td><td>" + (VISA_LABELS[c.visaType] || c.visaType) + '</td><td class="num">' + escapeHtml(origText) + '</td><td class="num">' + (converted !== null ? home + " " + fmtMoney(converted) : "\u2013") + "</td></tr>";
      }).join("");
      body.innerHTML = rows;
      document.getElementById("feeTotal").textContent = home + " " + fmtMoney(total) + (hasUnknown ? "\uFF08\u5C1A\u6709\u8CBB\u7528\u5F85\u67E5\u8B49\uFF0C\u672A\u8A08\u5165\uFF09" : "");
    }
    function renderConverter() {
      if (!rates) return;
      const amount = parseFloat(document.getElementById("convAmount").value) || 0;
      const from = document.getElementById("convFrom").value;
      const to = document.getElementById("convTo").value;
      const result = convertCurrency(amount, from, to);
      document.getElementById("convResult").textContent = result !== null ? fmtMoney(amount) + " " + from + " \u2248 " + fmtMoney(result) + " " + to : "\u7121\u6CD5\u63DB\u7B97";
      document.getElementById("convRateLine").textContent = result !== null && amount > 0 ? "\u532F\u7387\uFF1A1 " + from + " \u2248 " + fmtMoney(convertCurrency(1, from, to)) + " " + to : "";
    }
    function getStopBudget(id) {
      if (!state.budget.perStop[id]) state.budget.perStop[id] = { nights: null, currency: "USD", accom: null, daily: null, transport: null };
      return state.budget.perStop[id];
    }
    function renderBudgetTab() {
      if (!rates) return;
      const home = document.getElementById("budgetHomeCurrencySelect").value || state.homeCurrency;
      const codes = Object.keys(rates).sort();
      const body = document.getElementById("budgetTableBody");
      const route = state.route;
      if (!route.length) {
        body.innerHTML = '<tr><td colspan="8" class="empty-state">\u300C\u6211\u7684\u8DEF\u7DDA\u300D\u76EE\u524D\u662F\u7A7A\u7684\uFF0C\u5148\u53BB\u5730\u5716\u6216\u6E05\u55AE\u52A0\u5E7E\u500B\u570B\u5BB6\u5427\u3002</td></tr>';
        document.getElementById("budgetTotal").textContent = "\u2013";
        lastBudgetTotal = 0;
        renderSavings(0, home);
        return;
      }
      let grandTotal = 0;
      const rows = route.map(function(stop) {
        const id = stop.id;
        const c = findCountry(stop.countryId);
        if (!c) return "";
        const sb = getStopBudget(id);
        const autoNights = stopDuration(getSchedule(id));
        const nights = sb.nights !== null && sb.nights !== void 0 && sb.nights !== "" ? Number(sb.nights) : autoNights !== null ? autoNights : 0;
        const livingCost = (Number(sb.accom) || 0) * nights + (Number(sb.daily) || 0) * nights + (Number(sb.transport) || 0);
        const livingConverted = convertCurrency(livingCost, sb.currency, home) || 0;
        let visaConverted = 0, visaText = "\u2014";
        if (c.fee !== null && c.fee !== void 0 && c.fee > 0) {
          visaConverted = convertCurrency(c.fee, c.feeCurrency || "USD", home) || 0;
          visaText = home + " " + fmtMoney(visaConverted);
        } else if (c.fee === 0) {
          visaText = "\u514D\u8CBB";
        }
        const subtotal = livingConverted + visaConverted;
        grandTotal += subtotal;
        return '<tr data-id="' + id + '" data-country="' + stop.countryId + '"><td>' + escapeHtml(c.name) + '</td><td><input type="number" min="0" data-field="nights" data-id="' + id + '" value="' + (sb.nights !== null && sb.nights !== void 0 ? sb.nights : "") + '" placeholder="' + (autoNights !== null ? autoNights : 0) + '"></td><td><select data-field="currency" data-id="' + id + '">' + currencyOptionsHtml(sb.currency, codes) + '</select></td><td><input type="number" min="0" data-field="accom" data-id="' + id + '" value="' + (sb.accom || "") + '"></td><td><input type="number" min="0" data-field="daily" data-id="' + id + '" value="' + (sb.daily || "") + '"></td><td><input type="number" min="0" data-field="transport" data-id="' + id + '" value="' + (sb.transport || "") + '"></td><td class="num visa-fee-cell">' + visaText + '</td><td class="num subtotal">' + home + " " + fmtMoney(subtotal) + "</td></tr>";
      }).join("");
      body.innerHTML = rows;
      lastBudgetTotal = grandTotal;
      document.getElementById("budgetTotal").textContent = home + " " + fmtMoney(grandTotal);
      renderSavings(grandTotal, home);
    }
    function updateBudgetSubtotals() {
      if (!rates) return;
      const home = document.getElementById("budgetHomeCurrencySelect").value || state.homeCurrency;
      let grandTotal = 0;
      document.querySelectorAll("#budgetTableBody tr[data-id]").forEach(function(tr) {
        const id = tr.getAttribute("data-id");
        const c = findCountry(tr.getAttribute("data-country"));
        if (!c) return;
        const nightsInput = tr.querySelector('[data-field="nights"]');
        const currencySel = tr.querySelector('[data-field="currency"]');
        const accomInput = tr.querySelector('[data-field="accom"]');
        const dailyInput = tr.querySelector('[data-field="daily"]');
        const transportInput = tr.querySelector('[data-field="transport"]');
        const autoNights = stopDuration(getSchedule(id));
        const nights = nightsInput.value !== "" ? Number(nightsInput.value) : autoNights !== null ? autoNights : 0;
        const livingCost = (Number(accomInput.value) || 0) * nights + (Number(dailyInput.value) || 0) * nights + (Number(transportInput.value) || 0);
        const livingConverted = convertCurrency(livingCost, currencySel.value, home) || 0;
        let visaConverted = 0;
        const visaCell = tr.querySelector(".visa-fee-cell");
        if (c.fee !== null && c.fee !== void 0 && c.fee > 0) {
          visaConverted = convertCurrency(c.fee, c.feeCurrency || "USD", home) || 0;
          if (visaCell) visaCell.textContent = home + " " + fmtMoney(visaConverted);
        } else if (visaCell) {
          visaCell.textContent = c.fee === 0 ? "\u514D\u8CBB" : "\u2014";
        }
        const subtotal = livingConverted + visaConverted;
        grandTotal += subtotal;
        const subtotalCell = tr.querySelector(".subtotal");
        if (subtotalCell) subtotalCell.textContent = home + " " + fmtMoney(subtotal);
      });
      lastBudgetTotal = grandTotal;
      document.getElementById("budgetTotal").textContent = home + " " + fmtMoney(grandTotal);
      renderSavings(grandTotal, home);
      renderShareSummary();
    }
    function renderSavings(total, home) {
      const el = document.getElementById("savingsGap");
      const funds = parseFloat(document.getElementById("availableFunds").value);
      if (isNaN(funds)) {
        el.textContent = "";
        return;
      }
      const gap = funds - total;
      el.innerHTML = gap >= 0 ? '<span class="savings-gap ok">\u2705 \u8CC7\u91D1\u8DB3\u5920\uFF0C\u9084\u591A ' + home + " " + fmtMoney(gap) + "</span>" : '<span class="savings-gap short">\u26A0 \u9084\u5DEE ' + home + " " + fmtMoney(-gap) + "</span>";
    }
    function setRateStatus(live, extra) {
      const el = document.getElementById("rateStatus");
      if (!el) return;
      el.className = "rate-status " + (live ? "live" : "fallback");
      el.textContent = live ? "\u2705 \u5DF2\u9023\u7DDA\u81F3\u5373\u6642\u532F\u7387" + (extra ? "\uFF08" + extra + "\uFF09" : "") : "\u26A0 \u7121\u6CD5\u53D6\u5F97\u5373\u6642\u532F\u7387\uFF0C\u4F7F\u7528\u5167\u5EFA\u53C3\u8003\u532F\u7387\uFF08\u53EF\u80FD\u5DF2\u904E\u6642\uFF0C\u50C5\u4F9B\u4F30\u7B97\uFF09" + (extra ? "\uFF08" + extra + "\uFF09" : "");
    }
    function renderCurrencyAndBudget() {
      populateCurrencySelects();
      renderCurrencyTab();
      renderConverter();
      renderBudgetTab();
      renderTimeline();
      renderShareSummary();
    }
    function newEmergencyRowId() {
      return "ec_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }
    function renderEmergencyCard() {
      const ec = state.emergencyCard;
      document.querySelectorAll("#emergencyForm [data-ecfield]").forEach(function(input) {
        input.value = ec[input.getAttribute("data-ecfield")] || "";
      });
      const cardsList = document.getElementById("ec_cardsList");
      cardsList.innerHTML = ec.cards.length ? ec.cards.map(function(row) {
        return '<div class="emergency-row"><input type="text" data-ecrow="cards" data-ecfield="label" data-id="' + row.id + '" placeholder="\u5361\u7247\u540D\u7A31\uFF08\u4F8B\u5982\uFF1AOO\u9280\u884C Visa\uFF09" value="' + escapeHtml(row.label || "") + '"><input type="text" data-ecrow="cards" data-ecfield="phone" data-id="' + row.id + '" placeholder="\u6D77\u5916\u639B\u5931\u96FB\u8A71" value="' + escapeHtml(row.phone || "") + '"><button type="button" class="btn btn-small btn-ghost" data-action="ec-remove-card" data-id="' + row.id + '">\u79FB\u9664</button></div>';
      }).join("") : '<div class="empty-state-small">\u5C1A\u672A\u65B0\u589E</div>';
      const contactsList = document.getElementById("ec_contactsList");
      contactsList.innerHTML = ec.contacts.length ? ec.contacts.map(function(row) {
        return '<div class="emergency-row"><input type="text" data-ecrow="contacts" data-ecfield="name" data-id="' + row.id + '" placeholder="\u59D3\u540D" value="' + escapeHtml(row.name || "") + '"><input type="text" data-ecrow="contacts" data-ecfield="relation" data-id="' + row.id + '" placeholder="\u95DC\u4FC2" value="' + escapeHtml(row.relation || "") + '"><input type="text" data-ecrow="contacts" data-ecfield="phone" data-id="' + row.id + '" placeholder="\u96FB\u8A71" value="' + escapeHtml(row.phone || "") + '"><button type="button" class="btn btn-small btn-ghost" data-action="ec-remove-contact" data-id="' + row.id + '">\u79FB\u9664</button></div>';
      }).join("") : '<div class="empty-state-small">\u5C1A\u672A\u65B0\u589E</div>';
    }
    function renderMissionList() {
      const el = document.getElementById("missionList");
      if (!el) return;
      if (!state.route.length) {
        el.innerHTML = '<div class="empty-state">\u8DEF\u7DDA\u662F\u7A7A\u7684\uFF0C\u53BB\u5730\u5716\u6216\u6E05\u55AE\u6311\u5E7E\u500B\u570B\u5BB6\u5427\uFF01</div>';
        return;
      }
      const seen = {};
      const stops = state.route.filter(function(r) {
        if (seen[r.countryId]) return false;
        seen[r.countryId] = true;
        return true;
      });
      el.innerHTML = stops.map(function(stop) {
        const c = findCountry(stop.countryId);
        if (!c) return "";
        const localEmergencyLine = c.localEmergencyNumber ? '<div class="mission-line mission-line-emergency">\u{1F6A8} \u7576\u5730\u5831\u8B66/\u6D88\u9632/\u6551\u8B77\u8ECA\uFF1A' + escapeHtml(c.localEmergencyNumber) + "</div>" : "";
        if (c.missionName) {
          return '<div class="mission-card"><div class="mission-country">' + escapeHtml(c.name) + "</div>" + localEmergencyLine + '<div class="mission-name">' + escapeHtml(c.missionName) + "</div>" + (c.missionAddress ? '<div class="mission-line">\u{1F4CD} ' + escapeHtml(c.missionAddress) + "</div>" : "") + (c.missionPhone ? '<div class="mission-line">\u260E ' + escapeHtml(c.missionPhone) + "</div>" : "") + (c.missionEmergencyPhone ? '<div class="mission-line">\u{1F198} \u6025\u96E3\u6551\u52A9\uFF1A' + escapeHtml(c.missionEmergencyPhone) + "</div>" : "") + (c.missionNote ? '<div class="mission-note">' + escapeHtml(c.missionNote) + "</div>" : "") + "</div>";
        }
        return '<div class="mission-card mission-card-none"><div class="mission-country">' + escapeHtml(c.name) + "</div>" + localEmergencyLine + '<div class="mission-line dim">\u6B64\u5730\u5340\u67E5\u7121\u4E2D\u83EF\u6C11\u570B\u99D0\u5916\u9928\u8655\u8CC7\u6599\uFF0C\u8ACB\u81F3\u5916\u4EA4\u90E8\u5B98\u7DB2\u67E5\u8A62\u9130\u8FD1\u4EE3\u8868\u8655\uFF1A<a href="https://www.mofa.gov.tw/OverseasOffice.aspx?n=168&sms=87" target="_blank" rel="noopener">\u99D0\u5916\u9928\u8655\u67E5\u8A62</a></div></div>';
      }).join("");
    }
    function renderEmergencyTab() {
      renderEmergencyCard();
      renderMissionList();
    }
    document.getElementById("emergencyForm").addEventListener("input", function(e) {
      const field = e.target.closest("[data-ecfield]");
      if (!field) return;
      const rowType = field.getAttribute("data-ecrow");
      if (rowType) {
        const row = state.emergencyCard[rowType].find(function(r) {
          return r.id === field.getAttribute("data-id");
        });
        if (row) row[field.getAttribute("data-ecfield")] = field.value;
      } else {
        state.emergencyCard[field.getAttribute("data-ecfield")] = field.value;
      }
      saveState();
    });
    document.getElementById("emergencyForm").addEventListener("click", function(e) {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      if (action === "ec-add-card") {
        state.emergencyCard.cards.push({ id: newEmergencyRowId(), label: "", phone: "" });
      } else if (action === "ec-add-contact") {
        state.emergencyCard.contacts.push({ id: newEmergencyRowId(), name: "", relation: "", phone: "" });
      } else if (action === "ec-remove-card") {
        state.emergencyCard.cards = state.emergencyCard.cards.filter(function(r) {
          return r.id !== btn.getAttribute("data-id");
        });
      } else if (action === "ec-remove-contact") {
        state.emergencyCard.contacts = state.emergencyCard.contacts.filter(function(r) {
          return r.id !== btn.getAttribute("data-id");
        });
      } else {
        return;
      }
      saveState();
      renderEmergencyCard();
    });
    function buildShareData() {
      const home = state.homeCurrency || "TWD";
      const stops = state.route.map(function(stop, idx) {
        const c = findCountry(stop.countryId);
        if (!c) return null;
        const sched = getSchedule(stop.id);
        const duration = stopDuration(sched);
        const cities = getCities(stop.id);
        const sb = state.budget.perStop[stop.id] || null;
        let leg = null;
        if (idx > 0) {
          const prevStop = state.route[idx - 1];
          const prevC = findCountry(prevStop.countryId);
          leg = computeLeg(prevStop.id, prevC, stop.id, c);
        }
        const visitCount = state.route.filter(function(r, i) {
          return i <= idx && r.countryId === stop.countryId;
        }).length;
        return { stop, country: c, sched, duration, cities, budget: sb, leg, visitCount, order: idx + 1 };
      }).filter(Boolean);
      const sc = computeSchedule();
      let accomTotal = 0, dailyTotal = 0, transportTotal = 0, visaTotal = 0;
      let hasUnknownFee = false;
      stops.forEach(function(s) {
        const sb = s.budget;
        const nights = sb && sb.nights !== null && sb.nights !== void 0 && sb.nights !== "" ? Number(sb.nights) : s.duration !== null ? s.duration : 0;
        if (sb) {
          accomTotal += convertCurrency((Number(sb.accom) || 0) * nights, sb.currency, home) || 0;
          dailyTotal += convertCurrency((Number(sb.daily) || 0) * nights, sb.currency, home) || 0;
          transportTotal += convertCurrency(Number(sb.transport) || 0, sb.currency, home) || 0;
        }
        if (s.country.fee !== null && s.country.fee !== void 0 && s.country.fee > 0) {
          visaTotal += convertCurrency(s.country.fee, s.country.feeCurrency || "USD", home) || 0;
        } else if (s.country.visaType !== "visa_free") {
          hasUnknownFee = true;
        }
      });
      const grandTotal = accomTotal + dailyTotal + transportTotal + visaTotal;
      return {
        stops,
        sc,
        home,
        accomTotal,
        dailyTotal,
        transportTotal,
        visaTotal,
        grandTotal,
        hasUnknownFee,
        availableFunds: state.budget.availableFunds
      };
    }
    function shareDocBodyHtml(data) {
      if (!data.stops.length) {
        return '<div class="share-empty">\u300C\u6211\u7684\u8DEF\u7DDA\u300D\u76EE\u524D\u662F\u7A7A\u7684\uFF0C\u5148\u56DE\u7E3D\u89BD\u5730\u5716\u52A0\u5E7E\u500B\u570B\u5BB6\uFF0C\u9019\u88E1\u5C31\u6703\u51FA\u73FE\u884C\u7A0B\u6458\u8981\u3002</div>';
      }
      const sc = data.sc;
      const dateRangeText = sc.totalDays ? fmtDate(sc.minDate) + " \u2192 " + fmtDate(sc.maxDate) : "\u65E5\u671F\u5C1A\u672A\u6392\u5B9A";
      const rows = data.stops.map(function(s) {
        const c = s.country;
        const visitLabel = s.visitCount > 1 ? "\uFF08\u7B2C" + s.visitCount + "\u6B21\uFF09" : "";
        const dateText = s.sched.arrive && s.sched.depart ? s.sched.arrive + " ~ " + s.sched.depart : "\u672A\u6392\u5B9A";
        const legText = s.leg ? TRANSPORT_ICONS[s.leg.mode] + " " + TRANSPORT_LABELS[s.leg.mode] + " " + fmtKm(s.leg.km) + " / " + fmtHours(s.leg.hours) : "\uFF0D";
        const visaText = VISA_LABELS[c.visaType] + (formatFee(c) ? "\uFF08" + formatFee(c) + "\uFF09" : "") + (c.yellowFeverStatus ? "\uFF5C\u{1F489} " + YELLOW_FEVER_LABELS[c.yellowFeverStatus] : "");
        const citiesText = s.cities.length ? s.cities.map(function(city) {
          return city.name + (city.nights ? city.nights + "\u665A" : "");
        }).join("\u3001") : "\uFF0D";
        let subtotal = 0;
        if (s.budget) {
          const nights = s.budget.nights !== null && s.budget.nights !== void 0 && s.budget.nights !== "" ? Number(s.budget.nights) : s.duration !== null ? s.duration : 0;
          subtotal += convertCurrency((Number(s.budget.accom) || 0) * nights, s.budget.currency, data.home) || 0;
          subtotal += convertCurrency((Number(s.budget.daily) || 0) * nights, s.budget.currency, data.home) || 0;
          subtotal += convertCurrency(Number(s.budget.transport) || 0, s.budget.currency, data.home) || 0;
        }
        if (c.fee > 0) subtotal += convertCurrency(c.fee, c.feeCurrency || "USD", data.home) || 0;
        return "<tr><td>" + s.order + "</td><td>" + escapeHtml(c.name) + escapeHtml(visitLabel) + "</td><td>" + escapeHtml(dateText) + (s.duration !== null ? "<br><small>" + s.duration + " \u5929</small>" : "") + "</td><td>" + escapeHtml(visaText) + "</td><td>" + escapeHtml(legText) + "</td><td>" + escapeHtml(citiesText) + '</td><td class="num">' + data.home + " " + fmtMoney(subtotal) + "</td></tr>";
      }).join("");
      const gapLine = data.availableFunds !== null && data.availableFunds !== void 0 && data.availableFunds !== "" ? '<tr><td>\u53EF\u7528\u8CC7\u91D1</td><td class="num">' + data.home + " " + fmtMoney(Number(data.availableFunds)) + "</td></tr><tr><td><strong>" + (Number(data.availableFunds) - data.grandTotal >= 0 ? "\u7D50\u9918" : "\u7F3A\u53E3") + '</strong></td><td class="num"><strong>' + data.home + " " + fmtMoney(Math.abs(Number(data.availableFunds) - data.grandTotal)) + "</strong></td></tr>" : "";
      const emergencyRows = data.stops.filter(function(s) {
        return s.country.localEmergencyNumber || s.country.missionPhone;
      }).map(function(s) {
        const c = s.country;
        return "<tr><td>" + escapeHtml(c.name) + "</td><td>" + escapeHtml(c.localEmergencyNumber || "\uFF0D") + "</td><td>" + (c.missionPhone ? escapeHtml(c.missionName + "\u3000" + c.missionPhone) : "\u67E5\u7121\u4EE3\u8868\u8655\uFF0C\u8ACB\u4E0A\u5916\u4EA4\u90E8\u5B98\u7DB2\u67E5\u8A62\u9130\u8FD1\u9928\u8655") + "</td></tr>";
      }).join("");
      const emergencySection = emergencyRows ? '<h2>\u7DCA\u6025\u806F\u7D61\u8CC7\u8A0A</h2><table class="share-table"><thead><tr><th>\u570B\u5BB6</th><th>\u7576\u5730\u5831\u8B66/\u6D88\u9632/\u6551\u8B77\u8ECA</th><th>\u53F0\u7063\u99D0\u5916\u4EE3\u8868\u8655</th></tr></thead><tbody>' + emergencyRows + "</tbody></table>" : "";
      const schengen = computeSchengenUsage(sc);
      const schengenWarning = schengen && schengen.overLimit ? '<p class="share-warning">\u26A0 \u7533\u6839\u5340 90/180 \u5929\u898F\u5247\uFF1A\u4EE5 ' + fmtDate(schengen.peakDate) + " \u70BA\u57FA\u6E96\u5F80\u56DE\u63A8 180 \u5929\uFF0C\u7D2F\u7A4D\u5728\u7533\u6839\u5340\u5F85\u4E86 " + schengen.peakDays + " \u5929\uFF0C\u5DF2\u8D85\u904E 90 \u5929\u4E0A\u9650\uFF0C\u8ACB\u8ABF\u6574\u884C\u7A0B\u3002</p>" : "";
      return '<div class="share-header"><h1>\u{1F9ED} \u6211\u7684\u5927\u822A\u6D77\u6642\u4EE3 \xB7 \u74B0\u904A\u4E16\u754C\u884C\u7A0B\u6458\u8981</h1><p class="share-meta">' + escapeHtml(dateRangeText) + (sc.totalDays ? "\u3000\xB7\u3000\u5171 " + sc.totalDays + " \u5929" : "") + "\u3000\xB7\u3000" + data.stops.length + " \u7AD9\u3000\xB7\u3000\u7522\u751F\u65BC " + fmtDate(/* @__PURE__ */ new Date()) + '</p></div><table class="share-table"><thead><tr><th>#</th><th>\u570B\u5BB6</th><th>\u65E5\u671F</th><th>\u7C3D\u8B49</th><th>\u4EA4\u901A\u65B9\u5F0F</th><th>\u57CE\u5E02</th><th class="num">\u9810\u4F30\u82B1\u8CBB</th></tr></thead><tbody>' + rows + '</tbody></table><h2>\u9810\u7B97\u7E3D\u89BD</h2><table class="share-table share-budget-table"><tbody><tr><td>\u7C3D\u8B49\u8CBB\u7528</td><td class="num">' + data.home + " " + fmtMoney(data.visaTotal) + (data.hasUnknownFee ? "\u3000(\u90E8\u5206\u5F85\u67E5\u8B49\uFF0C\u672A\u8A08\u5165)" : "") + '</td></tr><tr><td>\u4F4F\u5BBF\u8CBB\u7528</td><td class="num">' + data.home + " " + fmtMoney(data.accomTotal) + '</td></tr><tr><td>\u751F\u6D3B\u8CBB\u7528</td><td class="num">' + data.home + " " + fmtMoney(data.dailyTotal) + '</td></tr><tr><td>\u4EA4\u901A\u8CBB\u7528</td><td class="num">' + data.home + " " + fmtMoney(data.transportTotal) + '</td></tr><tr class="share-grand-total"><td>\u7E3D\u8A08</td><td class="num">' + data.home + " " + fmtMoney(data.grandTotal) + "</td></tr>" + gapLine + "</tbody></table>" + emergencySection + '<div class="share-footer">' + schengenWarning + '<p>\u26A0 \u7C3D\u8B49\u8207\u65C5\u904A\u8B66\u793A\u8CC7\u8A0A\u50C5\u4F9B\u898F\u5283\u53C3\u8003\uFF0C\u51FA\u767C\u524D\u8ACB\u81F3 <a href="https://www.boca.gov.tw" target="_blank" rel="noopener">\u5916\u4EA4\u90E8\u9818\u4E8B\u4E8B\u52D9\u5C40</a> \u6838\u5BE6\u6700\u65B0\u898F\u5B9A\uFF1B\u8DDD\u96E2\u8207\u4EA4\u901A\u6642\u9593\u70BA\u7C97\u7565\u4F30\u7B97\uFF0C\u672A\u8A08\u5165\u8F49\u6A5F/\u7B49\u5019\u6642\u9593\u3002</p><p>\u7531\u300C\u5927\u822A\u6D77\u6642\u4EE3\u300D\u74B0\u904A\u4E16\u754C Dashboard \u7522\u751F</p></div>';
    }
    function renderShareSummary() {
      const el = document.getElementById("shareDoc");
      if (!el) return;
      el.innerHTML = shareDocBodyHtml(buildShareData());
    }
    function buildStandaloneShareHtml(data) {
      const printCss = document.getElementById("sharePrintStyle") ? document.getElementById("sharePrintStyle").textContent : "";
      return '<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><title>\u74B0\u904A\u4E16\u754C\u884C\u7A0B\u6458\u8981</title><style>' + printCss + '</style></head><body><div class="share-doc">' + shareDocBodyHtml(data) + "</div></body></html>";
    }
    document.getElementById("printSummaryBtn").addEventListener("click", function() {
      window.print();
    });
    document.getElementById("exportSummaryBtn").addEventListener("click", function() {
      const html = buildStandaloneShareHtml(buildShareData());
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "\u74B0\u904A\u4E16\u754C\u884C\u7A0B\u6458\u8981-" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ".html";
      a.click();
      URL.revokeObjectURL(url);
    });
    function initRates() {
      let cached = null;
      try {
        cached = JSON.parse(localStorage.getItem(RATES_CACHE_KEY) || "null");
      } catch (e) {
        cached = null;
      }
      fetch(RATES_URL).then(function(res) {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      }).then(function(data) {
        if (!data || !data.rates) throw new Error("no rates");
        rates = data.rates;
        localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ rates, fetchedAt: Date.now() }));
        setRateStatus(true, data.time_last_update_utc ? "\u66F4\u65B0\u65BC " + data.time_last_update_utc : "");
        renderCurrencyAndBudget();
      }).catch(function() {
        if (cached && cached.rates) {
          rates = cached.rates;
          const ageDays = Math.round((Date.now() - cached.fetchedAt) / 864e5);
          setRateStatus(false, "\u4F7F\u7528 " + ageDays + " \u5929\u524D\u7684\u5FEB\u53D6\u532F\u7387");
        } else {
          rates = FALLBACK_RATES;
          setRateStatus(false, "\u4F7F\u7528\u5167\u5EFA\u532F\u7387\u8868");
        }
        renderCurrencyAndBudget();
      });
    }
    document.getElementById("homeCurrencySelect").addEventListener("change", function() {
      state.homeCurrency = this.value;
      saveState();
      renderCurrencyTab();
    });
    document.getElementById("budgetHomeCurrencySelect").addEventListener("change", function() {
      state.homeCurrency = this.value;
      saveState();
      document.getElementById("homeCurrencySelect").value = this.value;
      renderBudgetTab();
    });
    ["convAmount", "convFrom", "convTo"].forEach(function(id) {
      document.getElementById(id).addEventListener("input", renderConverter);
      document.getElementById(id).addEventListener("change", renderConverter);
    });
    document.getElementById("convSwap").addEventListener("click", function() {
      const f = document.getElementById("convFrom"), t = document.getElementById("convTo");
      const tmp = f.value;
      f.value = t.value;
      t.value = tmp;
      renderConverter();
    });
    [["convFromCountry", "convFrom"], ["convToCountry", "convTo"]].forEach(function(pair) {
      const countrySel = document.getElementById(pair[0]);
      const currencySel = document.getElementById(pair[1]);
      countrySel.addEventListener("change", function() {
        const countryId = this.value;
        if (!countryId) return;
        const code = COUNTRY_CURRENCY[countryId];
        const hasRate = rates && Object.prototype.hasOwnProperty.call(rates, code);
        document.getElementById("convRateLine").textContent = hasRate ? "" : "\u26A0 \u76EE\u524D\u67E5\u7121 " + code + " \u7684\u5373\u6642\u532F\u7387\uFF0C\u7121\u6CD5\u81EA\u52D5\u4EE3\u5165";
        if (hasRate) {
          currencySel.value = code;
          renderConverter();
        }
      });
    });
    document.getElementById("availableFunds").addEventListener("input", function() {
      state.budget.availableFunds = this.value === "" ? null : Number(this.value);
      saveState();
      renderSavings(lastBudgetTotal, document.getElementById("budgetHomeCurrencySelect").value || state.homeCurrency);
      renderShareSummary();
    });
    document.getElementById("budgetTableBody").addEventListener("input", function(e) {
      const el = e.target.closest("[data-field]");
      if (!el || el.tagName === "SELECT") return;
      const sb = getStopBudget(el.getAttribute("data-id"));
      sb[el.getAttribute("data-field")] = el.value === "" ? null : el.value;
      saveState();
      updateBudgetSubtotals();
    });
    document.getElementById("budgetTableBody").addEventListener("change", function(e) {
      const el = e.target.closest('[data-field="currency"]');
      if (!el) return;
      getStopBudget(el.getAttribute("data-id")).currency = el.value;
      saveState();
      updateBudgetSubtotals();
    });
    function updateRouteClocks() {
      document.querySelectorAll("#routeList .local-time[data-tz]").forEach(function(el) {
        const info = getLocalTimeInfo(el.getAttribute("data-tz"));
        if (!info) return;
        el.textContent = "\u{1F550} " + info.timeStr + (info.diffLabel ? "\uFF08" + info.diffLabel + "\uFF09" : "");
      });
    }
    document.getElementById("lastCompiled").textContent = SEED_META.lastCompiled;
    document.getElementById("disclaimerBody").innerHTML = [SEED_META.sourceNote, SEED_META.safetyNote, SEED_META.healthNote].filter(Boolean).map(function(note) {
      return "<p>" + escapeHtml(note) + "</p>";
    }).join("") + '<p><a href="https://www.boca.gov.tw" target="_blank" rel="noopener">\u524D\u5F80\u5916\u4EA4\u90E8\u9818\u4E8B\u4E8B\u52D9\u5C40\u5B98\u7DB2</a></p>';
    if (state.budget.availableFunds !== null && state.budget.availableFunds !== void 0) {
      document.getElementById("availableFunds").value = state.budget.availableFunds;
    }
    initMap();
    initRates();
    populateConverterCountrySelects();
    renderAll();
    switchTab(localStorage.getItem(TAB_STORAGE_KEY) || "map");
    setInterval(updateRouteClocks, 6e4);
  })();
})();
