const baseName = "folderBase"
const storeName = "folderStore";

function logerr(err) {
    console.log(err);
}

function connectDB(f) {
    var request = indexedDB.open(baseName, 1);
    request.onerror = logerr;
    request.onsuccess = function () {
        f(request.result);
    }
    request.onupgradeneeded = function (e) {
        e.currentTarget.result.createObjectStore(storeName, { keyPath: "path" });
        connectDB(f);
    }
}

exports.getFile = (file, f) => {
    connectDB(function (db) {
        var request = db.transaction([storeName], "readonly").objectStore(storeName).get(file);
        request.onerror = logerr;
        request.onsuccess = function () {
            f(request.result ? request.result : -1);
        }
    });
}

exports.getStorage = (f) => {
    connectDB(function (db) {
        var rows = [],
            store = db.transaction([storeName], "readonly").objectStore(storeName);

        if (store.mozGetAll)
            store.mozGetAll().onsuccess = function (e) {
                f(e.target.result);
            };
        else
            store.openCursor().onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    rows.push(cursor.value);
                    cursor.continue();
                }
                else {
                    f(rows);
                }
            };
    });
}

exports.setFile = (file) => {
    connectDB(function (db) {
        var request = db.transaction([storeName], "readwrite").objectStore(storeName).put(file);
        request.onerror = logerr;
        request.onsuccess = function () {
            return request.result;
        }
    });
}

exports.delFile = (file) => {
    connectDB(function (db) {
        var request = db.transaction([storeName], "readwrite").objectStore(storeName).delete(file);
        request.onerror = logerr;
        request.onsuccess = function () {
            console.log("File delete from DB:", file);
        }
    });
}