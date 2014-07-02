document.addEventListener('WebComponentsReady',function() {

    xtag.register('dimple-axis',{
      accessors: {
        position: { get: function(){ return this.getAttribute("position"); } },
        type: { get: function(){ return this.getAttribute("type") || "measure"; } },
        field: { get: function(){ return this.getAttribute("field") || "bar"; } },
        title: { get: function(){ return this.getAttribute("title") ; } },
        //displayTitle: { get: function(){ return this.getAttribute("displayTitle") || "true"; } },
        display: { get: function(){ return this.getAttribute("display") || "true"; } },
        orderBy: { get: function(){ return this.getAttribute("orderBy"); } },
        orderByReverse: { get: function(){ return this.getAttribute("orderByReverse") || "false"; } },
        tickFormat: { get: function(){ return this.getAttribute("tickFormat"); } },
      }
    });

    xtag.register('dimple-series',{
      accessors: {
        series: { get: function(){ return this.getAttribute("series") || null; } },
        type: { get: function(){ return this.getAttribute("type") || "bar"; } },
        stacked: { get: function(){ return this.getAttribute("stacked") ; } },
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

              this.innerHTML = '<svg width='+this.width+' height='+this.height+'></svg>'+this.innerHTML;
              this.xtag.svg = this.firstElementChild;

              var chart = new dimple.chart(d3.select(this.xtag.svg), this.data);
              chart.setMargins(this['margin-left'],this['margin-top'],this['margin-right'],this['margin-bottom']);

              var dimple_axes = xtag.queryChildren(this,'dimple-axis');
              for(var i = 0; i<dimple_axes.length; i++){
                var axs = dimple_axes[i];
                var type = axs.type || "measure";
                var title = axs.title;
                //var displayTitle = axs.displayTitle === "true";
                var display = axs.display === "true";
                var orderBy = axs.orderBy;
                var orderByReverse = axs.orderByReverse;
                var tickFormat = axs.tickFormat;
                var field = axs.field.split(',');

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

                if(_axis.title !== null) _axis.title = title;
                _axis.hidden = !display;
                if(orderBy !== null) _axis.addOrderRule(orderBy, orderByReverse);
                if(tickFormat !== null) _axis.tickFormat = tickFormat;

              }

              var dimple_series = xtag.queryChildren(this,'dimple-series');
              for(var i=0; i<dimple_series.length;i++){
                var ser = dimple_series[i];
                var series = ser.series === null ? null : ser.series.split(',');
                var type = ser.type;
                var stacked = ser.stacked;
                var _series = chart.addSeries(series,dimple.plot[type]);
                if(stacked === null || stacked ==="true") _series.stacked = true;
                else _series.stacked = false;
              }

              var dimple_legend = xtag.queryChildren(this,'dimple-legend');// zero or one
              for(var i=0; i<dimple_legend.length;i++){
                var lgd = dimple_legend[i];
                chart.addLegend(lgd.x,lgd.y,lgd.width,lgd.height,lgd.horizontalAlign,lgd.series);
              }


              if(dimple_series.length == 0){
                chart.addSeries(null, dimple.plot[this.type]);
              }

              this.xtag.chart = chart;
              chart.draw();
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
        },
        methods: {}
    });

});
