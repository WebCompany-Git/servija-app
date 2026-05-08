"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.middleware = void 0;
// Ponto de entrada do middleware — exporta do ficheiro auxiliar
var middleware_1 = require("./lib/supabase/middleware");
Object.defineProperty(exports, "middleware", { enumerable: true, get: function () { return middleware_1.middleware; } });
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return middleware_1.config; } });
