// Path: netget/src/modules/AccessPoints/AccessPoints.js

function init_access_points() {
    var access_points = [];
    var access_points_file = fs.readFileSync('access_points.json', 'utf8');
    var access_points_json = JSON.parse(access_points_file);
    for (var i = 0; i < access_points_json.length; i++) {
        access_points.push(new AccessPoint(access_points_json[i]));
    }
    return access_points;
}

// find access points by name wifi or ethernet
function find_access_points_by_name(name) {
    var access_points = init_access_points();
    var found_access_points = [];
    for (var i = 0; i < access_points.length; i++) {
        if (access_points[i].name === name) {
            found_access_points.push(access_points[i]);
        }
    }
    return found_access_points;
}
