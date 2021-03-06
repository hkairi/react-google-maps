"use strict";
var React = require("react/addons"),
    {ToastContainer, ToastMessage} = require("react-toastr"),

    {GoogleMapsMixin, Map, Marker} = require("react-google-maps"),
    GettingStarted;
/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 */
GettingStarted = React.createClass({
  displayName: "GettingStarted",

  mixins: [require("../ReactFutureMixin"), GoogleMapsMixin],

  getInitialState () {
    return {
      markers: [{
        position: {
          lat: 25.0112183,
          lng: 121.52067570000001,
        },
        key: "Taiwan",
      }],
    };
  },
  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
  _handle_map_click (event) {
    var {markers} = this.state;
    markers = React.addons.update(markers, {
      $push: [
        {
          position: event.latLng,
          key: Date.now(),// Add a key property for: http://fb.me/react-warning-keys
        },
      ],
    });
    this.setState({ markers });

    if (3 === markers.length) {
      this.refs.toast.success(
        "Right click on the marker to remove it",
        "Also check the code!"
      );
    }
    this.refs.map.panTo(event.latLng);
  },

  _handle_marker_rightclick (index, event) {
    /*
     * All you modify is data, and the view is driven by data.
     * This is so called data-driven-development. (And yes, it's now in
     * web front end and even with google maps API.)
     */
    var {markers} = this.state;
    markers.splice(index, 1);
    this.setState({ markers });
  },

  _render (props, state) {
    return <div style={{height: "100%"}} {...props}>
      <ToastContainer ref="toast" toastMessageFactory={React.createFactory(ToastMessage.jQuery)}/>
      <Map ref="map" style={{height: "100%"}} zoom={3} center={new google.maps.LatLng(-25.363882, 131.044922)} onClick={this._handle_map_click} />
      {state.markers.map(toMarker, this)}
    </div>;

    function toMarker (marker, index) {
      return <Marker
        position={marker.position}
        key={marker.key}
        onRightclick={this._handle_marker_rightclick.bind(this, index)} />;
    }
  }
});

module.exports = React.createClass({
  mixins: [require("../ReactFutureMixin")],

  _render (props, state) {
    return <GettingStarted googleMapsApi={google.maps} {...props} />;
  }
});
