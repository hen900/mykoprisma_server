const MeasController = require('./controllers/measurement.controller.js');

const PresetController = require('./controllers/preset.controller.js');

const BufferController = require('./controllers/override.controller.js');

const PhotoController = require('./controllers/photo.controller.js');

const config = require('./common/config/env.config');

exports.routesConfig = function (app) {
    app.post('/setMeas', [
        MeasController.insert
    ]);
    app.post('/setOverride', [
	BufferController.set
    ]);

    app.post('/setPhoto', [
        PhotoController.set
    ]);

    app.post('/setPreset', [
        PresetController.set
    ]);

    app.get('/getPreset', [
        PresetController.get
    ]);

    app.get('/getMeas', [
	MeasController.list
    ]);
       app.get('/getOverride', [
        BufferController.get
    ]);

};
