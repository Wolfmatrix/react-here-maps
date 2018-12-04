import React, { Component } from "react";
import scriptLoader from "react-async-load-script";
import PropTypes from "prop-types";
import "../lib/mapsjs-ui.css";

/* global H:false */
/* global ui:false */

class HereMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: {},
      ui: {},
      H: {}
    };
  }

  componentDidUpdate(prevProps) {
    const { isScriptLoadSucceed } = this.props;
    if (
      prevProps.isScriptLoadSucceed !== isScriptLoadSucceed &&
      isScriptLoadSucceed
    ) {
      this.loadMap();
    }
  }

  loadMap = () => {
    const {
      initialCenter,
      zoom,
      liveTrafficEnable,
      setMinZoomOut,
      appConfig
    } = this.props;

    const platform = new H.service.Platform({
      app_id: appConfig.appId,
      app_code: appConfig.appCode,
      useCIT: true,
      useHTTPS: true
    });

    const pixelRatio = window.devicePixelRatio || 1;
    const defaultLayers = platform.createDefaultLayers({
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi: pixelRatio === 1 ? undefined : 320
    });

    const map = new H.Map(
      document.getElementById("mapContainer"),
      defaultLayers.normal.map,
      {
        zoom,
        center: initialCenter
      }
    );

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    if (liveTrafficEnable) {
      this.liveTrafficEnable(map, defaultLayers);
    }
    if (setMinZoomOut) {
      this.setMinZoomLevel(defaultLayers, setMinZoomOut);
    }
    this.setState({
      map,
      ui,
      H
    });
  };

  liveTrafficEnable = (map, defaultLayers) => {
    map.setBaseLayer(defaultLayers.normal.traffic);
    map.addLayer(defaultLayers.incidents);
  };

  setMinZoomLevel = (defaultLayers, setMinZoomOut) => {
    defaultLayers.normal.map.setMin(setMinZoomOut);
  };

  renderChildren = () => {
    const { children, zoom } = this.props;
    const { H, map, ui } = this.state;
    if (Object.keys(H).length != 0 && children) {
      return React.Children.map(children, child => {
        if (!child) return;
        return React.cloneElement(child, {
          map,
          H,
          zoom,
          ui
        });
      });
    }
    return null;
  };
  render() {
    const { style } = this.props;
    return (
      <div id="mapContainer" style={style}>
        {this.renderChildren()}
      </div>
    );
  }
}
HereMap.defaultProps = {
  style: {
    width: "100%",
    height: "100vh"
  },
  zoom: 0
};

HereMap.propTypes = {
  zoom: PropTypes.number,
  style: PropTypes.object,
  liveTrafficEnable: PropTypes.bool,
  initialCenter: PropTypes.object,
  children: PropTypes.func,
  appConfig: PropTypes.shape({
    appCode: PropTypes.string,
    appId: PropTypes.string
  }).isRequired
};

export default scriptLoader([
  "https://js.api.here.com/v3/3.0/mapsjs-core.js",
  "https://js.api.here.com/v3/3.0/mapsjs-service.js",
  "https://js.api.here.com/v3/3.0/mapsjs-ui.js",
  "https://js.api.here.com/v3/3.0/mapsjs-mapevents.js"
])(HereMap);
