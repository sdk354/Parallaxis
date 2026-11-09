/* Four map treatments, switchable and scorable from the design lab.

   All open zoomed into a region — that behaviour scored highest on its own and is
   orthogonal to palette, so it is not one of the options.

   `sev` is per-treatment: the ramp is not ground-agnostic, and the sand end of a
   dark-ground ramp is close to invisible on pale land.

   `bathyFill` is five colours, shallow → deep, matching the five depth bands in
   geo.js (200, 1000, 2000, 3000, 4000 m). `bathyLine` draws contours instead of
   fills; `bathyLineAt` picks which bands get a contour, so a line treatment does
   not have to draw all five.                                                   */

window.PX_TREATMENTS = {

  a: {
    id: 'a',
    name: 'High contrast',
    note: 'Dark ground, flat ocean, strong land separation. Rivers and lakes carry the detail.',
    ground: 'dark',
    ocean: '#080D14', land: '#2B3F53', landLit: '#3F5D79', border: '#5B7893',
    ink: '#F2F6F9', inkMuted: '#9AA9B7',
    disputed: '#C4707E', control: '#9E8CA8',
    layers: {
      bathyFill: null, bathyLine: null, bathyLineAt: null,
      landFill: true,
      rivers: '#38566E', riverWidth: 0.4,
      lakeFill: '#0E1A26', lakeStroke: '#3F5B73'
    },
    sev: ['', '#F5DCB6', '#E9AE6C', '#DA7C3C', '#C04A24', '#8E2A15']
  },

  b: {
    id: 'b',
    name: 'Nautical chart',
    note: 'Pale chart ground. Depth held right back so it sits behind the data instead of competing with it.',
    ground: 'light',
    ocean: '#E9F0F2', land: '#F8F4E9', landLit: '#FFF6D8', border: '#7C8B95',
    ink: '#16212B', inkMuted: '#5B6975',
    disputed: '#B0475C', control: '#7E6E92',
    layers: {
      // five near-neighbours: legible as steps, not as stripes
      bathyFill: ['#E4EDEF', '#DFE9EC', '#DAE5E9', '#D5E1E6', '#D0DDE3'],
      bathyLine: '#C2D4DC', bathyLineAt: [0, 2, 4], bathyLineWidth: 0.3, bathyLineOpacity: 0.7,
      landFill: true,
      rivers: '#AFC5D0', riverWidth: 0.32,
      lakeFill: '#E0EBEF', lakeStroke: '#BCD0D9'
    },
    sev: ['', '#D9AE70', '#C6822F', '#AC5A21', '#8A3416', '#59190C']
  },

  c: {
    id: 'c',
    name: 'Bathymetric',
    note: 'Five measured depth bands stepping off the continental shelf, drawn one path per sounding so the bands nest cleanly.',
    ground: 'dark',
    ocean: '#11293B', land: '#28394A', landLit: '#3D5C78', border: '#5C7B95',
    ink: '#EEF3F7', inkMuted: '#93A2B0',
    disputed: '#C4707E', control: '#9E8CA8',
    layers: {
      bathyFill: ['#0E2334', '#0B1C2B', '#081623', '#06111B', '#040C13'],
      bathyLine: null, bathyLineAt: null,
      landFill: true,
      rivers: '#37576F', riverWidth: 0.4,
      lakeFill: '#0C1B28', lakeStroke: '#3E5E76'
    },
    sev: ['', '#F5DCB6', '#E9AE6C', '#DA7C3C', '#C04A24', '#8E2A15']
  },

  d: {
    id: 'd',
    name: 'Survey blueprint',
    note: 'Pure line work. No ocean depth at all, no rivers — coastlines, borders and contested lines only.',
    ground: 'dark',
    ocean: '#060C15', land: 'none', landLit: 'rgba(79,179,199,0.12)', border: '#3E8DA0',
    ink: '#DCF0F5', inkMuted: '#7FA3AE',
    disputed: '#B96C7C', control: '#8FA9B4',
    layers: {
      bathyFill: null,
      bathyLine: null, bathyLineAt: null,
      landFill: false,
      rivers: null, riverWidth: 0,
      lakeFill: 'none', lakeStroke: '#215663'
    },
    sev: ['', '#F5DCB6', '#E9AE6C', '#DA7C3C', '#C04A24', '#8E2A15']
  }
};

/* Every treatment opens here: the densest cluster of tracked events, at a zoom
   where 50m coastlines and borders resolve. */
window.PX_START_VIEW = { cx: 560, cy: 150, w: 430 };
