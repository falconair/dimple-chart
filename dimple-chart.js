document.addEventListener('WebComponentsReady',function() {

    xtag.register('dimple-axis',{
      accessors: {
        position: { get: function(){ return this.getAttribute("position") || 'x'; } },
        type: { get: function(){ return this.getAttribute("type") || "measure"; } },
        field: { get: function(){ return this.getAttribute("field") || "bar"; } },
        title: { get: function(){ return this.getAttribute("title") || null; } },
        //displayTitle: { get: function(){ return this.getAttribute("displayTitle") || "true"; } },
        display: { get: function(){ return this.getAttribute("display") || "true"; } },
        orderBy: { get: function(){ return this.getAttribute("orderBy") || null; } },
        orderByReverse: { get: function(){ return this.getAttribute("orderByReverse") || null; } },
        tickFormat: { get: function(){ return this.getAttribute("tickFormat") || null; } },
        displayBarValues: { get: function(){ return this.getAttribute("displayBarValues") || null; } },
        svgTransform: { get: function(){ return this.getAttribute("svgTransform") || null; } },
      }
    });

    xtag.register('dimple-series',{
      accessors: {
        series: { get: function(){ return this.getAttribute("series") || null; } },
        type: { get: function(){ return this.getAttribute("type") || "bar"; } },
        stacked: { get: function(){ return this.getAttribute("stacked") ; } },
        radius: { get: function(){ return this.getAttribute("radius") ; } },
        innerRadius: { get: function(){ return this.getAttribute("innerRadius") ; } },
        outerRadius: { get: function(){ return this.getAttribute("outerRadius") ; } },
      }
    });

    xtag.register('dimple-legend',{
      accessors: {
        x: { get: function(){ return this.getAttribute("x"); } },
        y: { get: function(){ return this.getAttribute("y"); } },
        width: { get: function(){ return this.getAttribute("width"); } },
        height: { get: function(){ return this.getAttribute("height"); } },
        horizontalAlign: { get: function(){ return this.getAttribute("horizontalAlign") || 'left'; } },
        series: { get: function(){ return this.getAttribute("series") || null; } },
      }
    });

    xtag.register('dimple-chart', {
        lifecycle: {
            // Fires when an instance of the element is created
            created: function() {},

            // Fires when an instance was inserted into the document
            inserted: function() {

              var dimple_axes = xtag.queryChildren(this,'dimple-axis');
              var dimple_series = xtag.queryChildren(this,'dimple-series');
              var dimple_legend = xtag.queryChildren(this,'dimple-legend');// zero or one

              if(this['debug']==='true'){
                console.log('==========Adding chart:'+this['chart-desc']+'==========');

                for(var i=0; i< dimple_axes.length;i++){
                  var axs = dimple_axes[i];
                  console.log('Axis position:'+axs.position+', type:'+axs.type+', field:'+axs.field+', title:'+axs.title+', display:'+axs.display+', orderBy:'+axs.orderBy+', orderByReverse:'+axs.orderByReverse+', tickFormat:'+axs.tickFormat+', displayBarValues:'+axs.displayBarValues+', svgTransform:'+axs.svgTransform);
                }

                for(i = 0; i< dimple_series.length;i++){
                  var ser = dimple_series[i];
                  console.log('Series series:'+ser.series+', type:'+ser.type+', stacked:'+ser.stacked+', radius:'+ser.radius+', innerRadius:'+ser.innerRadius+', outerRadius:'+ser.outerRadius);
                }
              }

              this.innerHTML = '<svg width='+this.width+' height='+this.height+'></svg>'+this.innerHTML;
              this.xtag.svg = this.firstElementChild;

              var chart = new dimple.chart(d3.select(this.xtag.svg), this.data);
              chart.setMargins(this['margin-left'],this['margin-top'],this['margin-right'],this['margin-bottom']);

              var axesToModifyAfterDraw = [];
              for(var i = 0; i<dimple_axes.length; i++){
                var axs = dimple_axes[i];
                var type = axs.type ;
                var display = axs.display === "true";
                var orderBy = axs.orderBy === null? null : axs.orderBy;//.split(',');
                var field = axs.field === null ? null : axs.field;//.split(',');

                var _axis = null;

                if(type === "measure"){
                  _axis = chart.addMeasureAxis(axs.position, field);
                }
                else if(type === "category"){
                  _axis = chart.addCategoryAxis(axs.position, field);
                }
                else if(type === "percent"){
                  _axis = chart.addPercentAxis(axs.position, field);
                }
                else if(type === "color"){
                  _axis = chart.addColorAxis(axs.position, field);
                }
                else if(type === "log"){
                  _axis = chart.addLogAxis(axs.position, field);
                }
                else{
                  console.warn('Axis type "'+type+'" was not expected');
                }

                if(_axis.title !== null && _axis.title !== '' ) _axis.title = axs.title;
                _axis.hidden = !display;
                if(axs.orderBy !== null){
                  if(axs.orderByReverse !== null) _axis.addOrderRule(axs.orderBy, axs.orderByReverse);
                  else _axis.addOrderRule(axs.orderBy);
                }
                if(axs.tickFormat !== null) _axis.tickFormat = axs.tickFormat;
                if(axs.svgTransform !== null) axesToModifyAfterDraw.push([_axis,axs.svgTransform]);

              }



              //TODO: There should only be a single chart series
              var _series = null;
              for(var i=0; i<dimple_series.length;i++){
                var ser = dimple_series[i];
                var series = ser.series === null ? null : ser.series.split(',');
                var type = ser.type;
                var stacked = ser.stacked;
                var radius = ser.radius;
                var innerRadius = ser.innerRadius;
                var outerRadius = ser.outerRadius;
                _series = chart.addSeries(series,dimple.plot[type]);
                if(stacked === null || stacked ==="true") _series.stacked = true;
                else _series.stacked = false;
                if(radius !== null) _series.radius = radius;
                if(innerRadius !== null) _series.innerRadius = innerRadius;
                if(outerRadius !== null) _series.outerRadius = outerRadius;
              }


              for(var i=0; i<dimple_legend.length;i++){
                var lgd = dimple_legend[i];
                chart.addLegend(lgd.x,lgd.y,lgd.width,lgd.height,lgd.horizontalAlign,lgd.series);
              }

              if(dimple_series.length == 0){
                chart.addSeries(null, dimple.plot[this.type]);
              }

              this.xtag.chart = chart;
              chart.draw();

              //shapes can't be accessed until .draw() has been called
              for(var i=0; i<axesToModifyAfterDraw.length;i++){
                _axis = axesToModifyAfterDraw[i][0];
                svgTransform = axesToModifyAfterDraw[i][1];
                _axis.shapes.selectAll('text').attr('transform',
                  function(d){
                    return d3.select(this).attr('transform') + svgTransform;
                  });

              }

              var chartSeries = _series;
              //add in-line labels to bar charts
              //This is custom code, not part of dimple.
              //TODO: make it work for vertical bar chart as well
              /*if (displayBarValues && chartSeries !== null) {
                  chartSeries.shapes.each(function (d) {

                      var value = "";
                      if (d.yValue > 1000000000) {
                          value = d3.format(",.1f")(d.yValue / 1000000) + "b";
                      }
                      else if (d.yValue > 1000000) {
                          value = d3.format(",.1f")(d.yValue / 1000000) + "m";
                      }
                      else if (d.yValue > 1000) {
                          value = d3.format(",.1f")(d.yValue / 1000000) + "k";
                      } else {
                          value = d3.format(",.1f")(d.yValue);
                      }

                      // Get the shape as a d3 selection
                      var shape = d3.select(this),
                          barHeight = chartYAxis._scale(d.height);
                          barWidth = chartXAxis._scale(d.width);

                      svg.append("text")
                          .attr("x", (parseFloat(shape.attr("x")) + (parseFloat(shape.attr("width"))) / 2 ))
                          .attr("y", barHeight > 20 ? barHeight - 15 : barHeight + 15)
                          .style("text-anchor", "middle")
                          .style("font-size", "10px")
                          .style("font-family", "sans-serif")
                          .style("opacity", 0.6)
                          .text(value);
                  });
              }*/
            },

            // Fires when an instance was removed from the document
            removed: function() {},

            // Fires when an attribute was added, removed, or updated
            attributeChanged: function(attr, oldVal, newVal) {}
        },
        events: {},
        accessors: {
          data: { get: function(){ return dataRepo[this.getAttribute("data")]; }, },
          height: { get: function(){ return this.getAttribute("height") || 300; }, },
          width: { get: function(){ return this.getAttribute("width") || 500; }, },
          type: { get: function(){ return this.getAttribute("type") || "bar"; }, },
          'margin-top': { get: function(){ return this.getAttribute("margin-top") || '10%'; } },
          'margin-bottom': { get: function(){ return this.getAttribute("margin-bottom") || '15%'; } },
          'margin-left': { get: function(){ return this.getAttribute("margin-left") || '10'; } },
          'margin-right': { get: function(){ return this.getAttribute("margin-right") || '10'; } },
          'chart-desc': { get: function(){ return this.getAttribute("chart-desc") || ''; } },
          'debug': { get: function(){ return this.getAttribute("debug") || 'false'; } },
        },
        methods: {}
    });

});
