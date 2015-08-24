angular.module('app.user', [])
  .controller('userController', function($location, $scope, $http){
    $scope.user = {gender: 'female'};
    $scope.backToGame = function() {
      $location.path('/game');
    };
    $scope.drawLine = function(){
      var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      var x = d3.scale.linear()
        .range([0, width]);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      var line = d3.svg.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

      var svg = d3.select("#line").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var dataPoints = {
        1:10,
        2:20,
        3:30,
        4:40,
        5:50
      }, data = [];

      for(key in dataPoints){
      data.push({x:key,y:dataPoints[key]});
      }

      x.domain(d3.extent(data, function(d) { return d.x; }));
      y.domain(d3.extent(data, function(d) { return d.y; }));

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      svg.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);
    };

    $scope.drawBox = function(){
        var margin = {top: 10, right: 85, bottom: 20, left: 85},
            width = 220 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var min = Infinity,
            max = -Infinity;
        var chart = d3.box()
            .whiskers(iqr(1.5))
            .width(width)
            .height(height);

          var data = [], 
          csv = [850, 740, 900, 1070, 945, 850, 950, 980, 880, 1000, 890, 930, 
          650, 760, 810, 1030, 960,];

          csv.forEach(function(x) {
            var e = 0,
                s = Math.floor(x),
                d = data[e];
            if (!d) d = data[e] = [s];
            else d.push(s);
            if (s > max) max = s;
            if (s < min) min = s;
          });
          chart.domain([min, max]);
          data[0].push(915);
          var svg = d3.select("#box").selectAll("svg")
              .data(data)
            .enter().append("svg")
              .attr("class", "d3box")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.bottom + margin.top)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
              .call(chart);


        // Returns a function to compute the interquartile range.
        function iqr(k) {
          return function(d, i) {
            var q1 = d.quartiles[0],
                q3 = d.quartiles[2],
                iqr = (q3 - q1) * k,
                i = -1,
                j = d.length;
            while (d[++i] < q1 - iqr);
            while (d[--j] > q3 + iqr);
            return [i, j];
          };
        }




    };

  });
