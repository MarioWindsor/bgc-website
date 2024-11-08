/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./admin/buttons.js":
/*!**************************!*\
  !*** ./admin/buttons.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nObject(function webpackMissingModule() { var e = new Error(\"Cannot find module 'netlify-cms-app'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n\n\n// Function to download JSON as a file\nvar downloadJSON = function downloadJSON(data, filename) {\n  var blob = new Blob([JSON.stringify(data, null, 2)], {\n    type: 'application/json'\n  });\n  var url = URL.createObjectURL(blob);\n  var a = document.createElement('a');\n  a.href = url;\n  a.download = \"\".concat(filename, \".json\");\n  document.body.appendChild(a);\n  a.click();\n  document.body.removeChild(a);\n};\nvar ButtonControl = function ButtonControl(_ref) {\n  var value = _ref.value,\n    field = _ref.field;\n  var fetchURL = field.get('fetchURL');\n  var filename = field.get('name');\n  var handleClick = function handleClick() {\n    fetch(fetchURL).then(function (response) {\n      return response.json();\n    }).then(function (data) {\n      return downloadJSON(data, filename);\n    })[\"catch\"](function (error) {\n      return alert(\"Error fetching data: \".concat(error.message));\n    });\n  };\n  return /*#__PURE__*/React.createElement(\"div\", null, /*#__PURE__*/React.createElement(\"button\", {\n    type: \"button\",\n    onClick: handleClick\n  }, value || \"Download JSON\"));\n};\nvar ButtonPreview = function ButtonPreview(_ref2) {\n  var value = _ref2.value;\n  return /*#__PURE__*/React.createElement(\"button\", null, value || \"Download JSON\");\n};\n\n// Register the custom widget\nObject(function webpackMissingModule() { var e = new Error(\"Cannot find module 'netlify-cms-app'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('button', ButtonControl, ButtonPreview);\n\n//# sourceURL=webpack://bgc-website/./admin/buttons.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./admin/buttons.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;