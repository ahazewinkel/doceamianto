/*var Crafty = require('./core.js'),
    document = window.document;*/

Crafty.extend({
    /**@
     * #Crafty.assets
     * @category Assets
     * An object containing every asset used in the current Crafty game.
     * The key is the URL and the value is the `Audio` or `Image` object.
     *
     * If loading an asset, check that it is in this object first to avoid loading twice.
     *
     * @example
     * ~~~
     * var isLoaded = !!Crafty.assets["images/sprite.png"];
     * ~~~
     * @see Crafty.loader
     */
    assets: {},
    __paths: { audio: "assets/audio/", images: "assets/images/" },
    /**@
     * #Crafty.paths
     * @category Assets
     * @sign public void Crafty.paths([Object paths])
     * @param paths - Object containing paths for audio and images folders
     * This method works as a setter and getter for Crafty.__paths property, which holds values for
     * audio and images folders, where files are stored. Default audio folder is 'assets/audio/',
     * default images folder is 'assets/images/'(relative to the main page). 
     *
     * Returns paths object with values for audio and images folders if no argument is passed. To set
     * custom folders, pass an object as argument, with audio and images properties.
     *
     * @example
     *
     * Get audio folder:
     * ~~~
     * var audioFolder = Crafty.paths().audio;
     * ~~~
     *
     * Setting folders:
     * ~~~
     * Crafty.paths({ audio: "custom/audio/path/", images: "custom/images/path/" });
     * ~~~
     *
     * @see Crafty.load
     */
    paths: function(p) {
        if (typeof p === "undefined") {
            return this.__paths;
        } else {
            if(p.audio)
                this.__paths.audio = p.audio;
            if(p.images)
                this.__paths.images = p.images;
        }
    },

    /**@
     * #Crafty.asset
     * @category Assets
     * @trigger NewAsset - After setting new asset - Object - key and value of new added asset.
     * @sign public void Crafty.asset(String key, Object asset)
     * @param key - asset url.
     * @param asset - `Audio` or `Image` object.
     * Add new asset to assets object.
     *
     * @sign public void Crafty.asset(String key)
     * @param key - asset url.
     * Get asset from assets object.
     *
     * @example
     * ~~~
     * Crafty.asset(key, value);
     * var asset = Crafty.asset(key); //object with key and value fields
     * ~~~
     *
     * @see Crafty.assets
     */
    asset: function (key, value) {
        if (arguments.length === 1) {
            return Crafty.assets[key];
        }

        if (!Crafty.assets[key]) {
            Crafty.assets[key] = value;
            this.trigger("NewAsset", {
                key: key,
                value: value
            });
            return value;
        }
    },
    /**@
     * #Crafty.image_whitelist
     * @category Assets
     *
     * A list of file extensions that can be loaded as images by Crafty.load
     *
     * @example
     * ~~~
     * // add tif extension to list of supported image files
     * Crafty.image_whitelist.push("tif");
     * 
     * var assets = {
     *     "sprites": {
     *         "sprite.tif": {   //set a tif sprite
     *            "tile": 64,
     *            "tileh": 32,
     *            "map": { "sprite_car": [0, 0] }
     *         }
     *     },
     *     "audio": {
     *         "jump": "jump.mp3";
     *     }
     * };
     *
     * Crafty.load( assets, // preload the assets
     *     function() {     //when loaded
     *         Crafty.audio.play("jump"); //Play the audio file
     *         Crafty.e('2D, DOM, sprite_car'); // create entity with sprite
     *     },
     *
     *     function(e) { //progress
     *     },
     *
     *     function(e) { //uh oh, error loading
     *     }
     * );
     * ~~~
     *
     * @see Crafty.asset
     * @see Crafty.load
     */
    image_whitelist: ["jpg", "jpeg", "gif", "png", "svg"],
    /**@
     * #Crafty.loader
     * @category Assets
     * @sign public void Crafty.load(Object assets, Function onLoad[, Function onProgress[, Function onError]])
     * @param assets - Object JSON formatted (or JSON string), with assets to load (accepts sounds, images and sprites)
     * @param onLoad - Callback when the assets are loaded
     * @param onProgress - Callback when an asset is loaded. Contains information about assets loaded
     * @param onError - Callback when an asset fails to load
     *
     * Preloader for all assets. Takes a JSON formatted object (or JSON string) of files and adds them to the 
     * `Crafty.assets` object, as well as setting sprites accordingly.
     *
     * Format must follow the pattern shown in the example below, but it's not required to pass all "audio",
     * "images" and "sprites" properties, only those you'll need. For example, if you don't need to preload
     * sprites, you can omit that property.
     * 
     * Default folders for storing and locating assets are 'assets/audio' and 'assets/images'. For changing these,
     * use the function Crafty.paths.
     * 
     * Files with suffixes in `image_whitelist` (case insensitive) will be loaded.
     * 
     * It's possible to pass the full file path(including protocol), instead of just the filename.ext, in case
     * you want some asset to be loaded from another domain.
     *
     * If `Crafty.support.audio` is `true`, files with the following suffixes `mp3`, `wav`, `ogg` and 
     * `mp4` (case insensitive) can be loaded.
     *
     * The `onProgress` function will be passed on object with information about
     * the progress including how many assets loaded, total of all the assets to
     * load and a percentage of the progress.
     * ~~~
     * { loaded: j, total: total, percent: (j / total * 100), src:src }
     * ~~~
     *
     * `onError` will be passed with the asset that couldn't load.
     *
     * When `onError` is not provided, the onLoad is loaded even when some assets are not successfully loaded.
     * Otherwise, onLoad will be called no matter whether there are errors or not.
     *
     * @example
     * ~~~
     * var assetsObj = {
     *     "audio": {
     *         "beep": ["beep.wav", "beep.mp3", "beep.ogg"],
     *         "boop": "boop.wav",
     *         "slash": "slash.wav"
     *     },
     *     "images": ["badguy.bmp", "goodguy.png"],
     *     "sprites": { 
     *         "animals.png": { 
     *             "tile": 50,
     *             "tileh": 40,
     *             "map": { "ladybug": [0,0], "lazycat": [0,1], "ferociousdog": [0,2] }
     *             "paddingX": 5,
     *             "paddingY": 5,
     *             "paddingAroundBorder": 10
     *         },
     *         "vehicles.png": {
     *             "tile": 150,
     *             "tileh": 75,
     *             "map": { "car": [0,0], "truck": [0,1] }
     *         }
     *     },
     * };
     * 
     * Crafty.load(assetsObj, // preload assets
     *     function() { //when loaded
     *         Crafty.scene("main"); //go to main scene
     *         Crafty.audio.play("boop"); //Play the audio file
     *         Crafty.e('2D, DOM, lazycat'); // create entity with sprite
     *     },
     *
     *     function(e) { //progress
     *     },
     *
     *     function(e) { //uh oh, error loading
     *     }
     * );
     * ~~~
     *
     * @see Crafty.paths
     * @see Crafty.assets
     * @see Crafty.image_whitelist
     * @see Crafty.removeAssets
     */
    load: function (data, oncomplete, onprogress, onerror) {
      
        data = typeof data === "string"?JSON.parse(data):data;
      
        var j = 0,
            total = (data.audio? Object.keys(data.audio).length : 0) +
              (data.images? Object.keys(data.images).length : 0) +
              (data.sprites? Object.keys(data.sprites).length : 0),
            current, fileUrl, obj, type, asset,
            audSupport = Crafty.support.audio,
            paths = Crafty.paths(),
            getExt = function(f) {
                return f.substr(f.lastIndexOf('.') + 1, 3).toLowerCase();
            },
            getFilePath = function(type,f) {
                return f.search("://") === -1? (type=="audio"? paths.audio + f : paths.images + f) : f;
            },
            // returns null if 'a' is not already a loaded asset, obj otherwise
            isAsset = function(a) {
                return Crafty.asset(a) || null;
            },
            isSupportedAudio = function(f) {
                return Crafty.audio.supports(getExt(f));
            },
            isValidImage = function(f) {
                return Crafty.image_whitelist.indexOf(getExt(f)) != -1;
            },
            onImgLoad = function(obj,url) {
                obj.onload = pro;
                if (Crafty.support.prefix === 'webkit')
                    obj.src = ""; // workaround for webkit bug
                obj.src = url;
            };

        //Progress function

        function pro() {
            var src = this.src;

            //Remove events cause audio trigger this event more than once(depends on browser)
            if (this.removeEventListener)
                this.removeEventListener('canplaythrough', pro, false);

            ++j;
            //if progress callback, give information of assets loaded, total and percent
            if (onprogress)
                onprogress({
                    loaded: j,
                    total: total,
                    percent: (j / total * 100),
                    src: src
                });

            if (j === total && oncomplete) oncomplete();
        }
        //Error function

        function err() {
            var src = this.src;
            if (onerror)
                onerror({
                    loaded: j,
                    total: total,
                    percent: (j / total * 100),
                    src: src
                });

            j++;
            if (j === total && oncomplete) oncomplete();
        }

        for (type in data) {
            for(asset in data[type]) {

                current = data[type][asset];
                obj = null;

                if (type === "audio") {
                    if (audSupport && !Crafty.audio.sounds[asset]) {
                        if (typeof current === "object") {
                            var files = [];
                            for (var i in current) {
                                fileUrl = getFilePath(type, current[i]);
                                if (!isAsset(fileUrl) && isSupportedAudio(current[i]))
                                    files.push(fileUrl);
                            }
                            if (files.length)
                                obj = Crafty.audio.add(asset, files).obj;
                        }
                        else if (typeof current === "string" && isSupportedAudio(current)) {
                            fileUrl = getFilePath(type, current);
                            if (!isAsset(fileUrl))
                                obj = Crafty.audio.add(asset, fileUrl).obj;
                        }

                        //addEventListener is supported on IE9 , Audio as well
                        if (obj && obj.addEventListener)
                            obj.addEventListener('canplaythrough', pro, false);
                    }
                } else {
                    asset = type === "sprites"? asset : current;
                    fileUrl = getFilePath(type, asset);
                    if (!isAsset(fileUrl) && isValidImage(asset)) {
                        obj = new Image();
                        if (type === "sprites")
                            Crafty.sprite(current.tile, current.tileh, fileUrl, current.map,
                             current.paddingX, current.paddingY, current.paddingAroundBorder);
                        Crafty.asset(fileUrl, obj);
                        onImgLoad(obj, fileUrl);
                    }
                }
                if (obj) {
                    obj.onerror = err;
                } else {
                    err().call({})
                    --total;
                }
            }
        }

        // If we aren't trying to handle *any* of the files, that's as complete as it gets!
        if (total === 0)
            oncomplete();

    },
    /**@
     * #Crafty.removeAssets
     * @category Assets
     *
     * @sign public void Crafty.removeAssets(Object assets)
     * @param data - Object JSON formatted (or JSON string), with assets to remove (accepts sounds, images and sprites)
     * Removes assets (audio, images, sprites - and related sprite components) in order to allow the browser
     * to free memory.
     * 
     * Recieves a JSON fomatted object (or JSON string) containing 'audio', 'images' and/or 'sprites'
     * properties with assets to be deleted. Follows a similar format as Crafty.load 'data' argument. If
     * you pass the exact same object passed to Crafty.load, that will delete everything loaded that way.
     * For sprites, if you want to keep some specific component, just don't pass that component's name in
     * the sprite 'map'.
     * 
     * Note that in order to remove the sprite components related to a given sprite, it's required to
     * pass the 'map' property of that sprite, and although its own properties's values (the properties refer
     * to sprite components) are not used in the removing process, omitting them will cause an error (since
     * 'map' is an object, thus it's properties can NOT omitted - however, they can be null, or undefined).
     * It will work as long as the 'map' objects' properties have any value. Or if you define 'map' itself
     * as an array, like:
     * "map": [ "car", "truck" ] instead of "map": { "car": [0,0], "truck": [0,1] }.
     * This is examplified below ("animals.png" VS. "vehicles.png" sprites).
     *
     * @example
     * ~~~
     * var assetsToRemoveObj = {
     *     "audio": {
     *         "beep": ["beep.wav", "beep.mp3", "beep.ogg"],
     *         "boop": "boop.wav"
     *     },
     *     "images": ["badguy.bmp", "goodguy.png"],
     *     "sprites": {
     *         "animals.png": {
     *             "map": { "ladybug": [0,0], "lazycat": [0,1] },
     *         },
     *         "vehicles.png": {
     *             "map": [ "car", "truck" ]
     *         }
     *     }
     * }
     * 
     * Crafty.removeAssets(assetsToRemoveObj);
     * ~~~
     *
     * @see Crafty.load
     */
    removeAssets: function(data) {
      
        data = typeof data === "string"?JSON.parse(data):data;
      
        var current, fileUrl, type, asset,
            paths = Crafty.paths(),
            getFilePath = function(type,f) {
                return f.search("://") === -1? (type=="audio"? paths.audio + f : paths.images + f) : f;
            };
      
        for (type in data) {
            for (asset in data[type]) {
              
                current = data[type][asset];

                if (type === "audio") {
                    if (typeof current === "object") {
                        for (var i in current) {
                            fileUrl = getFilePath(type, current[i]);
                            if (Crafty.asset(fileUrl))
                                Crafty.audio.remove(asset);
                        }
                    }
                    else if (typeof current === "string") {
                        fileUrl = getFilePath(type, current);
                        if (Crafty.asset(fileUrl))
                            Crafty.audio.remove(asset);
                    }
                } else {
                    asset = type === "sprites"? asset : current;
                    fileUrl = getFilePath(type, asset);
                    if (Crafty.asset(fileUrl)) {
                        if (type === "sprites")
                            for (var comp in current.map)
                                delete Crafty.components()[comp];
                        delete Crafty.assets[fileUrl];
                    }
                }
            }
        }
    },
    /**@
     * #Crafty.modules
     * @category Assets
     * @sign public void Crafty.modules([String repoLocation,] Object moduleMap[, Function onLoad])
     * @param modules - Map of name:version pairs for modules to load
     * @param onLoad - Callback when the modules are loaded
     *
     * Browse the selection of community modules on http://craftycomponents.com
     *
     * It is possible to create your own repository.
     *
     *
     * @example
     * ~~~
     * // Loading from default repository
     * Crafty.modules({ moveto: 'DEV' }, function () {
     *     //module is ready
     *     Crafty.e("MoveTo, 2D, DOM");
     * });
     *
     * // Loading from your own server
     * Crafty.modules({ 'http://mydomain.com/js/mystuff.js': 'DEV' }, function () {
     *     //module is ready
     *     Crafty.e("MoveTo, 2D, DOM");
     * });
     *
     * // Loading from alternative repository
     * Crafty.modules('http://cdn.crafty-modules.com', { moveto: 'DEV' }, function () {
     *     //module is ready
     *     Crafty.e("MoveTo, 2D, DOM");
     * });
     *
     * // Loading from the latest component website
     * Crafty.modules(
     *     'http://cdn.craftycomponents.com'
     *     , { MoveTo: 'release' }
     *     , function () {
     *     Crafty.e("2D, DOM, Color, MoveTo")
     *       .attr({x: 0, y: 0, w: 50, h: 50})
     *       .color("green");
     *     });
     * });
     * ~~~
     *
     */
    modules: function (modulesRepository, moduleMap, oncomplete) {

        if (arguments.length === 2 && typeof modulesRepository === "object") {
            oncomplete = moduleMap;
            moduleMap = modulesRepository;
            modulesRepository = 'http://cdn.craftycomponents.com';
        }

        /*!
         * $script.js Async loader & dependency manager
         * https://github.com/ded/script.js
         * (c) Dustin Diaz, Jacob Thornton 2011
         * License: MIT
         */
        var $script = (function () {
            var win = this,
                doc = document,
                head = doc.getElementsByTagName('head')[0],
                validBase = /^https?:\/\//,
                old = win.$script,
                list = {}, ids = {}, delay = {}, scriptpath, scripts = {}, s = 'string',
                f = false,
                push = 'push',
                domContentLoaded = 'DOMContentLoaded',
                readyState = 'readyState',
                addEventListener = 'addEventListener',
                onreadystatechange = 'onreadystatechange';

                function every(ar, fn, i) {
                    for (i = 0, j = ar.length; i < j; ++i)
                        if (!fn(ar[i])) return f;
                    return 1;
                }

                function each(ar, fn) {
                    every(ar, function (el) {
                        return !fn(el);
                    });
                }

            if (!doc[readyState] && doc[addEventListener]) {
                doc[addEventListener](domContentLoaded, function fn() {
                    doc.removeEventListener(domContentLoaded, fn, f);
                    doc[readyState] = 'complete';
                }, f);
                doc[readyState] = 'loading';
            }

            function $script(paths, idOrDone, optDone) {
                paths = paths[push] ? paths : [paths];
                var idOrDoneIsDone = idOrDone && idOrDone.call,
                    done = idOrDoneIsDone ? idOrDone : optDone,
                    id = idOrDoneIsDone ? paths.join('') : idOrDone,
                    queue = paths.length;

                    function loopFn(item) {
                        return item.call ? item() : list[item];
                    }

                    function callback() {
                        if (!--queue) {
                            list[id] = 1;
                            if (done)
                                done();
                            for (var dset in delay) {
                                if (every(dset.split('|'), loopFn) && !each(delay[dset], loopFn))
                                    delay[dset] = [];
                            }
                        }
                    }
                setTimeout(function () {
                    each(paths, function (path) {
                        if (scripts[path]) {
                            if (id)
                                ids[id] = 1;
                            return scripts[path] == 2 && callback();
                        }
                        scripts[path] = 1;
                        if (id)
                            ids[id] = 1;
                        create(!validBase.test(path) && scriptpath ? scriptpath + path + '.js' : path, callback);
                    });
                }, 0);
                return $script;
            }

            function create(path, fn) {
                var el = doc.createElement('script'),
                    loaded = f;
                    el.onload = el.onerror = el[onreadystatechange] = function () {
                        if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
                        el.onload = el[onreadystatechange] = null;
                        loaded = 1;
                        scripts[path] = 2;
                        fn();
                    };
                el.async = 1;
                el.src = path;
                head.insertBefore(el, head.firstChild);
            }

            $script.get = create;

            $script.order = function (scripts, id, done) {
                (function callback(s) {
                    s = scripts.shift();
                    if (!scripts.length) $script(s, id, done);
                    else $script(s, callback);
                }());
            };

            $script.path = function (p) {
                scriptpath = p;
            };
            // This function is a tangled mess of conciseness, so suppress warnings here
            /* jshint -W030 */
            $script.ready = function (deps, ready, req) {
                deps = deps[push] ? deps : [deps];
                var missing = [];
                !each(deps, function (dep) {
                    list[dep] || missing[push](dep);
                }) && every(deps, function (dep) {
                    return list[dep];
                }) ?
                    ready() : ! function (key) {
                        delay[key] = delay[key] || [];
                        delay[key][push](ready);
                        req && req(missing);
                }(deps.join('|'));
                return $script;
            };
            /* jshint +W030 */
            $script.noConflict = function () {
                win.$script = old;
                return this;
            };

            return $script;
        })();

        var modules = [];
        var validBase = /^(https?|file):\/\//;
        for (var i in moduleMap) {
            if (validBase.test(i))
                modules.push(i);
            else
                modules.push(modulesRepository + '/' + i.toLowerCase() + '-' + moduleMap[i].toLowerCase() + '.js');
        }

        $script(modules, function () {
            if (oncomplete) oncomplete();
        });
    }
});