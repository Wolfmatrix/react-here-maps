import React, { Component } from "react";
import PropTypes from "prop-types";

class Circle extends Component {
  componentDidMount = () => {
    this.createCircle();
  };

  componentWillUnmount() {
    this.resetCircle();
  }

  resetCircle = () => {
    const { map } = this.props;
    map.getObjects().forEach(element => {
      try {
        map.removeObject(element);
      } catch (e) {}
    });
  };

  createCircle = () => {
    const { map, H, circleProps, bounds } = this.props;
    if (circleProps) {
      const circleContainers = this.circleContainer(H, circleProps);
      const containerCircle = new H.map.Group({
        objects: circleContainers
      });
      map.addObject(containerCircle);
      bounds && map.setViewBounds(containerCircle.getBounds());
    }
  };

  circleContainer = (H, circleProps) => {
    return circleProps.map(c => {
      return new H.map.Circle({ lat: c.lat, lng: c.lng }, c.radius, {
        style: c.style
      });
    });
  };
  render() {
    return null;
  }
}

Circle.propTypes = {
  map: PropTypes.object,
  H: PropTypes.object,
  ui: PropTypes.object,
  circleProps: PropTypes.array,
  bounds: PropTypes.bool
};
export default Circle;
