angular.module('app.performance', [])
  .controller('performanceController', function($location, $scope, $http, auth, $state){
    $scope.beginGame = function(){
      $state.go('game');
    };
    $scope.scoreHistory = function(){
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

      var svg = d3.select("#scores").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      $http.post('/api/getProfile', {id: auth.profile.user_id.split('|')[1]})
        .then(function(res){
          if(!!res.data){
            var dataPoints = res.data.highScores, data = [];
            dataPoints.forEach(function(value, index){
              data.push({x:index, y:value});
            });
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
          } else {
          }
        });
    };

    $scope.compare = function(compField){
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
          seedData = {
            'male': [963, 654, 263, 672, 617, 171, 126, 482, 19, 333, 614, 860, 163, 405, 129, 683, 690, 596],
            'female': [894, 562, 977, 239, 961, 993, 529, 1051, 330, 576, 371, 232, 936, 495, 502, 47, 308, 678],
            '0-14': [382, 520, 654, 852, 1049, 457, 847, 51, 352, 685, 464, 419, 593, 86, 24, 591, 544, 722],
            '15-24': [1012, 789, 447, 99, 604, 277, 102, 636, 791, 335, 842, 35, 473, 720, 268, 726, 1026, 190],
            '25-34': [1090, 823, 839, 999, 676, 326, 1071, 667, 1024, 49, 875, 643, 1089, 729, 509, 744, 409, 1088],
            '35-44': [786, 62, 638, 632, 366, 510, 870, 460, 2, 891, 124, 199, 920, 368, 609, 253, 1073, 744],
            '45-54': [841, 673, 41, 472, 111, 179, 461, 173, 151, 427, 428, 654, 664, 634, 383, 119, 326, 509],
            '55+': [514, 46, 685, 356, 808, 880, 1032, 913, 820, 741, 858, 653, 998, 754, 644, 153, 187, 1057]
          }

        $http.post('/api/getProfile', {id: auth.profile.user_id.split('|')[1]})
          .then(function(res){
            var dataPoints = res.data.highScores || [];
            var highScore = dataPoints[0] || 0;
            for(var i = 1; i < dataPoints.length; i++){
              if(dataPoints[i] > highScore){
                highScore = dataPoints[i];
              }
            }
            var csv = seedData[res.data[compField]];

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
            data[0].push(highScore);
            var idString = "#"+compField;
            var svg = d3.select(idString).selectAll("svg")
                .data(data)
              .enter().append("svg")
                .attr("class", "d3box")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.bottom + margin.top)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(chart);
          });

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
