"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatWorkItemByBusStatus = StatWorkItemByBusStatus;

var _tiklabCoreUi = require("tiklab-core-ui");

(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal["default"].signature : function (a) {
  return a;
};

function StatWorkItemByBusStatus(apiUrl) {
  var url;

  if (apiUrl) {
    url = apiUrl + "/workItemStat/statWorkItemByBusStatus";
  } else {
    url = "/workItemStat/statWorkItemByBusStatus";
  }

  return _tiklabCoreUi.Axios.post(url);
}

;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(StatWorkItemByBusStatus, "StatWorkItemByBusStatus", "/Users/yuanjiexuan/Desktop/bate/project-web/tiklab-teamwire-ui/tiklab-project-web/src/modules/widget/api/workStatistics.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();