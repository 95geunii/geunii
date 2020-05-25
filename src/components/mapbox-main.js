import mapboxgl from 'mapbox-gl'

export default {
  name: 'MapboxMain',
  data() {
    return {
      apiKey: 'pk.eyJ1IjoiZ2V1bmlpIiwiYSI6ImNrYTliZmxyNDA3cXoycW9rdWw3eHppbWsifQ.3DqgNmnXsykbYknPndn_JA',
      map: undefined,
    }
  },
  mounted() {
    this.createMap()
    this.map.on('load', () => {
      console.log('resize', this.map.resize)
      this.displayGeojsonLine()
      this.displayBuildings()
      this.displayGeojsonPoint()
    })
  },
  methods: {
    createMap() {
      mapboxgl.accessToken = this.apiKey
      this.map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-74.0066, 40.7135],
        zoom: 15.5,
        pitch: 45,
        bearing: -17.6,
        container: 'map',
        antialias: true
      })
    },
    displayBuildings() {
      const layers = (this.map.getStyle()).layers

      let labelLayerId
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id
          break
        }
      }

      this.map.addLayer(
        {
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 1
          }
        },
        labelLayerId
      )
    },
    displayGeojsonLine() {
      this.map.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [
                -74.0058696269989,
                40.71467145556915
              ],
              [
                -74.00756478309631,
                40.71546026529846
              ],
              [
                -74.00841236114502,
                40.71437869906487
              ],
              [
                -74.00673866271973,
                40.713606140997854
              ],
              [
                -74.00725364685059,
                40.713053146560895
              ],
              [
                -74.01011824607848,
                40.71439496334888
              ],
              [
                -74.01103019714355,
                40.71334590889376
              ],
              [
                -74.00961399078368,
                40.71275225059959
              ],
              [
                -74.01048302650452,
                40.71154865315634
              ],
              [
                -74.00906682014465,
                40.71088991831653
              ],
              [
                -74.00863766670227,
                40.71134534062948
              ],
              [
                -74.007328748703,
                40.71056461475733
              ]
            ]
          }
        }
      });

      this.map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': 'red',
          'line-width': 8
        }
      });
    },
    displayGeojsonPoint() {
      this.map.addSource('points', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              // feature for Mapbox DC
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [
                  -74.0099,
                  40.7135
                ]
              },
              'properties': {
                'title': 'Point 1',
                'icon': 'monument'
              }
            },
            {
              // feature for Mapbox SF
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [
                  -74.0059,
                  40.7135
                ]
              },
              'properties': {
                'title': 'Point2',
                'icon': 'harbor'
              }
            }
          ]
        }
      });
      this.map.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'points',
        'layout': {
          // get the icon name from the source's "icon" property
          // concatenate the name to get an icon from the style's sprite sheet
          'icon-image': ['concat', ['get', 'icon'], '-15'],
          // get the title name from the source's "title" property
          'text-field': ['get', 'title'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.6],
          'text-anchor': 'top'
        }
      });
    }
  }
}