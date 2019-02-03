import * as React from 'react';

import Diagram from './Diagram';
import Legend from './Legend';
import Section from '../../components/atoms/section/Section';

const Roadmap = ({data}) => (
  <React.Fragment>
    <Section>{<Diagram data={data} />}</Section>
    <Section>
      <Legend data={data.roadmap} />
    </Section>
  </React.Fragment>
);

export default Roadmap;
