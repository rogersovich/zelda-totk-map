// @ts-nocheck
import L from 'leaflet';
// https://github.com/Leaflet/Leaflet.TileLayer.NoGap
// Fixes subpixel tile gaps / seam grid lines in WebKit/Chromium

L.TileLayer.mergeOptions({
  dumpToCanvas: L.Browser.canvas && !L.Browser.ie,
  keepBuffer: 4,
});

L.TileLayer.include({
  _onUpdateLevel: function(z, zoom) {
    if (this.options.dumpToCanvas && this._levels[z] && this._levels[z].canvas) {
      this._levels[z].canvas.style.zIndex =
        this.options.maxZoom - Math.abs(zoom - z);
    }
  },

  _onRemoveLevel: function(z) {
    if (this.options.dumpToCanvas && this._levels[z] && this._levels[z].canvas) {
      L.DomUtil.remove(this._levels[z].canvas);
    }
  },

  _onCreateLevel: function(level) {
    if (this.options.dumpToCanvas) {
      level.canvas = L.DomUtil.create(
        "canvas",
        "leaflet-tile-container leaflet-zoom-animated",
        this._container
      );
      level.ctx = level.canvas.getContext("2d");
      this._resetCanvasSize(level);
    }
  },

  _removeTile: function(key) {
    if (this.options.dumpToCanvas) {
      var tile = this._tiles[key];
      if (tile && tile.coords) {
        var level = this._levels[tile.coords.z];
        var tileSize = this.getTileSize();

        if (level && level.canvasRange) {
          var offset = L.point(tile.coords.x, tile.coords.y)
            .subtract(level.canvasRange.min)
            .scaleBy(this.getTileSize());

          level.ctx.clearRect(offset.x, offset.y, tileSize.x, tileSize.y);
        }
      }
    }

    L.GridLayer.prototype._removeTile.call(this, key);
  },

  _resetCanvasSize: function(level) {
    var buff = this.options.keepBuffer || 2,
      pixelBounds = this._getTiledPixelBounds(this._map.getCenter()),
      tileRange = this._pxBoundsToTileRange(pixelBounds),
      tileSize = this.getTileSize();

    tileRange.min = tileRange.min.subtract([buff, buff]);
    tileRange.max = tileRange.max.add([buff + 1, buff + 1]);

    var pixelRange = L.bounds(
        tileRange.min.scaleBy(tileSize),
        tileRange.max.add([1, 1]).scaleBy(tileSize)
      ),
      mustRepositionCanvas = false,
      neededSize = pixelRange.max.subtract(pixelRange.min);

    if (
      neededSize.x > level.canvas.width ||
      neededSize.y > level.canvas.height
    ) {
      var oldSize = { x: level.canvas.width, y: level.canvas.height };
      var tmpCanvas = L.DomUtil.create("canvas");
      tmpCanvas.style.width = (tmpCanvas.width = oldSize.x) + "px";
      tmpCanvas.style.height = (tmpCanvas.height = oldSize.y) + "px";
      tmpCanvas.getContext("2d").drawImage(level.canvas, 0, 0);

      level.canvas.style.width = (level.canvas.width = neededSize.x) + "px";
      level.canvas.style.height = (level.canvas.height = neededSize.y) + "px";
      level.ctx.drawImage(tmpCanvas, 0, 0);
    }

    if (level.canvasRange) {
      var offset = level.canvasRange.min
        .subtract(tileRange.min)
        .scaleBy(this.getTileSize());

      level.ctx.globalCompositeOperation = "copy";
      level.ctx.drawImage(level.canvas, offset.x, offset.y);
      level.ctx.globalCompositeOperation = "source-over";

      mustRepositionCanvas = true;
    }

    level.canvasRange = tileRange;
    level.canvasPxRange = pixelRange;
    level.canvasOrigin = pixelRange.min;

    if (mustRepositionCanvas) {
      this._setCanvasZoomTransform(
        level,
        this._map.getCenter(),
        this._map.getZoom()
      );
    }
  },

  _setZoomTransform: function(level, center, zoom) {
    L.GridLayer.prototype._setZoomTransform.call(this, level, center, zoom);
    if (this.options.dumpToCanvas) {
      this._setCanvasZoomTransform(level, center, zoom);
    }
  },

  _setCanvasZoomTransform: function(level, center, zoom) {
    if (!level.canvasOrigin) {
      return;
    }
    var scale = this._map.getZoomScale(zoom, level.zoom),
      translate = level.canvasOrigin
        .multiplyBy(scale)
        .subtract(this._map._getNewPixelOrigin(center, zoom))
        .round();

    if (L.Browser.any3d) {
      L.DomUtil.setTransform(level.canvas, translate, scale);
    } else {
      L.DomUtil.setPosition(level.canvas, translate);
    }
  },

  _onOpaqueTile: function(tile) {
    if (!this.options.dumpToCanvas) {
      return;
    }

    this.dumpPixels(tile.coords, tile.el);
    tile.el.style.display = "none";
  },

  dumpPixels: function(coords, imageSource) {
    var level = this._levels[coords.z],
      tileSize = this.getTileSize();

    if (!level || !level.canvasRange || !this.options.dumpToCanvas) {
      return;
    }

    if (!level.canvasRange.contains(coords)) {
      this._resetCanvasSize(level);
    }

    var offset = L.point(coords.x, coords.y)
      .subtract(level.canvasRange.min)
      .scaleBy(this.getTileSize());

    try {
      level.ctx.drawImage(imageSource, offset.x, offset.y, tileSize.x, tileSize.y);
    } catch (_) {
      // Ignore cross-origin error if any
    }

    return this;
  },
});
