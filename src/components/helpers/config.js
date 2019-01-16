export const conwayConfig = {
  
  // Trail state
  trail: {
    current: true,
  },

  // Grid style
  grid: {
    current: 3,
    schemes: [
      {
        color: '#F3F3F3'
      },

      {
        color: '#FFFFFF'
      },

      {
        color: '#666666'
      },

      {
        color: '' // Special case: 0px grid
      }
    ]
  },

  // Zoom level
  zoom: {
    current: 0,
    schemes: [
      // { columns : 100, rows : 48, cellSize : 8 },
      {
        columns: window.innerWidth / 5,
        rows: window.innerHeight / 5,
        cellSize: 4
      },

      {
        columns: 300,
        rows: 144,
        cellSize: 2
      },

      {
        columns: 450,
        rows: 216,
        cellSize: 1
      }
    ]
  },


  // Cell colors
  colors: {
    current: 0,
    schemes: [
      {
        dead: '#FFFFFF',
        trail: ['#dcdcdc'],
        alive: ['#000000'],
        name: 'Classic'
      },
      {
        dead: '#111111',
        trail: ['#222222'],
        alive: ['#ffffff', '#f2f2f2', '#e6e6e6', '#d9d9d9', '#cccccc', '#bfbfbf', '#b3b3b3', '#a6a6a6', '#999999', '#8c8c8c', '#808080'],
        name: 'Starlight'
      },
      {
        dead: '#393e46',
        trail: ['#b55400'],
        alive: ["#000004", "#140e36", "#3b0f70", "#641a80", "#8c2981", "#b73779", "#de4968", "#f7705c", "#fe9f6d", "#fecf92", "#fcfdbf"],
        name: 'Magma'
      },
      {
        dead: '#35478C',
        trail: ["#6e40aa", "#6054c8", "#4c6edb", "#368ce1", "#23abd8", "#1ac7c2", "#1ddfa3", "#30ef82", "#52f667", "#7ff658", "#aff05b"],
        alive: ['#16193B'],
        name: 'Ocean'
      },

    ]
  },

}