const pseudoElement = (height = '1em', width = '1em', content = '" "') => `
  content: ${content};
  display: block;
  height: ${height};
  width: ${width};
`;

export default pseudoElement;
