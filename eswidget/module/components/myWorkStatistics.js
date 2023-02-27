"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _workStatistics = require("../api/workStatistics");

require("./myWorkStatistics.scss");

var _jsxFileName = "/Users/yuanjiexuan/Desktop/bate/project-web/tiklab-teamwire-ui/tiklab-project-web/src/modules/widget/components/myWorkStatistics.js";

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal["default"].signature : function (a) {
  return a;
};

var MyWorkStatistics = function MyWorkStatistics(props) {
  var projectUrl = props.projectUrl,
      webUrl = props.webUrl;

  var _useState = (0, _react.useState)(),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      workStatusList = _useState2[0],
      setWorkStatusList = _useState2[1];

  (0, _react.useEffect)(function () {
    (0, _workStatistics.StatWorkItemByBusStatus)(projectUrl).then(function (res) {
      setWorkStatusList(res.data);
    });
  }, []);

  var goWorkItemList = function goWorkItemList(index) {
    // setWorkTabs("all")
    if (!webUrl) {
      switch (index) {
        case 0:
          props.history.push({
            pathname: "/index/work/worklist/all"
          });
          break;

        case 1:
          props.history.push({
            pathname: "/index/work/worklist/done"
          });
          break;

        case 2:
          props.history.push({
            pathname: "/index/work/worklist/process"
          });
          break;

        case 3:
          props.history.push({
            pathname: "/index/work/worklist/overdue"
          });
          break;

        default:
          break;
      }
    } else {
      switch (index) {
        case 0:
          window.location = "".concat(webUrl, "/#/index/work/worklist/all"); // props.history.push({ pathname: "/index/work/worklist/all"})

          break;

        case 1:
          window.location = "".concat(webUrl, "/#/index/work/worklist/done");
          break;

        case 2:
          window.location = "".concat(webUrl, "/#/index/work/worklist/process");
          break;

        case 3:
          window.location = "".concat(webUrl, "/#/index/work/worklist/overdue");
          break;

        default:
          break;
      }
    }
  };

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "work-statistics",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 55,
      columnNumber: 12
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "work-statistics-title",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56,
      columnNumber: 13
    }
  }, /*#__PURE__*/_react["default"].createElement("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57,
      columnNumber: 17
    }
  }, "\u6211\u7684\u4E8B\u9879")), /*#__PURE__*/_react["default"].createElement("div", {
    className: "work-statistics-list",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 59,
      columnNumber: 13
    }
  }, workStatusList && workStatusList.map(function (item, index) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "work-statistics-item",
      key: index,
      onClick: function onClick() {
        return goWorkItemList(index);
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 62,
        columnNumber: 32
      }
    }, /*#__PURE__*/_react["default"].createElement("svg", {
      className: "work-icon",
      "aria-hidden": "true",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 63,
        columnNumber: 29
      }
    }, /*#__PURE__*/_react["default"].createElement("use", {
      xlinkHref: "#icondingqigongzuo",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 64,
        columnNumber: 33
      }
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "work-count",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 66,
        columnNumber: 29
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "work-num",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 67,
        columnNumber: 33
      }
    }, item.groupCount), /*#__PURE__*/_react["default"].createElement("div", {
      className: "work-text",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 68,
        columnNumber: 33
      }
    }, item.statusName)));
  })));
};

__signature__(MyWorkStatistics, "useState{[workStatusList, setWorkStatusList]}\nuseEffect{}");

var _default = MyWorkStatistics;
var _default2 = _default;
exports["default"] = _default2;
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(MyWorkStatistics, "MyWorkStatistics", "/Users/yuanjiexuan/Desktop/bate/project-web/tiklab-teamwire-ui/tiklab-project-web/src/modules/widget/components/myWorkStatistics.js");
  reactHotLoader.register(_default, "default", "/Users/yuanjiexuan/Desktop/bate/project-web/tiklab-teamwire-ui/tiklab-project-web/src/modules/widget/components/myWorkStatistics.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();