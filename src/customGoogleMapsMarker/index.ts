interface CustomMarker extends google.maps.Marker {
  map?: google.maps.Map | null | google.maps.StreetViewPanorama;
}

const createHTMLMapMarker = ({ ...args }) => {
  class HTMLMapMarker extends google.maps.OverlayView {
    anchor: { x: number; y: number };
    spidifier: any;
    isHovered: boolean;
    hoverImage: any;
    text: any;
    opacity: number;
    marker: CustomMarker;
    map: google.maps.Map | google.maps.StreetViewPanorama | null | undefined;
    latlng: google.maps.LatLng;
    div: HTMLDivElement | null | undefined;
    html: string | undefined;
    position:
      | number
      | google.maps.LatLng
      | google.maps.LatLngLiteral
      | undefined;

    constructor() {
      super();
      this.anchor = args.offset ? args.offset : { x: 0, y: 0 };
      this.spidifier = args.spidifier;
      this.setValues(args);
      this.isHovered = false;
      const text = args.text ? args.text : '#';
      const image = {
        url: args.image,
        size: new google.maps.Size(0, 0),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32),
      };
      this.hoverImage = args.hoverImage;
      this.text = text;
      this.opacity = 1.0;
      this.marker = new google.maps.Marker({ ...args, icon: image });
      this.marker.setVisible(true);
      this.marker.map = this.map;
      this.latlng = new google.maps.LatLng(args.position);
      this.setMap(args.map);
    }

    createDiv() {
      const clusterStyle = args.cluster === true ? 'cluster' : '';
      this.div = document.createElement('div');
      this.div.style.position = 'absolute';
      this.div.style.cursor = 'pointer';
      if (this.html) {
        this.div.innerHTML = this.html;
      } else {
        this.div.innerHTML = `<div class="custom-marker__icon-container ${clusterStyle}" style='opacity: ${
          this.opacity
        };'><img class='custom-marker-image ${clusterStyle}' src='${
          this.isHovered
            ? this.hoverImage
            : args.image
            ? args.image
            : 'https://cultofthepartyparrot.com/parrots/hd/parrot.gif'
        }'>
        <span>${this.text}</span></div>`;
      }
      this.div.addEventListener('click', (e) => {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        google.maps.event.trigger(this, 'click');
      });
      this.div.addEventListener('mouseenter', (e) => {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        if (!this.isHovered && this.div) {
          this.div.innerHTML = `<div class="custom-marker__icon-container ${clusterStyle}" style='opacity: ${
            this.opacity
          };'><img class='custom-marker-image ${clusterStyle}' src='${
            args.hoverImage
              ? args.hoverImage
              : 'https://cultofthepartyparrot.com/parrots/hd/parrot.gif'
          }'>
        <span>${this.text}</span></div>`;
          this.isHovered = true;
        }
      });
      this.div.addEventListener('mouseleave', (e) => {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        if (this.isHovered && this.div) {
          this.div.innerHTML = `<div class="custom-marker__icon-container ${clusterStyle}" style='opacity: ${
            this.opacity
          };'><img class='custom-marker-image ${clusterStyle}' src='${
            args.image
              ? args.image
              : 'https://cultofthepartyparrot.com/parrots/hd/parrot.gif'
          }'>
        <span>${this.text}</span></div>`;
          this.isHovered = false;
        }
      });
    }

    setPosition(position: { lat: any; lng: any }) {
      if (position instanceof google.maps.LatLng) {
        position = { lat: position.lat(), lng: position.lng() };
      }
      this.set('position', position);
    }

    draw() {
      if (!this.div) {
        this.createDiv();
        this.appendDivToOverlay();
      }
      this.positionDiv();
    }

    positionDiv() {
      this.latlng = new google.maps.LatLng(this.position as google.maps.LatLng);

      const point = this.getProjection().fromLatLngToDivPixel(this.latlng);

      if (point && this.div) {
        this.div.style.left = `${point.x - this.anchor.x}px`;
        this.div.style.top = `${point.y - this.anchor.y}px`;
      }
    }

    appendDivToOverlay() {
      const panes = this.getPanes();
      if (panes) panes.overlayLayer.appendChild(this.div as Node);
    }

    getDraggable() {
      return false;
    }

    getVisible() {
      return true;
    }

    onRemove() {
      if (this.div && this.div.parentNode) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }

    toggleDOM(map: google.maps.Map | google.maps.StreetViewPanorama | null) {
      if (this.getMap()) {
        this.setMap(null);
      } else {
        this.setMap(map);
      }
    }

    getPosition() {
      return this.latlng;
    }

    getZIndex() {
      return this.marker.getZIndex();
    }

    setZIndex(zIndex: number) {
      this.marker.setZIndex(zIndex);
    }

    setOpacity(opacity: number) {
      this.opacity = opacity;
    }
  }

  return new HTMLMapMarker();
};

export default createHTMLMapMarker;
