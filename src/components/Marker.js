import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";

class Marker extends Component {
  componentDidMount = () => {
    this.createMarker();
  };
  componentWillUnmount() {
    this.resetMarker();
  }

  resetMarker = () => {
    const { map } = this.props;
    map.getObjects().forEach(element => {
      try {
        map.removeObject(element);
      } catch (e) {}
    });
  };

  createMarker = () => {
    const { map, H, bounds, markerProps } = this.props;
    if (markerProps) {
      const markerContainers = this.markerContainer();
      const container = new H.map.Group({
        objects: markerContainers
      });
      map.addObject(container);
      bounds && map.setViewBounds(container.getBounds());
    }
  };

  markerContainer = () => {
    const { H, markerProps, ui } = this.props;
    return markerProps.map(p => {
      const icon = p.img && new H.map.Icon(p.img);
      const markerObject = new H.map.Marker(
        { lat: p.lat, lng: p.lng },
        {
          icon,
          data: p.title && this.infoWindow(p.title)
        }
      );
      if (p.title) {
        markerObject.addEventListener(
          "tap",
          evt => {
            const bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
              content: evt.target.getData()
            });
            ui.addBubble(bubble);
          },
          false
        );
      }
      return markerObject;
    });
  };

  infoWindow = title => {
    const { infoBubbleStyle } = this.props;
    return ReactDOMServer.renderToStaticMarkup(
      <div style={infoBubbleStyle}>{title}</div>
    );
  };

  render() {
    return null;
  }
}

Marker.propTypes = {
  map: PropTypes.object,
  H: PropTypes.object,
  ui: PropTypes.object,
  infoBubbleStyle: PropTypes.object,
  markerProps: PropTypes.array,
  bounds: PropTypes.bool
};
export default Marker;
