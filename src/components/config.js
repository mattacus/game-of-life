export const conwayConfig = {

  // Trail state
  trail: {
    current: false,
    schedule: false
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
    schedule: false,

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
    schedule: false,

    schemes: [
      {
        dead: '#FFFFFF',
        trail: ['#B5ECA2'],
        alive: ['#9898FF', '#8585FF', '#7272FF', '#5F5FFF', '#4C4CFF', '#3939FF', '#2626FF', '#1313FF', '#0000FF', '#1313FF', '#2626FF', '#3939FF', '#4C4CFF', '#5F5FFF', '#7272FF', '#8585FF']
      },
      {
        dead: '#FFFFFF',
        trail: ['#EE82EE', '#FF0000', '#FF7F00', '#FFFF00', '#008000 ', '#0000FF', '#4B0082'],
        alive: ['#FF0000', '#FF7F00', '#FFFF00', '#008000 ', '#0000FF', '#4B0082', '#EE82EE']
      },

      {
        dead: '#FFFFFF',
        trail: ['#9898FF', '#8585FF', '#7272FF', '#5F5FFF', '#4C4CFF', '#3939FF', '#2626FF', '#1313FF', '#0000FF', '#1313FF', '#2626FF', '#3939FF', '#4C4CFF', '#5F5FFF', '#7272FF', '#8585FF'],
        alive: ['#000000']
      },
      {
        dead: '#35478C',
        trail: ['#4E7AC7'],
        alive: ['#16193B']
      },

    ]
  },

}