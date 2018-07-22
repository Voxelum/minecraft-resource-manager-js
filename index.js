"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ResourceLocation = /** @class */ (function () {
    function ResourceLocation(domain, path) {
        this.domain = domain;
        this.path = path;
    }
    ResourceLocation.prototype.toString = function () { return this.domain + ":" + this.path; };
    /**
     * build from texture path
     */
    ResourceLocation.ofTexturePath = function (path) {
        var idx = path.indexOf(':');
        if (idx === -1)
            return new ResourceLocation('minecraft', "textures/" + path + ".png");
        if (idx === 0)
            return new ResourceLocation('minecraft', "textures/" + path.substring(1, path.length) + ".png");
        return new ResourceLocation(path.substring(0, idx), "textures/" + path.substring(idx + 1, path.length) + ".png");
    };
    /**
     * build from model path
     */
    ResourceLocation.ofModelPath = function (path) {
        var idx = path.indexOf(':');
        if (idx === -1)
            return new ResourceLocation('minecraft', "models/" + path + ".json");
        if (idx === 0)
            return new ResourceLocation('minecraft', "models/" + path.substring(1, path.length) + ".json");
        return new ResourceLocation(path.substring(0, idx), "models/" + path.substring(idx + 1, path.length) + ".json");
    };
    /**
     * from absoluted path
     */
    ResourceLocation.fromPath = function (path) {
        var idx = path.indexOf(':');
        if (idx === -1)
            return new ResourceLocation('minecraft', path);
        if (idx === 0)
            return new ResourceLocation('minecraft', path.substring(1, path.length));
        return new ResourceLocation(path.substring(0, idx), path.substring(idx + 1, path.length));
    };
    return ResourceLocation;
}());
exports.ResourceLocation = ResourceLocation;
var ATOZ = /[a-z]/;
var ResourceSourceZip = /** @class */ (function () {
    function ResourceSourceZip(name, zip) {
        this.name = name;
        this.zip = zip;
        this.type = 'zip';
    }
    ResourceSourceZip.prototype.update = function (location, data, type) {
        if (type === void 0) { type = 'text'; }
        var path = "assets/" + location.domain + "/" + location.path;
        this.zip.file(path, data, { base64: type === 'base64' });
        return Promise.resolve();
    };
    ResourceSourceZip.prototype.has = function (location) {
        var path = "assets/" + location.domain + "/" + location.path;
        var file = this.zip.file(path);
        if (!file)
            return Promise.resolve(true);
        return Promise.resolve(false);
    };
    ResourceSourceZip.prototype.load = function (location, type) {
        if (type === void 0) { type = 'text'; }
        return __awaiter(this, void 0, void 0, function () {
            var path, file, metaPath, metaFile, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        path = "assets/" + location.domain + "/" + location.path;
                        file = this.zip.file(path);
                        if (!file)
                            return [2 /*return*/, Promise.resolve()];
                        metaPath = path + ".mcmeta";
                        metaFile = this.zip.file(metaPath);
                        _a = {};
                        return [4 /*yield*/, file.async(type)];
                    case 1:
                        _a.data = _e.sent();
                        if (!metaFile) return [3 /*break*/, 3];
                        _d = (_c = JSON).parse;
                        return [4 /*yield*/, metaFile.async('text')];
                    case 2:
                        _b = _d.apply(_c, [_e.sent()]);
                        return [3 /*break*/, 4];
                    case 3:
                        _b = undefined;
                        _e.label = 4;
                    case 4: return [2 /*return*/, (_a.metadata = _b,
                            _a.location = location,
                            _a)];
                }
            });
        });
    };
    ResourceSourceZip.prototype.info = function () {
        return __awaiter(this, void 0, void 0, function () {
            var iconPath, metaPath, info, _a, _b, description, pack_format, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        iconPath = this.zip.file('pack.png');
                        metaPath = this.zip.file('pack.mcmeta');
                        info = {
                            name: this.name,
                            description: '',
                            format: -1,
                            icon: undefined
                        };
                        if (!iconPath) return [3 /*break*/, 2];
                        _a = info;
                        return [4 /*yield*/, iconPath.async('base64')];
                    case 1:
                        _a.icon = _e.sent();
                        _e.label = 2;
                    case 2:
                        if (!metaPath) return [3 /*break*/, 4];
                        _d = (_c = JSON).parse;
                        return [4 /*yield*/, metaPath.async('text')];
                    case 3:
                        _b = _d.apply(_c, [_e.sent()]).pack, description = _b.description, pack_format = _b.pack_format;
                        info.description = description;
                        info.format = pack_format;
                        _e.label = 4;
                    case 4: return [2 /*return*/, info];
                }
            });
        });
    };
    ResourceSourceZip.prototype.domains = function () {
        var set = {};
        Object.keys(this.zip.files)
            .filter(function (file) { return file.startsWith('assets') && file.length > 7 && file[7].match(ATOZ); })
            .map(function (file) { return file.substring(7, file.indexOf('/', 7)); })
            .forEach(function (file) { set[file] = true; });
        return Promise.resolve(Object.keys(set));
    };
    return ResourceSourceZip;
}());
exports.ResourceSourceZip = ResourceSourceZip;
var ResourceManager = /** @class */ (function () {
    function ResourceManager(list) {
        if (list === void 0) { list = []; }
        this.list = list;
        this.cache = {};
    }
    ResourceManager.prototype.putCache = function (res) {
        this.cache[res.location.toString()] = res;
        return res;
    };
    ResourceManager.prototype.addResourceSource = function (source) {
        return __awaiter(this, void 0, void 0, function () {
            var info, domains, wrapper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, source.info()];
                    case 1:
                        info = _a.sent();
                        return [4 /*yield*/, source.domains()];
                    case 2:
                        domains = _a.sent();
                        wrapper = { info: info, source: source, domains: domains };
                        this.list.push(wrapper);
                        return [2 /*return*/];
                }
            });
        });
    };
    ResourceManager.prototype.clearCache = function () { this.cache = {}; };
    ResourceManager.prototype.clearAll = function () {
        this.cache = {};
        this.list.splice(0, this.list.length);
    };
    Object.defineProperty(ResourceManager.prototype, "allPacks", {
        get: function () { return this.list.map(function (l) { return l.info; }); },
        enumerable: true,
        configurable: true
    });
    ResourceManager.prototype.swap = function (first, second) {
        if (first >= this.list.length || first < 0 || second >= this.list.length || second < 0) {
            throw new Error('Illegal index');
        }
        var fir = this.list[first];
        this.list[first] = this.list[second];
        this.list[second] = fir;
        this.clearCache();
    };
    ResourceManager.prototype.invalidate = function (location) {
        delete this.cache[location.toString()];
    };
    ResourceManager.prototype.load = function (location, encoding) {
        if (encoding === void 0) { encoding = 'text'; }
        return __awaiter(this, void 0, void 0, function () {
            var cached, _i, _a, src, loaded;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cached = this.cache[location.toString()];
                        if (cached)
                            return [2 /*return*/, cached];
                        _i = 0, _a = this.list;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        src = _a[_i];
                        return [4 /*yield*/, src.source.load(location, encoding)];
                    case 2:
                        loaded = _b.sent();
                        if (!loaded)
                            return [3 /*break*/, 3];
                        return [2 /*return*/, this.putCache(loaded)];
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, undefined];
                }
            });
        });
    };
    return ResourceManager;
}());
exports.ResourceManager = ResourceManager;
//# sourceMappingURL=index.js.map