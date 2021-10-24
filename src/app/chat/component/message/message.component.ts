import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { markerSvg, Message } from 'src/app/model';
import { Feature, Map, MapBrowserEvent, Overlay, View } from 'ol';
import * as control from 'ol/control';
import * as geom from 'ol/geom';
import * as layer from 'ol/layer'
import * as proj from 'ol/proj';
import * as source from 'ol/source';
import { Icon, Style } from 'ol/style';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @ViewChild('content') contentElement!: ElementRef
  @Input() message!: Message;
  map!: Map;
  clickEvent = (event: MapBrowserEvent<UIEvent>) => this.map.getOverlays().forEach(
    o => o.setPosition(this.map.hasFeatureAtPixel(event.pixel) ? event.coordinate : undefined)
  );

  get overlays() {
    if (!this.message || !this.message.coordinates) return [];
    const element = document.createElement('div');
    element.innerHTML = `
      <table style="background-color: #fffc; border: 1px solid #dbdbdb; margin: 0 20px; padding: 10px;">
        <tr>
          <td>Latitude:</td>
          <td style="text-align: right;"><b>${ this.message.coordinates.lat }</b></td>
        </tr>
        <tr>
          <td>Longitude:</td>
          <td style="text-align: right;"><b>${ this.message.coordinates.lng }</b></td>
        </tr>
      </table>
    `;
    return [new Overlay({ element, autoPan: true, autoPanAnimation: { duration: 250 } })];
  }

  get point() {
    return this.message?.coordinates
      ? proj.fromLonLat([ this.message.coordinates.lng, this.message.coordinates.lat ])
      : [];
  }

  get layers() {
    if (!this.message || !this.message.coordinates) return [];
    const feature = new Feature({ geometry: new geom.Point(this.point) });
    const style = new Style({ image: new Icon({ src: markerSvg, opacity: 0.8, scale: 0.8 }) });
    feature.setStyle(style);
    return [
      new layer.Tile({
        source: new source.OSM({
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          attributions: [],
          maxZoom: 22
        })
      }),
      new layer.Vector({ source: new source.Vector({ features: [feature] }) })
    ];
  }

  get options() {
    return {
      target: this.contentElement.nativeElement,
      controls: control.defaults({ attribution: false }).extend([
        new control.Attribution({ collapsible: false })
      ]),
      view: new View({ center: this.point, maxZoom: 22, zoom: 16 }),
      layers: this.layers,
      overlays: this.overlays
    };
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
    if (!this.contentElement || !this.contentElement.nativeElement) return;
    else if (this.message.coordinates) {
      this.contentElement.nativeElement.innerHTML = '';
      this.contentElement.nativeElement.style.height = '55vh';

      this.map = new Map(this.options);
      this.map.on('singleclick', event => this.clickEvent(event));
    } else {
      this.contentElement.nativeElement.innerHTML = this.message.message;
    }
  }
}
