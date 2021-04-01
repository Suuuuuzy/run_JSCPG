var cy = window.cy = cytoscape({
  container: document.getElementById('cy'),

  boxSelectionEnabled: false,

  style: [
    {
      selector: 'node',
      css: {
        'content': 'data(content)',
        'text-wrap': 'wrap',
        'shape': 'rectangle', 
        'width': 'data(width)',
        'height': 'data(height)',
        'text-valign': 'center',
        'text-halign': 'center',
//        'line-height': 1,
        'text-justification': 'left'
      }
    },
    {
      selector: ':parent',
      css: {
        'text-valign': 'top',
        'text-halign': 'center',
      }
    },
    {
      selector: 'edge',
      css: {
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle'
      }
    }
  ],

  elements: {
    nodes: {{NODES}},
    edges: {{EDGES}}
  },

  layout: {
    name: 'preset',
    padding: 2
  }
});


