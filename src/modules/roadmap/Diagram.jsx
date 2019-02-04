import * as React from 'react';
import styled from 'styled-components';

import adjustCenters from './utils/adjustCenters';
import buildFeatureChains from './utils/buildFeatureChains';
import cartesianCenter from './utils/cartesianCenter';
import countFeatureEndpoints from './utils/countFeatureEndpoints';
import getIntervalRadii from './utils/getIntervalRadii';
import maximumInterval from './utils/maximumInterval';

import Connectors from './Connectors';
import DiagramLabel from './DiagramLabel';
import DiagramSection from './DiagramSection';
import Features from './Features';

import {mixin} from '../../styles';

const StyledDiagram = styled.svg.attrs(({size}) => ({
  role: 'img',
  viewBox: `0 0 ${size} ${size}`,
}))`
  ${mixin.centerMX}

  display: block;
  height: ${({size}) => size}px;
  width: ${({size}) => size}px;
`;

export default class Diagram extends React.Component {
  static defaultProps = {
    size: 900,
  };

  absMiddle = this.props.size / 2;
  intervals = maximumInterval(this.props.data.roadmap);
  intervalRadii = getIntervalRadii(this.intervals);
  sections = this.props.data.roadmap.map((_, i) => i);
  renderTree = [{}]; // array, seeded with empty root object
  endPointsBeforeCount = 0;
  featureChains = [];
  featureId = 0;

  state = {
    renderTree: [{}], // array, seeded with empty root object
  };

  render() {
    const {data, size} = this.props;
    const {subject, year} = data.metadata;
    const {renderTree} = this.state;
    const sections = this.sections.length;
    const am = this.absMiddle;

    return (
      <StyledDiagram size={size}>
        {this.sections.map(s => (
          <DiagramSection
            key={s}
            section={s}
            sections={sections}
            intervalRadii={this.intervalRadii}
            intervals={this.intervals}
            absMiddle={am}
            size={size}
            data={data.roadmap[s]}
          />
        ))}
        <Connectors renderTree={renderTree} absMiddle={am} sections={sections} />
        <Features renderTree={renderTree} sections={sections} />
        <DiagramLabel text={[subject, year]} absMiddle={am} />
      </StyledDiagram>
    );
  }

  componentDidMount() {
    // prepare feature data and build render tree
    this.buildRenderTreeFromSections();

    // before we can render the features, we need to adjust the center points of multiple dependent features
    // in the same interval
    this.featureChains = adjustCenters(this.featureChains, this.intervalRadii, this.renderTree);
  }

  buildRenderTreeFromSections = () => {
    const {roadmap} = this.props.data;

    this.sections.forEach(section => {
      const {features} = roadmap[section];

      // get number of features that the available angle should be divided by;
      // ignore dependent features, as they do not consume space in terms of angle
      const anglePerEndPoint = 360 / this.sections.length / countFeatureEndpoints(features);

      // reset endPointsBeforeCount for every section
      this.endPointsBeforeCount = 0;

      features.forEach(feature => {
        this.buildRenderTree(section, anglePerEndPoint, feature);
      });
    });

    this.setState({renderTree: [...this.renderTree]});
  };

  /*
   * Calculate attributes required for rendering the roadmap diagram in a radial tree layout from the raw roadmap
   * data.
   *
   * @param   {Number}    section             Number of the section; value has to be zero-based!
   * @param   {Number}    anglePerEndPoint    Angle between two end points in the current section
   * @param   {Object}    featureData         Roadmap data
   * @param   {Number}    parentFeatureId     ID of the feature that the current feature is dependent from
   */
  buildRenderTree(section, anglePerEndPoint, featureData, parentFeatureId) {
    const {description, name, plannedForInterval} = featureData;

    let angle;
    let center;
    let dependentEndPointsCount;
    let interval;
    let tmpFeatureId;

    if (Array.isArray(featureData)) {
      // cache the featureId, so that the elements in the array or their children don't increment it
      tmpFeatureId = this.featureId;

      // recurse through array of features; we're not touching the renderTree in this case
      featureData.forEach(feature => this.buildRenderTree(section, anglePerEndPoint, feature, tmpFeatureId));
    } else if (featureData.hasOwnProperty('dependentFeature')) {
      interval = plannedForInterval; // just to make the following code shorter

      // calculate, how many end points are among the dependent features, so we can adjust the angle later on
      dependentEndPointsCount = countFeatureEndpoints(featureData.dependentFeature);

      // calculate feature angle
      angle =
        (360 / this.sections.length) * section + // start angle of section
        (anglePerEndPoint * 1) / 2 + // center all features within section
        // by shifting them by 1/2 angle unit
        anglePerEndPoint * this.endPointsBeforeCount + // angle consumed by prior end points
        anglePerEndPoint * (dependentEndPointsCount / 2 - 1 / 2); // middle of dependent end points

      // calculate feature center
      center = cartesianCenter(angle, this.intervalRadii[interval - 1].center, {}, this.absMiddle, this.props.size);

      // increment featureId, because we are adding this feature to the renderTree
      this.featureId++;

      // build featureChains to calculate number of chained features planned for the same interval
      this.featureChains = buildFeatureChains(this.featureChains, interval, parentFeatureId, this.featureId);

      // add feature data to render tree
      this.renderTree.push({
        angle,
        anglePerEndPoint,
        center,
        dependentEndPointsCount,
        description,
        endPointsBeforeCount: this.endPointsBeforeCount,
        interval,
        name,
        parentFeatureId,
        radius: this.intervalRadii[interval - 1].center,
        section,
      });

      // recurse through dependent features
      this.buildRenderTree(section, anglePerEndPoint, featureData.dependentFeature, this.featureId);
    } else {
      interval = featureData.plannedForInterval; // just to make the following code shorter

      // calculate feature angle
      angle =
        (360 / this.sections.length) * section + // start angle of section
        (anglePerEndPoint * 1) / 2 + // center all features within section
        // by shifting them by 1/2 angle unit
        anglePerEndPoint * this.endPointsBeforeCount; // angle consumed by prior end points

      // calculate feature center
      center = cartesianCenter(angle, this.intervalRadii[interval - 1].center, {}, this.absMiddle, this.props.size);

      // increment featureId, because we are adding this feature to the renderTree
      this.featureId++;

      // build featureChains to calculate number of chained features planned for the same interval
      this.featureChains = buildFeatureChains(this.featureChains, interval, parentFeatureId, this.featureId);

      // add feature data to render tree
      this.renderTree.push({
        angle,
        anglePerEndPoint,
        center,
        dependentEndPointsCount: 0,
        description,
        endPointsBeforeCount: this.endPointsBeforeCount,
        interval,
        name,
        parentFeatureId,
        radius: this.intervalRadii[interval - 1].center,
        section,
      });
    }
  }
}
