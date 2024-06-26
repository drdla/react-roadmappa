'use strict';
var jQuery = require('jquery');
var Snap = require('snapsvg');

(function($) {
  $(function() {
    class Roadmap {
      /**
       * Class constructor.
       *
       * @param   {Object}    data JSON object containing all data for rendering the roadmap
       */
      constructor(data) {
        this.fullData = data; // the complete set of data
        this.data = data; // the data the roadmap is generated from; can be a filtered subset

        this.roadmapPlaceholder = document.getElementById('js_roadmapPlaceholder');
        this.placeholderWidth = parseInt(window.getComputedStyle(this.roadmapPlaceholder).width, 10);
        this.absMiddle = this.perc2Abs('50%');

        this.paper = null;

        this.intervals = this.maximumInterval();
        this.sections = this.data.roadmap.length;
        this.renderTree = [{}]; // array, seeded with empty root object
        this.featureId = 0;
        this.endPointsBeforeCount = 0;
        this.featureChains = [];

        this.diagramSvgSelector = '#js_roadmapDiagram'; // Selector of the SVG Snap uses as drawing area
        this.diagramRadii = {
          segmentMin: 6, // inner radius of smallest circle segments; in %
          segmentMax: 46, // inner radius of smallest circle segments; in %
          sectionLabel: 48, // radius of textpath for section labels; in %
          dot: 4, // radius of feature dots; in px
        };
        this.intervalRadii = this.getIntervalRadii(this.intervals);
        this.stateClass = {
          selected: 'is-selected',
          filteredOut: 'is-filtered-out',
          highlighted: 'is-highlighted',
        };
      }

      /**
       * Render the title of the roadmap as page title.
       */
      renderRoadmapTitle() {
        document.getElementById('js_roadmapTitle').textContent = this.data.metadata.title;
      }

      /**
       * Render the circular roadmap diagram.
       */
      renderDiagram() {
        // set up Snap paper (i.e. the Snap drawing area)
        this.paper = Snap(this.diagramSvgSelector);

        // set size of paper
        this.setPaperSize();

        // render sections of diagram, each split into number of given intervals (e.g. quarters or months)
        for (var currentSection = 0; currentSection < this.sections; currentSection++) {
          this.renderSectionLabel(currentSection); // render first so its bounding box doesn't overlap a segment
          this.renderSectionBackground(currentSection);
          this.getSectionFeatureData(currentSection);
        }

        // before we can render the features, we need to adjust the center points of multiple dependent features
        // in the same interval
        this.adjustCenters();

        // now draw the renderTree
        this.renderRenderTree();

        // and finally add a label at the center of the diagram; drawn last so it renders on top
        this.renderDiagramLabel(this.data.metadata.subject + '<br>' + this.data.metadata.year);
      }

      /**
       * Evenly distribute centers of features in one dependency chain that belong to the same interval within the
       * interval.
       */
      adjustCenters() {
        var self = this,
          adjustedCenter,
          adjustedRadius,
          feature,
          featureId,
          radii,
          splitIntervalBy,
          subInterval,
          subIntervalRadius;

        this.featureChains.forEach(function(interval) {
          interval.forEach(function(dependencyChain) {
            if (dependencyChain.length > 1) {
              // only handle 'real' dependency chains, i.e. arrays with more than 1 element
              for (var i = 0, l = dependencyChain.length; i < l; i++) {
                // calculate adjusted feature center
                splitIntervalBy = l + 1; // interval needs to accommodate l elements + 1 for spacing
                subInterval = i + 1; // feature is element i of elements in interval (fix zero base)
                featureId = dependencyChain[i];
                feature = self.renderTree[featureId];
                radii = self.intervalRadii[feature.interval - 1];
                subIntervalRadius = (radii.outer - radii.inner) / splitIntervalBy;
                adjustedRadius = radii.inner + subIntervalRadius * subInterval;
                adjustedCenter = self.cartesianCenter(feature.angle, adjustedRadius);

                // update renderTree
                feature.center = adjustedCenter;
                feature.radius = adjustedRadius;
              }
            }
          });
        });
      }

      /**
       * Get the inner width of the diagram placeholder and set it as height and width attributes of the Snap diagram.
       */
      setPaperSize() {
        this.placeholderWidth = parseInt(window.getComputedStyle(this.roadmapPlaceholder).width, 10);

        // resize paper to new placeholder dimensions
        this.paper.attr({
          height: this.placeholderWidth + 'px',
          width: this.placeholderWidth + 'px',
        });
      }

      /**
       * Draw circle segments for each interval of the diagram section as background.
       *
       * @param   {Number}    currentSection  Number of the current section; value has to be zero-based!
       */
      renderSectionBackground(currentSection) {
        var self = this,
          startAngle = (360 / this.sections) * currentSection,
          endAngle = (360 / this.sections) * (currentSection + 1),
          classes = [];

        for (var currentInterval = 0; currentInterval < this.intervals; currentInterval++) {
          classes = [
            'roadmap__segment', // class for styling with CSS
            this.getColorOfSection(currentSection, 'fill'), // color class
            'js_segment', // base class for targeting segments
            'js_interval-' + (currentInterval + 1), // class for targeting all segments of an interval
            'js_section-' + (currentSection + 1), // class for targeting all segments of a section
          ];

          this.paper
            .circleSegment(
              this.absMiddle,
              this.absMiddle,
              this.perc2Abs(this.intervalRadii[currentInterval].outer + '%'),
              this.perc2Abs(this.intervalRadii[currentInterval].inner + '%'),
              startAngle,
              endAngle
            )
            .addClass(classes.join(' '))
            .attr({
              'data-interval': currentInterval + 1, // store for interaction with elements in interval
            })
            .hover(
              function() {
                self.highlightSegments(this, self, 'interval');
              },
              function() {
                self.removeSegmentHighlights(self);
              }
            )
            .mousedown(function() {
              self.applyIntervalFilter(this, self);
            });
        }
      }

      /**
       * Get the feature data for the current section and render each feature.
       *
       * @param   {Number}    currentSection  Number of the current section; value has to be zero-based!
       */
      getSectionFeatureData(currentSection) {
        var self = this,
          features = this.data.roadmap[currentSection].features,
          anglePerEndPoint;

        // get number of features that the available angle should be divided by;
        // ignore dependent features, as they do not consume space in terms of angle
        anglePerEndPoint = 360 / self.sections / self.countFeatureEndPoints(features);

        // reset endPointsBeforeCount for every section
        this.endPointsBeforeCount = 0;

        features.forEach(function(feature) {
          self.buildRenderTree(currentSection, anglePerEndPoint, feature);
        });
      }

      /**
       * Calculate attributes required for rendering the roadmap diagram in a radial tree layout from the raw roadmap
       * data.
       *
       * @param   {Number}    section             Number of the section; value has to be zero-based!
       * @param   {Number}    anglePerEndPoint    Angle between two end points in the current section
       * @param   {Object}    featureData         Roadmap data
       * @param   {Number}    parentFeatureId     ID of the feature that the current feature is dependent from
       */
      buildRenderTree(section, anglePerEndPoint, featureData, parentFeatureId) {
        var self = this,
          angle,
          center,
          dependentEndPointsCount,
          interval,
          tmpFeatureId;

        if (Array.isArray(featureData)) {
          // cache the featureId, so that the elements in the array or their children don't increment it
          tmpFeatureId = self.featureId;

          // recurse through array of features; we're not touching the renderTree in this case
          featureData.forEach(function(feature) {
            self.buildRenderTree(section, anglePerEndPoint, feature, tmpFeatureId);
          });
        } else if (featureData.hasOwnProperty('dependentFeature')) {
          interval = featureData.plannedForInterval; // just to make the following code shorter

          // calculate, how many end points are among the dependent features, so we can adjust the angle later on
          dependentEndPointsCount = this.countFeatureEndPoints(featureData.dependentFeature);

          // increment featureId, because we are adding this feature to the renderTree
          this.featureId++;

          // calculate feature angle
          angle =
            (360 / this.sections) * section + // start angle of section
            (anglePerEndPoint * 1) / 2 + // center all features within section
            // by shifting them by 1/2 angle unit
            anglePerEndPoint * this.endPointsBeforeCount + // angle consumed by prior end points
            anglePerEndPoint * (dependentEndPointsCount / 2 - 1 / 2); // middle of dependent end points

          // calculate feature center
          center = self.cartesianCenter(angle, self.intervalRadii[interval - 1].center);

          // build featureChains to calculate number of chained features planned for the same interval
          self.buildFeatureChains(interval, parentFeatureId, this.featureId);

          // add feature data to render tree
          this.renderTree.push({
            angle: angle,
            anglePerEndPoint: anglePerEndPoint,
            center: center,
            dependentEndPointsCount: dependentEndPointsCount,
            description: featureData.description,
            endPointsBeforeCount: this.endPointsBeforeCount,
            interval: interval,
            name: featureData.name,
            parentFeatureId: parentFeatureId,
            radius: self.intervalRadii[interval - 1].center,
            section: section,
          });

          // recurse through dependent features
          this.buildRenderTree(section, anglePerEndPoint, featureData.dependentFeature, this.featureId);
        } else {
          interval = featureData.plannedForInterval; // just to make the following code shorter

          // increment featureId, because we are adding this feature to the renderTree
          this.featureId++;

          // calculate feature angle
          angle =
            (360 / this.sections) * section + // start angle of section
            (anglePerEndPoint * 1) / 2 + // center all features within section
            // by shifting them by 1/2 angle unit
            anglePerEndPoint * this.endPointsBeforeCount; // angle consumed by prior end points

          // calculate feature center
          center = self.cartesianCenter(angle, self.intervalRadii[interval - 1].center);

          // build featureChains to calculate number of chained features planned for the same interval
          self.buildFeatureChains(interval, parentFeatureId, this.featureId);

          // add feature data to render tree
          this.renderTree.push({
            angle: angle,
            anglePerEndPoint: anglePerEndPoint,
            center: center,
            dependentEndPointsCount: 0,
            description: featureData.description,
            endPointsBeforeCount: this.endPointsBeforeCount,
            interval: interval,
            name: featureData.name,
            parentFeatureId: parentFeatureId,
            radius: self.intervalRadii[interval - 1].center,
            section: section,
          });

          // we have an end point! so let's increment endPointsBeforeCount
          this.endPointsBeforeCount++;
        }
      }

      /**
       * Extract and store information, which features that are directly dependent from another are to be rendered
       * in the same interval.
       *
       * @param   {Number}    interval        Number of the interval the feature is planned for
       * @param   {Number}    parentFeatureId ID of the feature that the current feature is dependent from
       * @param   {Number}    featureId       ID of the current feature
       */
      buildFeatureChains(interval, parentFeatureId, featureId) {
        var existsInArray;

        if (this.featureChains[interval]) {
          this.featureChains[interval].forEach(function(featureChain, index) {
            // check for each featureChain in the interval of featureId, if its parentFeatureId is in there
            // -> if so, we have a dependency chain in that interval between the feature and its parent feature
            if (parentFeatureId && featureChain.indexOf(parentFeatureId) !== -1) {
              existsInArray = index;
            }
          });

          if (existsInArray >= 0) {
            // parentFeatureId was found in a dependency chain in that interval -> append featureId to that
            this.featureChains[interval][existsInArray].push(featureId);
          } else {
            // start a new dependency chain array for that interval that only contains featureId for now
            this.featureChains[interval].push([featureId]);
          }
        } else {
          // the interval does not exist in featureChains -> add it and start a new dependency chain array in it
          this.featureChains[interval] = []; // create empty array
          this.featureChains[interval].push([featureId]); // push array with featureId in
        }
      }

      /**
       * Recursively count the number of features without dependent features (end points) in a feature data object.
       *
       * @param   {Object|Array}  object  Object with feature data
       *
       * @return  {Number}                Number of feature end points
       */
      countFeatureEndPoints(object) {
        var self = this,
          endPointsCount = 0;

        // call function recursively for nested features
        if (Array.isArray(object)) {
          // -> array of feature objects: loop through objects in array (this is just an intermediate step)
          object.forEach(function(arrayObject) {
            endPointsCount += self.countFeatureEndPoints(arrayObject);
          });
        } else if (object.hasOwnProperty('dependentFeature')) {
          // -> feature object with nested feature object: don't count and only recurse through children, because
          // parent / child relation is graphed as a straight line that does not require adjustment of angle
          endPointsCount += self.countFeatureEndPoints(object.dependentFeature);
        } else {
          // -> standard object: increase count to adjust angle for even spacing of features
          endPointsCount++;
        }

        return endPointsCount;
      }

      /**
       * Calculate position and alignment of label for a feature.
       *
       * @param   {Number}    featureAngle    Angle of the feature relative to the diagram center
       * @param   {Number}    featureRadius   Radius of the feature from the diagram center
       *
       * @return  {Object}                    X and y coordinates and text alignment
       */
      getLabelAttributes(featureAngle, featureRadius) {
        var textAnchor = 'middle',
          spacing = 2, // default spacing
          labelCenter;

        // adjust text-alignment depending on featureAngle
        if (featureAngle > 45 && featureAngle < 135) {
          spacing = 1;

          // left-align text on the right side of the diagram
          textAnchor = 'start';
        } else if (featureAngle > 225 && featureAngle < 315) {
          spacing = 1;

          // right-align text on the left side of the diagram
          textAnchor = 'end';
        }

        spacing += this.fineTuneLabelSpacing(featureAngle) * 0.5;

        // increase radius to add space between dot and label
        labelCenter = this.cartesianCenter(featureAngle, featureRadius + spacing);

        return {
          textAnchor: textAnchor,
          x: labelCenter.x,
          y: labelCenter.y,
        };
      }

      /**
       * Adjust the position of a feature label relative to its feature dot, depending on their diagram position.
       *
       * @param   {Number}    angleInDegrees  Angle at which the feature is rendered in the circular roadmap
       *
       * @return  {Number}                    Additional spacing in pixels
       */
      fineTuneLabelSpacing(angleInDegrees) {
        return Math.abs(
          // maximum shift for multiples of 45°, minimum shift for multiples of 0° / 90°
          Math.sin((((angleInDegrees * 2) % 180) / 180) * Math.PI)
        );
      }

      /**
       * Draw roadmap diagram from renderTree.
       */
      renderRenderTree() {
        var self = this,
          $details = $('#js_roadmapDetails'), // TODO: get this property from constructor
          connectorClasses,
          parent,
          parentPoint,
          classes,
          labelAttributes;

        // draw all connectors
        this.renderTree.forEach(function(connector, index) {
          if (index > 0) {
            connectorClasses = [
              'roadmap__feature-connector', // class for styling with CSS
              self.getColorOfSection(connector.section, 'stroke'), // color class
              'js_feature', // base class for targeting features
              'js_featureConnector', // base class for targeting feature dots
              'js_section-' + (connector.section + 1), // class for targeting all features of a section
              'js_interval-' + connector.interval, // class for targeting all features of an interval
            ];

            // get center of parent feature
            // TODO: move to own function!?
            parent = self.renderTree[connector.parentFeatureId];
            parentPoint = parent ? parent.center : {x: self.absMiddle, y: self.absMiddle};

            self.paper
              .path(['M', connector.center.x, connector.center.y, 'L', parentPoint.x, parentPoint.y].join(' '))
              .addClass(connectorClasses.join(' '));
          }
        });

        // draw all dots and labels
        this.renderTree.forEach(function(feature, index) {
          if (index > 0) {
            classes = [
              'roadmap__feature', // class for styling with CSS
              'js_feature', // base class for targeting features
              'js_section-' + (feature.section + 1), // class for targeting all features of a section
              'js_interval-' + feature.interval, // class for targeting all features of an interval
            ];

            labelAttributes = self.getLabelAttributes(feature.angle, feature.radius);

            // group dot and label into one 'feature'
            self.paper
              .g(
                // feature dot
                self.paper
                  .circle(feature.center.x, feature.center.y, self.diagramRadii.dot)
                  .addClass('roadmap__feature-dot js_featureDot ' + self.getColorOfSection(feature.section, 'stroke')),

                // feature label
                self.paper
                  .text(labelAttributes.x, labelAttributes.y, feature.name)
                  .addClass('roadmap__feature-label js_featureLabel')
                  .attr({
                    'text-anchor': labelAttributes.textAnchor,
                  })
              )
              .attr({
                id: 'js_feature-' + index,
              })
              .addClass(classes.join(' '))
              .hover(
                function() {
                  if (!this.hasClass(self.stateClass.filteredOut)) {
                    // get feature details and fade in details placeholder
                    $details
                      .html(
                        // find corresponding legend entry and get its markup
                        // TODO: this should be done with the featureId so jQuery can be removed
                        $('.js_legendEntry > h3:contains(' + feature.name + ')')
                          .parent('li')
                          .html()
                      )
                      .stop(true, true)
                      .animate({opacity: 1}, 50);
                  }
                },
                function() {
                  if (!this.hasClass(self.stateClass.filteredOut)) {
                    // empty details placeholder and fade it out
                    $details
                      .html('')
                      .stop(true, true)
                      .animate({opacity: 0}, 50);
                  }
                }
              );
          }
        });
      }

      /**
       * Render a circle with centered text in the center of the roadmap diagram to label the diagram.
       *
       * @param   {String}    text    Text for roadmap label
       */
      renderDiagramLabel(text) {
        // draw circle
        this.paper.circle('50%', '50%', this.diagramRadii.segmentMin + '%').addClass('roadmap__label');

        // add text
        var label = this.paper
          .multitext('50%', '49.75%', text) // y-position adjusted to move text up to visual middle
          .addClass('roadmap__label-text');

        if ((text.match(/(\n)|(<br>)|(<br[\s]?\/>)/g) || []).length > 1) {
          // regex to find line breaks
          // adjust vertical position of label, if the text has more than two lines:
          // - pull up by half of its height to compensate varying label height
          // - push down by one line
          label.attr({
            y: this.perc2Abs('50%') - label.getBBox().height / 2 + 14, // TODO: not 14px on mobile screens!
          });
        }
      }

      /**
       * Render a legend for the roadmap containing every feature and its description, grouped by section.
       */
      renderLegend() {
        var self = this,
          markup = '';

        // render markup for every section
        this.data.roadmap.forEach(function(sectionData, sectionNumber) {
          markup += '<section id="js_legendSection-' + (sectionNumber + 1) + '" ';
          markup += 'class="roadmap__legend-section layout__item u-1 u-1/3-lap-and-up js_legendSection">';
          markup += '<h2 class="' + self.getColorOfSection(sectionNumber, 'color') + '">';
          markup += sectionData.businessValue;
          markup += '</h2>';
          markup += '<ul class="list-bare">';
          markup += self.getLegendEntries(sectionData.features, sectionNumber);
          markup += '</ul>';
          markup += '</section>';
        });

        // insert into DOM as one big fragment
        document.getElementById('js_roadmapLegend').innerHTML = markup;
      }

      /**
       * Generate HTML markup for all entries in a given section.
       *
       * @param   {Object}    features        The features for which to generate legend entries
       * @param   {Number}    currentSection  Number of the current section; value has to be zero-based!
       *
       * @return  {String}                    HTML markup, containing heading plus list of features for given section
       */
      getLegendEntries(features, currentSection) {
        var self = this,
          markup = '',
          classes;

        // call function recursively for nested features
        if (Array.isArray(features)) {
          // -> array of feature objects: loop through objects in array (this is just an intermediate step)
          features.forEach(function(feature) {
            markup += self.getLegendEntries(feature, currentSection);
          });
        } else if (features.hasOwnProperty('dependentFeature')) {
          // -> feature object with nested feature object: render markup and recurse through dependent feature(s)
          classes = [
            'roadmap__legend-entry', // class for styling with CSS
            'js_legendEntry', // base class for targeting legend entries
            'js_section-' + (currentSection + 1), // class for targeting all features of a section
            'js_interval-' + features.plannedForInterval, // class for targeting all features of an interval
          ];

          markup += '<li class="' + classes.join(' ') + '">'; // TODO: add id
          markup += '<h3>' + features.name + '</h3>';
          markup += '<dfn>' + features.description + '</dfn>';
          markup += '</li>';

          markup += self.getLegendEntries(features.dependentFeature, currentSection);
        } else {
          // -> standard object: render markup
          classes = [
            'roadmap__legend-entry', // class for styling with CSS
            'js_legendEntry', // base class for targeting legend entries
            'js_section-' + (currentSection + 1), // class for targeting all features of a section
            'js_interval-' + features.plannedForInterval, // class for targeting all features of an interval
          ];

          markup += '<li class="' + classes.join(' ') + '">'; // TODO: add id
          markup += '<h3>' + features.name + '</h3>';
          markup += '<dfn>' + features.description + '</dfn>';
          markup += '</li>';
        }

        return markup;
      }

      /**
       * Get color for given section from predefined color schemes.
       *
       * @param   {Number}    sectionNumber   Number of the section; value has to be zero-based!
       * @param   {String}    property        CSS / SVG property to target (e.g. color, fill, stroke)
       *
       * @return  {String}                    CSS class name (without '.'!) for color
       */
      getColorOfSection(sectionNumber, property) {
        var colorClass = 'color--' + (sectionNumber + 1) + '-' + this.sections,
          propertyClass = property || '';

        return [colorClass, propertyClass].join(' ');
      }

      /**
              getColorOfSection(sectionNumber) , // color class
         * Get the maximum value of plannedForInterval from the roadmap data.
         *
         * @return  {Number}    Value of maximum interval
         */
      maximumInterval() {
        var intervals = [],
          max;

        // collect all instances of plannedForInterval in array
        this.data.roadmap.forEach(function(e) {
          e.features.forEach(function(e) {
            intervals.push(e.plannedForInterval);
          });
        });

        // find maximum value of array
        max = Math.max.apply(null, intervals);
        return max;
      }

      /**
       * Get radius values for a given number of intervals to be rendered in the roadmap diagram.
       *
       * @param   {Number}    numberOfIntervals   Number of intervals to be rendered in the roadmap diagram
       *
       * @return  {Object}                        Percent values for outer, inner, and center radius of every interval
       */
      getIntervalRadii(numberOfIntervals) {
        var step = (this.diagramRadii.segmentMax - this.diagramRadii.segmentMin) / numberOfIntervals,
          innerRadius = '',
          outerRadius = '',
          centerRadius = '',
          radii = [];

        for (var i = 0; i < numberOfIntervals; i++) {
          innerRadius = this.diagramRadii.segmentMin + i * step;
          outerRadius = this.diagramRadii.segmentMin + (i + 1) * step;
          centerRadius = this.diagramRadii.segmentMin + (i + 0.5) * step;

          radii.push({
            inner: innerRadius,
            center: centerRadius,
            outer: outerRadius,
          });
        }

        return radii;
      }

      /**
       * Convert relative sizes to absolute sizes, based on the container width.
       *
       * @param   {String}    valueInPercent  Percentage value as string, e.g. '10%'
       *
       * @return  {Number}                    Absolute value in pixels
       */
      perc2Abs(valueInPercent) {
        var parsedValue = parseInt(valueInPercent.replace('%', ''), 10) / 100;

        return parsedValue * this.placeholderWidth;
      }

      /**
       * Convert absolute sizes to relative sizes, based on the container width.
       *
       * @param   {Number}    valueInPx   Absolute value in pixels
       *
       * @return  {String}                Relative value in percent, e.g. '5.3%'
       */
      abs2Perc(valueInPx) {
        return valueInPx / this.placeholderWidth + '%';
      }

      /**
       * Get absolute coordinates of a point at a given angle and radius from the center.
       *
       * @param   {num}   centerX         Center x coordinate
       * @param   {num}   centerY         Center y coordinate
       * @param   {num}   radius          Radius from the center
       * @param   {num}   angleInDegrees  Angle from the center
       *
       * @return  {Object}                Object with Cartesian x and y coordinates
       */
      polar2Cartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

        return {
          x: centerX + radius * Math.cos(angleInRadians),
          y: centerY + radius * Math.sin(angleInRadians),
        };
      }

      /**
       * Get Cartesian coordinates of a point at a given angle and radius from the center.
       *
       * @param   {Number]}   angle   Angle of point relative to center
       * @param   {Number}    radius  Radius of point from center
       * @param   {Object}    center  X and y coordinates of center
       *
       * @return  {Object}            X and y coordinates of point
       */
      cartesianCenter(angle, radius, center) {
        if (!Snap.is(center, 'object') || (center.x === undefined || center.y === undefined)) {
          // use diagram center as default center point
          center = {
            x: this.absMiddle,
            y: this.absMiddle,
          };
        }

        return this.polar2Cartesian(center.x, center.y, this.perc2Abs(radius + '%'), angle);
      }

      /**
       * Generate SVG path description for symmetric arcs.
       *
       * @param   {Number}    centerX     X coordinate of center
       * @param   {Number}    centerY     Y coordinate of center
       * @param   {Number}    radius      Radius of arc from center
       * @param   {Number}    startAngle  Angle relative to center, at which the arc starts
       * @param   {Number}    endAngle    Angle relative to center, at which the arc ends
       * @param   {Boolean}   noMoveTo    Don't prepend a 'move to' fragment to the path description, if true
       *
       * @return  {String}                Arc description
       */
      describeArc(centerX, centerY, radius, startAngle, endAngle, noMoveTo = false) {
        var start = this.polar2Cartesian(centerX, centerY, radius, endAngle),
          end = this.polar2Cartesian(centerX, centerY, radius, startAngle),
          rotation = 0, // don't rotate
          largeArc = 0, // always draw a short arc
          angelDiff = endAngle - startAngle,
          sweep = angelDiff >= 0 && angelDiff <= 180 ? '0' : '1', // make arc sweep into right direction
          d = [
            'M',
            start.x,
            start.y, // move to start point
            'A',
            radius,
            radius,
            rotation,
            largeArc,
            sweep,
            end.x,
            end.y, // draw arc
          ];

        if (noMoveTo) {
          // draw the arc only, don't move to a start point first
          d = ['A', radius, radius, rotation, largeArc, sweep, end.x, end.y];
        }

        return d.join(' ');
      }

      /**
       * Mark all specified diagram segments with the 'highlighted' state class.
       *
       * @param   {Object}    trigger Clicked diagram segment or section label
       * @param   {Object}    self    Roadmap object (for getting settings)
       * @param   {String}    type    Type of highlighting to perform:
       *                              - 'interval': highlight all segments of the selected interval
       *                              - 'section': highlight all segments of the selected section
       */
      highlightSegments(trigger, self, type) {
        Snap.selectAll('.js_segment.js_' + type + '-' + trigger.attr('data-' + type)).forEach(function(e) {
          e.addClass(self.stateClass.highlighted);
        });
      }

      /**
       * Remove the 'highlighted' state class from all diagram segments.
       *
       * @param   {Object}    self    Roadmap object (for getting settings)
       */
      removeSegmentHighlights(self) {
        Snap.selectAll('.js_segment.' + self.stateClass.highlighted).forEach(function(e) {
          e.removeClass(self.stateClass.highlighted);
        });
      }

      /**
       * Apply section filter to roadmap; fades out all features that don't belong to the selected section.
       *
       * @param   {Object}    trigger Clicked section label
       * @param   {Object}    self    Roadmap object (for getting settings)
       */
      applySectionFilter(trigger, self) {
        if (trigger.hasClass(self.stateClass.selected)) {
          // section is selected already, so just unselect it by removing the currently applied filters
          self.removeRoadmapFilter();
        } else {
          // remove all currently applied filters first
          self.removeRoadmapFilter();

          // mark selected section with state class
          trigger.addClass(self.stateClass.selected);

          Snap.selectAll('.js_segment.js_section-' + trigger.attr('data-section')).forEach(function(e) {
            e.addClass(self.stateClass.selected);
          });

          // filter out all features that don't belong to the selected section
          Snap.selectAll('.js_feature:not(.js_section-' + trigger.attr('data-section') + ')').forEach(function(e) {
            e.addClass(self.stateClass.filteredOut);
          });

          // filter out all other sections in the legend (can't use Snap here, legend is not part of the SVG)
          $('.js_legendSection').addClass(self.stateClass.filteredOut);

          $('#js_legendSection-' + trigger.attr('data-section')).removeClass(self.stateClass.filteredOut);
        }
      }

      /**
       * Apply interval filter to roadmap; fades out all features that don't belong to the selected interval.
       *
       * @param   {Object}    trigger Clicked diagram segment
       * @param   {Object}    self    Roadmap object (for getting settings)
       */
      applyIntervalFilter(trigger, self) {
        if (trigger.hasClass(self.stateClass.selected)) {
          // interval is selected already, so just unselect it by removing the currently applied filters
          self.removeRoadmapFilter();
        } else {
          // remove all currently applied filters first
          self.removeRoadmapFilter();

          // mark selected interval with state class
          Snap.selectAll('.js_segment.js_interval-' + trigger.attr('data-interval')).forEach(function(e) {
            e.addClass(self.stateClass.selected);
          });

          // filter out all features in the diagram that don't belong to the selected interval
          Snap.selectAll('.js_feature:not(.js_interval-' + trigger.attr('data-interval') + ')').forEach(function(e) {
            e.addClass(self.stateClass.filteredOut);
          });

          // filter out all features in the legend that don't belong to the selected interval
          // (can't use Snap here, legend is not part of the SVG)
          $('.js_legendEntry').addClass(self.stateClass.filteredOut);

          $('.js_legendEntry.js_interval-' + trigger.attr('data-interval')).removeClass(self.stateClass.filteredOut);
        }
      }

      /**
       * Remove filter from roadmap; fades all filtered out features back in.
       */
      removeRoadmapFilter() {
        var self = this,
          selectedSection = Snap.select('.js_segment-label.' + self.stateClass.selected);

        if (selectedSection) {
          // remove state class from section label
          selectedSection.removeClass(self.stateClass.selected);
        }

        // remove state class from segments
        Snap.selectAll('.js_segment.' + self.stateClass.selected).forEach(function(e) {
          e.removeClass(self.stateClass.selected);
        });

        // unhide the filtered out features in the diagram
        Snap.selectAll('.js_feature').forEach(function(e) {
          e.removeClass(self.stateClass.filteredOut);
        });

        // unhide the filtered out sections and entries in the legend
        // (can't use Snap here, legend is not part of the SVG)
        $(
          '.js_legendSection.' + self.stateClass.filteredOut + ', .js_legendEntry.' + self.stateClass.filteredOut
        ).removeClass(self.stateClass.filteredOut);
      }

      /**
       * Initialize roadmap; calls various methods to render roadmap.
       */
      init() {
        var self = this;

        self.renderRoadmapTitle();
        self.renderDiagram();
        self.renderLegend();

        // handle resizing of page
        window.addEventListener('resize', function() {
          self.setPaperSize();
        });
      }
    }

    // TODO: this is kind of an ugly pattern, but at least it is working for now
    var roadmap;
    $.getJSON('/mock-data.json', function(data) {
      roadmap = new Roadmap(data);
      roadmap.init();
    });

    // Custom Snap.svg functions ---------------------------------------------------------------------------------------
    Snap.plugin(function(Snap, Element, Paper) {
      /**
       * Render text with line breaks.
       *
       * @param   {Number}    x       X coordinate of text element
       * @param   {Number}    y       Y coordinate of text element
       * @param   {String}    text    Text to be rendered; contains line breaks like '<br>' or '\n'
       *
       * @return  {Object}            SVG text element with child tspan elements for every line of text
       */
      Paper.prototype.multitext = function(x, y, text) {
        text = text
          .replace(/<br[\s]?[/]?>/g, '\n') // replace <br> | <br/> | <br /> tags with newlines
          .split('\n'); // split into array (gets automatically wrapped in tspans by Snap)

        var t = this.text(x, y, text);

        t.selectAll('tspan:nth-child(n+2)') // every tspan from the second one ...
          .attr({
            dy: '1.3em', // ... is shifted down by the height of one line (1.3em)
            x: x,
          });

        return t;
      };

      /**
       * Draw circle segments.
       *
       * @param   {Number}    centerX     X coordinate of center
       * @param   {Number}    centerY     Y coordinate of center
       * @param   {String}    outerRadius Outer radius of circle segment from center in percent, e.g. '10%'
       * @param   {String}    innerRadius Inner radius of circle segment from center in percent, e.g. '5%'
       * @param   {Number}    startAngle  Angle in degrees relative to center at which the circle segment starts
       * @param   {Number}    endAngle    Angle in degrees relative to center at which the circle segment ends
       *
       * @return  {Object}                SVG path element
       */
      Paper.prototype.circleSegment = function(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle) {
        // FIXME: references to Roadmap methods with 'roadmap.' depend on prior instantiation and are thus fragile
        var outerArc = roadmap.describeArc(centerX, centerY, outerRadius, startAngle, endAngle),
          startInnerArc = roadmap.polar2Cartesian(centerX, centerY, innerRadius, startAngle),
          lineOuter2Inner = ['L', startInnerArc.x, startInnerArc.y].join(' '),
          innerArc = roadmap.describeArc(centerX, centerY, innerRadius, endAngle, startAngle, true),
          closePath = 'Z',
          circleSegmentPath;

        // join path fragments
        circleSegmentPath = [outerArc, lineOuter2Inner, innerArc, closePath].join(' ');

        return this.path(circleSegmentPath);
      };
    });
  });
})(jQuery);
