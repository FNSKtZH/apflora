/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                             = require('jquery'),
    ol                            = require('ol');

module.exports = function () {
    var olMap = window.apf.olMap;
    // interaction erstellen
    /**
     * @constructor
     * @extends {ol.interaction.Pointer}
     */
    olMap.DragBeob = function () {

        ol.interaction.Pointer.call(this, {
            handleDownEvent: olMap.DragBeob.prototype.handleDownEvent,
            handleDragEvent: olMap.DragBeob.prototype.handleDragEvent,
            handleMoveEvent: olMap.DragBeob.prototype.handleMoveEvent,
            handleUpEvent: olMap.DragBeob.prototype.handleUpEvent
        });

        /**
        * @type {ol.Pixel}
        * @private
        */
        this.coordinate_ = null;

        /**
        * @type {string|undefined}
        * @private
        */
        this.cursor_ = 'pointer';

        /**
        * @type {ol.Feature}
        * @private
        */
        this.feature_ = null;

        /**
        * @type {string|undefined}
        * @private
        */
        this.previousCursor_ = undefined;

    };
    ol.inherits(olMap.DragBeob, ol.interaction.Pointer);


    /**
     * @param {ol.MapBrowserEvent} evt Map browser event.
     * @return {boolean} `true` to start the drag sequence.
     */
    olMap.DragBeob.prototype.handleDownEvent = function (evt) {
        var map = evt.map;

        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            return feature;
        });

        if (feature) {
            this.coordinate_ = evt.coordinate;
            this.feature_ = feature;
        }

        return !!feature;
    };


    /**
     * @param {ol.MapBrowserEvent} evt Map browser event.
     */
    olMap.DragBeob.prototype.handleDragEvent = function (evt) {
        var map = evt.map;

        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            return feature;
        });

        var deltaX = evt.coordinate[0] - this.coordinate_[0];
        var deltaY = evt.coordinate[1] - this.coordinate_[1];

        var geometry = /** @type {ol.geom.SimpleGeometry} */
            (this.feature_.getGeometry());
        ol.geom.translate(geometry, deltaX, deltaY);

        this.coordinate_[0] = evt.coordinate[0];
        this.coordinate_[1] = evt.coordinate[1];
    };


    /**
     * @param {ol.MapBrowserEvent} evt Event.
     */
    olMap.DragBeob.prototype.handleMoveEvent = function(evt) {
        if (this.cursor_) {
            var map = evt.map;
            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function(feature, layer) {
                  return feature;
                });
            var element = evt.map.getTargetElement();
            if (feature) {
                if (element.style.cursor != this.cursor_) {
                    this.previousCursor_ = element.style.cursor;
                    element.style.cursor = this.cursor_;
                }
            } else if (this.previousCursor_ !== undefined) {
                element.style.cursor = this.previousCursor_;
                this.previousCursor_ = undefined;
            }
        }
    };


    /**
     * @param {ol.MapBrowserEvent} evt Map browser event.
     * @return {boolean} `false` to stop the drag sequence.
     */
    olMap.DragBeob.prototype.handleUpEvent = function (evt) {
        this.coordinate_ = null;
        this.feature_    = null;
        return false;
    };


    var pointFeature   = new ol.Feature(new ol.geom.Point([0, 0]));

    var lineFeature    = new ol.Feature(new ol.geom.LineString([[-1e7, 1e6], [-1e6, 3e6]]));

    var polygonFeature = new ol.Feature(new ol.geom.Polygon([[[-3e6, -1e6], [-3e6, 1e6], [-1e6, 1e6], [-1e6, -1e6], [-3e6, -1e6]]]));

    olMap.dragBeobInteraction = new ol.interaction.defaults().extend([new olMap.DragBeob()]);
    olMap.map.addInteraction(olMap.dragBeobInteraction);
};