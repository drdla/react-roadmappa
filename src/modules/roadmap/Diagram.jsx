import * as React from 'react';
import styled from 'styled-components';

import adjustCenters from './utils/adjustCenters';
import buildFeatureChains from './utils/buildFeatureChains';
import countFeatureEndpoints from './utils/countFeatureEndpoints';
import cartesianCenter from './utils/cartesianCenter';
import getMaximumInterval from './utils/getMaximumInterval';
import getRadiiForIntervals from './utils/getRadiiForIntervals';

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
  intervals = getMaximumInterval(this.props.data.roadmap);
  intervalRadii = getRadiiForIntervals(this.intervals);
  sections = this.props.data.roadmap.map((_, i) => i);

  state = {
    endPointsBeforeCount: 0,
    featureChains: [],
    featureId: 0,
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
            intervals={this.intervals}
            absMiddle={am}
            size={size}
            data={data.roadmap[s]}
          />
        ))}
        <DiagramLabel text={[subject, year]} absMiddle={am} />
        <Connectors renderTree={renderTree} absMiddle={am} sections={sections} />
        <Features renderTree={renderTree} sections={sections} />
      </StyledDiagram>
    );
  }

  componentDidMount() {
    // prepare feature data and build render tree
    this.buildRenderTreeFromSections();

    // before we can render the features, we need to adjust the center points of multiple dependent features
    // in the same interval
    const featureChains = adjustCenters(this.state.featureChains, this.intervalRadii, this.state.renderTree);
    this.setState({featureChains});
  }

  buildRenderTreeFromSections = () => {
    const {roadmap} = this.props.data;

    this.sections.forEach(section => {
      const {features} = roadmap[section];

      // get number of features that the available angle should be divided by;
      // ignore dependent features, as they do not consume space in terms of angle
      const anglePerEndPoint = 360 / this.sections.length / countFeatureEndpoints(features);

      // reset endPointsBeforeCount for every section
      this.setState({endPointsBeforeCount: 0});

      features.forEach(feature => {
        this.buildRenderTree(section, anglePerEndPoint, feature);
      });
    });
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

    const self = this;
    let angle;
    let center;
    let dependentEndPointsCount;
    let interval;
    let tmpFeatureId;

    if (Array.isArray(featureData)) {
      // cache the featureId, so that the elements in the array or their children don't increment it
      tmpFeatureId = self.featureId; // FIXME

      // recurse through array of features; we're not touching the renderTree in this case
      featureData.forEach(feature => self.buildRenderTree(section, anglePerEndPoint, feature, tmpFeatureId));
    } else if (featureData.hasOwnProperty('dependentFeature')) {
      interval = plannedForInterval; // just to make the following code shorter

      // calculate, how many end points are among the dependent features, so we can adjust the angle later on
      dependentEndPointsCount = countFeatureEndpoints(featureData.dependentFeature);

      // calculate feature angle
      angle =
        (360 / this.sections.length) * section + // start angle of section
        (anglePerEndPoint * 1) / 2 + // center all features within section
        // by shifting them by 1/2 angle unit
        anglePerEndPoint * this.state.endPointsBeforeCount + // angle consumed by prior end points
        anglePerEndPoint * (dependentEndPointsCount / 2 - 1 / 2); // middle of dependent end points

      // calculate feature center
      center = cartesianCenter(angle, this.intervalRadii[interval - 1].center);

      // increment featureId, because we are adding this feature to the renderTree
      const featureId = this.state.featureId + 1;

      // build featureChains to calculate number of chained features planned for the same interval
      const featureChains = buildFeatureChains(
        this.state.featureChains,
        interval,
        parentFeatureId,
        this.state.featureId
      );

      // add feature data to render tree
      const renderTree = [
        ...this.state.renderTree,
        {
          angle,
          anglePerEndPoint,
          center,
          dependentEndPointsCount,
          description,
          endPointsBeforeCount: this.state.endPointsBeforeCount,
          interval,
          name,
          parentFeatureId,
          radius: this.intervalRadii[interval - 1].center,
          section,
        },
      ];

      this.setState({
        featureChains,
        featureId,
        renderTree,
      });

      // recurse through dependent features
      return this.buildRenderTree(section, anglePerEndPoint, featureData.dependentFeature, this.state.featureId);
    } else {
      interval = featureData.plannedForInterval; // just to make the following code shorter

      // calculate feature angle
      angle =
        (360 / this.sections.length) * section + // start angle of section
        (anglePerEndPoint * 1) / 2 + // center all features within section
        // by shifting them by 1/2 angle unit
        anglePerEndPoint * this.state.endPointsBeforeCount; // angle consumed by prior end points

      // calculate feature center
      center = cartesianCenter(angle, self.intervalRadii[interval - 1].center);

      // increment featureId, because we are adding this feature to the renderTree
      const featureId = this.state.featureId + 1;

      // build featureChains to calculate number of chained features planned for the same interval
      const featureChains = buildFeatureChains(this.state.featureChains, interval, parentFeatureId, this.featureId);

      // add feature data to render tree
      const renderTree = [
        ...this.state.renderTree,
        {
          angle,
          anglePerEndPoint,
          center,
          dependentEndPointsCount: 0,
          description,
          endPointsBeforeCount: this.state.endPointsBeforeCount,
          interval,
          name,
          parentFeatureId,
          radius: self.intervalRadii[interval - 1].center,
          section,
        },
      ];

      // we have an end point! so let's increment endPointsBeforeCount
      this.setState({
        endPointsBeforeCount: this.state.endPointsBeforeCount + 1,
        featureChains,
        featureId,
        renderTree,
      });
    }
  }
}
