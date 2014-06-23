dimple-chart
============

dimple-chart html tag using x-tag


Example
=======

```html
<dimple-chart data="data" height="300" width="300" margin-bottom="15%" type="bar">
  <dimple-axis position="y" type="measure" field="Awesomeness"></dimple-axis>
  <dimple-axis position="x" type="category" field="Word" orderBy="Word"></dimple-axis>
  <dimple-legend x="10" y="10" width="500" height="30" ></dimple-legend>
</dimple-chart>

<dimple-chart data="data" height="300" width="300" margin-bottom="15%">
  <dimple-axis position="y" type="measure" field="Awesomeness" display="false"></dimple-axis>
  <dimple-axis position="x" type="category" field="Word" title="this is a title"></dimple-axis>
  <dimple-series type="bar"></dimple-series>
</dimple-chart>
```

Some ideas from http://esripdx.github.io/angular-dimple/
